var sharedCbHelper;

/*
$( document ).delegate("#pageDiv", "pageinit", function() {
	alert("pageinit");
	// load the navigation bar from the include footer.html
	$("body").find("[data-role=footer]").load("footer.html", function(){
		$("body").find("[data-role=navbar]").navbar();
		var curpage = $.mobile.activePage.data('url').replace("/", "");
		$("body").find("[data-role=navbar]").find('a.ui-btn-active').removeClass("ui-btn-active");
		$('a[href$="' + curpage + '"]').addClass("ui-btn-active");
	});
	
});
*/

function saveSettings() {
	var appCode = $('#appcode').val();
	var appUniq = $('#appuniq').val();
	var appPwd = $('#apppwd').val();
	
	if (localStorage) {
		localStorage.setItem("app_code", appCode);
		localStorage.setItem("app_uniq", appUniq);
		localStorage.setItem("app_pwd", appPwd);
	}
	
	sharedCbHelper = new CBHelper(appCode, appUniq, new GenericHelper());
	sharedCbHelper.setPassword(hex_md5(appPwd));
	//hex_md5;
}

function sendLogMessage() {
	var logMsg = $('#logmsg').val();
	var logLevel = $('#loglevel').val();
	
	if (sharedCbHelper) {
		sharedCbHelper.writeLog(logMsg, "DEFAULT", sharedCbHelper.CBLogLevel[logLevel]);
	}
}

function dataInsertObject() {
	var dataObject = {
		"firstName" : "Cloud",
		"lastName" : "Base",
		"title" : ".io"
	};
	
	if (sharedCbHelper) {
		sharedCbHelper.insertDocument("jquery_users", dataObject, null, function(resp) {
			console.log(resp.outputString);
		});
	}
}

function dataInsertObjectFile() {
	var dataObject = {
		"firstName" : "Cloud",
		"lastName" : "Base",
		"title" : ".io"
	};
	
	if (sharedCbHelper) {
		sharedCbHelper.prepareAttachmentFileFromFormElement("datafile", function(files) {
			sharedCbHelper.insertDocument("jquery_users", dataObject, files, function(resp) {
				console.log(resp.outputString);
			});
		})
	}
}

function dataSearch() {
	if (sharedCbHelper) {
		sharedCbHelper.searchDocuments({ "firstName" : "Cloud" }, "jquery_users", function(resp) {
			console.log(resp.outputString);
		});
	}
}

function downloadImage() {
	if (sharedCbHelper) {
		sharedCbHelper.downloadFile($('#fileid').val(), function(statusCode, fileData) {
			var fileReader = new FileReader();
			
			fileReader.onload = function (evt) {
				// Read out file contents as a Data URL
				var result = evt.target.result;
                // Set image src to Data URL
               $('#downloadedImage').attr('src', result);
            };
            // Load blob as Data URL
            fileReader.readAsDataURL(fileData);
            
		},
		function(downloadedBytes, totalBytes) {
			$('#downloadStatus').html('Downloading ' + downloadedBytes + ' of ' + totalBytes);
		});
	}
}

function executeFunction() {
	if (sharedCbHelper) {
		sharedCbHelper.executeCloudFunction($('#fcode').val(), null, function(resp) { 
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
