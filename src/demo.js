const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
import {SyncScroll} from "md-sync-scroll";

import styles from './styles.css';

const md = new MarkdownIt({
 highlight: function (str, lang) {
  if (lang && hljs.getLanguage(lang)) {
   try {
    return `<pre class='hljs'><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
   } catch (e) {
   }
  }

  return `<pre class='hljs'><code>${md.utils.escapeHtml(str)}</code></pre>`;
 }
});

const editArea = document.getElementById('edit');
const previewArea = document.getElementById('preview');
const syncScroll = new SyncScroll();

previewArea.innerHTML = md.render(editArea.innerText);

const editFrags = editArea.querySelectorAll('.h1,.h2,.h3,.h4,.h5,.h6');
const preFrags = previewArea.querySelectorAll('h1,h2,h3,h4,h5,h6');

console.log(editFrags, preFrags);

syncScroll.addArea(editArea, '.h1,.h2,.h3,.h4,.h5,.h6');
syncScroll.addArea(previewArea, 'h1,h2,h3,h4,h5,h6');

document.getElementById('editMarginUp').onclick = editMarginUp;
document.getElementById('editMarginDown').onclick = editMarginDown;

function editMarginUp() {
 const els = editArea.querySelectorAll('div');
 els.forEach(value => {
  let number = Number.parseInt(value.style.margin.slice(0, value.style.margin.length - 2) || 0, 10);
  value.style.margin = ++number + 'px';
 });

 syncScroll.update();
}

function editMarginDown() {
 const els = editArea.querySelectorAll('div');
 els.forEach(value => {
  let number = Number.parseInt(value.style.margin.slice(0, value.style.margin.length - 2) || 0, 10);
  value.style.margin = --number + 'px';
 });

 syncScroll.update();
}
