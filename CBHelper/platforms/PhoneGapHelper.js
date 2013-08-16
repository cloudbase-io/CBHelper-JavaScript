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
 * this is the cloudbase.io platform PhoneGap helper. It will use the device
 * object to obtain information about the device and the navigator object for the 
 * language
 * @returns A new PhoneGapHelper object
 */
function PhoneGapHelper() {
	/**
	 * The model of the current device (iPhone 4S)
	 */
	this.deviceModel			= "";
	/**
	 * The OS version of the current device (6.1)
	 */
	this.deviceVersion			= device.version;
	/**
	 * The name of the device type (iPhone)
	 */
	this.deviceName				= device.model;
	/**
	 * The device type, this is a static string.
	 */
	this.deviceType				= device.platform;
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
	this.deviceUniqueIdentifier	= device.uuid;
	/**
	 * Whether push notifications are enabled on this platform
	 */
	this.pushNotifications		= false;
	
	this.logToDomElement = null;
}

PhoneGapHelper.prototype.log = function(message) {
	if (console) {
		console.log(message);
	}
	
	if (this.logToDomElement) {
		document.getElementById(this.logToDomElement).innerHTML += '<p><pre>' + mesasge + '</pre></p>'; 
	}
}