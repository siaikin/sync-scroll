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

// const appendHTMLs = [];
// console.time();
// for (let i = 0; i < 1000; i++) {
//     appendHTMLs.push(`<div class="h2">## 性能测试 ${i}</div><div><br></div><div>当我们滚动鼠标滚轮时，他们会基于**片断**进行等比例滚动</div><div><br></div>`);
// }
// console.timeEnd();
// editArea.innerHTML += appendHTMLs.join('');

const options = ConfigOptions.instance({
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
// syncScroll.addArea({
//     area: editArea,
//     queryCriteria: '.h1,.h2,.h3,.h4,.h5,.h6'
// });
// syncScroll.addArea({
//     area: previewArea,
//     queryCriteria: 'h1,h2,h3,h4,h5,h6'
// });
// syncScroll.update();
