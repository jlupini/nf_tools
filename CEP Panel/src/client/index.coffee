$(document).ready ->

  #
  # CSInterface Work
  #
  csInterface = new CSInterface
  csInterface.requestOpenExtension 'com.my.localserver', ''
  hook = (hookString, callback) ->
    csInterface.evalScript hookString, callback

  #
  # Bindings
  #
  $('#reload-button').click ->
    window.location.reload true
  $('#restart-server-button').click ->
    url = 'http://localhost:3200/restart'
    $.ajax
      type: 'GET'
      url: url
      success: (response) ->
        console.log "Restarted Server"
      error: (jqXHR, textStatus, errorThrown) ->
        alert errorThrown, jqXHR.responseJSON
  # $('#import-button').click ->
  #   url = 'http://localhost:3200/import'
  #   $.ajax
  #     type: 'GET'
  #     url: url
  #     headers: 'directory': extensionDirectory
  #     success: (response) ->
  #       hook "openDocument('#{response}')"
  #     error: (jqXHR, textStatus, errorThrown) ->
  #       alert errorThrown, jqXHR.responseJSON
  $('#hook-button').click ->
    hook "loadNFLibraries()"
  # $('#comp-button').click ->
  #   hook "getCompName()", (result) ->
  #     $("#tempDisplayText").text "Comp Name is... #{result}"
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
          # hook "processRawAnnotationData()"
        error: (jqXHR, textStatus, errorThrown) ->
          alert errorThrown, jqXHR.responseJSON


  extensionDirectory = csInterface.getSystemPath('extension')
