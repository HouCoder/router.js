const $content = $('.content');

const homeHandler = () => {
    $content.html($('#home').html());
};

const postsHandler = () => {
    $content.html($('#posts').html());
};

const showPost = (param) => {
    $content.html($(`#post-${param.id}`).html());
};
const aboutHandler = () => {
    $content.html($('#about').html());
};

const routeSets = [{
    pathname: '/router.js/',
    name: 'home',
    callback: homeHandler,
}, {
    pathname: '/router.js/posts',
    name: 'posts',
    callback: postsHandler,
}, {
    pathname: '/router.js/post/:id',
    name: 'post',
    callback: showPost,
}, {
    pathname: '/router.js/about',
    name: 'about',
    callback: aboutHandler,
}];

// Escapes the RegExp special characters - https://stackoverflow.com/a/3561711
function escapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function getRouteConfigByPath(pathname) {
    let config;
    // Try exact math
    config = routeSets.find(route => route.pathname === pathname);

    if (config !== undefined) {
        return config;
    }

    // Try route with parameters
    routeSets.forEach(route => {
        // Skip routes with no parameters.
        if (!route.pathname.includes(':')) {
            return false;
        }

        // Match values by regex.
        const regString = '^' + route.pathname.split(/:[a-zA-Z0-9-_]*/)
            .map(escapeRegExp)
            .join('([a-zA-Z0-9-_]*)') + '$';

        // Convert string to regex
        const reg = new RegExp(regString);
        let parameterValues = reg.exec(pathname);

        if (parameterValues !== null) {
            // Remove the first matched text.
            parameterValues.shift();

            parameterValues = [...parameterValues];

            // Match all parameter names
            // https://regex101.com/r/A2ZGLw/1/
            const parameterNames = route.pathname.match(/\:([a-zA-Z0-9-_]*)/g)
                // Removing all leading :
                .map(match => match.replace(/^:/, ''));

            const finalParameters = {};

            // Generate parameter object with correct keys and values.
            parameterNames.forEach((key, i) => finalParameters[key] = parameterValues[i]);

            config = {
                ...route,
                param: finalParameters
            };
        }
    });

    if (config !== undefined) {
        return config;
    }

    // No match, just return 404
    return routeSets.find(route => route.pathname === '/404');
}

function runCallbackByPath(pathname, needPushState = true) {
    const routeConfig = getRouteConfigByPath(pathname);

    routeConfig.callback(routeConfig.param);

    if (needPushState) {
        history.pushState({
            pathname: pathname,
            name: routeConfig.name,
        }, null, pathname);
    }
}

window.addEventListener('popstate', (e) => {
    const previousPath = e.state.pathname;

    runCallbackByPath(previousPath, false);
});

// Register link events
$(document).on('click', 'a[href].spa-route', (e) => {
    e.preventDefault();

    const $a = $(e.target);
    const routerPath = $a.attr('href').trim();

    runCallbackByPath(routerPath);
});

// Handle pathname on page loading
runCallbackByPath(location.pathname);
