/**
 * @name ExperimentalMenu
 * @author Martin™#9999
 * @description Adds the **Experimental Menu** upon startup, the code(in load()) for which can be found at https://discord.gg/K2XqsZSy in #experimental-menu. The **Experimental Menu** adds 2 new menu items in your user settings. One of them lets you change different developer settings that aren't usually available. The second one lets you enable different experiments/features that Discord hasn't officially rolled out to all users. When enabling experiments, each *Treatment* is certain stage in that feature's development process. The higher the *Treatment*, the more polished the feature is
 * @version 1.0.0
 * @authorId 492464793416892416
 */

module.exports = class ExperimentalMenu {
	load() {
		const DI = window.DiscordInternals;
		const hasLib = !!(DI && DI.versionCompare && DI.versionCompare(DI.version || "", "1.9") >= 0);
		const WebpackModules = hasLib && DI.WebpackModules || (() => {

			const req = typeof(webpackJsonp) == "function" ? webpackJsonp([], {
					'__extra_id__': (module, exports, req) => exports.default = req
			}, ['__extra_id__']).default : webpackJsonp.push([[], {
					'__extra_id__': (module, exports, req) => module.exports = req
			}, [['__extra_id__']]]);
			delete req.m['__extra_id__'];
			delete req.c['__extra_id__'];
			const find = (filter, options = {}) => {
				const {cacheOnly = false} = options;
				for (let i in req.c) {
					if (req.c.hasOwnProperty(i)) {
						let m = req.c[i].exports;
						if (m && m.__esModule && m.default && filter(m.default))
							return m.default;
						if (m && filter(m))
							return m;
					}
				}
				if (cacheOnly) {
					console.warn('Cannot find loaded module in cache');
					return null;
				}
				console.warn('Cannot find loaded module in cache. Loading all modules may have unexpected side effects');
				for (let i = 0; i < req.m.length; ++i) {
					let m = req(i);
					if (m && m.__esModule && m.default && filter(m.default))
						return m.default;
					if (m && filter(m))
						return m;
				}
				console.warn('Cannot find module');
				return null;
			};
			const findByUniqueProperties = (propNames, options) => find(module => propNames.every(prop => module[prop] !== undefined), options);
			const findByDisplayName = (displayName, options) => find(module => module.displayName === displayName, options);
			return {find, findByUniqueProperties, findByDisplayName};
		})();
		t = WebpackModules.findByUniqueProperties(["isDeveloper"]);
		Object.defineProperty(t,"isDeveloper",{get:_=>1,set:_=>_,configurable:true});
	}

	start() {}
	stop() {}
}
