import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/highlight';
import js from 'highlight.js/lib/languages/javascript';
import markdown from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('javascript', js);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('xml', xml);


import {SyncScroll, ConfigOptions} from "./index.js";

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
const editArea2 = document.getElementById('edit2');
const previewArea2 = document.getElementById('preview2');

const options = ConfigOptions.instance({
    syncWithClick: true,
    offsetScroll: 100
});
const syncScroll = new SyncScroll(options);
previewArea.innerHTML = md.render(editArea.innerText);
previewArea2.innerHTML = md.render(editArea2.innerText);

syncScroll.addAreas([
    {
        area: editArea,
        queryCriteria: '.h1,.h2,.h3,.h4,.h5,.h6'
    },
    {
        area: previewArea,
        queryCriteria: 'h1,h2,h3,h4,h5,h6'
    },
    {
        area: editArea2,
        queryCriteria: '.h1,.h2,.h3,.h4,.h5,.h6'
    },
    {
        area: previewArea2,
        queryCriteria: 'h1,h2,h3,h4,h5,h6'
    }
]);
