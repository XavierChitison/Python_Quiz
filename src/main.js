import { App } from './app.js?v=2.4.4';

const root = document.getElementById('app');
try {
  new App(root);
  document.querySelector('.skip-link')?.addEventListener('click', event => {
    const main = document.getElementById('main-content');
    if (!main) return;
    event.preventDefault();
    main.focus();
  });
} catch (error) {
  console.error('The application could not start.', error);
  root.innerHTML = '<main class="startup-error"><h1>Could not start Xavier\'s Python Challenge</h1><p>Refresh the page. If this keeps happening, check that the project is served over HTTP and that browser storage is available.</p></main>';
}
