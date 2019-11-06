$(document).ready(function() {
  var checkForUpdates, csInterface, extensionDirectory, getPageAnnotations, hook, latestAnnotationData, rgbToHex, smartTimer;
  csInterface = new CSInterface;
  csInterface.requestOpenExtension('com.my.localserver', '');
  hook = function(hookString, callback) {
    if (callback == null) {
      callback = null;
    }
    return csInterface.evalScript(hookString, callback);
  };
  hook("loadNFLibraries()");
  latestAnnotationData = {};
  smartTimer = null;
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
  getPageAnnotations = function() {
    return hook("getActivePage()", function(result) {
      var disp, url;
      if (result !== "null") {
        url = 'http://localhost:3200/annotationData';
        return $.ajax({
          type: 'GET',
          url: url,
          headers: {
            'filepath': result
          },
          success: function(response) {
            var annotation, annotationDataString, colorClassName, disp, dispElement, dispID, i, j, len, results;
            if (JSON.stringify(response) === JSON.stringify(latestAnnotationData)) {

            } else {
              console.log("data changed - updating");
              console.log(response);
              latestAnnotationData = response;
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
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            return alert(errorThrown, jqXHR.responseJSON);
          }
        });
      } else {
        disp = $("#annotation-display");
        disp.empty();
        disp.append("<p class='no-active-page'>No active page</p>");
        return latestAnnotationData = {};
      }
    });
  };
  checkForUpdates = function() {
    return getPageAnnotations();
  };
  $('#reload-button').click(function() {
    if (smartTimer != null) {
      clearInterval(smartTimer);
    }
    return window.location.reload(true);
  });
  $('#smart-toggle').click(function() {
    if (smartTimer != null) {
      hook("alert('Stopping smart updates')");
      clearInterval(smartTimer);
      return smartTimer = null;
    } else {
      hook("alert('Starting smart updates')");
      return smartTimer = setInterval(checkForUpdates, 1000);
    }
  });
  $('#one-page-annotations').click(getPageAnnotations);
  return extensionDirectory = csInterface.getSystemPath('extension');
});
