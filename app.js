const $content = $('.spa-content');

const homeHandler = () => {
    const template = `<h1>Hello, welcome to my homepage!</h1>`;
    $content.html(template);
};

const postsHandler = () => {
    const template = `
        <dl>
            <dt>Tom</dt>
            <dd>
                <a class="spa-route" href="/post/tom/how-to-download-music">How to download music</a>
            </dd>
            <dd>
                <a class="spa-route" href="/post/tom/install-and-config-nginx">Install and config nginx</a>
            </dd>
        </dl>
        <dl>
            <dt>Jim</dt>
            <dd>
                <a class="spa-route" href="/post/jim/my-top10-movies">My top10 movies</a>
            </dd>
            <dd>
                <a class="spa-route" href="/post/jim/my-business-plan">My business plan</a>
            </dd>
        </dl>
    `;
    $content.html(template);
};

const showPost = (param) => {
    const template = `
        <h1>${param.title}</h1>
        <div style="text-align: right">${param.user}</div>
    `;
    $content.html(template);
};
const aboutHandler = () => {
    const template = `<h1>This is the about page</h1>`;
    $content.html(template);
};

const routeSets = [{
    pathname: '/',
    callback: homeHandler,
}, {
    pathname: '/posts',
    callback: postsHandler,
}, {
    pathname: '/post/:user/:title',
    callback: showPost,
}, {
    pathname: '/about',
    callback: aboutHandler,
}];

new SimpleRoute(routeSets, 'a[href].spa-route');
