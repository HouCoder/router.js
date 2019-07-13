(() => {
    const privateRules = [];
    let linkSelector = '';
    let routeCallbackParameters;

    /** The SimpleRoute class */
    class SimpleRoute {
        /**
         * Routing callback.
         *
         * @callback routingCallback
         * @param {Object|undefined} param URL parameters.
         */

        /**
         * @typedef {Object} routeConfig
         * @property {String}           pathname Pathname.
         * @property {routingCallback}  callback Routing callback.
         */

        /**
         * Create a SimpleRoute instance.
         * @param {routeConfig[]} rules Route rules.
         */
        constructor(rules, selector) {
            privateRules.push(...rules);

            linkSelector = selector;

            // Register events
            this.bindEvents();

            // Run for initial page
            this.runCallbackByPathname(location.pathname);
        }

        /**
         * Register popstate and link clicking events.
         */
        bindEvents() {
            window.addEventListener('popstate', (e) => {
                const previousPathname = e.state.pathname;

                this.runCallbackByPathname(previousPathname, false);
            });

            // Register link events
            $(document).on('click', linkSelector, (e) => {
                e.preventDefault();
                const $a = $(e.target);
                const routerPath = $a.attr('href').trim();

                this.runCallbackByPathname(routerPath);
            });
        }

        /**
         * Escape special characters.
         * @param {*} str
         * @see {@link https://stackoverflow.com/a/3561711}
         * @return {String} Input string with escaped special characters.
         */
        escapeRegExp(str) {
            return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        /**
         * Get route config by pathname and update the routeCallbackParameters if possible.
         * @param {String} pathname Pathname.
         * @return {routeConfig}    Route config object.
         */
        getRouteConfigByPathname(pathname) {
            // Try exact math
            let config = routeSets.find(route => route.pathname === pathname);

            if (config !== undefined) {
                return config;
            }

            // Try route with parameters
            routeSets.forEach(route => {
                // Skip routes without parameter.
                if (!route.pathname.includes(':')) {
                    return false;
                }

                // Match by regex.
                // Setp#1: The goal is to replace `:parameter` with `([a-zA-Z0-9-_]*)` in the pathname,
                //         so that we can convert it into an regexp later.
                // Example: `/user/:userName/post/:postId` => `\/user\/([a-zA-Z0-9-_]*)\/post\/([a-zA-Z0-9-_]*)`
                let regString = route.pathname.split(/:[a-zA-Z0-9-_]*/)
                    .map(this.escapeRegExp)
                    .join('([a-zA-Z0-9-_]*)');

                regString = '^' + regString + '$';

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

                    // Generate parameter object with correct key&value pairs.
                    parameterNames.forEach((key, i) => finalParameters[key] = parameterValues[i]);

                    routeCallbackParameters = finalParameters;

                    config = {
                        ...route,
                    };
                }
            });

            if (config !== undefined) {
                return config;
            }
        }

        /**
         * Run callback by pathname.
         * @param {String} pathname       Pathname.
         * @param {Boolean} needPushState Need to run history.pushState or not.
         */
        runCallbackByPathname(pathname, needPushState = true) {
            const routeConfig = this.getRouteConfigByPathname(pathname);

            routeConfig.callback(routeCallbackParameters);

            if (needPushState) {
                history.pushState({
                    pathname: pathname,
                }, null, pathname);
            }
        }
    }

    window.SimpleRoute = SimpleRoute;
})();
