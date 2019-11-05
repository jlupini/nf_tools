$(document).ready ->

  #
  # CSInterface Work
  #
  csInterface = new CSInterface
  csInterface.requestOpenExtension 'com.my.localserver', ''
  hook = (hookString, callback) ->
    csInterface.evalScript hookString, callback

  #
  # Helper Functions
  #
  rgbToHex = (r, g, b) ->
    componentToHex = (c) ->
      hex = c.toString(16)
      if hex.length == 1 then '0' + hex else hex

    if r.length is 3
      b = r[2]
      g = r[1]
      r = r[0]
    '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)

  #
  # Bindings
  #
  $('#reload-button').click ->
    window.location.reload true
  $('#hook-button').click ->
    hook "loadNFLibraries()"
  # $('#annotation-button').click ->
  #   url = 'http://localhost:3200/annotations'
  #   $.ajax
  #     type: 'GET'
  #     url: url
  #     # headers: 'directory': extensionDirectory
  #     success: (response) ->
  #       console.log response
  #     error: (jqXHR, textStatus, errorThrown) ->
  #       alert errorThrown, jqXHR.responseJSON
  #   # hook "getCompName()", (result) ->
  #   #   $("#tempDisplayText").text "Comp Name is... #{result}"
  $('#one-page-annotations').click ->
    hook "getActivePage()", (result) ->
      console.log "active page is '#{result}'"
      url = 'http://localhost:3200/annotationData'
      $.ajax
        type: 'GET'
        url: url
        headers: 'filepath': result
        success: (response) ->
          console.log response
          disp = $("#annotation-display")
          disp.empty()
          for annotation, i in response
            disp.append "<li id='annotation-#{i}' class='annotation-item #{annotation.colorName.replace(/\s+/g, '-').toLowerCase()}'>#{annotation.cleanName}</li>"
          # hook "processRawAnnotationData()"
        error: (jqXHR, textStatus, errorThrown) ->
          alert errorThrown, jqXHR.responseJSON


  extensionDirectory = csInterface.getSystemPath('extension')
