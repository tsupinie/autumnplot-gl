// @ts-check

import { MarkdownRendererEvent } from 'typedoc-plugin-markdown'

import('typedoc-plugin-markdown')

/** @param {import('typedoc-plugin-markdown').MarkdownApplication} app  */
export function load(app) {
    app.renderer.on(MarkdownRendererEvent.BEGIN, output => {
        const index_page = output.pages.filter(page => page.kind == 'index')[0];
        const globals_page = output.pages.filter(page => page.url == 'globals.md')[0];

        output.pages.splice(output.pages.indexOf(index_page), 1);
        output.pages.splice(output.pages.indexOf(globals_page), 1);
        output.pages.unshift({url: 'index.md', kind: globals_page.kind, model: globals_page.model});
    });
}