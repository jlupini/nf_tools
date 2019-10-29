$(document).ready ->

  csInterface = new CSInterface

  makeAlert = ->
    csInterface.makeAlert()

  reloadPage = ->
    window.location.reload true
    return

  importDoc = ->
    url = 'http://localhost:3200/import'
    $.ajax
      type: 'GET'
      url: url
      headers: 'directory': extensionDirectory
      success: (response) ->
        csInterface.openDocument("#{response}")
      error: (jqXHR, textStatus, errorThrown) ->
        alert errorThrown, jqXHR.responseJSON

  csInterface.requestOpenExtension 'com.my.localserver', ''


  $('#reload-button').click ->
    window.location.reload true
  $('#import-button').click ->
    importDoc()
  $('#alert-button').click ->
    makeAlert()


  extensionDirectory = csInterface.getSystemPath('extension')
