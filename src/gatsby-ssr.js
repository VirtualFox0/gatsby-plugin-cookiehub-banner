import React from "react"

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }, pluginOptions) => {
    if (!pluginOptions.cookieHubId) {
        return null
    }

    function isV2ApiEnabled(pluginOptions) {
        return pluginOptions.cookieHubV2Api !== undefined ? pluginOptions.cookieHubV2Api : false;
    }

    const setComponents = pluginOptions.head ? setHeadComponents : setPostBodyComponents
    const apiVersion = isV2ApiEnabled(pluginOptions) ? 'c2' : 'cc'
    const cookieHubUrl = "https://cookiehub.net/" + apiVersion + "/" + pluginOptions.cookieHubId + ".js"

    var cookieNames = {};
    for (var i = 0; i < pluginOptions.categories.length; i++) {
        var category = pluginOptions.categories[i];
        cookieNames[category.categoryName] = category.cookieName;
    }

    return setComponents([
        <script
            key={`gatsby-plugin-cookiehub-banner-src`}
            src={cookieHubUrl}
            />,
        <script
            key="gatsby-plugin-cookiehub-banner-script"
            dangerouslySetInnerHTML={{
            __html: `
                window.addEventListener("load", function() {
                    const cookieNames = ${JSON.stringify(cookieNames)};
                    const handleCategoryUserInput = function(categoryName, allowed) {
                        var cookieName = cookieNames[categoryName];
                        if (cookieName === undefined) {
                            cookieName = 'gatsby-plugin-cookiehub-banner-' + categoryName + '-allowed';
                        } 
                        const cookieString = cookieName+'=' + allowed + ';path=/';
                        document.cookie = cookieString;
                    };

                    const cpm = {
                        onInitialise: function(status) {
                            for (var i = 0; i < status.categories.length; i++) {
                                var category = status.categories[i];
                                handleCategoryUserInput(category.id, category.value);
                            }
                        },
                        onAllow: function(category) {
                            handleCategoryUserInput(category, true);
                        },
                        onRevoke: function(category) {
                            handleCategoryUserInput(category, false);
                        }
                    };

                    if (window.cookieconsent !== undefined) {
                        window.cookieconsent.initialise(cpm);
                    } else if (window.cookiehub !== undefined) {
                        window.cookiehub.load(cpm);
                    } else {
                        console.log("CookieHub not loaded!");
                    }
                });
            `,
            }}
        />
    ])
}