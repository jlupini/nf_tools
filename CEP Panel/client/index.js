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
          var annotation, annotationDataString, colorClassName, disp, dispElement, dispID, i, j, len, results;
          console.log(response);
          disp = $("#annotation-display");
          disp.empty();
          results = [];
          for (i = j = 0, len = response.length; j < len; i = ++j) {
            annotation = response[i];
            dispID = "annotation-" + i;
            colorClassName = annotation.colorName.replace(/\s+/g, '-').toLowerCase();
            disp.append("<li id='" + dispID + "' class='annotation-item " + colorClassName + "'></li>");
            dispElement = $("#" + dispID);
            dispElement.append("<div class='clean-name'>" + annotation.cleanName + "</div><div class='highlight-text'>" + annotation.text + "</div>");
            annotationDataString = JSON.stringify(annotation);
            results.push(dispElement.click({
              param: annotationDataString
            }, function(e) {
              return hook("createHighlightFromAnnotation('" + e.data.param + "')");
            }));
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
