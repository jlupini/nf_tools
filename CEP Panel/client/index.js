$(document).ready(function() {

	/* 1) Create an instance of CSInterface. */
	var csInterface = new CSInterface();

	csInterface.requestOpenExtension("com.my.localserver", "");

	$('#reload-button').click(function() {
	    window.location.reload(true);
	});

	$('#import-button').click(function() {
	    importDoc();
	});

	$('#alert-button').click(function() {
	    makeAlert();
	});



	/* Get the path for your panel */
	var extensionDirectory = csInterface.getSystemPath("extension");

	function makeAlert() {
		csInterface.evalScript(`makeAlert()`);
	}

	function reloadPage() {
		window.location.reload(true);
	}

	function importDoc() {
		/* Make sure to include the full URL */
		var url = "http://localhost:3200/import";

		/* Use ajax to communicate with your server */
		$.ajax({
			type: "GET",
			url: url,
			headers: {
				"directory": extensionDirectory
			},
			success: function(response) {
				/* Use the ExtendScript function to display the downloaded file */
				csInterface.evalScript(`openDocument("${response}")`);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert(errorThrown, jqXHR.responseJSON);
			}
		});

	}

});
