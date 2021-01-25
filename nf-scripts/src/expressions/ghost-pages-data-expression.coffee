numLayers = thisComp.numLayers
topmostLayer = null
nextTopmostLayer = null
extra = 0
i = 1
while i <= numLayers
  theLayer = thisComp.layer(i)
  layerName = theLayer.name
  try
    if theLayer.source?.name.indexOf("NFPage") >= 0 and layerName.indexOf('[ref]') < 0 and theLayer.active
      if not topmostLayer?
        topmostLayer = theLayer
      else if theLayer.index < topmostLayer.index
        extra++
        nextTopmostLayer = topmostLayer
        topmostLayer = theLayer
      else if theLayer.index < nextTopmostLayer?.index or not nextTopmostLayer?
        nextTopmostLayer = theLayer
  i++

if topmostLayer?
  if nextTopmostLayer?
    "#{topmostLayer.name}&#{nextTopmostLayer.name}"
  else
    "#{topmostLayer.name}"
else
  ""
