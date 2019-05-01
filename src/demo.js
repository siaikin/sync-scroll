import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/highlight';
import js from 'highlight.js/lib/languages/javascript';
import markdown from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('javascript', js);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('xml', xml);


import {SyncScroll, ConfigOptions} from "md-sync-scroll";

import './styles.css';

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
const options = new ConfigOptions({
    syncWithClick: true,
    offsetScroll: 100
});
const syncScroll = new SyncScroll(options);

previewArea.innerHTML = md.render(editArea.innerText);

const editFrags = editArea.querySelectorAll('.h1,.h2,.h3,.h4,.h5,.h6');
const preFrags = previewArea.querySelectorAll('h1,h2,h3,h4,h5,h6');

syncScroll.addAreas([
    {
        area: editArea,
        queryCriteria: '.h1,.h2,.h3,.h4,.h5,.h6'
    },
    {
        area: previewArea,
        queryCriteria: 'h1,h2,h3,h4,h5,h6'
    }
]);

// const scrollLine = document.getElementById('offsetSignLine');
// const offsetScrollValue = document.getElementById('offsetScrollValue');
//
// document.getElementById('offsetScrollUp').onclick = offsetScrollUp;
// document.getElementById('offsetScrollDown').onclick = offsetScrollDown;
//
// function offsetScrollUp() {
//     options.offsetScroll += 10;
//     scrollLine.style.top = options.offsetScroll + 'px';
//     offsetScrollValue.value = options.offsetScroll;
// }
//
// function offsetScrollDown() {
//     if (options.offsetScroll <= 0) { return; }
//     options.offsetScroll -= 10;
//     scrollLine.style.top = options.offsetScroll + 'px';
//     offsetScrollValue.value = options.offsetScroll;
// }
