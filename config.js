const appConfig = require("application-config")("EtherTorrent");
const path = require("path");

const APP_NAME = "EtherTorrent Node";
const APP_PORT = 5000;
const APP_VERSION = require("./package.json").version;
const IS_TEST = isTest();

module.exports = {
  APP_BANNER: APP_NAME + " - " + APP_VERSION,
  APP_NAME: APP_NAME,
  APP_PORT: APP_PORT,
  APP_VERSION: APP_VERSION,

  IS_TEST: IS_TEST,

  CONFIG_PATH: getConfigPath(),
  DEFAULT_DOWNLOAD_PATH: getDefaultDownloadPath(),
  TORRENT_PATH: path.join(getConfigPath(), "torrents"),

  WINDOW_INITIAL_BOUNDS: {
    width: 1000,
    height: 750
  },
  APP_WINDOW_TITLE: APP_NAME,
}





function getDefaultDownloadPath() {
  // TODO -> Just using torrent_data for now 
  return "./torrent_data";
}




// Returns the configuration path
function getConfigPath() {
  return path.dirname(appConfig.filePath);
}




// // Return the default download path
// function getDefaultDownloadPath() {
//   return getPath("downloads");
// }

// // getPath -> 
// function getPath(key) {
//   if(!process.versions.electron) {
//     // Node.js process
//     return "" 
//   }
//   else if(process.type === "renderer") {
//     // electron render process
//     return electron.remote.app.getPath(key);
//   }
//   else {
//     // Electron main process
//     return electron.app.getPath(key);
//   }
// }

// Determines if we are running tests
function isTest() {
  return process.env.NODE_ENV === "test";
}