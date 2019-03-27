###*
Creates a new NFCitationLayer from a given AVLayer or NFLayer
@class NFCitationLayer
@classdesc Subclass of {@link NFLayer} for a citation layer
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
###
class NFCitationLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    @
  toString: ->
    return "NFCitationLayer: '#{@layer.name}'"

  ###*
  Adds a citation visible marker at the given time
  @memberof NFCitationLayer
  @param {float} [time=currTime] - the time to add the marker
  @param {float} [duration=5] - the duration of the marker
  @returns {NFCitationLayer} self
  ###
  show: (time, duration) ->
    time = time or @containingComp().getTime()
    duration = duration or 5
    endTime = time + duration

    markers = @markers()
    citationMarkers = []
    if markers.numKeys > 0
      for idx in [1..markers.numKeys]
        thisMarker = markers.keyValue idx
        thisTime = markers.keyTime idx
        thisEndTime = thisTime + thisMarker.duration
        if thisMarker.comment is "Citation"
          if thisTime <= time < thisEndTime
            # We're trying to start inside an existing marker
            # So just extend the end of the existing one.
            newDuration = endTime - thisTime
            thisMarker.duration = newDuration if newDuration > thisMarker.duration
            return @
          if thisTime <= endTime < thisEndTime
            # We're trying to end this marker inside an existing one
            # So just extend the start of the existing one back
            delta = thisTime - time
            newDuration = thisMarker.duration + delta
            markers.removeKey idx
            @addMarker
              time: time
              comment: "Citation"
              duration: newDuration
            return @


    @addMarker
      time: time
      comment: "Citation"
      duration: duration
    return @


NFCitationLayer = Object.assign NFCitationLayer,

  ###*
  Returns whether or not the given AVLayer is a valid Citation Layer
  @memberof NFCitationLayer
  @param {AVLayer} the layer to check
  @returns {boolean} whether the AV layer is a valid citation layer
  ###
  isCitationLayer: (theLayer) ->
    return theLayer.name.indexOf("Citation") >= 0

  ###*
  Returns the folder where citation comps live. Makes one if it doesn't exist.
  @memberof NFCitationLayer
  @returns {FolderItem} the folder where the cite comps live
  ###
  folder: ->
    citeFolder = NFProject.findItem "Citations"
    unless citeFolder
      assetsFolder = NFProject.findItem "Assets"
      citeFolder = assetsFolder.items.addFolder "Citations"
    return citeFolder

  ###*
  Fetches the citation from the citations.csv file found in the project
  directory.
  @memberof NFCitationLayer
  @param {NFPDF} thePDF - the PDF to make the comp for
  @returns {NFComp} the new comp
  @throw Throws an error if citations.csv could not be found or empty
  ###
  fetchCitation: (thePDF) ->
    pdfKey = thePDF.getPDFNumber()
    if NFTools.testProjectFile "citations.csv"
      citationsFile = NFTools.readProjectFile "citations.csv", yes
      citationArray = citationsFile.splitCSV()

      throw new Error "Empty Citation array" unless citationArray.length > 0

      # Figure out our start column
      startColumn = 0
      throw new Error "Not enough columns" unless citationArray[0].length > 0
      for citeLineItemIdx in [0..citationArray[0].length-1]
        citeLineItem = citationArray[0][citeLineItemIdx]
        if citeLineItem isnt ""
          startColumn = citeLineItemIdx
          break

      throw new Error "Not enough columns" unless citationArray[0].length >= startColumn

      citeObj = {}
      for citeLine in citationArray
        newKey = citeLine[startColumn]
        newVal = citeLine[startColumn + 1]
        citeObj[newKey] = newVal

      if citeObj[pdfKey]?
        return citeObj[pdfKey]
      else return "NO CITATION FOUND!"

    throw new Error "No citation found for PDF #{thePDF.getPDFNumber()}"

  ###*
  Returns the citation layer/comp name for a given PDF
  @memberof NFCitationLayer
  @param {NFPDF} thePDF - the PDF to make the name for
  @returns {String} the citation layer/comp name
  ###
  nameFor: (thePDF) ->
    return "#{thePDF.getPDFNumber()} - Citation"

  ###*
  Creates a new citation composition. Note that citation comps, while NFComps,
  do not have their own unique wrapper class.
  @memberof NFCitationLayer
  @param {NFPDF} thePDF - the PDF to make the comp for
  @returns {NFComp} the new comp
  ###
  newCitationComp: (thePDF) ->
    throw new Error "Missing parameters" unless thePDF instanceof NFPDF
    NFTools.log "Creating new citation comp for PDF: #{thePDF.toString()}", "NFCitationLayer"

    citationString = NFCitationLayer.fetchCitation thePDF

    citeFolder = NFCitationLayer.folder()
    citeComp = citeFolder.items.addComp(NFCitationLayer.nameFor(thePDF), 1920, 1080, 1, 600, 30)

    # Note: we're working with raw layers and comps and stuff here

    # Create background layer and add effects
    bgSolid = citeComp.layers.addSolid [0,0,0], 'colorCorrect', citeComp.width, citeComp.height, 1
    bgSolid.adjustmentLayer = true
    bgSolid.name = 'Background Blur'
    bgBlur = bgSolid.property('Effects').addProperty('ADBE Gaussian Blur 2')
    bgBlur.property('Blurriness').setValue 35
    bgBrightness = bgSolid.property('Effects').addProperty('ADBE Brightness & Contrast 2')
    bgBrightness.property('Brightness').setValue -148
    bgBrightness.property("Use Legacy (supports HDR)").setValue 1

    # Create and format text layer
    fontSize = 37
    textLayer = citeComp.layers.addBoxText [(fontSize + 20) * citationString.length, fontSize + 20], citationString
    textLayer_TextProp = textLayer.property('ADBE Text Properties').property('ADBE Text Document')
    textLayer_TextDocument = textLayer_TextProp.value
    textLayer_TextDocument.resetCharStyle()
    textLayer_TextDocument.fillColor = [1,1,1]
    textLayer_TextDocument.strokeWidth = 0
    textLayer_TextDocument.font = 'Avenir Next'
    textLayer_TextDocument.justification = ParagraphJustification.RIGHT_JUSTIFY
    textLayer_TextDocument.fontSize = fontSize
    textLayer_TextDocument.applyFill = true
    textLayer_TextDocument.applyStroke = false
    textLayer_TextProp.setValue textLayer_TextDocument
    textLayer.boxText = true

    # Position text layer
    sourceRectText = textLayer.sourceRectAtTime(0, false)
    textLayer.anchorPoint.setValue [sourceRectText.left + sourceRectText.width, sourceRectText.top]
    textBoxSizeX = textLayer_TextDocument.boxTextSize[0]
    textBoxSizeY = textLayer_TextDocument.boxTextSize[1]

    # Create mask and position
    maskShape = new Shape
    maskShape.vertices = [
      [0,sourceRectText.height + 20]
      [0,0]
      [sourceRectText.width + 25,0]
      [sourceRectText.width + 25,sourceRectText.height + 20]
    ]
    maskShape.closed = true
    bgMask = bgSolid.property('Masks').addProperty('Mask')
    maskPath = bgMask.property('Mask Path')
    maskPath.setValue maskShape

    # Final Positions
    sourceRectBgMask = bgSolid.sourceRectAtTime(0, false)
    bgSolid.anchorPoint.setValue [sourceRectText.width + 25,0]
    bgSolid.position.setValue [citeComp.width,20,0]
    textLayer.position.setValue [citeComp.width - 10,30,0]

    # Order Layers Correctly
    textLayer.moveBefore bgSolid

    return citeComp

  ###*
  Creates a new NFCitationLayer for the given group
  @memberof NFCitationLayer
  @param {NFPaperLayerGroup} group - the group to make the citation layer for
  @returns {NFCitationLayer} the new citation layer
  ###
  newCitationLayer: (group) ->
    throw new Error "Missing group" unless group instanceof NFPaperLayerGroup

    thePDF = NFPDF.fromGroup group
    compName = NFCitationLayer.nameFor thePDF
    citationComp = NFProject.findItem compName

    # Make a new comp if one doesn't exist for this PDF
    citationComp = NFCitationLayer.newCitationComp thePDF unless citationComp?

    NFTools.log "Creating new citation layer for Group: #{group.toString()}", "static NFCitationLayer"
    # Add the Layer
    citeLayer = group.containingComp().insertComp
      comp: new NFComp citationComp
      below: group.paperParent
      time: group.paperParent.layer.inPoint
    citeLayer.layer.collapseTransformation = yes
    citeLayer.layer.startTime = group.getPages().getEarliestLayer().layer.inPoint

    sourceExpression = NFTools.readExpression "citation-opacity-expression"
    citeLayer.transform().property("Opacity").expression = sourceExpression

    return citeLayer
