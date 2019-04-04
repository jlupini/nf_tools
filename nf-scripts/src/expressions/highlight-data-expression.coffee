targetComp = comp('TARGET_COMP_NAME')
targetPage = 'PAGE_BASE_NAME'

MARK_TOP = null
# Don't edit anything above or including this line

if time is 0
  # Get all matching page layers
  matchingPageLayers = []
  numLayers = targetComp.numLayers
  i = 1
  while i <= numLayers
    theLayer = targetComp.layer(i)
    if theLayer.name.indexOf(targetPage) >= 0 and theLayer.name.indexOf("[+]") >= 0
      matchingPageLayers.push i
    i++

  displayString = "allMatchingLayers:[#{matchingPageLayers.join()}]\n"

else ""
