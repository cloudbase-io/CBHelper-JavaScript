var sharedCbHelper;


function saveSettings() {
	var appCode = document.getElementById("appcode").value;
	var appUniq = document.getElementById("appuniq").value;
	var appPwd = document.getElementById("apppwd").value;
	
	if (localStorage) {
		localStorage.setItem("app_code", appCode);
		localStorage.setItem("app_uniq", appUniq);
		localStorage.setItem("app_pwd", appPwd);
	}
	
	sharedCbHelper = new CBHelper(appCode, appUniq, new BBWebWorksHelper());
	sharedCbHelper.setPassword(hex_md5(appPwd));
}

function sendLogMessage() {
	var logMessage = document.getElementById("logline").value;
	var logLevel = document.getElementById("loglevel").value;
	
	if (sharedCbHelper) {
		sharedCbHelper.writeLog(logMessage, "DEFAULT", sharedCbHelper.CBLogLevel[logLevel]);
	}
}

function insertObject() {
	var dataObject = {
		"firstName" : "Cloud",
		"lastName" : "Base",
		"title" : ".io"
	};
	
	if (sharedCbHelper) {
		sharedCbHelper.insertDocument("webworks_users", dataObject, null, function(resp) {
			console.log(resp.outputString);
		});
	}
}

function insertFile(evt) {
	var dataObject = {
		"firstName" : "Cloud",
		"lastName" : "Base",
		"title" : ".io"
	};
	
	sharedCbHelper.prepareAttachmentFileFromFormElement(evt.target.id, function(files) {
		if (files == null)
			console.log("no file loaded");
		else {
			sharedCbHelper.insertDocument("webworks_users", dataObject, files, function(resp) {
				console.log(resp.outputString);
			});
		}
	});
}

function insertFileObject() {
	if (sharedCbHelper) {
		document.getElementById("picture").click();
	}
}

function searchObjects() {
	if (sharedCbHelper) {
		sharedCbHelper.searchDocuments({ "firstName" : "Cloud" }, "webworks_users", function(resp) {
			console.log(resp.outputString);
		});
	}
}

function beginDownload() {
	if (sharedCbHelper) {
		var fileId = document.getElementById("fileid").value;
		sharedCbHelper.downloadFile(fileId, 
			function(statusCode, fileData) {
				console.log("received file data");
				var fileReader = new FileReader();
				
				fileReader.onload = function (evt) {
					// Read out file contents as a Data URL
					var result = evt.target.result;
	                
	                // Set image src to Data URL
	              	document.getElementById("downloadFile").src = result;
	            };
	            // Load blob as Data URL
	            fileReader.readAsDataURL(fileData);
            
			},
			function(downloadedBytes, totalBytes) {
				console.log('Downloading ' + downloadedBytes + ' of ' + totalBytes);
			}
		);
	}
}

function executeFunction() {
	if (sharedCbHelper) {
		var fcode = document.getElementById("fcode").value;
		sharedCbHelper.executeCloudFunction(fcode, null, function(resp) { 
			console.log(resp.outputString);
		});
	}
}

function executeApplet() {
	if (sharedCbHelper) {
		sharedCbHelper.executeApplet("cb_twitter_search", { "search" : "#cloudbaseio" }, function(resp) { 
			console.log(resp.outputString);
		});
	}
}
