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
 * this is the cloudbase.io platform specific helper for MoSync Reload.
 * @returns A new MoSyncHelper object
 */
function MoSyncHelper() {
	/**
	 * The model of the current device (iPhone 4S)
	 */
	this.deviceModel			= window.device.platform;
	/**
	 * The OS version of the current device (6.1)
	 */
	this.deviceVersion			= window.device.version;
	/**
	 * The name of the device type (iPhone)
	 */
	this.deviceName				= window.device.name;
	/**
	 * The device type, this is a static string.
	 */
	this.deviceType				= "MoSync-Reload";
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
	this.deviceUniqueIdentifier	= window.device.uuid;
	/**
	 * Whether push notifications are enabled on this platform
	 */
	this.pushNotifications		= true;
	
	//this.log(window.navigator.language);
}

/**
 * Logs a message to the JavaScript console.
 * @param logMessage The string message to be logged
 */
MoSyncHelper.prototype.log = function(logMessage) {
	mosync.rlog(logMessage);
};

MoSyncHelper.prototype.getPushNotificationsPlatform = function() {
	if ( device.platform == null ) {
		return "";
	}
	var platform = device.platform.toLowerCase();
	if ( platform == "iphone" || platform == "ipad" || platform == "ios" ) {
		return "ios";
	}
	if ( platform == "android" || platform == "google" ) {
		return "and";
	}
	if ( platform.indeOf("blackberry") > -1 ) {
		return "bb";
	}
}

/**
 * Reads a file from the device file system given the path and returns it in the form of a CBHelperAttachment structure
 * containing a file name and a Blob object to be attached to a FormData object
 * @param filePath The absolute path to the file. This can either be the full path starting with a / or the virtual path
 *  using Tizen's virtual roots
 * @param fileReady A callback to receive the attachment object once it's ready
 */
MoSyncHelper.prototype.prepareAttachmentFileFromPath = function(filePath, fileReady) {
	var newFile =  {};
	
	newFile.name = filePath.replace(/^.*[\\\/]/, '');
	
	try {
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(foundFs) {
				foundFs.root.getFile(newFile.name, {create: false, exclusive: false}, 
					function(foundFile) {
						var reader = new FileReader();
				        reader.onloadend = function(evt) {
				        	
				        	try {
				        		mosync.rlog(evt.target.result.split(',')[1]);
				        		var binary = atob(evt.target.result.split(',')[1]);
					        	var length = binary.length;
					        	var ab = new ArrayBuffer(length);
					            var ua = new Uint8Array(ab);
					            for(var i = 0; i < length; i++) {
					            	ua[i] = binary.charCodeAt(i);
					            }
					            newFile.content = new Blob( [ab], {type : "application/octet-stream"});
				        	} catch(e) {
				        		window.BlobBuilder = window.BlobBuilder || 
				        		                         window.WebKitBlobBuilder || 
				        		                         window.MozBlobBuilder || 
				        		                         window.MSBlobBuilder;
				        		if(e.name == 'TypeError' && window.BlobBuilder){
				        			var bb = new BlobBuilder();
				        			bb.append([ab]);
				        			newFile.content = bb.getBlob("application/octet-stream");
				        		} else if(e.name == "InvalidStateError"){
				        			newFile.content = new Blob( [ab.buffer], {type : "application/octet-stream"});
				        		} else{
				        		    newFile = null  
				        		}
				        	}
				        	
				            fileReady(newFile);
				        };
				        reader.readAsDataURL(foundFile);
					}, 
					function(ex) {
						mosync.rlog("error requesting file " + JSON.stringify(ex));
						fileReady(null);
					});
				
			}, 
			function(ex) {
				mosync.rlog("error requesting file system " + JSON.stringify(ex));
				fileReady(null);
		});
	} catch (ex) {
		mosync.rlog("error while reading file " + JSON.stringify(ex));
		fileReady(null);
	}
};