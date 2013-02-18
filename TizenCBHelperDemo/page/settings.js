/*******************************************************************************
 * page1 event handler
 * 
 * @generated Tizen UI Builder
 * @attribute user, editable
 *******************************************************************************
*/

/**
 * @param {Object} event
 * @base _settings_page
 * @returns {Boolean}
*/
_settings_page.prototype.saveSettingsButton_ontap = function(event) {
	tizenHelperInit(function(tizenObject) {
		try {
			var appCode = $('#appCodeInput').val();
			var appSecret = $('#appSecretInput').val();
			var appPwd = hex_md5($('#appPwdInput').val());
			
			localStorage.setItem("app_code", appCode);
			localStorage.setItem("app_uniq", appSecret);
			localStorage.setItem("app_pwd", appPwd);
			
			sharedCbHleper = new CBHelper(appCode, appSecret, tizenObject);
			sharedCbHleper.setPassword(appPwd);
			
			//sessionStorage.setItem("cb_helper", helper);
		} catch (ex) {
			tizenObject.log("error " + ex);
		}
	});	
	
	return true;
};

/**
 * @param {Object} event
 * @base _settings_page
 * @returns {Boolean}
*/
_settings_page.prototype.onpageshow = function(event) {
	console.log("onpageshow");
	if (localStorage.getItem("app_code")) 
		$('#appCodeInput').val(localStorage.getItem("app_code"));
	
	if (localStorage.getItem("app_uniq"))
		$('#appSecretInput').val(localStorage.getItem("app_uniq"));
	
	if (localStorage.getItem("app_pwd"))
		$('#appPwdInput').val(localStorage.getItem("app_pwd"));
	
	$('#appCodeInput').val("steftest-tizen");
	$('#appSecretInput').val("161f08e1cf3f7ff7432fa6ba391344d1");
	$('#appPwdInput').val("m1i2n3e4");
	
	return true;
};

