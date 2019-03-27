displayString = ""
# spotlightMarkers = []

# firstInBlock = 101
# lastInBlock = 202
# onlyInBlock = 252
# notFirstOrLastInBlock = 303
# nearestSpotlightMarkerOnThisControl = null
#
# inFunc = (mark) ->
#   return mark.time
# outFunc = (mark) ->
#   return mark.time + mark.duration

# Gets an array of the active markers at this time
activeMarkersAtTime = ->
  # controlLayers = []
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

      # controlLayers.push i


      # if theLayer.marker.numKeys > 0
      #   # For each marker, check if it's a spotlight marker. Also grab the nearest spotlight marker on this control when we find it.
      #   for idx in [1..theLayer.marker.numKeys]
      #
      #     testMarker = theLayer.marker.key(idx)
      #
      #     if testMarker.comment is "Spotlight"
      #       spotlightMarkers.push testMarker
      #
      #       adjIn = inFunc testMarker
      #       adjOut = outFunc testMarker
      #       activeMarkers.push testMarker if adjIn <= time < adjOut
      #
      #       if theLayer.name is controlLayer.name
      #         if adjIn <= time <= adjOut
      #           nearestMarker = testMarker
      #         else if nearestMarker?
      #           timeToIn = Math.abs(time - adjIn)
      #           timeToOut = Math.abs(time - adjOut)
      #           prevTimeToIn = Math.abs(time - inFunc(nearestMarker))
      #           prevTimeToOut = Math.abs(time - outFunc(nearestMarker))
      #
      #           min = Math.min timeToIn, timeToOut, prevTimeToIn, prevTimeToOut
      #           if min is timeToIn or min is timeToOut
      #             nearestMarker = testMarker
      #         else
      #           nearestMarker = testMarker
      #
      # nearestSpotlightMarkerOnThisControl = nearestMarker

    i++

  # displayString += "all_control_layer_indicies: [#{controlLayers.join()}]"
  displayString += "PDF#{k}:[#{v.join()}]\n" for k,v of dict

  return activeMarkers

positionInBlock = ->
  activeMarkers = activeMarkersAtTime()

  # if activeMarkers.length is 0
  #   return notFirstOrLastInBlock
  # else
  #   blockStartTime = inFunc activeMarkers[0]
  #   blockEndTime = outFunc activeMarkers[0]
  #   blockStartMarker = blockEndMarker = activeMarkers[0]
  #
  #   if activeMarkers.length > 1
  #     for idx in [0..activeMarkers.length-1]
  #       iMarker = activeMarkers[idx]
  #       if inFunc(iMarker) <= blockStartTime
  #         blockStartTime = inFunc iMarker
  #         blockStartMarker = iMarker
  #       if outFunc(iMarker) > blockEndTime
  #         blockEndTime = outFunc iMarker
  #         blockEndMarker = iMarker
  #   else
  #     return onlyInBlock
  #
  #   thisMarker = nearestSpotlightMarkerOnThisControl
  #   if blockStartMarker.time is thisMarker.time
  #     return firstInBlock
  #   else if blockEndMarker.time is thisMarker.time
  #     return lastInBlock
  #   else
  #     return notFirstOrLastInBlock

positionInBlock() if time is 0

displayString
