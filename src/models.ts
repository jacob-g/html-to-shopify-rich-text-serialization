interface ShopifyRichTextNodeBase {
    type: string;
}

export interface ShopifyRichTextRoot extends ShopifyRichTextNodeBase {
    type: 'root';
    children: ShopifyRichTextTopLevelNode[];
}

export interface ShopifyRichTextTextNode extends ShopifyRichTextNodeBase {
    type: 'text';
    value: string;
    bold?: boolean;
    italic?: boolean;
}

export interface ShopifyRichTextLinkNode extends ShopifyRichTextNodeBase {
    type: 'link';
    url: string;
    title?: string;
    children?: ShopifyRichTextTextNode[];
}

export interface ShopifyRichTextHeadingNode extends ShopifyRichTextNodeBase {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children?: ShopifyRichTextInlineNode[];
}

interface ShopifyRichTextParagraphNode extends ShopifyRichTextNodeBase {
    type: 'paragraph';
    children?: ShopifyRichTextInlineNode[];
}

interface ShopifyRichTextListNode extends ShopifyRichTextNodeBase {
    type: 'list';
    listType: 'ordered' | 'unordered';
    children?: ShopifyRichTextListItemNode[];
}

interface ShopifyRichTextListItemNode extends ShopifyRichTextNodeBase {
    type: 'list-item';
    children?: ShopifyRichTextListChildNode[];
}

export const inlineNodeTypes = ['text', 'link'];
export const topLevelNodeTypes = ['heading', 'paragraph', 'list'];
export const listChildNodeTypes = ['text', 'heading', 'link'];

export type ShopifyRichTextNode =
    | ShopifyRichTextTextNode
    | ShopifyRichTextLinkNode
    | ShopifyRichTextHeadingNode
    | ShopifyRichTextParagraphNode
    | ShopifyRichTextListNode
    | ShopifyRichTextListItemNode
    ;

export type ShopifyRichTextTopLevelNode = 
    ShopifyRichTextHeadingNode |
    ShopifyRichTextParagraphNode |
    ShopifyRichTextListNode;

export type ShopifyRichTextInlineNode =
    ShopifyRichTextTextNode |
    ShopifyRichTextLinkNode;

export type ShopifyRichTextListChildNode =
    | ShopifyRichTextInlineNode
    | ShopifyRichTextHeadingNode
    | ShopifyRichTextLinkNode;
