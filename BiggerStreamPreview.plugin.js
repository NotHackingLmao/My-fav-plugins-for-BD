/**!
 * @name BiggerStreamPreview
 * @description Adds a button in the context menu to see bigger stream previews.
 * @version 1.0.9
 * @author Marmota (Jaime Filho)
 * @authorId 289112759948410881
 * @invite z6Yx9A8VDR
 * @website https://github.com/jaimeadf/BetterDiscordPlugins/tree/release/src/BiggerStreamPreview
 * @source https://github.com/jaimeadf/BetterDiscordPlugins/tree/release/src/BiggerStreamPreview
 * @updateUrl https://raw.githubusercontent.com/jaimeadf/BetterDiscordPlugins/release/dist/BiggerStreamPreview/BiggerStreamPreview.plugin.js
 */

/*@cc_on
@if (@_jscript)
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
@else@*/

const fs = require('fs');
const path = require('path');
const request = require('request');
const electron = require('electron');

const config = {"info":{"name":"BiggerStreamPreview","description":"Adds a button in the context menu to see bigger stream previews.","version":"1.0.9","authors":[{"name":"Marmota (Jaime Filho)","discord_id":"289112759948410881"}],"github":"https://github.com/jaimeadf/BetterDiscordPlugins/tree/release/src/BiggerStreamPreview","github_raw":"https://raw.githubusercontent.com/jaimeadf/BetterDiscordPlugins/release/dist/BiggerStreamPreview/BiggerStreamPreview.plugin.js"},"changelog":[{"title":"Bugs Squashed","type":"fixed","items":["Fixed all the issues related to the new discord update that started to lazy load a bunch of modules."]}]};

function buildPlugin() {
    const [Plugin, BoundedLibrary] = global.ZeresPluginLibrary.buildPlugin(config);
    var plugin;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ BiggerStreamPreview)
});

;// CONCATENATED MODULE: external ["BdApi","React"]
const external_BdApi_React_namespaceObject = global["BdApi"]["React"];
var external_BdApi_React_default = /*#__PURE__*/__webpack_require__.n(external_BdApi_React_namespaceObject);
;// CONCATENATED MODULE: external "BoundedLibrary"
const external_BoundedLibrary_namespaceObject = BoundedLibrary;
;// CONCATENATED MODULE: external "Plugin"
const external_Plugin_namespaceObject = Plugin;
var external_Plugin_default = /*#__PURE__*/__webpack_require__.n(external_Plugin_namespaceObject);
;// CONCATENATED MODULE: ./src/@discord/Flux.js


const {
    Dispatcher,
    Store,
    BatchedStoreListener,
    useStateFromStores,
    useStateFromStoresArray,
    useStateFromStoresObject,
    default: Flux
} = external_BoundedLibrary_namespaceObject.WebpackModules.getByProps('Store', 'default');



/* harmony default export */ const _discord_Flux = ((/* unused pure expression or super */ null && (Flux)));

;// CONCATENATED MODULE: ./src/@discord/components/Modal.js


const {
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalListContent,
    ModalRoot,
    ModalSize,
    default: Modal
} = external_BoundedLibrary_namespaceObject.WebpackModules.getByProps('ModalRoot');



/* harmony default export */ const components_Modal = ((/* unused pure expression or super */ null && (Modal)));

;// CONCATENATED MODULE: ./src/@utils/listenContextMenuOpening.js


const ContextMenuActions = external_BoundedLibrary_namespaceObject.WebpackModules.getByProps('openContextMenuLazy');

function listenContextMenuOpening(callback) {
    return external_BoundedLibrary_namespaceObject.Patcher.before(ContextMenuActions, 'openContextMenuLazy', (thisObject, args) => {
        const importComponent = args[1];

        args[1] = async () => {
            const wrapperComponent = await importComponent(...arguments);

            return props => {
                const wrapper = wrapperComponent(props);

                callback(wrapper);

                return wrapper;
            };
        };
    });
}

/* harmony default export */ const _utils_listenContextMenuOpening = (listenContextMenuOpening);

;// CONCATENATED MODULE: ./src/@utils/patchContextMenus.js
 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }


function patchContextMenus(criteria, patch) {
    if (typeof criteria !== 'function') {
        const matcher = criteria;

        criteria = ContextMenu => {
            return _optionalChain([ContextMenu, 'access', _ => _.displayName, 'optionalAccess', _2 => _2.match, 'call', _3 => _3(matcher)]);
        };
    }

    return _utils_listenContextMenuOpening(wrapper => {
        const { type: ContextMenu } = wrapper;

        if (criteria(ContextMenu)) {
            return external_BoundedLibrary_namespaceObject.Patcher.after(wrapper, 'type', patch);
        }
    });
}

/* harmony default export */ const _utils_patchContextMenus = (patchContextMenus);

;// CONCATENATED MODULE: ./src/@utils/index.js



;// CONCATENATED MODULE: ./src/BiggerStreamPreview/index.jsx










const { StreamStore, StreamPreviewStore, ModalActions } = external_BoundedLibrary_namespaceObject.DiscordModules;

const ImageModal = external_BoundedLibrary_namespaceObject.WebpackModules.getByDisplayName('ImageModal');
const MaskedLink = external_BoundedLibrary_namespaceObject.WebpackModules.getByDisplayName('MaskedLink');

class BiggerStreamPreview extends (external_Plugin_default()) {
    onStart() {
        this.patchUserContextMenus();
        this.patchStreamContextMenu();
    }

    onStop() {
        external_BoundedLibrary_namespaceObject.Patcher.unpatchAll();
    }

    patchUserContextMenus() {
        _utils_patchContextMenus(/UserContextMenu$/, (thisObject, [{ user }], returnValue) => {
            const [stream, previewURL] = useStateFromStores([StreamStore, StreamPreviewStore], () => {
                const stream = StreamStore.getStreamForUser(user.id);
                const previewURL = stream
                    ? StreamPreviewStore.getPreviewURL(stream.guildId, stream.channelId, stream.ownerId)
                    : null;

                return [stream, previewURL];
            });

            if (!stream) {
                return;
            }

            this.pushStreamPreviewMenuItems(returnValue, previewURL);
        });
    }

    patchStreamContextMenu() {
        _utils_patchContextMenus('StreamContextMenu', (thisObject, [{ stream }], returnValue) => {
            const previewURL = useStateFromStores([StreamPreviewStore], () => {
                return StreamPreviewStore.getPreviewURL(stream.guildId, stream.channelId, stream.ownerId);
            });

            this.pushStreamPreviewMenuItems(returnValue, previewURL);
        });
    }

    pushStreamPreviewMenuItems(menuWrapper, previewURL) {
        menuWrapper.props.children.props.children.push(
            external_BoundedLibrary_namespaceObject.DiscordContextMenu.buildMenuItem({ type: 'separator' }),
            external_BoundedLibrary_namespaceObject.DiscordContextMenu.buildMenuItem({
                label: 'View Stream Preview',
                action: () => this.openImageModal(previewURL),
                disabled: previewURL === null
            })
        );
    }

    async openImageModal(url) {
        const image = await this.fetchImage(url);

        ModalActions.openModal(props => (
            external_BdApi_React_default().createElement(ModalRoot, { className: "modal-3Crloo", size: ModalSize.DYNAMIC, ...props,}
                , external_BdApi_React_default().createElement(ImageModal, {
                    className: "image-36HiZc",
                    src: url,
                    original: url,
                    width: image.width,
                    height: image.height,
                    renderLinkComponent: props => external_BdApi_React_default().createElement(MaskedLink, { ...props,} ),
                    shouldAnimate: true,}
                )
            )
        ));
    }

    async fetchImage(url) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = url;

            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', () => reject('Unable to fetch image.'));
        });
    }
}

plugin = __webpack_exports__["default"];
/******/ })()
;

    return plugin;
}

module.exports = global.ZeresPluginLibrary
    ? buildPlugin()
    : class {
          constructor() {
              this._config = config;
          }

          getName() {
              return config.info.name;
          }

          getAuthor() {
              return config.info.authors.map(a => a.name).join(', ');
          }

          getDescription() {
              return config.info.description;
          }

          getVersion() {
              return config.info.version;
          }

          load() {
              global.BdApi.showConfirmationModal(
                  'Library plugin is needed',
                  `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
                  {
                      confirmText: 'Download',
                      cancelText: 'Cancel',
                      onConfirm() {
                          request.get(
                              'https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js',
                              (error, response, body) => {
                                  if (error) {
                                      return electron.shell.openExternal(
                                          'https://betterdiscord.app/Download?id=9'
                                      );
                                  }

                                  fs.writeFileSync(
                                      path.join(global.BdApi.Plugins.folder, '0PluginLibrary.plugin.js'),
                                      body
                                  );
                              }
                          );
                      }
                  }
              );
          }

          start() {}

          stop() {}
      };

/*@end@*/
