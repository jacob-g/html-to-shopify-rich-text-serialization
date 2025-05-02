import { parseDocument } from 'htmlparser2';
import { inlineNodeTypes, listChildNodeTypes, ShopifyRichTextHeadingNode, ShopifyRichTextInlineNode, ShopifyRichTextListChildNode, ShopifyRichTextNode, ShopifyRichTextRoot, ShopifyRichTextTextNode, ShopifyRichTextTopLevelNode, topLevelNodeTypes } from './models';
import type { ChildNode, Text } from 'domhandler';

interface ParseContext {
    bold?: boolean;
    italic?: boolean;
}

const htmlTextNodeToShopifyNode = (node: Text, context: ParseContext): ShopifyRichTextTextNode => 
    ({
        type: "text",
        value: node.data,
        bold: context.bold,
        italic: context.italic,
    });

const htmlNodeToShopifyNodes = (node: ChildNode, context: ParseContext = {}): ShopifyRichTextNode[] => {
    switch (node.type) {
        case 'text':
            return [htmlTextNodeToShopifyNode(node, context)];
        case 'tag':
            switch (node.name) {
                case 'b':
                case 'strong':
                    return node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, { ...context, bold: true }));
                case 'i':
                case 'em':
                    return node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, { ...context, italic: true }));
                case 'li':
                    return [
                        {
                            type: 'list-item',
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => listChildNodeTypes.includes(node.type)) as ShopifyRichTextListChildNode[]
                        }
                    ];
                case 'ul':
                    return [
                        {
                            type: 'list',
                            listType: 'unordered',
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => node.type === 'list-item')
                        }
                    ];
                case 'ol':
                    return [
                        {
                            type: 'list',
                            listType: 'ordered',
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => node.type === 'list-item')
                        }
                    ];
                case 'a':
                    return [
                        {
                            type: 'link',
                            url: node.attribs['href'],
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => node.type === 'text') as ShopifyRichTextTextNode[]
                        }
                    ]
                case 'p':
                    return [
                        {
                            type: 'paragraph',
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
                case 'h1':
                    return [
                        {
                            type: 'heading',
                            level: 1,
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
                case 'h2':
                    return [
                        {
                            type: 'heading',
                            level: 2,
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
                case 'h3':
                    return [
                        {
                            type: 'heading',
                            level: 3,
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
                case 'h4':
                    return [
                        {
                            type: 'heading',
                            level: 4,
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
                case 'h5':
                    return [
                        {
                            type: 'heading',
                            level: 5,
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
                case 'h6':
                    return [
                        {
                            type: 'heading',
                            level: 6,
                            children: node.childNodes.flatMap(node => htmlNodeToShopifyNodes(node, context)).filter(node => inlineNodeTypes.includes(node.type)) as ShopifyRichTextInlineNode[]
                        }
                    ];
            }
    }
}

const htmlToShopifyRichText = (html: string): ShopifyRichTextRoot => {
    const doc = parseDocument(html);
    console.log(doc.childNodes);

    return {
        type: 'root',
        children: doc.childNodes.flatMap(node => htmlNodeToShopifyNodes(node)).filter(node => topLevelNodeTypes.includes(node.type)) as ShopifyRichTextTopLevelNode[]
    }
};

export default htmlToShopifyRichText;
