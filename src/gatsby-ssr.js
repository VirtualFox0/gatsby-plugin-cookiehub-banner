import React from "react"

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }, pluginOptions) => {
    if (!pluginOptions.cookieHubId) {
        return null
    }

    const setComponents = pluginOptions.head ? setHeadComponents : setPostBodyComponents
    const cookieHubUrl = "https://cookiehub.net/cc/" + pluginOptions.cookieHubId + ".js"

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

                    window.cookieconsent.initialise({
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
                    })
                });
            `,
            }}
        />
    ])
}