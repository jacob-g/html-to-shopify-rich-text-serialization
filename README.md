A simple function to convert HTML into the JSON format that the [Shopify rich text metaobject field](https://shopify.dev/docs/apps/build/custom-data/metafields/list-of-data-types#rich-text-formatting) expects.

## Usage
To use this project, simply import the function:
```ts
import { htmlToShopifyRichText } from 'htmltoshopifyrichtextserialization';
```

and then call the function as follows:
```ts
htmlToShopifyRichText('<p>this is a paragraph</p>');

/*
returns
{
    type: 'root',
    children: [
        {
            type: 'paragraph',
            children: [
                {
                    type: 'text',
                    value: 'this is a paragraph',
                    bold: undefined,
                    italic: undefined
                }
            ]
        }
    ]
}
*/
```

This can be then serialized to JSON with `JSON.stringify` and used as the value for a rich text metafield or metaobject field in GraphQL.

## Tag Nesting
The tag nesting is limited to what Shopify allows, and any tags that do not fit Shopify's allowed nesting structure will be ignored. The basic structure is as follows:

* Top-level tags: the outermost tag must be a heading (`<h1>`, `<h2>`, etc.), paragraph (`<p>`), or list (`<ul>`/`<ol>`). Top-level content not wrapped in one of these tags will be ignored. Multiple sets of tags can be at the top level (e.g. `<h1></h1><p></p>` is a valid string).
* Lists: the immediate children of lists be list items (`<li>`). Nested lists are not supported by the Shopify rich text format.
* List items: the immediate children of list items must be links (`<a>`), raw text, bold (`<b>`/`<strong>`), italic (`<i>`/`<em>`), and headings
* Links: the children of links must be inline (raw text, bold, italic) or headings, and cannot include other links
* Headings and paragraphs: the children can only be inline or links

A more formal specification for the format of tags that Shopify allows can be seen by the TypeScript interfaces in `src/models.ts`. A number of examples can be seen in the unit tests in `tests/index.test.ts`.