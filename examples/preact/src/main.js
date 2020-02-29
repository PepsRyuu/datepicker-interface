import { render, h } from 'preact';
import App from './App';

window.h = h;

render(<App />, document.querySelector('#app'));
