`#include "nf_functions.jsx"`

importedFunctions = app.nf
globals =
	mainComp: app.project.activeItem
	undoGroupName: 'Create Gaussy Layer'
nf = Object.assign importedFunctions, globals

createGaussyLayer = ->
	targetLayer = nf.mainComp.selectedLayers[0]
	gaussyName = newGaussyNameForLayer(targetLayer)
	
	# Create new adjustment layer
	gaussyLayer = nf.mainComp.layers.addSolid([1, 1, 1], gaussyName, targetLayer.width, targetLayer.height, 1)
	gaussyLayer.adjustmentLayer = true
	gaussyLayer.moveBefore targetLayer

	effects = gaussyLayer.Effects
	effects.addProperty "AV_Gaussy"

	gaussianBlur = effects.addProperty('Gaussian Blur')
	gaussianBlur.property('Repeat Edge Pixels').setValue true

	# Generate the expression
	markerExpressionModel =
		layer: gaussyLayer
		duration:
			effect: "AV Gaussy"
			subEffect: "Duration"
		valueB:
			effect: "AV Gaussy"
			subEffect: "Blurriness"
	markerExpression = nf.markerDrivenExpression(markerExpressionModel)
	gaussyLayer.property('Effects').property('Gaussian Blur').property('Blurriness').expression = markerExpression

	gaussyLayer.startTime = targetLayer.startTime
	targetLayer.selected = true
	gaussyLayer.selected = false

	# Create in/out markers in target layer
	inMarker = new MarkerValue('Blur In')
	gaussyLayer.property('Marker').setValueAtTime nf.mainComp.time, inMarker
	outMarker = new MarkerValue('Blur Out')
	gaussyLayer.property('Marker').setValueAtTime nf.mainComp.time + 5, outMarker

	# Add Desaturation
	hueSatEffect = effects.addProperty "ADBE Color Balance (HLS)"
	masterSaturation = hueSatEffect.property("Saturation")
	masterLightness = hueSatEffect.property("Lightness")

	# Generate the expressions
	markerExpressionModel =
		layer: gaussyLayer
		duration:
			effect: "AV Gaussy"
			subEffect: "Duration"
		valueB:
			effect: "AV Gaussy"
			subEffect: "Saturation"
	markerExpression = nf.markerDrivenExpression(markerExpressionModel)
	masterSaturation.expression = markerExpression

	markerExpressionModel =
		layer: gaussyLayer
		duration:
			effect: "AV Gaussy"
			subEffect: "Duration"
		valueB:
			effect: "AV Gaussy"
			subEffect: "Lightness"
	markerExpression = nf.markerDrivenExpression(markerExpressionModel)
	masterLightness.expression = markerExpression

	return

newGaussyNameForLayer = (targetLayer) ->
	layerName = targetLayer.name
	shortName = layerName.substr(0, layerName.indexOf('.'))
	name = 'Blur' + shortName
	if targetLayer.mask(name) == null
		return name
	else
		i = 2
		while i <= targetLayer.mask.numProperties
			testName = name + ' ' + i
			if targetLayer.mask(testName) == null
				return testName
			i++
	name

app.beginUndoGroup nf.undoGroupName
createGaussyLayer()
app.endUndoGroup()