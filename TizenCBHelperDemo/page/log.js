/*******************************************************************************
 * page1 event handler
 * 
 * @generated Tizen UI Builder
 * @attribute user, editable
 *******************************************************************************
*/
/**
 * @param {Object} event
 * @base _log_page
 * @returns {Boolean}
*/
_log_page.prototype.sendLogButton_ontap = function(event) {
	
	
	if (sharedCbHleper) {
		console.log("found helper");
		var logLevel = $('#logLevelInput').val();
		var logMessage = $('#logMessageInput').val();
		
		sharedCbHleper.writeLog(logMessage, "DEFAULT", sharedCbHleper.CBLogLevel[logLevel]);
	}
};

