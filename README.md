# router.js
A simple client side route implementation

今天给大家介绍一下前端路由的实现，我们日常在单页面应用里面经常会用到前端路由，前端路由就是在不刷新整个页面的情况下更改页面 url 并且更新页面内容，前端可以根据用户访问的 URL 不同展示不用类型的页面，不再依赖于后端的路由功能来区分页面。

在讲具体的实现之前我们首先介绍一下 history api，history api 是 html5 引入的新功能，hostory api 包含了我们平时比较常用的 `forward`、`back` 和 `go` 来控制浏览器前进后退，还有两个不常用的 api - `pushState` 和 `replaceState`，这两个不常用的 api 和 `window.onpopstate` 事件回调是我们实现前端路由的基础方法。

`pushState` 和 `replaceState` 两个方法接受的参数是一致的，两个方法唯一的区别表现在行为上 `pushState` 表示新加载一个页面，`replaceState` 表示替换当前页面。表现在浏览器上就是使用 `pushState` 后浏览器的后退按钮变得可点击，同时上一个页面的 url 会被浏览器保留在历史记录里面。使用 `replaceState` 后浏览器的前进和后退按钮不会发生任何变化
