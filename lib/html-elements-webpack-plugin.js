﻿const RE_ENDS_WITH_BS = /\/$/;

function* capitlizeFirstLetter(str) {
	for (let [i, l] of Array.from(str).entries()) {
		yield (i === 0) ? l.toUpperCase() : l;
	}
}

function* capitalizeWordsArray(rest) {
	for (let word of rest) {
		yield* capitlizeFirstLetter(word);
	}
}

function kebbabCase2CamelCase(str) {
	const strArr = str.split('-');
	if (strArr.length < 2) return str;
	let [first, ...rest] = strArr;
	const restGen = capitalizeWordsArray(rest);
	return [first, ...restGen].join('');
}

function compatAddPlugin(tappable, hookName, callback, async = false, forType = null) {
	const method = (async) ? 'tapAsync' : 'tap';
	if (tappable.hooks) {
		hookName = kebbabCase2CamelCase(hookName);
		if (forType) {
			tappable.hooks[hookName][method](forType, HtmlElementsWebpackPlugin.name, callback);
		} else {
			tappable.hooks[hookName][method](HtmlElementsWebpackPlugin.name, callback);
		}
	} else {
		tappable.plugin(hookName, callback);
	}
}

class HtmlElementsWebpackPlugin {
	constructor(locations) {
		this.locations = locations;
	}

	apply(compiler) {
		compatAddPlugin(compiler, 'compilation',
			(compilation) => {
				compilation.options.htmlElements = compilation.options.htmlElements || {};
				compatAddPlugin(compilation, 'html-webpack-plugin-before-html-generation',
					(htmlPluginData) => {
						const locations = this.locations;
						if (locations) {
							const publicPath = htmlPluginData.assets.publicPath;
							Object.getOwnPropertyNames(locations)
							.forEach(function (loc) {
								compilation.options.htmlElements[loc] = getHtmlElementString(locations[loc], publicPath);
							});
						}
					});
			});
	}
}

/**
 * Create an HTML tag with attributes from a map.
 *
 * Example:
 * createTag('link', { rel: "manifest", href: "/assets/manifest.json" })
 * // <link rel="manifest" href="/assets/manifest.json">
 * @param tagName The name of the tag
 * @param attrMap A Map of attribute names (keys) and their values.
 * @param publicPath a path to add to eh start of static asset url
 * @returns {string}
 */
function createTag(tagName, attrMap, publicPath) {
	publicPath = publicPath || '';

	// add trailing slash if we have a publicPath and it doesn't have one.
	if (publicPath && !RE_ENDS_WITH_BS.test(publicPath)) {
		publicPath += '/';
	}

	const attributes = Object.getOwnPropertyNames(attrMap)
	.filter(function (name) {
		return name[0] !== '=';
	})
	.map(function (name) {
		var value = attrMap[name];

		if (publicPath) {
			// check if we have explicit instruction, use it if so (e.g: =herf: false)
			// if no instruction, use public path if it's href attribute.
			const usePublicPath = attrMap.hasOwnProperty('=' + name) ? !!attrMap['=' + name] : name === 'href';

			if (usePublicPath) {
				// remove a starting trailing slash if the value has one so we wont have //
				value = publicPath + (value[0] === '/' ? value.substr(1) : value);
			}
		}

		return `${name}="${value}"`;
	});

	const closingTag = tagName === 'script' ? '</script>' : '';

	return `<${tagName} ${attributes.join(' ')}>${closingTag}`;
}

/**
 * Returns a string representing all html elements defined in a data source.
 *
 * Example:
 *
 *    const ds = {
 *      link: [
 *        { rel: "apple-touch-icon", sizes: "57x57", href: "/assets/icon/apple-icon-57x57.png" }
 *      ],
 *      meta: [
 *        { name: "msapplication-TileColor", content: "#00bcd4" }
 *      ]
 *    }
 *
 * getHeadTags(ds);
 * // "<link rel="apple-touch-icon" sizes="57x57" href="/assets/icon/apple-icon-57x57.png">"
 *    "<meta name="msapplication-TileColor" content="#00bcd4">"
 *
 * @returns {string}
 */
function getHtmlElementString(dataSource, publicPath) {
	return Object.getOwnPropertyNames(dataSource)
	.map(function (name) {
		if (Array.isArray(dataSource[name])) {
			return dataSource[name].map(function (attrs) {
				return createTag(name, attrs, publicPath);
			});
		} else {
			return [createTag(name, dataSource[name], publicPath)];
		}
	})
	.reduce(function (arr, curr) {
			return arr.concat(curr);
		},
		[])
	.join('\n\t');
}

module.exports = HtmlElementsWebpackPlugin;
