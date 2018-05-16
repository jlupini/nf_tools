`#include "runtimeLibraries.jsx"`

NF = app.NF
_ =
	mainComp: app.project.activeItem
	undoGroupName: 'Create Highlight Layer'

main = ->
	mainComp = app.project.activeItem
	highlightLayer = mainComp.selectedLayers[0]

	# Get out of here if too many layers are selected
	return alert "Error!\nMore than one layer selected" if _.mainComp.selectedLayers.length > 1

	if !(highlightLayer instanceof ShapeLayer)
		# If we're not even on a shape layer, make one
		createShapeLayer highlightLayer
	else if highlightLayer.property("Effects").property("AV Highlighter")?
		# If we're already on a working highlight...

		# First of all, fix any expression issues if they exist. Exit if we fixed something
		return if fixExpressionProblems(highlightLayer)

		if highlightLayer.property("Effects").property("AV Highlighter").property("Spacing").expressionEnabled
			# ...and it's connected to a parent comp... Ask for input
			getChoice()
		else
			# ...and it's not connected to anything... Split away!
			splitHighlightLayer()
	else
		# If there isn't a highlight yet but it is a shape layer, make a highlight!
		createHighlighter()

getChoice = ->
	w = new Window('dialog')
	w.alignChildren = 'left'
	
	w.add 'statictext', [0,0,300,50], 'This highlight is connected to a parent composition.\rCreating a split will disconnect the highlight,\rso you will have to bubble it up again after.', {multiline: true}

	splitButton = w.add 'button', undefined, 'Split and Disconnect', name: 'split'
	disconnectButton = w.add 'button', undefined, 'Disconnect Only', name: 'disconnect'
	cancelButton = w.add 'button', undefined, 'Cancel', name: 'cancel'

	splitButton.onClick = ->
		NF.Util.disconnectBubbleupsInLayers _.mainComp.selectedLayers[0]
		splitHighlightLayer()
		w.close()
		return

	disconnectButton.onClick = ->
		NF.Util.disconnectBubbleupsInLayers _.mainComp.selectedLayers[0]
		w.close()
		return

	cancelButton.onClick = ->
		w.close()
		return

	w.show()

# Tries to fix broken expressions. Basically inject code here if you need to upgrade or solve a problem migrating
# Returns false if nothing was fixed, true if we repaired something
fixExpressionProblems = (highlightLayer) ->
	firstShapeColorExpression = highlightLayer.property("Contents").property(1).property("Contents").property("Stroke 1").property("Color").expression
	return false unless firstShapeColorExpression?
	if firstShapeColorExpression.indexOf("popup_val == 21") >= 0
		# Replace the color expressions
		numShapes = highlightLayer.property("Contents").numProperties
		i = 1
		while i <= numShapes
			highlightLayer.property("Contents").property(i).property('Contents').property('Stroke 1').property('Color').expression = getColorExpression()
			i++
		alert "Just so you're in the loop...\nI fixed a broken expression on this highlight. Run the script again to do whatever you were trying to do just now..."
		return true
	return false


# Creates and populates _.highlightColorOptions
initColorPresets = ->
	# Note: to add/subtract or change the order of the highlight colour options, the pseudo effect in preset-effects.xml must be edited
	highlightColorYELLOW = [255, 221, 3, 255]
	highlightColorBLUE = [152, 218, 255, 255]
	highlightColorPURPLE = [236, 152, 255, 255]
	highlightColorGREEN = [157, 255, 160, 255]
	highlightColorPINK = [255, 152, 202, 255]
	highlightColorORANGE = [255, 175, 104, 255]
	highlightColorRED = [255, 157, 157, 255]

	_.highlightColorOptions = [
		highlightColorYELLOW
		highlightColorBLUE
		highlightColorPURPLE
		highlightColorGREEN
		highlightColorPINK
		highlightColorORANGE
		highlightColorRED
	]

getColorExpression = ->
	# FIXME Move this up to the top
	initColorPresets()

	# Set colour property based on variables at top of script
	trimString = ''
	trimString += 'popup_val = effect("AV Highlighter")("Highlight Colour");'
	i = 0
	while i < _.highlightColorOptions.length
		if i != 0
			trimString += 'else '
		if i != _.highlightColorOptions.length - 1
			trimString += 'if (popup_val == ' + (i + 1) + ') '
		trimString += '{ [' + _.highlightColorOptions[i].toString() + ']/255; } '
		i++
	trimString += ';'
	return trimString

createHighlighter = ->

	mainComp = app.project.activeItem
	highlightLayer = mainComp.selectedLayers[0]

	highlightLinesCount = parseInt(prompt('How many initial highlight lines would you like to create?'))
	highlightLayer.name = 'Highlighter'
	highlightLayer.blendingMode = BlendingMode.MULTIPLY

	#highlightLayer.motionBlur = true;
	shape1 = highlightLayer.property('Contents').property('Shape 1')

	# Remove the fill
	shape1.property('Contents').property('Fill 1').remove()

	# Add a trim
	trim1 = shape1.property('Contents').addProperty('ADBE Vector Filter - Trim')

	# Create layer Controls
	effects = highlightLayer.Effects
	effects.addProperty 'AV_Highlighter'

	# Start to set properties
	shape1.property('Contents').property('Stroke 1').property('Stroke Width').expression = 'effect("AV Highlighter")("Thickness")'
	shape1.property('Contents').property('Trim Paths 1').property('Start').expression = 'effect("AV Highlighter")("Start Offset")'
	highlightLayer.property('Transform').property('Opacity').expression = 'effect("AV Highlighter")("Opacity")'

	shape1.property('Contents').property('Stroke 1').property('Color').expression = getColorExpression()

	# Set the position string
	offsetString = ''
	offsetString += '[transform.position[0]+ effect("AV Highlighter")("Offset")[0],'
	offsetString += ' transform.position[1]+ effect("AV Highlighter")("Offset")[1]]'
	highlightLayer.property('Transform').property('Position').expression = offsetString

	# Set the expression for line 1
	shape1.property('Contents').property('Trim Paths 1').property('End').expression = NF.Util.trimExpression(1, highlightLinesCount)

	# Make the additional lines
	i = 2
	while i <= highlightLinesCount
		# Duplicate the shape and offset its position
		newShape = highlightLayer.property('Contents').property(1).duplicate()
		newShape.property('Transform').property('Position').expression = '[content("Shape 1").transform.position[0], effect("AV Highlighter")("Spacing")*' + (i - 1) + ']'

		# Make the new slider and make it control the new shape's trim paths property
		newShape.property('Contents').property('Trim Paths 1').property('Start').expression = ''

		newShape.property('Contents').property('Trim Paths 1').property('End').expression = NF.Util.trimExpression(i, highlightLinesCount)

		i++
	return

createShapeLayer = (targetLayer) ->
	newShape = app.project.activeItem.layers.addShape()
	newShape.moveBefore targetLayer
	newShape.name = 'Highlighter'
	newShape.parent = targetLayer
	newShape.startTime = targetLayer.inPoint
	return

splitHighlightLayer = ->
	_.selectedLayer = _.mainComp.selectedLayers[0]
	splitterEffect = _.selectedLayer.property("Effects").property("Splitter")

	# Create the Splitter Effect and return if it doesn't already exists
	return createSplitterEffect() unless splitterEffect?

	splitterPoint = splitterEffect.property("Point").value
	newLayers = splitHighlightAtPoint splitterPoint

	# Remove Splitter Effect
	for layer in newLayers
		layer.property("Effects").property("Splitter").remove()
		layer.selected = yes

splitHighlightAtPoint = (splitterPoint) ->
	lineArray = getLineArray()
	closestIndex = indexOfClosestLineToPoint splitterPoint, lineArray
	closestLine = lineArray[closestIndex]

	percentage = percentThroughLineAtPoint closestLine, splitterPoint

	# Adjust thickness if it's thicker than one full spacing height so that parts match up nicely
	highlighterEffect = _.selectedLayer.property("Effects").property("AV Highlighter")
	highlighterThickness = highlighterEffect.property("Thickness")
	highlighterSpacing = highlighterEffect.property("Spacing")
	highlighterThickness.setValue highlighterSpacing.value + 1 if highlighterThickness.value > highlighterSpacing.value + 1
	

	originalHighlightLayer = _.selectedLayer
	newHighlightLayer = originalHighlightLayer.duplicate()

	newHighlightLayer.moveAfter originalHighlightLayer

	# Record the position value for the split line, which will be the new 'parent position'
	newHighlightParentPosition = closestLine.shape.property("Transform").property("Position").value

	# Delete lines that aren't used in each layer
	lineCount = originalHighlightLayer.property("Contents").numProperties
	i = lineCount - 1
	while i >= 0
		if i < closestIndex
			originalHighlightLayer.property("Contents").property(i+1).remove()
		if i > closestIndex
			newHighlightLayer.property("Contents").property(i+1).remove()
		i--

	# Fix the position Expressions in the new layer
	lineCount = newHighlightLayer.property("Contents").numProperties
	i = lineCount
	while i >= 1
		if i is lineCount
			# Give the first line its proper offset control and position parent value
			firstShape = newHighlightLayer.property("Contents").property(i)
			firstShapeName = firstShape.name
			firstShapePosition = firstShape.property("Transform").property("Position")

			firstShapePosition.expression = ""
			firstShapePosition.setValue newHighlightParentPosition

			firstShape.property("Contents").property("Trim Paths 1").property("Start").expression = "effect(\"AV Highlighter\")(\"Start Offset\")"
		else
			newHighlightLayer.property("Contents").property(i).property("Transform").property("Position").expression = "[content(\"#{firstShapeName}\").transform.position[0], content(\"#{firstShapeName}\").transform.position[1] + effect(\"AV Highlighter\")(\"Spacing\")*#{lineCount - i}]"
		i--

	originalHighlighterEffect = originalHighlightLayer.property("Effects").property("AV Highlighter")
	newHighlighterEffect = newHighlightLayer.property("Effects").property("AV Highlighter")
	newHighlighterEffect.property("Start Offset").setValue percentage * 100
	originalHighlighterEffect.property("End Offset").setValue (1 - percentage) * 100

	NF.Util.fixTrimExpressionsForHighlightLayer newHighlightLayer
	NF.Util.fixTrimExpressionsForHighlightLayer originalHighlightLayer

	newLayers = [originalHighlightLayer, newHighlightLayer]
	return newLayers

percentThroughLineAtPoint = (line, point) ->
	pointX = point[0]
	percent = (pointX - line.relativeX) / line.length
	return percent

getLineArray = () ->
	lineCount = _.selectedLayer.property("Contents").numProperties
	# Create an array of the path objects in the order they appear
	lineArray = []
	i = 1
	while i <= lineCount
		lineShape = _.selectedLayer.property("Contents").property(i)
		lineName = lineShape.name
		linePath = lineShape.property("Contents").property("Path 1").property("Path").value
		lineVerticies = linePath.vertices

		lineStartPoint = lineVerticies[0]
		lineEndPoint = lineVerticies[1]
		yOffsetValue = lineShape.property("Transform").property("Position").value[1]
		lineAdjustedStartPoint = [lineStartPoint[0], lineStartPoint[1] + yOffsetValue]
		lineRelativeAdjustedStartPoint = NF.Util.pointRelativeToComp(lineAdjustedStartPoint, _.selectedLayer)

		lineRawY = lineAdjustedStartPoint[1]
		lineRelativeY = lineRelativeAdjustedStartPoint[1]

		lineStartRelativeX = lineRelativeAdjustedStartPoint[0]
		lineLength = lineEndPoint[0] - lineStartPoint[0]

		lineObj =
			name: lineName
			shape: lineShape
			path: linePath
			verticies: lineVerticies
			rawY: lineRawY
			relativeY: lineRelativeY
			relativeX: lineStartRelativeX
			length: lineLength
			yOffsetValue: yOffsetValue

		lineArray.push lineObj
		i++

	return lineArray

createSplitterEffect = () ->
	splitterEffect = _.selectedLayer.property("Effects").addProperty("ADBE Point Control")
	splitterEffect.name = "Splitter"
	return 1

indexOfClosestLineToPoint = (point, lineArray) ->
	testY = point[1]
	curr = 0
	diff = Math.abs(testY - lineArray[0].relativeY)
	i = 0
	while i < lineArray.length
		newDiff = Math.abs(testY - lineArray[i].relativeY)
		if newDiff < diff
			diff = newDiff
			curr = i
		i++
	curr

app.beginUndoGroup _.undoGroupName

main()

app.endUndoGroup()
