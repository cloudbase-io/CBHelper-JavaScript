/*******************************************************************************
 * Application initialization & Global app object creation 
 * 
 * @generated Tizen UI Builder
 * @attribute managed, readonly, volatile
 *******************************************************************************
*/

$(document).bind("mobileinit", function() {
});

function _app() {
}


_app.prototype.startPageId = "settings";
_app.prototype.startPage = "./page/settings.html";
_app.prototype.lastPageTransition = undefined;
_app.prototype.isFirstEnter = true;
_app.prototype.masterPagePath = location.href;

// global application object
var app = new _app();

_app.prototype.init = function() {
	var rootDir = $.mobile.path.get(app.masterPagePath);
	var newPage;

	newPage = new _settings_page();
	newPage.init_page(true);
	pageManager.addPage(newPage, $.mobile.path.makeUrlAbsolute("./page/settings.html", rootDir));

	newPage = new _log_page();
	newPage.init_page(false);
	pageManager.addPage(newPage, $.mobile.path.makeUrlAbsolute("./page/log.html", rootDir));

	newPage = new _data_page();
	newPage.init_page(false);
	pageManager.addPage(newPage, $.mobile.path.makeUrlAbsolute("./page/data.html", rootDir));

	newPage = new _cloudfunction_page();
	newPage.init_page(false);
	pageManager.addPage(newPage, $.mobile.path.makeUrlAbsolute("./page/cloudfunction.html", rootDir));


	_app.prototype.init = function() {};
};
