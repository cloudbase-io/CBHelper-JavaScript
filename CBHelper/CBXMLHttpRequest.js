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

/**
 * This object is an abstraction of the standard XMLHttpRequest. It uses jquery if 
 * available otherwise will revert back to the standard broser object. This is only
 * used by the helper class internally
 * 
 * @param cbFunction The cloudbase.io function name (data/cloudfunction/applet/downloads etc)
 * @param url The url we are calling to
 * @param whenDone A callback to be executed once the request is completed
 * @returns a new CBXMLHttpRequest object
 */
function CBXMLHttpRequest (cbFunction, url, whenDone) {
	/**
	 * The url to POST the data to
	 */
	this.requestUrl = url;
	/**
	 * The name of the cloudbase function
	 */
	this.cloudbaseFunction = cbFunction;
	/**
	 * The callback function when the request is completed
	 */
	this.requestCompleted = whenDone;
	/**
	 * additional custom headers for the request
	 */
	this.headers = {};
	/**
	 * A CBPlatformHelper. in this class this is used just for logging
	 */
	this.platformHelper = null;
	/**
	 * A callback function to monitor the download of a file
	 * This receives two parameters: The number of bytes downloaded
	 * so far and the total number of bytes expected
	 * function(bytesDownloaded, totalBytes)
	 */
	this.downloadProgress = null;
}

/**
 * Adds a new custom header to the request
 * @param key The name for the header
 * @param value The value for the new custom header
 */
CBXMLHttpRequest.prototype.setRequestHeader = function(key, value) {
	this.headers[key] = value;
};

CBXMLHttpRequest.getBlobBuilder = function() {
	if (window.MSBlobBuilder)
		return new MSBlobBuilder();
	if (window.MozBlobBuilder)
		return new MozBlobBuilder();
	if (window.WebKitBloblBuilder)
		return new WebKitBlobBuilder();
	if (window.BlobBuilder)
		return new BlobBuilder();
		
	return null;
}

/**
 * Sends the request and calls the callback functions during a downloads
 * and once the request is completed
 * @param formData A value string representing the multipart/form-data object or a browser FormData object
 * @param aSync whether the request should be asynchronous
 */
CBXMLHttpRequest.prototype.send = function(formData, aSync) {
	var oRequest = this;
	
	if (this.cloudbaseFunction == "download") {
		var xhr = new XMLHttpRequest();

		xhr.open("POST", this.requestUrl, true);
			// Set the responseType to arraybuffer. "blob" is an option too, rendering BlobBuilder unnecessary, but the support for "blob" is not widespread enough yet
		xhr.responseType = "arraybuffer";
			//xhr.overrideMimeType("text/plain; charset=x-user-defined");
		//xhr.overrideMimeType('text\/plain; charset=x-user-defined');

		xhr.addEventListener("load", function () {
			if (xhr.status == 200) {
				//oRequest.log("resp: " + xhr.response)
					// Create a blob from the response
				//var blob = new Blob([xhr.response], {type: "image/png" });
				var blob = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-type') });

               	if (oRequest.requestCompleted !== "undefined") {
					oRequest.requestCompleted(xhr.status, blob);
				}
           	}
       	}, false);
       	
       	xhr.addEventListener("progress", function(evt) {
       		if (evt.lengthComputable) {  
       			//evt.loaded the bytes browser receive
				//evt.total the total bytes seted by the header
				oRequest.downloadProgress(evt.loaded, evt.total);
			} 
       	});
        
        // Send XHR
       	xhr.send(formData);
	} else {
		if (typeof jQuery !== 'undefined') {
			$.ajax({
				type:		"POST",
				url:		oRequest.requestUrl,
				data:		formData,
				async:		aSync,
				processData: false,
				contentType: false,
				crossDomain: true,
				headers:	{
					x_cb_js_class : "true"
				},
				complete:	function(httpResponse, textStatus) {
					if (oRequest.requestCompleted !== "undefined") {
						oRequest.requestCompleted(httpResponse.status, httpResponse.responseText);
					}
				}
			});
		} else {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", this.requestUrl, true);

			xhr.addEventListener("load", function () {
				if (oRequest.requestCompleted)
					oRequest.requestCompleted(xhr.status, xhr.responseText);
	       	}, false);
	        	
			xhr.send(formData);
		}
	}
};