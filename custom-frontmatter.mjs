// @ts-check
import { Reflection, ReflectionKind } from 'typedoc';
import { MarkdownPageEvent } from 'typedoc-plugin-markdown';

/** @param {import('typedoc-plugin-markdown').MarkdownApplication} app  */
export function load(app) {
    app.renderer.on(
        MarkdownPageEvent.BEGIN,

        /** @param {MarkdownPageEvent<Reflection>} page */
        (page) => {
            /**
             * Update page.frontmatter object using information from the page model
             */
            if (page.model?.kind == ReflectionKind.Class || page.model?.kind == ReflectionKind.Interface || 
                page.model?.kind == ReflectionKind.TypeAlias || page.model?.kind == ReflectionKind.Variable) {

                page.frontmatter = {
                    // e.g add a title
                    title: page.model?.name,
                    // spread the existing frontmatter
                    ...page.frontmatter,
                };
            }

            if (page.model?.kind == ReflectionKind.Function) {
                page.frontmatter = {
                    title: `${page.model?.name}()`,
                    ...page.frontmatter,
                };
            }

            if (page.url == 'index.md') {
                page.frontmatter = {
                    title: `API Reference`,
                    ...page.frontmatter,
                };
            }
        },
    );
}