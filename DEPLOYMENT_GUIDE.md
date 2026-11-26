# GitHub Pages

The application is plain HTML, CSS, and JavaScript modules. GitHub Pages publishes the source files directly; no bundler or build step is required.

## Enable deployment

1. Create a GitHub repository and push this project to it.
2. In repository **Settings → Pages**, select **Deploy from a branch**.
3. Select the branch containing the application (`master` for `XavierChitison/Python_Quiz`) and the `/(root)` folder, then save.
4. Open the URL shown in Pages settings after publishing completes.
5. Test a coding problem. The first Python execution downloads Pyodide from jsDelivr and needs an internet connection.

GitHub Pages serves the root `index.html` and its `src/` and `public/` directories directly. Relative URLs and hash-based routes support project-site paths such as `https://USERNAME.github.io/REPOSITORY-NAME/`. The source app can also be run locally in VS Code with Live Server without installing npm dependencies.

The branch must contain the static entry point, styles, JavaScript modules, and `public/vendor/ace/` assets; committing only `index.html` is not sufficient. The `.nojekyll` file is included for direct static publishing. If a browser still displays an old version after Pages finishes deploying, refresh the page and check the Pages deployment status before changing application settings.

GitHub Pages may cache files for several minutes. When releasing changes, update the shared `v` query consistently across the entry point, versioned application-module imports, and worker URL so returning browsers load compatible versions. Also version changed static assets such as the stylesheet when they may already be cached.

## Limitations

Progress is stored in each visitor's browser profile and does not sync across devices. The site downloads the pinned Pyodide runtime from jsDelivr when needed. Client-side Python is not a hardened sandbox and hidden test data is inspectable.
