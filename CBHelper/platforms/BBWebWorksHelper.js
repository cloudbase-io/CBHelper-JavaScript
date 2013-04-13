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
 * this is the cloudbase.io platform specific helper for BlackBerry. It relies on the
 * BlackBerry WebWorks library being loaded
 * @returns A new BBWebWorksHelper object
 */
function BBWebWorksHelper() {
	/**
	 * The model of the current device (iPhone 4S)
	 */
	this.deviceModel			= blackberry.system.model;
	/**
	 * The OS version of the current device (6.1)
	 */
	this.deviceVersion			= blackberry.system.softwareVersion;
	/**
	 * The name of the device type (iPhone)
	 */
	this.deviceName				= blackberry.system.name;
	/**
	 * The device type, this is a static string.
	 */
	this.deviceType				= "BlackBerry";
	/**
	 * The current language of the OS
	 */
	this.language				= blackberry.system.language.split("-")[0];
	/**
	 * The country the device is registered to
	 */
	this.country				= blackberry.system.region.split("-")[1];
	/**
	 * a unique identifier for the device. In Tizen's case we use the IMEI
	 */
	this.deviceUniqueIdentifier	= blackberry.system.hardwareId;
	/**
	 * Whether push notifications are enabled on this platform
	 */
	this.pushNotifications		= true;
	
	this.logToDomElement = null;
	
	//alert("language: " + this.language + "\ncountry: " + this.country + "\ndevice type: " + this.deviceType + "\ndevice name: " + this.deviceName + "\ndevice model: " + this.deviceModel + "\ndevice version: " + this.deviceVersion + "\nunique id: " + this.deviceUniqueIdentifier);
}

BBWebWorksHelper.prototype.log = function(message) {
	if (console) {
		console.log(message);
	}
	
	if (this.logToDomElement) {
		document.getElementById(this.logToDomElement).innerHTML += '<p><pre>' + mesasge + '</pre></p>'; 
	}
};

BBWebWorksHelper.prototype.prepareAttachmentFileFromPath = function(filePath, fileReady) {
	
	//this.log("preparing file");
	var newFile =  {};
	
	newFile.name = filePath.replace(/^.*[\\\/]/, '');
	try {
		blackberry.io.file.readFile(filePath, function(readFilePath, fileData) {
			newFile.content = fileData;
			
			fileReady(newFile);
		});
	} catch (ex) {
		this.log("error while reading file " + JSON.stringify(ex));
		fileReady(null);
	}
};