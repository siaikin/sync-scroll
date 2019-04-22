# Sync Scroll
这是一个基于**片段**的同步滚动插件
## 片断

```markdown
// 片段start
# 这表示一个片段的开始
这些是片段内容
这些也是片段内容
// 片段end
```
            
如果你想要使用它让你的内容能进行同步滚动，你需要让你的内容符合以上的布局。这种布局很多Markdown格式的文本都是天然符合的，不过就是标题-内容-标题-内容...

示例：

```markdown
# 文章标题
标题下的内容...
# 文章标题2
标题下的内容2...
...
```
            
其实这个页面就是一个很好的例子，当你滚动滚轮或滚动条的时候，注意一下以`#`号开头的段落，就就能看到效果了。

# Usage
SyncScroll正常运行，需要你用一个块级元素包裹你的内容，你可以按`F12`查看此页的代码。

1. 首先引入

```js
import {SyncScroll} from "md-sync-scroll";
```
            
2. 设置要进行同步的DOM元素。你需要指定每个`Area`的子元素查询条件。

```js
import {SyncScroll} from "md-sync-scroll";

const editArea = document.getElementById('edit');
const previewArea = document.getElementById('preview');
const syncScroll = new SyncScroll();

// 对于本页面来说，我用`h1-6`指示片段的开始，那么我就要查询被我指定为`h1-h6`的元素
// 在左边我用class='h1-6'标记，在右边用<h1-6>表示
syncScroll.addArea(editArea, '.h1,.h2,.h3,.h4,.h5,.h6');
syncScroll.addArea(previewArea, 'h1,h2,h3,h4,h5,h6');
```
            
# API
## SyncScroll
### PROPERTY
| Prop name | Type | Default | Description |
| --- | --- | --- | --- |
| areas | Array<Area> | null | Area的数组 |
### FUNCTION
| Func name | Params | Description |
| --- | --- | --- |
| addArea | el, queryCriteria | 添加一个`Area`，指定一个Dom元素el，和子元素查询语句 |
| update | null | `Area`内容改变时调用，更新所有的`Area` |
