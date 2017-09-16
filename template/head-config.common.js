/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: "msapplication-TileImage", content: "/icons/ms-icon-144x144.png", "=content": true },
 * Will prefix the publicPath to content.
 *
 * { rel: "apple-touch-icon", sizes: "57x57", href: "/icons/apple-icon-57x57.png", "=href": false },
 * Will not prefix the publicPath on href (href attributes are added by default)
 */

module.exports = {
  link: [
    /** <link> tags for "apple-touch-icon" (AKA Web Clips). **/
    { rel: "apple-touch-icon", sizes: "57x57", href: "/icons/apple-icon-57x57.png" },
    { rel: "apple-touch-icon", sizes: "60x60", href: "/icons/apple-icon-60x60.png" },
    { rel: "apple-touch-icon", sizes: "72x72", href: "/icons/apple-icon-72x72.png" },
    { rel: "apple-touch-icon", sizes: "76x76", href: "/icons/apple-icon-76x76.png" },
    { rel: "apple-touch-icon", sizes: "114x114", href: "/icons/apple-icon-114x114.png" },
    { rel: "apple-touch-icon", sizes: "120x120", href: "/icons/apple-icon-120x120.png" },
    { rel: "apple-touch-icon", sizes: "144x144", href: "/icons/apple-icon-144x144.png" },
    { rel: "apple-touch-icon", sizes: "152x152", href: "/icons/apple-icon-152x152.png" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/icons/apple-icon-180x180.png" },

    /** <link> tags for android web app icons **/
    { rel: "icon", type: "image/png", sizes: "192x192", href: "/icons/android-icon-192x192.png" },

    /** <link> tags for favicons **/
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/icons/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "96x96", href: "/icons/favicon-96x96.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/icons/favicon-16x16.png" },

    /** <link> tags for a Web App Manifest **/
    { rel: "manifest", href: "/icons/manifest.json" }
  ],
  meta: [
    { name: "msapplication-TileColor", content: "#FFFFFF" },
    { name: "msapplication-TileImage", content: "/icons/ms-icon-144x144.png", "=content": true },
    { name: "theme-color", content: "#FFFFFF" }
  ]
};
