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
  $('#restart-server-button').click(function() {
    var url;
    url = 'http://localhost:3200/restart';
    return $.ajax({
      type: 'GET',
      url: url,
      success: function(response) {
        return console.log("Restarted Server");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        return alert(errorThrown, jqXHR.responseJSON);
      }
    });
  });
  $('#hook-button').click(function() {
    return hook("loadNFLibraries()");
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
