$(document).ready(function() {
  var csInterface, extensionDirectory, hook;
  csInterface = new CSInterface;
  csInterface.requestOpenExtension('com.my.localserver', '');
  hook = function(hookString, callback) {
    return csInterface.evalScript(hookString, callback);
  };
  $('#reload-button').click(function() {
    return window.location.reload(true);
  });
  $('#import-button').click(function() {
    var url;
    url = 'http://localhost:3200/import';
    return $.ajax({
      type: 'GET',
      url: url,
      headers: {
        'directory': extensionDirectory
      },
      success: function(response) {
        return hook("openDocument('" + response + "')");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        return alert(errorThrown, jqXHR.responseJSON);
      }
    });
  });
  $('#hook-button').click(function() {
    return hook("loadNFLibraries()");
  });
  $('#comp-button').click(function() {
    return hook("getCompName()", function(result) {
      return $("#tempDisplayText").text("Comp Name is... " + result);
    });
  });
  $('#annotation-button').click(function() {
    var url;
    url = 'http://localhost:3200/annotations';
    return $.ajax({
      type: 'GET',
      url: url,
      success: function(response) {
        hook("makeAlert()");
        return console.log(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        return alert(errorThrown, jqXHR.responseJSON);
      }
    });
  });
  $('#one-page-annotations').click(function() {
    return hook("getActivePage()", function(result) {
      var url;
      console.log("active page is '" + result + "'");
      url = 'http://localhost:3200/annotationData';
      return $.ajax({
        type: 'GET',
        url: url,
        headers: {
          'filepath': result
        },
        success: function(response) {
          hook("alert('got the stuffffff')");
          return console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return alert(errorThrown, jqXHR.responseJSON);
        }
      });
    });
  });
  return extensionDirectory = csInterface.getSystemPath('extension');
});
