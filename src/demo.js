import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/highlight';
import js from 'highlight.js/lib/languages/javascript';
import markdown from 'highlight.js/lib/languages/markdown';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('javascript', js);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('xml', xml);


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
console.log(syncScroll);
document.getElementById('editMarginUp').onclick = editMarginUp;
document.getElementById('editMarginDown').onclick = editMarginDown;

function editMarginUp() {
    const lineHeight = editArea.style.lineHeight;
    const num = Number.parseInt(lineHeight.slice(0, lineHeight.length - 2) || 21, 10);
    editArea.style.cssText = 'line-height: ' + (num + 1) + 'px';
    // editArea.classList.add('testPerformance');
    syncScroll.update();
}

// function editMarginUp() {
//     const fragment = document.createDocumentFragment();
//     const parent = editArea.parentElement;
//     fragment.append(editArea);
//
//     const els = fragment.querySelectorAll('div');
//     console.log(els.length);
//     let margin, num, style;
//     for (let i = els.length; i--;) {
//         style = els[i].style;
//         margin = style.margin;
//         num = Number.parseInt(margin.slice(0, margin.length - 2) || '0', 10);
//         style.margin =  ++num + 'px';
//     }
//     parent.insertBefore(fragment, previewArea);
//     syncScroll.update();
// }


function editMarginDown() {
    const lineHeight = editArea.style.lineHeight;
    const num = Number.parseInt(lineHeight.slice(0, lineHeight.length - 2) || 21, 10);
    editArea.style.cssText = 'line-height: ' + (num - 1) + 'px';

    syncScroll.update();
}
