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
 * this is the cloudbase.io platform specific helper for tizen. It should be initialized using
 * the tizenHelperInit function with a callback as the methods to retrieve device information
 * are asynchronous
 * @returns A new TizenHelper object
 */
function TizenHelper() {
	/**
	 * The model of the current device (iPhone 4S)
	 */
	this.deviceModel			= "";
	/**
	 * The OS version of the current device (6.1)
	 */
	this.deviceVersion			= "";
	/**
	 * The name of the device type (iPhone)
	 */
	this.deviceName				= "";
	/**
	 * The device type, this is a static string.
	 */
	this.deviceType				= "Tizen";
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
	this.deviceUniqueIdentifier	= "";
	/**
	 * Whether push notifications are enabled on this platform
	 */
	this.pushNotifications		= false;
	
	//this.log(window.navigator.language);
}

/**
 * An array of the virtual roots available on the Tizen filesystem APIs
 */
TizenHelper.FSVirtualRoots =  [ 'images', 'videos', 'music', 'documents', 'downloads', 'removable' ];

/**
 * Logs a message to the JavaScript console.
 * @param logMessage The string message to be logged
 */
TizenHelper.prototype.log = function(logMessage) {
	console.log(logMessage);
};

/**
 * Reads a file from the Tizen file system given the path and returns it in the form of a CBHelperAttachment structure
 * containing a file name and a Blob object to be attached to a FormData ojbect
 * @param filePath The absoulte path to the file. This can either be the full path starting with a / or the virtual path
 *  using Tizen's virtual roots
 * @param fileReady A callback to receive the attachment object once it's ready
 */
TizenHelper.prototype.prepareAttachmentFileFromPath = function(filePath, fileReady) {
	
	//this.log("preparing file");
	var newFile =  {};
	
	newFile.name = filePath.replace(/^.*[\\\/]/, '');
	
	var fullPath = filePath.replace(newFile.name, '');
	var virtualRoot = "";
	
	for (var i in TizenHelper.FSVirtualRoots) {
		if ( fullPath.toLowerCase().indexOf(TizenHelper.FSVirtualRoots[i] + "/" ) != -1 ) {
			virtualRoot = TizenHelper.FSVirtualRoots[i];
			//console.log("found virtual root: " + virtualRoot);
			break;
		}
	}
	
	//console.log("looking for " + fullPath);
	tizen.filesystem.resolve(virtualRoot, function(dirObject) {
		//dirObject.listFiles(function(files) { console.log("files: " + JSON.stringify(files)); }, function(err) { console.log("error list: " + err); });
		//console.log("resolving file in " + fullPath + " with name " + newFile.name);
		try {
			var file = dirObject.resolve(newFile.name);
			//console.log("resolved file " + newFile.name + " - " + fullPath);
			
			file.openStream(
				// open for reading
				'r',
		 
				// success callback - read and display the contents of the file
				function(fileStream) {
					try {
						//console.log("opened stream " + fileStream.bytesAvailable);
						//fileStream.position = parseInt(0);
						
						var bb = new (window.MozBlobBuilder || window.BlobBuilder || window.WebKitBlobBuilder)();
						
						var buf = new ArrayBuffer(fileStream.bytesAvailable);
						var bufView = new Uint8Array(buf);
						
						for (var i = 0; i < fileStream.bytesAvailable; i++)
							bufView[i] = fileStream.readBytes(1);
						
						//bb.append(fileStream.readBytes(fileStream.bytesAvailable));
						bb.append(buf);
						newFile.content = bb.getBlob("application/octet-stream");
						//console.log("created content " + newFile.content.size);
						
						fileStream.close();
						//console.log("closed stream");
						fileReady(newFile);
						
					} catch (exc) {
						console.log('File reading exception: ' + exc.message + '<br/>');
						fileReady(null);
					} 
				},
		 
				// error callback
				function(ex) {
					console.log("error while reading stream " + JSON.stringify(ex));
					fileReady(null);
				}
			);
		} catch (ex) {
			console.log("error while reading file " + JSON.stringify(ex));
			fileReady(null);
		}
	}, 
	function(error) {
		console.log("error while resolving file folder " + JSON.stringify(error));
		fileReady(null);
	}, 'r');
};

/**
 * This function initializes a new TizenHelper object and returns it in the callback function
 * @param doneLoading
 */
function tizenHelperInit(doneLoading) {
	var deviceSupported = tizen.systeminfo.isSupported("Device");
	var tizenHelper = new TizenHelper();
	
	if ( deviceSupported ) {
		tizenHelper.log("device supported");
		tizen.systeminfo.getPropertyValue("Device", function(deviceInfo) {
			tizenHelper.log("device name: " + deviceInfo.model + " " + deviceInfo.version);
			tizenHelper.deviceModel = deviceInfo.model;
			tizenHelper.deviceName = deviceInfo.vendor;
			tizenHelper.deviceVersion = deviceInfo.version;
			tizenHelper.deviceUniqueIdentifier = deviceInfo.imei;
			
			doneLoading(tizenHelper);
		}, function(e) {
			TizenHelper.log("error!!");
			tizenHelper.deviceModel = "Tizen-device";
			tizenHelper.deviceName = "Tizen";
			tizenHelper.deviceVersion = "unknown";
			tizenHelper.deviceUniqueIdentifier = "TizenDevice";
			
			doneLoading(tizenHelper);
		});
	} else {
		tizenHelper.log("device info not supported");
		doneLoading(tizenHelper);
	}
}