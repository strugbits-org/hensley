import parse from 'html-react-parser';
import { generateImageURLById, generateVideoURL } from './generateImageURL';

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
    if (typeof content === 'string') return content;
    let html = "";

    content.nodes.forEach(node => {
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

export const convertToHTMLBlog = ({
    content = "",
    class_heading = "",
    class_p = "",
    class_ul = "",
    class_ol = "",
    class_image = "",
    class_video = "",
    class_gallery = "",
    class_gallery_item = ""
}) => {
    if (typeof content === 'string') return content;
    let html = "";

    const processTextNodes = (nodes) => {
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

    content.nodes.forEach(node => {
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
                html += '<li>';
                listItem.nodes.forEach(paragraph => {
                    html += processTextNodes(paragraph.nodes);
                });
                html += '</li>';
            });

            html += '</ul>';
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
            const imageSrc = generateImageURLById({ id: image.src?.url || image.src.id });

            // Build image attributes
            const width = image.width ? `width="${image.width}"` : '';
            const height = image.height ? `height="${image.height}"` : '';
            const altText = imageData.altText ? `alt="${imageData.altText}"` : '';
            const alignment = imageData.containerData?.alignment?.toLowerCase() || 'center';

            html += `<div className="image-container ${class_image}" style="text-align: ${alignment};">`;
            html += `<img src="${imageSrc}" ${altText} ${width} ${height} />`;
            html += '</div>';
        }
        else if (node.type === 'GALLERY') {
            const galleryData = node.galleryData;
            const items = galleryData.items || [];
            const layout = galleryData.options?.layout?.type?.toLowerCase() || 'masonry';
            const columns = galleryData.options?.layout?.numberOfColumns ? galleryData.options?.layout?.numberOfColumns : layout === 'masonry' ? 'auto-fit' : 'auto';
            const spacing = galleryData.options?.item?.spacing || 6;
            const alignment = galleryData.containerData?.alignment?.toLowerCase() || 'center';

            html += `<div className="gallery-container" style="text-align: ${alignment};">`;
            html += `<div className="gallery-grid ${class_gallery}" style="display: grid; gap: ${spacing}px; grid-template-columns: repeat(${columns === 0 ? 'auto-fit' : columns}, minmax(200px, 1fr));">`;

            items.forEach(item => {
                if (item.image) {
                    const image = item.image;
                    const imageSrc = generateImageURLById({ id: image.media.src.url });
                    const width = image.media?.width ? `width="${image.media.width}"` : '';
                    const height = image.media?.height ? `height="${image.media.height}"` : '';
                    const altText = item.altText ? `alt="${item.altText}"` : '';

                    html += `<div className="gallery-item ${class_gallery_item}">`;
                    html += `<img src="${imageSrc}" ${altText} ${width} ${height} style="width: 100%; height: auto; object-fit: cover;" />`;
                    html += '</div>';
                }
            });

            html += '</div>';
            html += '</div>';
        }
    });

    return parse(html);
};