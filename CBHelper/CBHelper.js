/*
Copyright (C) 2012 Cloudbase.io

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License,
version 2, as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
MA 02110-1301, USA.
*/

/*! \mainpage cloudbase.io JavaScript Helper Class Reference
 *
 * \section intro_sec Introduction
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, version 2, as published by
 * the Free Software Foundation.<br/><br/>
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.<br/><br/>
 
 * You should have received a copy of the GNU General Public License
 * along with this program; see the file COPYING.  If not, write to the Free
 * Software Foundation, 59 Temple Place - Suite 330, Boston, MA
 * 02111-1307, USA.<br/><br/>
 *
 * \section install_sec Getting Started
 *
 * The cloudbase.io JavaScript helper class can be included in any website.<br/><br/>
 * It relies on the CBXMLHttpRequest and a platform specific helper libraries being loaded
 *
 * This full reference is a companion to <a href="/documentation/javascript" target="_blank">
 * the tutorial on the cloudbase.io website<a/>
 */

/**
* The CBHelperResponseInfo object contains all of the data and information returned 
* by cloudbase.io once a request is made. Other than the file download API calls all
* other calls will send to the responder function an object of this type
*
* @class CBHelperResponseInfo
* @constructor
*/
function CBHelperResponseInfo() {
	/**
	* The status code returned by the cloudbase.io APIs. The most common values are
	* 200 for OK or 401 for unauthorized request. 
	* 
	* @property httpStatus
	* @type int
	* @default 0
	*/
	this.httpStatus			= 0;
	/**
	* The function type for the current API call. log/data/notifications/cloudfunction/email and so on.
	* This is irrelevant unless you need to parse again the output returned by the APIs using the 
	* outputString property.
	* 
	* @property cloudbaseFunction
	* @type string
	* @default ""
	*/
	this.cloudbaseFunction	= "";
	/**
	* The error message (if any) returned by the cloudbase APIs
	* 
	* @property errorMessage
	* @type string
	* @default ""
	*/
	this.errorMessage		= "";
	/**
	* Whether the API call was succesfull - the httpStatus may be 200 but the parameters were badly formatted
	* so the value of this property is <strong>false</strong>.
	* 
	* @property callStatus
	* @type bool
	* @default false
	*/
	this.callStatus			= false;
	/**
	* The parsed JSON output of the API call. 
	* 
	* @property outputData
	* @type object/array
	* @default object {}
	*/
	this.outputData			= {};
	/**
	* The full JSON response returned by the cloudbase.io servers. 
	* 
	* @property outputString
	* @type string
	* @default ""
	*/
	this.outputString		= "";
}

/**
 * returns true is the call to the cloudbase.io APIs was successful
 */
CBHelperResponseInfo.prototype.callStatus = function() {
	return (this.httpStatus == 200);
};

/**
* This object is used to store and send to the cloudbase.io servers the location information - 
* it should be set in the <strong>currentLocation</strong> property of the CBHelper object.
*
* @class CBHelperCurrentLocation
* @constructor
*/
function CBHelperCurrentLocation(latitude, longitude, altitude) {
	this.lat = latitude;
	this.lng = longitude;
	this.alt = altitude;
}

CBHelperCurrentLocation.prototype.isValid = function() {
	return (typeof this.lat == 'number' &&  this.lat >= 0.00 && this.lat <= 90.00 
		&& typeof this.lng == 'number' && this.lng >= 0.00 && this.lng <= 360.00
		&& typeof this.alt == 'number');
}

/**
* This is the main cloudbase.io helper class. all of the API calls can be made through this object
* once it's been instanced using the application code, unique identifier and password.
* The CBHelper class depends on the XMLHttpRequest and JSON objects being loaded.
*
* @class CBHelper
* @constructor
*/
function CBHelper (appCode, appUniq, platformHelper) {
	/**
	* The application code assigned to the cloudbase.io application 
	* 
	* @property appCode
	* @type string
	* @default ""
	*/
	this.appCode				= appCode;
	/**
	* The application unique identifier assigned to the cloudbase.io application 
	* 
	* @property appUniq
	* @type string
	* @default ""
	*/
    this.appUniq 				= appUniq;
    
    /**
     * The platform helper object to be used for 
     * platform-specific system calls
     */
    this.platformHelper			= platformHelper;
    /**
	* The md5 hash of the application password on cloudbase.io. 
	* 
	* @property password
	* @type string
	* @default ""
	*/
    this.password 				= "";
    /**
	* The sessionId is a unique identifier generated by the cloudbase.io servers once a
	* device is registered - See registerDevice API call. 
	* 
	* @property CBSessionId
	* @type string
	* @default ""
	*/
    var CBSessionId				= "";
    this.deviceRegistered		= false;
    /**
	* This variable should contain a CBHelperCurrentLocation object. if this property is set
	* then the location information will be sent with each API call.
	* 
	* @property currentLocation
	* @type CBHelperCurrentLocation
	* @default null
	*/
    this.currentLocation		= null;
    
    /**
	* If the application settings on cloudbase.io define the authentication properties then
	* this field need to be set to the username specified in the authentication collection.
	* cloudbase.io will authenticate the user against the collection before allowing any call
	* to be performed. See the cloudbase.io documentation http://cloudbase.io/documentation/rest-apis
	* for the cb_auth_user and cb_auth_password fields.
	* 
	* @property authUsername
	* @type String
	* @default null
	*/
    this.authUsername			= null;
    /**
	* If the application settings on cloudbase.io define the authentication properties then
	* this field need to be set to the password specified in the authentication collection.
	* cloudbase.io will authenticate the user against the collection before allowing any call
	* to be performed. See the cloudbase.io documentation http://cloudbase.io/documentation/rest-apis
	* for the cb_auth_user and cb_auth_password fields.
	* 
	* @property authPassword
	* @type String
	* @default null
	*/
    this.authPassword			= null;
    
    this.isHttps				= true;
    this.domain					= "api.cloudbase.io";
    this.requestParamBoundary	= "---------------------------14737809831466499882746641449";
    
    // check whether the broser supports the FormData object
    this.supportsFormData		= (window.FormData !== undefined);
    
    this.getCurrentLocation = function() {
    	return this.currentLocation;
    }
    
    this.getAuthUsername = function() {
    	return this.authUsername;
    }
    
    this.getAuthPassword = function() {
    	return this.authPassword;
    }
    
    this.getPlatformHelper = function() {
    	return this.platformHelper;
    }
}

CBHelper.prototype.defaultLogCategory = "DEFAULT";
CBHelper.prototype.CBLogLevel = {
    DEBUG : "DEBUG",
    INFO : "INFO",
    WARNING : "WARNING",
    ERROR : "ERROR",
    FATAL : "FATAL",
    EVENT : "EVENT"
};

/**
* Sets the password for the application on cloudbase.io. This method expects the md5 hash
* of the application password. Once the password is set the CBHelper class will automatically
* try to register the device with the cloudbase.io servers thus starting a new session and 
* receiving the sessionId
*
* @method setPassword
* @param {String} pwd The md5 hash of the application password on cloudbase.io
*/
CBHelper.prototype.setPassword = function(pwd) {
    this.password = pwd;
    if (!this.deviceRegistered) {
    	this.registerDevice();
    	this.deviceRegistered = true;
    }
};

// Register device
/**
* Registers a device with the cloudbase.io server and receives the sessionId.
*
* @method registerDevice
*/
CBHelper.prototype.registerDevice = function() {
	params = {
		"device_type" : this.platformHelper.deviceType,
		"device_name" : this.platformHelper.deviceName + " - " + this.platformHelper.deviceModel,
		"device_model" : this.platformHelper.deviceVersion,
		"language" : this.platformHelper.language,
		"country" : this.platformHelper.country
	};
	url = this.generateUrl() + "/" + this.appCode + "/register";
	
	var pHelper = this.platformHelper;
	this.sendHttpRequest("register-device", url, params, null, null, function(parsedData) {
		//pHelper.log("received session id: " + parsedData.outputData.sessionid);
		CBSessionId = parsedData.outputData.sessionid;
	});
};
// /Register device

// Logging functions
CBHelper.prototype.logDebug = function(line, category) {
	this.writeLog(line, category, this.CBLogLevel.DEBUG);
};
CBHelper.prototype.logInfo = function(line, category) {
	this.writeLog(line, category, this.CBLogLevel.INFO);
};
CBHelper.prototype.logWarn = function(line, category) {
	this.writeLog(line, category, this.CBLogLevel.WARNING);
};
CBHelper.prototype.logError = function(line, category) {
	this.writeLog(line, category, this.CBLogLevel.ERROR);
};
CBHelper.prototype.logFatal = function(line, category) {
	this.writeLog(line, category, this.CBLogLevel.FATAL);
};
CBHelper.prototype.logEvent = function(line, category) {
	this.writeLog(line, category, this.CBLogLevel.EVENT);
};
/**
* Logs something to the cloudbase.io servers. This log is accessible through the application
* control panel on the cloudbase.io account pages and allows to keep track of potential issues
* and errors encountered by the application's users.
* Additionally it is possible to send special "EVENT" messages by using the EVENT severity type.
* These events will be collected and used to generate analytics for custom events.
* 
* Shortcuts for each severity types are also available:
* logDebug(line, category);
* logInfo(line, category);
* logWarn(line, category);
* logError(line, category);
* logFatal(line, category);
* logEvent(line, category);
*
* @method writeLog
* @param {String} line The text to log
* @param {String} category The category to log to. If this parameter is null then "DEFAULT" is used
* @param {CBHelper.CBLogLevel} severity The severity of the logged information - DEBUG/INFO/WARNING/ERROR/FATAL/EVENT
*/
CBHelper.prototype.writeLog = function(line, category, severity) {
	params = {
		"category" : (category = typeof category !== 'undefined'?category:this.defaultLogCategory),
		"level" : severity,
		"log_line" : line,
		"device_name" : this.platformHelper.deviceName + " - " + this.platformHelper.deviceModel,
		"device_model" : this.platformHelper.deviceType + " - " + this.platformHelper.deviceVersion
	};
	url = this.generateUrl() + "/" + this.appCode + "/log";
	this.sendHttpRequest("log", url, params, null, null, null);
};
/**
* Sends navigation information to the cloudbase.io servers using the sessionId. This data
* is used to generate the usage flow analytics to help you understand how your users interact
* with your application.
* This method should be called every time a new screen is displayed with the new screen name.
*
* @method logNavigation
* @param {String} viewName The unique identifier of the newly loaded screen
*/
CBHelper.prototype.logNavigation = function(viewName) {
	if (CBSessionId != "") {
		params = {
			"session_id" : CBSessionId,
			"screen_name" : viewName
		};
		
		url = this.generateUrl() + "/" + this.appCode + "/lognavigation";
		this.sendHttpRequest("log-navigation", url, params, null, null, function(resp) { JSON.stringify(resp); });
	}
};
// /Logging functions

// CloudBase functions


/**
* Inserts a document in a collection in your cloudbase. The document could be any object.
* The cloudbase.io helper class will automatically try to serialise it to JSON.
* It is also possible to attach files to a document through this method. File attachments 
* will appear as a special new field in your document called cb_files which will contain
* a list of the files attached to the document and their unique identifier on the cloudbase.io
* servers. The files can then be downloaded using this unique identifier
*
* @method insertDocument
* @param {String} collection The name of the collection (table) to save the new document to
* @param {Object} data The object to be saved - this will automatically be serialised to JSON
* @param {Array} files This is an array of file objects. The object contains two parameters { name : "FILENAME.jpg", content : "FILEDATA" }
* @param {function(CBHelperResponseInfo)} responder A function to handle the response returned by cloudbase.io
* 	in the form of a CBHelperResponseInfo object
*/
CBHelper.prototype.insertDocument = function(collection, data, files, responder) {
	var finalData;
	var dataType = typeof data;
	if (dataType !== 'array') {
		finalData = new Array(data);
	} else {
		finalData = data;
	}
	
	url = this.generateUrl() + "/" + this.appCode + "/" + collection + "/insert";
	
	this.sendHttpRequest("data", url, finalData, null, files, responder);
	
};
/**
 * Returns all of the documents in a collection.
 * 
 * @method searchAllDocuments
 * @param {String} collection The name of the collection to search
 * @param {function(CBHelperResponseInfo)} responder A function to handle the response returned by cloudbase.io
 * 	in the form of a CBHelperResponseInfo object
 */
CBHelper.prototype.searchAllDocuments = function(collection, responder) {
	this.searchDocuments({}, collection, responder);
};
/**
 * Returns the documents matching the given set of conditions. For a complete description of the 
 * possible conditions see the REST APIs documentation on http://cloudbase.io/documentation/rest-apis
 * 
 * @method searchDocuments
 * @param {Object} conditions The object representing the search conditions: { 'first_name' : 'cloud' }
 * @param {String} collection The name of the collection to search
 * @param {function(CBHelperResponseInfo)} responder A function to handle the response returned by cloudbase.io
 * 	in the form of a CBHelperResponseInfo object
 */
CBHelper.prototype.searchDocuments = function(conditions, collection, responder) {
	var params = {
		"cb_search_key" : conditions
	};
	
	url = this.generateUrl() + "/" + this.appCode + "/" + collection + "/search";
	this.sendHttpRequest("data", url, params, null, null, responder);
};
/**
 * Runs a search over a collection and applies the given list of aggregation commands to the output.
 * @param aggregateCommands An array of aggregation commands 
 * @param collection The name of the collection to search
 * @param responder A responder to handle the response 
 */
CBHelper.prototype.searchAggregate = function(aggregateCommands, collection, responder) {
	var params = {
		"cb_aggregate_key" : aggregateCommands
	};
		
	url = this.generateUrl() + "/" + this.appCode + "/" + collection + "/aggregate";
	this.sendHttpRequest("data", url, params, null, null, responder);
}

/**
 * Overwrites the documents matching the given conditions with the new objects passed to the method. 
 * Works in exactly the same way as an SQL update.
 * 
 * @method updateDocument
 * @param {Object} data The data of the new objects
 * @param {Object} conditions The object representing the search conditions: { 'first_name' : 'cloud' }
 * @param {String} collection The name of the collection to search
 * @param {function(CBHelperResponseInfo)} responder A function to handle the reponse returned by cloudbase.io
 * 	in the form of a CBHelperResponseInfo object
 */
CBHelper.prototype.updateDocument = function(data, conditions, collection, files, responder) {
	var finalData;
	var dataType = typeof data;
	if (dataType !== 'array') {
		data.cb_search_key = conditions;
		finalData = new Array(data);
	} else {
		finalData = new Array();
		for (var i = 0; i < data.length; i++) {
			var curObject = data[i];
			curObject.cb_search_key = conditions;
			finalData.push(curObject);
		}
	}
	
	url = this.generateUrl() + "/" + this.appCode + "/" + collection + "/update";
	this.sendHttpRequest("data", url, finalData, null, files, responder);
};

/**
 * Downloads a file attached to a cloudbase document. The file_id field is part of the file object
 * in the cb_files field in a collection.
 * @param fileId The file id to be downloaded
 * @param responder a function responder expecing two parameters, the int http status and the Blob object
 *  of the file data function(statusCode, blobData)
 * @param a function to monitor the progress of the download. This function receives two paramers, the total 
 *  bytes downloaded and the bytes available
 */
CBHelper.prototype.downloadFile = function(fileId, responder, progress) {
	var url = this.generateUrl() + "/" + this.appCode + "/file/" + fileId;
	
	this.sendHttpRequest("download", url, { "base64" : false }, null, null, responder, progress);
};

// /CloudBase functions

// Notification functions

/**
 * Registers the current device to send and receive push notifications in a specific channel.
 * This method will be triggered only if supported by the platform specific helper.
 * 
 * @param token The token returned by the original provider
 * @param channel The notification channel to subscribe to - by default all devices are registered in the 'all' channel
 * @param A function to receive the status of the subscription: function(sub = boolean) - true if the device was subscribed correctly
 */
CBHelper.prototype.registerDeviceForNotifications = function(token, channel, responder) {
	if ( this.getPlatformHelper().pushNotifications ) {
		var url = this.generateUrl() + "/" + this.appCode + "/notifications-register";
		var params = {
			"action": "subscribe",
			"device_key": token,
			"device_network" : this.getPlatformHelper().getPushNotificationsPlatform(),
			"channel" : channel
		}
		
		this.sendHttpRequest("notifications-register", url, params, null, null, function(resp) {
			responder(resp.callStatus);
		});
	} else {
		responder(false);
	}
}

/**
 * Unregisters a device from a push notification channel on cloudbase.io
 * 
 * @param token The unique token identifying the device
 * @param channel The channel to unsubscribe from 
 * @param fromAll Whether to completely remove the device from the push notifications list ( will also unsubscribe from the 'all' channel)
 */
CBHelper.prototype.unregisterDeficeForNotifications = function(token, channel, fromAll) {
	if ( this.getPlatformHelper().pushNotifications ) {
		var url = this.generateUrl() + "/" + this.appCode + "/notifications-register";
		var params = {
			"action": "unsubscribe",
			"device_key": token,
			"device_network" : this.getPlatformHelper().getPushNotificationsPlatform(),
			"channel" : channel
		}
		if ( fromAll ) {
			params.from_all = true;
		}
		
		this.sendHttpRequest("notifications-register", url, params, null, null, function(resp) {
			responder(resp.callStatus);
		});
	} else {
		responder(false);
	}
}

/**
 * Sends a push notification to all devices subscribed to the channel - This method will work only if the 
 * application's security settings on cloudbase.io allow client devices to push notifications
 * 
 * @param text The push notification content
 * @param channel The name of the channel to push to
 * @param iosCertificateType Whether to use the "development" or "production" certificate to send notifications to iOS devices
 */
CBHelper.prototype.sendNotification = function(text, channel, iosCertificateType) {
	if ( this.getPlatformHelper().pushNotifications ) {
		var url = this.generateUrl() + "/" + this.appCode + "/notifications";
		var params = {
			"channel" : channel,
			"cert_type" : iosCertificateType,
			"alert" : text
		};
		
		this.sendHttpRequest("notifications", url, params, null, null);
	}
}

/**
 * Sends an email to the given recipient using a template previously created on cloudbase.io.
 * Email templates can be managed from the application control panel on cloudbase.io
 * 
 * @method sendNotification
 * @param {String} recipient The email address of the recipient
 * @param {String} subject The subject of the email
 * @param {String} templateCode The unique identifier of the template
 * @param {Object} vars An associative array of varibles to fill the template { 'first_name' : 'Cloud' }
 * 	For more information on how to use these variables in a template see the cloudbase.io documentation
 */
CBHelper.prototype.sendEmail = function(recipient, subject, templateCode, vars) {
	var params = {
		"template_code" : templateCode,
		"recipient" : recipient,
		"subject" : subject,
		"variables" : vars
	};
	
	url = this.generateUrl() + "/" + this.appCode + "/email";
	this.sendHttpRequest("email", url, params, null, null, responder);
};

// /Notification functions

// CloudFunction functions
/**
 * Executes a CloudFunction on the cloudbase.io servers. Additional POST parameters
 * can be specified in this method.
 * 
 * @method executeCloudFunction
 * @param {String} functionCode The unique code assigned by cloudbase.io to the CloudFunction
 * @param {Object} params A list of additional parameters for the CloudFunction (if needed)
 * @param {function(CBHelperResponseInfo)} responder A function to handle the reponse returned by cloudbase.io
 * 	in the form of a CBHelperResponseInfo object
 */
CBHelper.prototype.executeCloudFunction = function(functionCode, params, responder) {
	url = this.generateUrl() + "/" + this.appCode + "/cloudfunction/" + functionCode;
    
    this.sendHttpRequest("cloudfunction", url, null, params, null, responder);
};
/**
 * Executes one of the standard Applets provided by cloudbase.io - the list of applets
 * and their documentation can be found at http://cloudbase.io/documentation/applets
 * 
 * @method executeApplet
 * @param {String} appletCode The unique code of the applet
 * @param {Object} params A list of additional parameters for the applet (if needed)
 * @param {function(CBHelperResponseInfo)} responder A function to handle the reponse returned by cloudbase.io
 * 	in the form of a CBHelperResponseInfo object
 */
CBHelper.prototype.executeApplet = function(appletCode, params, responder) {
	url = this.generateUrl() + "/" + this.appCode + "/applet/" + appletCode;
    this.sendHttpRequest("applet", url, null, params, null, responder);
};
// /CloudFunction functions    

// PayPal function
/**
 * Calls PayPal and requests a token for the express checkout of digital goods.
 * The PayPal API credentials must be set in the cloudbase.io control panel for this method to work.
 * 
 * @param {Object} a payment object populated as per the specification described in the cloudbase.io
 * javascript documentation
 * @param true if the transaction should be initiated in the live environment and not the PayPal sandbox
 * @param an options object with additional details for the transaction: { currency, completedCloudfunction, cancelledCloudfunction, paymentCompletedUrl, paymentCancelledUrl }
 * @param {function(CBHelperResponseInfo)} A function to receive the PayPal token and checkout url
 */
CBHelper.prototype.preparePayPalPurchase = function(paymentObject, isLive, options, responder) {
	url = this.generateUrl() + "/" + this.appCode + "/paypal/prepare";
	
	var postData = {
		"purchase_details" : paymentObject,
    	"environment" : (isLive?"live":"sandbox"),
    	"currency" : (options.currency?options.currency:"USD"),
    	"type" : "purchase",
    	"completed_cloudfunction" : (options.completedCloudfunction?options.completedCloudfunction:""),
    	"cancelled_cloudfunction" : (options.cancelledCloudfunction?options.cancelledCloudfunction:""),
    	"payment_completed_url" : (options.paymentCompletedUrl?options.paymentCompletedUrl:""),
    	"payment_cancelled_url" : (options.paymentCancelledUrl?options.paymentCancelledUrl:"")
	};
	
	this.sendHttpRequest("paypal", url, postData, null, null, responder);
}

CBHelper.parseOutput = function(httpStatus, data, cloudbaseFunction) {
	var output = new CBHelperResponseInfo();
	output.cloudbaseFunction = cloudbaseFunction;
	output.outputString = data;
	try {
		var theData = JSON.parse(data);
		output.callStatus = (theData[cloudbaseFunction]["status"] == "OK");
		output.outputData = theData[cloudbaseFunction]["message"];
		output.errorMessage = theData[cloudbaseFunction]["error"];
	} catch (ex) {
		output.callStatus = false;
		output.errorMessage = "Error while parsing response data: " + ex;
	}
	return output;
};
CBHelper.prototype.sendHttpRequest = function(cloudbaseFunction, url, params, additionalParams, files, responder, progress) {
	var paramData = this.prepareRequestParams(params, additionalParams, files);
	
	var cbRequest = new CBXMLHttpRequest(cloudbaseFunction, url, function(requestState, responseText) {
		if (requestState == 200) {
			if (cloudbaseFunction == "download") {
				if (responder) {
					responder(requestState, responseText);
				}
			} else {
				var outputData = CBHelper.parseOutput(requestState, responseText, cloudbaseFunction);
				if (responder) {
					responder(outputData);
				}
			}
		} else {
			console.log("response " + requestState);
			if (responder)
				responder(null);
				
			//console.log(responseText);
		}
	});
	
	cbRequest.downloadProgress = progress;
	//cbRequest.setRequestHeader(XCB-JS-HELPER, "TRUE");
	cbRequest.platformHelper = this.platformHelper;
	
	if ( ! this.supportsFormData ) {
		cbRequest.setRequestHeader("Content-type", "multipart/form-data; boundary=" + this.requestParamBoundary);
		cbRequest.setRequestHeader("Content-length", paramData.length);
	}
	
	cbRequest.send(paramData, true);
};

CBHelper.prototype.prepareRequestParamBody = function(paramName, paramValue) {
	var output = "";
	output += "--" + this.requestParamBoundary + "\r\n";
	output += "Content-Disposition: form-data; name=\"" + paramName + "\"\r\n\r\n";
	output += paramValue + "\r\n";
	
	return output;
};

CBHelper.prototype.prepareRequestFileBody = function(fileName, fileContent, fileCounter) {
	var output = "";
	output += "--" + this.requestParamBoundary + "\r\n";
	output += "Content-Disposition: attachment; name=\"file_" + fileCounter + "\"; filename=\"" + fileName + "\"\r\n";
	output += "Content-Type: application/octet-stream\r\n\r\n";
	output += fileContent + "\r\n";
	
	return output;
};

CBHelper.prototype.prepareRequestParams = function(params, additionalParams, files) {
	if ( ! this.supportsFormData ) {
		var outParams = "";
		outParams += this.prepareRequestParamBody("app_uniq", this.appUniq);
		outParams += this.prepareRequestParamBody("app_pwd", this.password);
		outParams += this.prepareRequestParamBody("device_uniq", this.platformHelper.deviceUniqueIdentifier);
		if (params)
			outParams += this.prepareRequestParamBody("post_data", JSON.stringify(params));
			
		if (this.getAuthUsername() != null && this.getAuthPassword() != null) {
			outParams += this.prepareRequestParamBody("cb_auth_user", this.getAuthUsername());
			outParams += this.prepareRequestParamBody("cb_auth_password", this.getAuthPassword());
		}
		
		if (typeof additionalParams !== 'undefined') {
			for (var key in additionalParams) {
				outParams += this.prepareRequestParamBody(key, additionalParams[key]);
			}
		}
		
		if ( this.getCurrentLocation() ) {
			outParams += this.prepareRequestParamBody("location_data", JSON.stringify(this.getCurrentLocation()));
		}
		
		if (files != null) {
			for (var i = 0; i < files.length; i++) {
				if (files[i] != null) {
					var curFile = files[i];
					outParams += this.prepareRequestFileBody(curFile["name"], curFile["content"], i);
				}
			}
		}
		
		outParams += this.prepareRequestParamBody("cb_js_helper", "true");
		return outParams;
	} else {
		var formOutParams = new FormData();
		formOutParams.append("app_uniq", this.appUniq);
		formOutParams.append("app_pwd", this.password);
		formOutParams.append("device_uniq", this.platformHelper.deviceUniqueIdentifier);
		if (params) {
			//alert(fCBEscapeString(JSON.stringify(params)));
			formOutParams.append("post_data", JSON.stringify(params));
		}
		
		if (this.getAuthUsername() != null && this.getAuthPassword() != null) {
			formOutParams.append("cb_auth_user", this.getAuthUsername());
			formOutParams.append("cb_auth_password", this.getAuthPassword());
		}
		
		if (typeof additionalParams !== 'undefined') {
			for (var key in additionalParams) {
				//params += "&" + key + "=" + additionalParams[key];
				formOutParams.append(key, additionalParams[key]);
			}
		}
		
		if ( this.getCurrentLocation() ) {
			//params += "&current_location=" + JSON.stringify(this.currentLocation);
			formOutParams.append("location_data", JSON.stringify(this.getCurrentLocation()));
		}
		
		if (files != null) {
			for (var i = 0; i < files.length; i++) {
				if (files[i] != null) {
					formOutParams.append(files[i].name, files[i].content);
				}
			}
		}
		
		formOutParams.append("cb_js_helper", "true");
		
		return formOutParams;
	}
};

CBHelper.prototype.prepareAttachmentFileFromFormElement = function(elementId, fileReady) {
	var fileElement = document.getElementById(elementId);
	
	var files = [];
	
	for (var i = 0; i < fileElement.files.length; i++) {
		var newFile =  {};
		
		newFile.name = 'file_' + i;
		
		newFile.content = fileElement.files[i];
		
		
		files.push(newFile);
	}
	
	fileReady(files);
};

CBHelper.prototype.prepareAttachmentFileFromPath = function(filePath, fileReady) {
	try {
		mosync.rlog("helper class call");
		this.platformHelper.prepareAttachmentFileFromPath(filePath, fileReady);
	} catch (ex) {
		this.platformHelper.log("error while reading file " + ex);
		fileReady(null);
	}
};

CBHelper.prototype.generateUrl = function() {
	return (this.isHttps?"http":"http") + "://" + this.domain;
};