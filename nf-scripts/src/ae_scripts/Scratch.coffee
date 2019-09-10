$.evalFile File($.fileName).path + "/runtimeLibraries.jsx"

app.beginUndoGroup 'Run Scratch Script'

testLayer = NFProject.activeComp().selectedLayers().get(0)
testLayer.centerAnchorPoint()
#
# parentLayer = testLayer.getParent()
# testLayer.setParent null
#
# centerPoint = testLayer.relativeCenterPoint()
#
# anchorPointProp = testLayer.transform("Anchor Point")
# anchorPoint = anchorPointProp.value
#
# positionProp = testLayer.transform("Position")
# oldPosition = positionProp.value
# positionProp.setValue centerPoint
# positionDelta = [centerPoint[0] - oldPosition[0], centerPoint[1] - oldPosition[1]]
#
# newAnchorPointValue = [positionDelta[0] + anchorPoint[0], positionDelta[1] + anchorPoint[1]]
# anchorPointProp.setValue newAnchorPointValue
#
# testLayer.setParent parentLayer


app.endUndoGroup()
