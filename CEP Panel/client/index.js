$(document).ready(function() {
  var csInterface, extensionDirectory, importDoc, makeAlert, reloadPage;
  csInterface = new CSInterface;
  makeAlert = function() {
    return csInterface.makeAlert();
  };
  reloadPage = function() {
    window.location.reload(true);
  };
  importDoc = function() {
    var url;
    url = 'http://localhost:3200/import';
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'directory': extensionDirectory
      },
      success: function(response) {
        return csInterface.openDocument("" + response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        return alert(errorThrown, jqXHR.responseJSON);
      }
    });
  };
  csInterface.requestOpenExtension('com.my.localserver', '');
  $('#reload-button').click(function() {
    return window.location.reload(true);
  });
  $('#import-button').click(function() {
    return importDoc();
  });
  $('#alert-button').click(function() {
    return makeAlert();
  });
  return extensionDirectory = csInterface.getSystemPath('extension');
});
