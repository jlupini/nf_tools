numLayers = thisComp.numLayers
topmostLayer = null
nextTopmostLayer = null
pdfNum = (layer) ->
  return layer.name.substr(0, layer.name.indexOf('_'))
i = 1
while i <= numLayers
  theLayer = thisComp.layer(i)
  layerName = theLayer.name
  try
    if theLayer.source?.name.indexOf("NFPage") >= 0 and layerName.indexOf('[ref]') < 0 and theLayer.active
      if not topmostLayer?
        topmostLayer = theLayer
      else if theLayer.index < topmostLayer.index
        nextTopmostLayer = topmostLayer unless pdfNum(theLayer) is pdfNum(topmostLayer)
        topmostLayer = theLayer
      else if theLayer.index < nextTopmostLayer?.index or not nextTopmostLayer?
        nextTopmostLayer = theLayer unless pdfNum(theLayer) is pdfNum(topmostLayer)
  i++

if topmostLayer?
  if nextTopmostLayer?
    "#{topmostLayer.name};#{nextTopmostLayer.name}"
  else
    "#{topmostLayer.name}"
else
  ""
