$(document).ready ->

  #
  # CSInterface Work
  #
  csInterface = new CSInterface
  csInterface.requestOpenExtension 'com.my.localserver', ''
  hook = (hookString, callback = null) ->
    csInterface.evalScript hookString, callback

  #
  # Load NF Libs
  #
  hook "loadNFLibraries()"

  #
  # Global Vars
  #
  latestAnnotationData = {}
  smartTimer = null

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
  getPageAnnotations = ->
    hook "getActivePage()", (result) ->
      if result isnt "null"
        # console.log "active page is '#{result}'"
        url = 'http://localhost:3200/annotationData'
        $.ajax
          type: 'GET'
          url: url
          headers: 'filepath': result
          success: (response) ->
            # Don't bother doing anything if there's no change
            if JSON.stringify(response) is JSON.stringify(latestAnnotationData)
              # console.log "no change to data"
            else
              console.log "data changed - updating"
              console.log response
              latestAnnotationData = response
              disp = $("#annotation-display")
              disp.empty()
              for annotation, i in response
                dispID = "annotation-#{i}"
                colorClassName = annotation.colorName.replace(/\s+/g, '-').toLowerCase()
                disp.append "<li id='#{dispID}' class='annotation-item #{colorClassName}'></li>"
                dispElement = $("##{dispID}")
                dispElement.append "<div class='clean-name'>#{annotation.cleanName}</div><div class='highlight-text'>#{annotation.text}</div>"
                annotationDataString = JSON.stringify annotation
                dispElement.click {param: annotationDataString}, (e) ->
                  hook "createHighlightFromAnnotation('#{e.data.param}')"
          error: (jqXHR, textStatus, errorThrown) ->
            alert errorThrown, jqXHR.responseJSON
      else
        disp = $("#annotation-display")
        disp.empty()
        disp.append "<p class='no-active-page'>No active page</p>"
        latestAnnotationData = {}
  checkForUpdates = ->
    getPageAnnotations()

  #
  # Bindings
  #
  $('#reload-button').click ->
    clearInterval smartTimer if smartTimer?
    window.location.reload true
  $('#smart-toggle').click ->
    if smartTimer?
      hook "alert('Stopping smart updates')"
      clearInterval smartTimer
      smartTimer = null
    else
      hook "alert('Starting smart updates')"
      smartTimer = setInterval checkForUpdates, 1000

  $('#one-page-annotations').click getPageAnnotations


  extensionDirectory = csInterface.getSystemPath('extension')
