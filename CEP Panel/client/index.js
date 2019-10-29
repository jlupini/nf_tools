/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();

csInterface.requestOpenExtension("com.my.localserver", "");

/* Make a reference to your HTML button and add a click handler. */
var openButton = document.querySelector("#import-button");
openButton.addEventListener("click", importDoc);

/* Get the path for your panel */
var extensionDirectory = csInterface.getSystemPath("extension");

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
		success: response => {
			/* Use the ExtendScript function to display the downloaded file */
			csInterface.evalScript(`openDocument("${response}")`);
		},
		error: (jqXHR, textStatus, errorThrown) => {
			alert(errorThrown, jqXHR.responseJSON);
		}
	})

}
