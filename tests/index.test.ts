import { describe, expect, test } from '@jest/globals';
import htmlToShopifyRichText from '../src/index';

describe('top-level element tests', () => {
    test('heading', () => {
        const result = htmlToShopifyRichText('<h1>test</h1>');

        expect(result).toEqual({
            type: 'root',
            children: [
                {
                    type: 'heading',
                    level: 1,
                    children: [
                        {
                            type: 'text',
                            value: 'test',
                            bold: undefined,
                            italic: undefined
                        }
                    ]
                }
            ]
        })
    });

    test('paragraph', () => {
        const result = htmlToShopifyRichText('<p>test</p>');

        expect(result).toEqual({
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            type: 'text',
                            value: 'test',
                            bold: undefined,
                            italic: undefined
                        }
                    ]
                }
            ]
        })
    });

    test('list', () => {
        const result = htmlToShopifyRichText('<ul><li>test</li></ul>');

        expect(result).toEqual({
            type: 'root',
            children: [
                {
                    type: 'list',
                    listType: 'unordered',
                    children: [
                        {
                            type: 'list-item',
                            children: [
                                {
                                    type: 'text',
                                    value: 'test',
                                    bold: undefined,
                                    italic: undefined
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    });
});

describe('formatting', () => {
    test('bold/italic', () => {
        const result = htmlToShopifyRichText('<p>test <b>bold <i>and italic</i></b></p>');

        expect(result).toEqual({
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            type: 'text',
                            value: 'test ',
                            bold: undefined,
                            italic: undefined
                        },
                        {
                            type: 'text',
                            value: 'bold ',
                            bold: true,
                            italic: undefined,
                        },
                        {
                            type: 'text',
                            value: 'and italic',
                            bold: true,
                            italic: true
                        }
                    ]
                }
            ]
        })
    });

    test('links', () => {
        const result = htmlToShopifyRichText('<p><a href="https://example.com">link body</a></p>');

        expect(result).toEqual({
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [
                        {
                            type: 'link',
                            url: 'https://example.com',
                            children: [
                                {
                                    type: 'text',
                                    value: 'link body',
                                    bold: undefined,
                                    italic: undefined
                                }
                            ]
                        }
                    ]
                }
            ]
        })
    });
});

describe('nesting', () => {
    test('list items', () => {
        const result = htmlToShopifyRichText('<ol><li><a href="https://example.com"><b>link body</b></a></li><li><h3>Heading 3</h3></li></ol>');
    
        expect(result).toEqual({
            type: 'root',
            children: [
                {
                    type: 'list',
                    listType: 'ordered',
                    children: [
                        {
                            type: 'list-item',
                            children: [
                                {
                                    type: 'link',
                                    url: 'https://example.com',
                                    children: [
                                        {
                                            type: 'text',
                                            value: 'link body',
                                            bold: true,
                                            italic: undefined
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'list-item',
                            children: [
                                {
                                    type: 'heading',
                                    level: 3,
                                    children: [
                                        {
                                            type: 'text',
                                            value: 'Heading 3',
                                            bold: undefined,
                                            italic: undefined
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    });
    
    test("list items", () => {
        const result = htmlToShopifyRichText(
            '<h4><a href="https://example.com"><b>link body</b></a> <b>bold</b></h4>'
        );

        expect(result).toEqual({
            type: "root",
            children: [
                {
                    type: "heading",
                    level: 4,
                    children: [
                        {
                            type: "link",
                            url: "https://example.com",
                            children: [
                                {
                                    type: "text",
                                    value: "link body",
                                    bold: true,
                                    italic: undefined,
                                },
                            ],
                        },
                        {
                            type: "text",
                            value: " ",
                            bold: undefined,
                            italic: undefined,
                        },
                        {
                            type: "text",
                            value: "bold",
                            bold: true,
                            italic: undefined,
                        },
                    ],
                },
            ],
        });
    });

    test("multiple top-level items", () => {
        const result = htmlToShopifyRichText(
            '<h5>test h4</h5><p>test paragraph</p>'
        );

        expect(result).toEqual({
            type: "root",
            children: [
                {
                    type: "heading",
                    level: 5,
                    children: [
                        {
                            type: "text",
                            value: "test h4",
                            bold: undefined,
                            italic: undefined,
                        },
                    ]
                },
                {
                    type: 'paragraph',
                    children: [
                        {
                            type: 'text',
                            value: 'test paragraph',
                            bold: undefined,
                            italic: undefined
                        }
                    ]
                }
            ],
        });
    });
})