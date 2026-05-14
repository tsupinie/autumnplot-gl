# autumnplot-gl Documentation Website

## Package setup

```bash
npm install
```

## Local development

```bash
npx docusaurus start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. The server will generate the API docs when it starts, but to regenerate them after having started the server, run
 
```bash
npx docusaurus generate-typedoc
```

## Build

```bash
npx docusaurus build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Push to the `docusaurus` branch of autumnplot-gl to build and deploy the documentation via a Github action. Don't forget to update the static assets (like pre-built files) before pushing a final version.