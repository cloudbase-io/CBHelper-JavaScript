/*******************************************************************************
 * data event handler
 * 
 * @generated Tizen Builder
 * @attribute user, editable
 *******************************************************************************
*/


/**
 * @param {Object} event
 * @base _data_page
 * @returns {Boolean}
*/
_data_page.prototype.inserObjectButton_ontap = function(event) {
	if (sharedCbHleper) {
		var object = {
			"fisrtName"	: "Cloud",
			"lastName"	: "Base",
			"title"		: ".io"
		};
		
		sharedCbHleper.insertDocument("js_users", object, null, function(response) {
			console.log(response.outputString);
		});
	}
};
/**
 * @param {Object} event
 * @base _data_page
 * @returns {Boolean}
*/
_data_page.prototype.insertObjectFileButton_ontap = function(event) {
	//if (sharedCbHleper) {
		var object = {
			"fisrtName"	: "Cloud",
			"lastName"	: "Base",
			"title"		: ".io"
		};
		
		var source = null;
	    try {
	        source = tizen.mediacontent.getLocalMediaSource();
	    } catch (exc) {
	        console.log('tizen.mediacontent.getLocalMediaSource() exception:' + exc.message);
	        return;
	    }
	   var selectedImage;
	    try {
	        source.findItems(function(items) {
	        	for ( var i in items) {
	        		if (items[i].type == "IMAGE") {
	        			selectedImage = items[i].itemURI;
	        		
	        			break;
	        		}
	        	}
	        	sharedCbHleper.prepareAttachmentFileFromPath(selectedImage, function(fileAttachment) {
	        		if (fileAttachment == null) {
	        			console.log("could not find file");
	        		} else {
	        			sharedCbHleper.insertDocument("js_users", object, new Array(fileAttachment), function(response) {
			    			console.log(response.outputString);
			    		});
	        		}
	        	});
	        	
	        }, function(error) {
	        	console.log("received error " + error);
	        });
	    } catch (exc) {
	        console.log('findItems() exception:' + exc.message);
	    }
	//}
};

/**
 * @param {Object} event
 * @base _data_page
 * @returns {Boolean}
*/
_data_page.prototype.searchItemsButton_ontap = function(event) {
	if (sharedCbHleper) {
		var conditions = { "firstName" : "Cloud" };
		sharedCbHleper.searchDocuments(conditions, "js_users", function(response) {
			console.log(response.outputString);
		});
	}
};

/**
 * @param {Object} event
 * @base _data_page
 * @returns {Boolean}
*/
_data_page.prototype.downloadFileButton_ontap = function(event) {
	if (sharedCbHleper) {
		sharedCbHleper.downloadFile("203581e89a2a7536db26f9e74328d164", function(status, data) {
			alert("status: " + status + " - data " + data);
		});
	}
};

