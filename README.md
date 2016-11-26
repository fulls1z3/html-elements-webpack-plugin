# html-elements-webpack-plugin [![npm version](https://badge.fury.io/js/html-elements-webpack-plugin.svg)](http://badge.fury.io/js/html-elements-webpack-plugin) [![npm downloads](https://img.shields.io/npm/dm/html-elements-webpack-plugin.svg)](https://npmjs.org/html-elements-webpack-plugin)

This repository holds the JavaScript source code and distributable bundle of **`html-elements-webpack-plugin`**, the webpack plugin to append head elements during the creation of `index.html` with the source code is copied from [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter).

It can be considered as a shorthand implementation the `html-elements-webpack-plugin` developed by [AngularClass](https://github.com/AngularClass).

## Getting started
### Installation
You can install **`html-elements-webpack-plugin`** using `npm`
```
npm install html-elements-webpack-plugin --save
```

### Usage
Create a JS file (ex: head-config.js) in your `./config` folder, and define head elements you want them to be appended during the creation of `index.html`:

#### head-config.js
```JavaScript
/**
 * Configuration for head elements added during the creation of index.html.
 *
 * All href attributes are added the publicPath (if exists) by default.
 * You can explicitly hint to prefix a publicPath by setting a boolean value to a key that has
 * the same name as the attribute you want to operate on, but prefix with =
 *
 * Example:
 * { name: 'msapplication-TileImage', content: '/assets/icon/ms-icon-144x144.png', '=content': true },
 * Will prefix the publicPath to content.
 *
 * { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png', '=href': false },
 * Will not prefix the publicPath on href (href attributes are added by default
 *
 */
module.exports = {
  link: [
    /** <link> tags for 'apple-touch-icon' (AKA Web Clips). **/
    { rel: 'apple-touch-icon', sizes: '57x57', href: '/assets/icon/apple-icon-57x57.png' },
    { rel: 'apple-touch-icon', sizes: '60x60', href: '/assets/icon/apple-icon-60x60.png' },
    { rel: 'apple-touch-icon', sizes: '72x72', href: '/assets/icon/apple-icon-72x72.png' },
    { rel: 'apple-touch-icon', sizes: '76x76', href: '/assets/icon/apple-icon-76x76.png' },
    { rel: 'apple-touch-icon', sizes: '114x114', href: '/assets/icon/apple-icon-114x114.png' },
    { rel: 'apple-touch-icon', sizes: '120x120', href: '/assets/icon/apple-icon-120x120.png' },
    { rel: 'apple-touch-icon', sizes: '144x144', href: '/assets/icon/apple-icon-144x144.png' },
    { rel: 'apple-touch-icon', sizes: '152x152', href: '/assets/icon/apple-icon-152x152.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/icon/apple-icon-180x180.png' },

    /** <link> tags for android web app icons **/
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/assets/icon/android-icon-192x192.png' },

    /** <link> tags for favicons **/
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/icon/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/assets/icon/favicon-96x96.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/icon/favicon-16x16.png' },

    /** <link> tags for a Web App Manifest **/
    { rel: 'manifest', href: '/assets/manifest.json' }
  ],
  meta: [
    { name: 'msapplication-TileColor', content: '#00bcd4' },
    { name: 'msapplication-TileImage', content: '/assets/icon/ms-icon-144x144.png', '=content': true },
    { name: 'theme-color', content: '#00bcd4' }
  ]
};
```

#### webpack.config.js
```JavaScript
const HtmlElementsPlugin = require('html-elements-plugin');

module.exports = {
  // ...your Webpack config
  plugins: [
	... 
    /*
     * Plugin: HtmlElementsPlugin
     * Description: Generate html tags based on javascript maps.
     *
     * If a publicPath is set in the webpack output configuration, it will be automatically added to
     * href attributes, you can disable that by adding a "=href": false property.
     * You can also enable it to other attribute by settings "=attName": true.
     *
     * The configuration supplied is map between a location (key) and an element definition object (value)
     * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
     *
     * Example:
     *  Adding this plugin configuration
     *  new HtmlElementsPlugin({
     *    headTags: { ... }
     *  })
     *
     *  Means we can use it in the template like this:
     *  <%= webpackConfig.htmlElements.headTags %>
     *
     * Dependencies: HtmlWebpackPlugin
     */
    new HtmlElementsPlugin({
      headTags: require('./head-config')
    }),

	...
  ]
};
```

Awesome! **`html-elements-webpack-plugin`** will now append the head elements specified in `head-config.js` during the creation of `index.html`:

## Licence
The MIT License (MIT)

Copyright (c) 2016 [Burak Tasci](http://www.buraktasci.com)