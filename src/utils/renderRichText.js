import parse from 'html-react-parser';

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