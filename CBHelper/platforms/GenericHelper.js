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
 * this is the cloudbase.io platform generic helper. It will use the standard
 * navigator object to obtain information about the browser
 * @returns A new GenericHelper object
 */
function GenericHelper() {
	/**
	 * The model of the current device (iPhone 4S)
	 */
	this.deviceModel			= "";
	/**
	 * The OS version of the current device (6.1)
	 */
	this.deviceVersion			= this.getDeviceVersion();
	/**
	 * The name of the device type (iPhone)
	 */
	this.deviceName				= this.getDeviceName();
	/**
	 * The device type, this is a static string.
	 */
	this.deviceType				= this.getDeviceType();
	/**
	 * The current language of the OS
	 */
	this.language				= window.navigator.language.split("-")[0];
	/**
	 * The country the device is registered to
	 */
	this.country				= window.navigator.language.split("-")[1];
	/**
	 * a unique identifier for the device. In Tizen's case we use the IMEI
	 */
	this.deviceUniqueIdentifier	= this.getUniqueIdentifier();
	/**
	 * Whether push notifications are enabled on this platform
	 */
	this.pushNotifications		= false;
	
	this.logToDomElement = null;
	
	//alert("device type: " + this.deviceType + "\ndevice name: " + this.deviceName + "\ndevice version: " + this.deviceVersion + "\nunique id: " + this.deviceUniqueIdentifier);
}

GenericHelper.prototype.getUniqueIdentifier = function() {
	
	if (localStorage) {
		if (localStorage.getItem("cb_unique_identifier")) {
			return localStorage.getItem("cb_unique_identifier");
		} else {
			var newUUID = this.generateUUID();
			localStorage.setItem("cb_unique_identifier", newUUID);
			return newUUID;
		}
	} else {
		var currentcookie = document.cookie;
		if (currentcookie.indexOf("cb_unique_identifier=") != -1) {
			return currentcookie.replace("cb_unique_identifier=", "");
		} else {
			var newUUID = this.generateUUID();
			document.cookie="cb_unique_identifier=" + newUUID;
			return new UUID;
		}
	}
}

GenericHelper.prototype.log = function(message) {
	if (console) {
		console.log(message);
	}
	
	if (this.logToDomElement) {
		document.getElementById(this.logToDomElement).innerHTML += '<p><pre>' + mesasge + '</pre></p>'; 
	}
}

GenericHelper.prototype.getDeviceType = function() {
	if (navigator.userAgent.toLowerCase().indexOf("android") != -1) {
		return "Android";
	} else if (navigator.userAgent.toLowerCase().indexOf("webos") != -1) {
		return "WebOS";
	} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		return "iOS";
	} else if (navigator.userAgent.toLowerCase().indexOf("blackberry") != -1) {
		return "BlackBerry";
	} else if (navigator.userAgent.toLowerCase().indexOf("macintosh") != -1) {
		return "Macintosh";
	} else {
		return "Unknown";
	}
};

GenericHelper.prototype.generateUUID = function (separator) {
    var delim = separator || "-";

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};

GenericHelper.prototype.identifyBrowser = function(userAgent, elements) {
    var regexps = {
            'Chrome': [ /Chrome\/(\S+)/ ],
            'Firefox': [ /Firefox\/(\S+)/ ],
            'MSIE': [ /MSIE (\S+);/ ],
            'Opera': [
                /Opera\/.*?Version\/(\S+)/,     /* Opera 10 */
                /Opera\/(\S+)/                  /* Opera 9 and older */
            ],
            'Safari': [ /Version\/(\S+).*?Safari\// ]
        },
        re, m, browser, version;
 
    if (userAgent === undefined)
        userAgent = navigator.userAgent;
 
    if (elements === undefined)
        elements = 2;
    else if (elements === 0)
        elements = 1337;
 
 	browservalue = {
 		name : navigator.appName,
 		version : navigator.appVersion
 	};
 
    for (browser in regexps)
        while (re = regexps[browser].shift())
            if (m = userAgent.match(re)) {
                version = (m[1].match(new RegExp('[^.]+(?:\.[^.]+){0,' + --elements + '}')))[0];
                //return browser + ' ' + version;
                browservalue.name = browser;
                browservalue.version = version;
                break;
            }
 
    return browservalue;
}

GenericHelper.prototype.getDeviceName = function() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		if (navigator.userAgent.toLowerCase().indexOf("iphone") != -1) {
			return "iPhone";
		} else if (navigator.userAgent.toLowerCase().indexOf("ipad") != -1) {
			return "iPad";
		} else if (navigator.userAgent.toLowerCase().indexOf("ipod") != -1) {
			return "iPod";
		} else if (navigator.userAgent.toLowerCase().indexOf("android") != -1) {
			return "Unknown Android";
		} else if (navigator.userAgent.toLowerCase().indexOf("webos") != -1) {
			return "Unknown WebOS";
		} else if (navigator.userAgent.toLowerCase().indexOf("blackberry") != -1) {
			return "Unknown BlackBerry";
		} else {
			var browserInfo =  this.identifyBrowser(navigator.userAgent, 2);
			return browserInfo.name;
		}
	} else {
		var browserInfo =  this.identifyBrowser(navigator.userAgent, 2);
		return browserInfo.name;
	}
};

GenericHelper.prototype.getDeviceVersion = function() {
	var agent = navigator.userAgent;
	
	//return navigator.appVersion;
	var browserInfo =  this.identifyBrowser(navigator.userAgent, 2);
	return browserInfo.version;
	
	if (agent.toLowerCase().indexOf("version") != -1) {
		var osVersion = agent.substring(
			agent.toLowerCase().indexOf("version/") + "version/".length,
			agent.toLowerCase().indexOf(" ", agent.toLowerCase().indexOf("version/"))
		);
		return osVersion;
	} else {
		return "Unknown";
	}
}
