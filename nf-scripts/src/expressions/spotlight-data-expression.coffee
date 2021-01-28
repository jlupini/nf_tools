displayString = ""

activeMarkersAtTime = ->
  dict = {}
  activeMarkers = []
  nearestMarker = null
  numLayers = thisComp.numLayers

  i = 1
  while i <= numLayers
    theLayer = thisComp.layer(i)
    layerName = theLayer.name
    if layerName.indexOf("Highlight Control") >= 0
      # Get the PDF
      PDFNumber = layerName.substr(0, layerName.indexOf(' -'))
      try
        dict[PDFNumber].push(i)
      catch error
        dict[PDFNumber] = [i]

    i++

  displayString += "PDF#{k}:[#{v.join()}]\n" for k,v of dict

  return activeMarkers

positionInBlock = ->
  activeMarkers = activeMarkersAtTime()

positionInBlock() if time is 0

displayString
