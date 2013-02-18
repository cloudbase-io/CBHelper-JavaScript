/*******************************************************************************
 * cloudfunction event handler
 * 
 * @generated Tizen Builder
 * @attribute user, editable
 *******************************************************************************
*/


/**
 * @param {Object} event
 * @base _cloudfunction_page
 * @returns {Boolean}
*/
_cloudfunction_page.prototype.executeFunctionButton_ontap = function(event) {
	if (sharedCbHleper) {
		var functionCode = $('#functionCodeInput').val();
		
		sharedCbHleper.executeCloudFunction(functionCode, null, function(response) {
			console.log(response.outputString);
		});
	}
};

/**
 * @param {Object} event
 * @base _cloudfunction_page
 * @returns {Boolean}
*/
_cloudfunction_page.prototype.executeAppletButton_ontap = function(event) {
	if (sharedCbHleper) {
		var appletCode = "cb_twitter_search";
		var params = { "search" : "#cloudbaseio" };
		
		sharedCbHleper.executeApplet(appletCode, params, function(response) {
			console.log(response.outputString);
		});
	}
};

