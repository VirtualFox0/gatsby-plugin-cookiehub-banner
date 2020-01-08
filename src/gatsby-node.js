exports.onPreInit = ({ reporter }, options) => {
    if (!options.cookieHubId) {
      reporter.warn(
        `The cookiehub banner plugin requires a cookieHubId.`
      )
    }
}