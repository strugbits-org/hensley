import parse from 'html-react-parser';
import { generateImageURL, generateVideoURL } from './generateImageURL';
import { resolveCoreMediaUrl } from '.';

// Resolve an image src from rich-text nodes — prefer Payload/Core URLs directly,
// only fall through to Wix helpers for legacy wix:image:// protocol strings.
const resolveRichTextImageSrc = (rawSrc) => {
    if (!rawSrc) return '';
    if (rawSrc.startsWith('wix:image://v1/') || rawSrc.startsWith('wix:vector://v1/')) {
        return generateImageURL({ wix_url: rawSrc, fit: 'fit' });
    }
    return resolveCoreMediaUrl(rawSrc);
};

// --- Lexical (Payload CMS) → Wix Rich Text Adapter ---

const LEXICAL_FORMAT_BOLD = 1;
const LEXICAL_FORMAT_ITALIC = 2;
const LEXICAL_FORMAT_UNDERLINE = 8;
const LEXICAL_FORMAT_STRIKETHROUGH = 4;

const isLexicalContent = (content) =>
    content && typeof content === 'object' && content.root && Array.isArray(content.root?.children);

const lexicalFormatToDecorations = (format = 0) => {
    const decorations = [];
    if (format & LEXICAL_FORMAT_BOLD) decorations.push({ type: 'BOLD' });
    if (format & LEXICAL_FORMAT_ITALIC) decorations.push({ type: 'ITALIC' });
    if (format & LEXICAL_FORMAT_UNDERLINE) decorations.push({ type: 'UNDERLINE' });
    if (format & LEXICAL_FORMAT_STRIKETHROUGH) decorations.push({ type: 'STRIKETHROUGH' });
    return decorations;
};

const convertLexicalTextNode = (node) => ({
    type: 'TEXT',
    id: node.id || Math.random().toString(36).slice(2),
    textData: {
        text: node.text || '',
        decorations: lexicalFormatToDecorations(node.format),
    },
});

const convertLexicalLinkNode = (node) => {
    const children = (node.children || []).map(convertLexicalChildNode).filter(Boolean);
    return children.map((child) => ({
        ...child,
        textData: {
            ...child.textData,
            decorations: [
                ...(child.textData?.decorations || []),
                {
                    type: 'LINK',
                    linkData: {
                        link: {
                            url: node.fields?.url || node.url || '#',
                            target: node.fields?.newTab || node.newTab ? 'BLANK' : 'SELF',
                        },
                    },
                },
            ],
        },
    }));
};

const convertLexicalChildNode = (node) => {
    if (!node) return null;
    if (node.type === 'text') return convertLexicalTextNode(node);
    if (node.type === 'linebreak') return { type: 'TEXT', id: Math.random().toString(36).slice(2), textData: { text: '\n', decorations: [] } };
    if (node.type === 'link' || node.type === 'autolink') return null; // handled inline
    return null;
};

const flattenLexicalChildren = (children = []) => {
    const result = [];
    for (const child of children) {
        if (child.type === 'link' || child.type === 'autolink') {
            result.push(...convertLexicalLinkNode(child));
        } else {
            const converted = convertLexicalChildNode(child);
            if (converted) result.push(converted);
        }
    }
    return result;
};

const headingTagToLevel = (tag) => {
    const match = typeof tag === 'string' && tag.match(/h(\d)/i);
    return match ? parseInt(match[1], 10) : 2;
};

const convertLexicalNode = (node) => {
    if (!node || typeof node !== 'object') return null;
    const id = node.id || Math.random().toString(36).slice(2);

    switch (node.type) {
        case 'paragraph':
            return {
                type: 'PARAGRAPH',
                id,
                nodes: flattenLexicalChildren(node.children || []),
            };

        case 'heading':
            return {
                type: 'HEADING',
                id,
                headingData: { level: headingTagToLevel(node.tag) },
                nodes: flattenLexicalChildren(node.children || []),
            };

        case 'list': {
            const isOrdered = node.listType === 'number' || node.tag === 'ol';
            return {
                type: isOrdered ? 'ORDERED_LIST' : 'BULLETED_LIST',
                id,
                nodes: (node.children || []).map((listItem) => ({
                    type: 'LIST_ITEM',
                    id: listItem.id || Math.random().toString(36).slice(2),
                    nodes: (listItem.children || []).map((para) => ({
                        type: 'PARAGRAPH',
                        id: para.id || Math.random().toString(36).slice(2),
                        nodes: para.type === 'paragraph' || para.type === 'listitem'
                            ? flattenLexicalChildren(para.children || [])
                            : flattenLexicalChildren([para]),
                    })),
                })),
            };
        }

        case 'quote':
            return {
                type: 'PARAGRAPH',
                id,
                nodes: flattenLexicalChildren(node.children || []),
            };

        case 'horizontalrule':
            return { type: 'DIVIDER', id };

        case 'upload': {
            const mediaUrl = resolveCoreMediaUrl(node.value, { w: 1280 });
            return {
                type: 'IMAGE',
                id,
                imageData: {
                    image: {
                        src: { url: mediaUrl, id: mediaUrl },
                        width: node.value?.width,
                        height: node.value?.height,
                    },
                    altText: node.value?.alt || '',
                    containerData: { alignment: 'CENTER' },
                },
            };
        }

        case 'block': {
            const { blockType, ...fields } = node.fields || {};

            if (blockType === 'mediaBlock' && fields.media) {
                const media = fields.media;
                const mediaUrl = resolveCoreMediaUrl(media, { w: 1280 });
                return {
                    type: 'IMAGE',
                    id,
                    imageData: {
                        image: {
                            src: { url: mediaUrl, id: mediaUrl },
                            width: media.width,
                            height: media.height,
                        },
                        altText: media.alt || '',
                        caption: fields.caption || '',
                        containerData: { alignment: 'CENTER' },
                    },
                };
            }

            if (blockType === 'galleryBlock' && Array.isArray(fields.images)) {
                return {
                    type: 'GALLERY_BLOCK',
                    id,
                    galleryBlockData: {
                        images: fields.images.map((item) => {
                            const img = item.image || {};
                            return {
                                url: resolveCoreMediaUrl(img, { w: 768 }),
                                width: img.width,
                                height: img.height,
                                alt: img.alt || '',
                                caption: item.caption || '',
                            };
                        }),
                        layout: fields.layout || 'grid',
                        columns: parseInt(fields.columns || '3', 10),
                    },
                };
            }

            if (blockType === 'sliderBlock' && Array.isArray(fields.slides)) {
                return {
                    type: 'SLIDER_BLOCK',
                    id,
                    sliderBlockData: {
                        slides: fields.slides.map((slide) => {
                            const img = slide.image || {};
                            return {
                                url: resolveCoreMediaUrl(img, { w: 1280 }),
                                width: img.width,
                                height: img.height,
                                alt: img.alt || '',
                                caption: slide.caption || '',
                                link: slide.link || '',
                            };
                        }),
                        autoplay: fields.autoplay || false,
                    },
                };
            }

            if (blockType === 'bannerBlock' && fields.content) {
                return {
                    type: 'BANNER_BLOCK',
                    id,
                    bannerBlockData: {
                        style: fields.style || 'info',
                        nodes: convertLexicalToWixNodes(fields.content),
                    },
                };
            }

            return null;
        }

        default:
            return null;
    }
};

const convertLexicalToWixNodes = (lexicalContent) => {
    if (!isLexicalContent(lexicalContent)) return [];
    return (lexicalContent.root.children || [])
        .map(convertLexicalNode)
        .filter(Boolean);
};

// --- End Lexical Adapter ---

const getRichTextNodes = (content) => {
    if (isLexicalContent(content)) return convertLexicalToWixNodes(content);
    if (Array.isArray(content?.nodes)) return content.nodes;
    if (Array.isArray(content)) return content;
    return [];
};

export const renderNode = (node) => {

    const HeadingComponent = ({ level, children }) => {
        const HeadingTag = `h${level}`;
        return <HeadingTag>{children}</HeadingTag>;
    };

    const renderTextWithDecorations = (textData) => {
        if (!textData.decorations || textData.decorations.length === 0) {
            return textData.text;
        }

        return textData.decorations.reduce((acc, decoration) => {
            switch (decoration.type) {
                case "ITALIC":
                    return <i>{acc}</i>;
                case "BOLD":
                    return <b>{acc}</b>;
                case "LINK":
                    return (
                        <a
                            href={decoration.linkData.link.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {acc}
                        </a>
                    );
                default:
                    return acc;
            }
        }, textData.text);
    };

    switch (node.type) {
        case "HEADING":
            const headingClass = `fs--${30 + node.headingData.level * 2
                } text-center text-uppercase white-1 split-chars`;
            return (
                <HeadingComponent
                    level={node.headingData.level}
                    className={headingClass}
                >
                    {renderTextWithDecorations(node.nodes[0].textData)}
                </HeadingComponent>
            );
        case "PARAGRAPH":
            return (
                <p>
                    {node.nodes.map((n, idx) => (
                        <span key={idx}>{renderTextWithDecorations(n.textData)}</span>
                    ))}
                </p>
            );
        case "ORDERED_LIST":
            return (
                <ol>
                    {node.nodes.map((listItem) => (
                        <li key={listItem.id}>
                            {listItem.nodes[0].nodes.map((n, idx) => (
                                <span key={idx}>{renderTextWithDecorations(n.textData)}</span>
                            ))}
                        </li>
                    ))}
                </ol>
            );
        case "BULLETED_LIST":
            return (
                <ul>
                    {node.nodes.map((listItem) => (
                        <li key={listItem.id}>
                            {listItem.nodes[0].nodes.map((n, idx) => (
                                <span key={idx}>{renderTextWithDecorations(n.textData)}</span>
                            ))}
                        </li>
                    ))}
                </ul>
            );
        case "DIVIDER":
            return <hr />;
        default:
            return null;
    }
};

export const convertToHTML = ({ content = "", class_p = "", class_ul = "", class_heading = "" }) => {
    if (!content) return null;
    if (typeof content === 'string') return content;

    const nodes = getRichTextNodes(content);
    if (nodes.length === 0) {
        if (typeof content?.html === 'string') return parse(content.html);
        if (typeof content?.text === 'string') return content.text;
        return null;
    }

    let html = "";

    nodes.forEach(node => {
        if (node.type === 'PARAGRAPH') {
            if (node.nodes.length > 0) {
                html += `<p className="${class_p}">`;

                node.nodes.forEach(textNode => {
                    if (textNode.type === 'TEXT') {
                        let decorationsHTML = "";

                        if (textNode.textData.decorations) {
                            textNode.textData.decorations.forEach(decoration => {
                                if (decoration.type === 'BOLD') {
                                    decorationsHTML += '<strong>';
                                } else if (decoration.type === 'ITALIC') {
                                    decorationsHTML += '<em>';
                                }
                            });
                        }

                        html += decorationsHTML + textNode.textData.text;

                        if (decorationsHTML !== "") {
                            decorationsHTML.split('').reverse().forEach(char => {
                                if (char === '>') {
                                    html += '</' + decorationsHTML.substring(decorationsHTML.lastIndexOf('<') + 1);
                                    decorationsHTML = decorationsHTML.substring(0, decorationsHTML.lastIndexOf('<'));
                                }
                            });
                        }
                    }
                });

                html += '</p>';
            } else {
                html += '<br/>';
            }
        } else if (node.type === 'HEADING') {
            if (node.nodes.length > 0) {
                const headingLevel = node.headingData?.level || 1;
                html += `<h${headingLevel} className="${class_heading}">`;

                node.nodes.forEach(textNode => {
                    if (textNode.type === 'TEXT') {
                        let decorationsHTML = "";

                        if (textNode.textData.decorations) {
                            textNode.textData.decorations.forEach(decoration => {
                                if (decoration.type === 'BOLD') {
                                    decorationsHTML += '<strong>';
                                } else if (decoration.type === 'ITALIC') {
                                    decorationsHTML += '<em>';
                                }
                            });
                        }

                        html += decorationsHTML + textNode.textData.text;

                        if (decorationsHTML !== "") {
                            decorationsHTML.split('').reverse().forEach(char => {
                                if (char === '>') {
                                    html += '</' + decorationsHTML.substring(decorationsHTML.lastIndexOf('<') + 1);
                                    decorationsHTML = decorationsHTML.substring(0, decorationsHTML.lastIndexOf('<'));
                                }
                            });
                        }
                    }
                });

                html += `</h${headingLevel}>`;
            }
        } else if (node.type === 'BULLETED_LIST') {
            html += `<ul className="${class_ul}" >`;

            node.nodes.forEach(listItem => {
                html += '<li>';

                listItem.nodes.forEach(paragraph => {
                    paragraph.nodes.forEach(textNode => {
                        if (textNode.type === 'TEXT') {
                            let decorationsHTML = "";

                            if (textNode.textData.decorations) {
                                textNode.textData.decorations.forEach(decoration => {
                                    if (decoration.type === 'BOLD') {
                                        decorationsHTML += '<strong>';
                                    } else if (decoration.type === 'ITALIC') {
                                        decorationsHTML += '<em>';
                                    }
                                });
                            }

                            html += decorationsHTML + textNode.textData.text;

                            if (decorationsHTML !== "") {
                                decorationsHTML.split('').reverse().forEach(char => {
                                    if (char === '>') {
                                        html += '</' + decorationsHTML.substring(decorationsHTML.lastIndexOf('<') + 1);
                                        decorationsHTML = decorationsHTML.substring(0, decorationsHTML.lastIndexOf('<'));
                                    }
                                });
                            }
                        }
                    });
                });

                html += '</li>';
            });

            html += '</ul>';
        }
    });

    return parse(html);
}

export const convertToHTMLRichContent = ({
    content = "",
    class_heading = "",
    class_p = "",
    class_ul = "",
    class_ol = "",
    class_li = "",
    class_image = "",
    class_image_container = "",
    class_video = "",
    class_gallery = "",
    class_gallery_item = "",
    class_table = "",
    class_table_row = "",
    class_table_cell = ""
}) => {
    if (!content) return null;
    if (typeof content === 'string') return content;

    const nodes = getRichTextNodes(content);
    if (nodes.length === 0) {
        if (typeof content?.html === 'string') return parse(content.html);
        if (typeof content?.text === 'string') return content.text;
        return null;
    }

    let html = "";

    const processTextNodes = (nodes = []) => {
        let textHTML = "";
        nodes.forEach(textNode => {
            if (textNode.type === 'TEXT') {
                let decorationsHTML = "";
                let closingTags = [];

                if (textNode.textData.decorations) {
                    textNode.textData.decorations.forEach(decoration => {
                        if (decoration.type === 'BOLD') {
                            decorationsHTML += '<strong>';
                            closingTags.unshift('</strong>');
                        } else if (decoration.type === 'ITALIC') {
                            decorationsHTML += '<em>';
                            closingTags.unshift('</em>');
                        } else if (decoration.type === 'LINK') {
                            const url = decoration.linkData?.link?.url || '#';
                            const target = decoration.linkData?.link?.target?.toLowerCase() === 'blank' ? ' target="_blank" rel="noopener noreferrer"' : '';
                            decorationsHTML += `<a href="${url}"${target}>`;
                            closingTags.unshift('</a>');
                        } else if (decoration.type === 'UNDERLINE') {
                            decorationsHTML += '<u>';
                            closingTags.unshift('</u>');
                        } else if (decoration.type === 'COLOR') {
                            const foreground = decoration.colorData?.foreground;
                            const background = decoration.colorData?.background;
                            let styleAttr = '';

                            if (foreground && foreground !== 'transparent') {
                                styleAttr += `color: ${foreground};`;
                            }
                            if (background && background !== 'transparent') {
                                styleAttr += `background-color: ${background};`;
                            }

                            if (styleAttr) {
                                decorationsHTML += `<span style="${styleAttr}">`;
                                closingTags.unshift('</span>');
                            }
                        }
                    });
                }

                textHTML += decorationsHTML + textNode.textData.text + closingTags.join('');
            }
        });
        return textHTML;
    };

    const processTableCell = (cellNode) => {
        let cellHTML = "";
        cellNode.nodes.forEach(cellChild => {
            if (cellChild.type === 'PARAGRAPH') {
                if (cellChild.nodes.length > 0) {
                    cellHTML += processTextNodes(cellChild.nodes);
                } else {
                    cellHTML += '<br/>';
                }
            }
        });
        return cellHTML;
    };

    nodes.forEach(node => {
        if (node.type === 'PARAGRAPH') {
            if (node.nodes.length > 0) {
                html += `<p className="${class_p}">`;
                html += processTextNodes(node.nodes);
                html += '</p>';
            } else {
                html += '<br/>';
            }
        }
        else if (node.type === 'HEADING') {
            if (node.nodes.length > 0) {
                const headingLevel = node.headingData?.level || 1;
                html += `<h${headingLevel} className="${class_heading}">`;
                html += processTextNodes(node.nodes);
                html += `</h${headingLevel}>`;
            }
        }
        else if (node.type === 'ORDERED_LIST') {
            html += `<ol className="${class_ol}">`;

            node.nodes.forEach(listItem => {
                html += '<li>';
                listItem.nodes.forEach(paragraph => {
                    html += processTextNodes(paragraph.nodes);
                });
                html += '</li>';
            });

            html += '</ol>';
        }
        else if (node.type === 'BULLETED_LIST') {
            html += `<ul className="${class_ul}">`;

            node.nodes.forEach(listItem => {
                html += `<li className="${class_li}">`;
                listItem.nodes.forEach(paragraph => {
                    html += processTextNodes(paragraph.nodes);
                });
                html += '</li>';
            });

            html += '</ul>';
        }
        else if (node.type === 'TABLE') {
            html += `<table className="${class_table}">`;

            let hasHeader = false;
            if (node.nodes.length > 0) {
                const firstRow = node.nodes[0];
                if (firstRow.type === 'TABLE_ROW' && firstRow.nodes.length > 0) {
                    hasHeader = firstRow.nodes.some(cell =>
                        cell.nodes.some(paragraph =>
                            paragraph.nodes.some(textNode =>
                                textNode.textData?.decorations?.some(decoration =>
                                    decoration.type === 'BOLD'
                                )
                            )
                        )
                    );
                }
            }

            node.nodes.forEach((rowNode, rowIndex) => {
                if (rowNode.type === 'TABLE_ROW') {
                    const isHeaderRow = hasHeader && rowIndex === 0;

                    if (isHeaderRow) {
                        html += '<thead>';
                    } else if (rowIndex === 1 && hasHeader) {
                        html += '<tbody>';
                    }

                    html += `<tr className="${class_table_row}">`;

                    rowNode.nodes.forEach(cellNode => {
                        if (cellNode.type === 'TABLE_CELL') {
                            const cellTag = isHeaderRow ? 'th' : 'td';
                            html += `<${cellTag} className="${class_table_cell}">`;
                            html += processTableCell(cellNode);
                            html += `</${cellTag}>`;
                        }
                    });

                    html += '</tr>';

                    if (isHeaderRow) {
                        html += '</thead>';
                    }
                }
            });

            if (hasHeader && node.nodes.length > 1) {
                html += '</tbody>';
            }

            html += '</table>';
        }
        else if (node.type === 'VIDEO') {
            const videoData = node.videoData;
            const video = videoData.video;
            const videoSrc = generateVideoURL(video.src?.url || video.src.id);

            // Build video attributes
            const width = video.width ? `width="${video.width}"` : '';
            const height = video.height ? `height="${video.height}"` : '';
            const altText = videoData.altText ? `alt="${videoData.altText}"` : '';
            const alignment = videoData.containerData?.alignment?.toLowerCase() || 'center';

            html += `<div className="video-container ${class_video}" style="text-align: ${alignment};">`;
            html += `<img src="${videoSrc}" ${altText} ${width} ${height} />`;
            html += '</div>';
        }
        else if (node.type === 'IMAGE') {
            const imageData = node.imageData;
            const image = imageData.image;
            const rawSrc = image.src?.url || image.src?.id || '';
            const imageSrc = resolveRichTextImageSrc(rawSrc);

            // Build image attributes
            const width = image.width ? `width="${image.width}"` : '';
            const height = image.height ? `height="${image.height}"` : '';
            const altText = imageData.altText ? `alt="${imageData.altText}"` : '';
            const alignment = imageData.containerData?.alignment?.toLowerCase() || 'center';

            html += `<div className="image-container ${class_image_container}" style="text-align: ${alignment};">`;
            html += `<img className="${class_image}" src="${imageSrc}" ${altText} ${width} ${height} />`;
            if (imageData.caption) html += `<p class="text-xs text-center mt-1 text-secondary-alt font-haasRegular">${imageData.caption}</p>`;
            html += '</div>';
        }
        else if (node.type === 'GALLERY') {
            const galleryData = node.galleryData;
            const items = galleryData.items || [];
            const spacing = galleryData.options?.item?.spacing ?? 6;
            const alignment = galleryData.containerData?.alignment?.toLowerCase() || 'center';

            html += `<div className="gallery-container text-${alignment}">`;
            html += `<div className="gallery-grid grid ${class_gallery} grid-cols-${items.length > 4 ? 4 : items.length} gap-[${spacing}px] space-y-[${spacing}px]">`;

            items.forEach(item => {
                const image = item.image?.media;
                if (image?.src?.url) {
                    const imageSrc = resolveRichTextImageSrc(image.src.url);
                    const width = image.width ? `width="${image.width}"` : '';
                    const height = image.height ? `height="${image.height}"` : '';
                    const altText = item.altText ? `alt="${item.altText}"` : '';

                    html += `<div className="gallery-item ${class_gallery_item} col-span-1 mb-[${spacing}px]">`;
                    html += `<img src="${imageSrc}" ${altText} ${width} ${height} class="w-full h-auto object-cover" />`;
                    html += `</div>`;
                }
            });

            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
        }
        else if (node.type === 'GALLERY_BLOCK') {
            const { images, layout, columns } = node.galleryBlockData;
            const colClass = `grid-cols-${columns}`;
            html += `<div class="gallery-block-container w-full my-6">`;
            html += `<div class="grid ${colClass} gap-4">`;
            images.forEach(img => {
                const src = resolveRichTextImageSrc(img.url);
                const altAttr = img.alt ? `alt="${img.alt}"` : '';
                html += `<div class="gallery-block-item">`;
                html += `<img class="${class_image} w-full h-auto object-cover" src="${src}" ${altAttr} />`;
                if (img.caption) html += `<p class="text-xs text-center mt-1 text-secondary-alt font-haasRegular">${img.caption}</p>`;
                html += `</div>`;
            });
            html += `</div>`;
            html += `</div>`;
        }
        else if (node.type === 'SLIDER_BLOCK') {
            const { slides } = node.sliderBlockData;
            html += `<div class="slider-block-container w-full my-6 overflow-x-auto">`;
            html += `<div class="flex gap-4">`;
            slides.forEach(slide => {
                const src = resolveRichTextImageSrc(slide.url);
                const altAttr = slide.alt ? `alt="${slide.alt}"` : '';
                const wrapper = slide.link ? `<a href="${slide.link}" target="_blank" rel="noopener noreferrer">` : '';
                const wrapperClose = slide.link ? `</a>` : '';
                html += `<div class="slider-block-slide flex-shrink-0">`;
                html += wrapper;
                html += `<img class="${class_image} w-full h-auto object-cover" src="${src}" ${altAttr} />`;
                html += wrapperClose;
                if (slide.caption) html += `<p class="text-xs text-center mt-1 text-secondary-alt font-haasRegular">${slide.caption}</p>`;
                html += `</div>`;
            });
            html += `</div>`;
            html += `</div>`;
        }
        else if (node.type === 'BANNER_BLOCK') {
            const { style, nodes: bannerNodes } = node.bannerBlockData;
            const bannerColors = {
                info: 'bg-blue-50 border-blue-400 text-blue-800',
                warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
                error: 'bg-red-50 border-red-400 text-red-800',
                success: 'bg-green-50 border-green-400 text-green-800',
            };
            const colorClass = bannerColors[style] || bannerColors.info;
            html += `<div class="banner-block border-l-4 px-4 py-3 my-4 ${colorClass}">`;
            bannerNodes.forEach(bannerNode => {
                if (bannerNode.type === 'PARAGRAPH' && bannerNode.nodes.length > 0) {
                    html += `<p>${processTextNodes(bannerNode.nodes)}</p>`;
                }
            });
            html += `</div>`;
        }

    });

    return parse(html);
};