$(document).ready(function() {
  var csInterface, extensionDirectory, hook, rgbToHex;
  csInterface = new CSInterface;
  csInterface.requestOpenExtension('com.my.localserver', '');
  hook = function(hookString, callback) {
    return csInterface.evalScript(hookString, callback);
  };
  rgbToHex = function(r, g, b) {
    var componentToHex;
    componentToHex = function(c) {
      var hex;
      hex = c.toString(16);
      if (hex.length === 1) {
        return '0' + hex;
      } else {
        return hex;
      }
    };
    if (r.length === 3) {
      b = r[2];
      g = r[1];
      r = r[0];
    }
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };
  $('#reload-button').click(function() {
    return window.location.reload(true);
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
          var annotation, disp, i, j, len, results;
          console.log(response);
          disp = $("#annotation-display");
          disp.empty();
          results = [];
          for (i = j = 0, len = response.length; j < len; i = ++j) {
            annotation = response[i];
            results.push(disp.append("<li id='annotation-" + i + "' class='annotation-item " + (annotation.colorName.replace(/\s+/g, '-').toLowerCase()) + "'>" + annotation.cleanName + "</li>"));
          }
          return results;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return alert(errorThrown, jqXHR.responseJSON);
        }
      });
    });
  });
  return extensionDirectory = csInterface.getSystemPath('extension');
});
