###*
Creates a new NFPartComp and sets its comp property.
@class NFPartComp
@classdesc NF Wrapper object for a CompItem used as a part comp that allows for access to and maniplation of its layers.
@property {CompItem} comp - the CompItem for this NFPartComp
@param {CompItem} comp - the CompItem for this NFPartComp
@extends NFComp
@throws Will throw an error if not given a valid CompItem at initialization
###
class NFPartComp extends NFComp
  constructor: (comp) ->
    NFComp.call(this, comp)
    throw new Error "Can't create an NFPartComp from a non-part comp" unless @getName().indexOf("Part") >= 0
    @

  toString: ->
    return "NFPartComp: '#{@getName()}'"

  ###*
  Animates to a given highlight or page, with options. Will throw an error if
  there are
  other animations that take place after the current time on the same PDF in
  this comp. Must include one of model.highlight or model.page
  @memberof NFPartComp
  @param {Object} model - the model object
  @param {NFHighlightLayer} [model.highlight] - the highlight to animate to
  @param {NFPageComp} [model.page] - the page to animate to
  @param {time} [model.time=currTime] - the time to do the animation at
  @param {float} [model.animationDuration=3] - the length of the move and scale
  @param {float} [model.pageTurnDuration=2] - the length of the pageturn
  @param {float} [model.maxPageScale=115] - the maximum a page will scale
  @param {float} [model.fillPercentage=85] - the percentage of the comp width
  for the final highlight to take up
  @param {boolean} [model.skipTitle=false] - whether we should skip going to the
  title page if this PDF is new in the project
  @throws Throw error if not given a highlight
  @throws Throw error if there is movement on the target page parent layer
  after the current comp time in this comp.
  @returns {NFPageLayer|NFHighlightLayer} model.page or model.highlight
  ###
  animateTo: (model) ->
    model =
      highlight: model.highlight
      page: model.page
      time: model.time
      animationDuration: model.animationDuration ? 3
      pageTurnDuration: model.pageTurnDuration ? 2
      maxPageScale: model.maxPageScale ? 115
      skipTitle: model.skipTitle ? no
      fillPercentage: model.fillPercentage ? 85

    unless model.highlight? or model.page?
      throw new Error "No highlight or page to animate to"
    if model.highlight? and model.page?
      throw new Error "Cannot animate to both a page and highlight."

    if model.page?
      throw new Error "Page is of wrong type" unless model.page instanceof NFPageComp
      targetPDF = model.page.getPDF()
    else if model.highlight?
      throw new Error "Highlight is of wrong type" unless model.highlight instanceof NFHighlightLayer
      targetPDF = model.highlight.getPDF()

    containingPartComps = targetPDF.containingPartComps()
    targetPage = model.page ? model.highlight.getPageComp()
    preAnimationTime = @getTime()
    @setTime model.time if model.time?
    activePDF = @activePDF()
    prevGroup = @groupFromPDF activePDF if activePDF?

    # If we've NEVER SEEN THIS PDF before
    if containingPartComps.length is 0
      # Get the active page, if any
      activePageLayer = @activePage()

      #  If we don't have the 'no q' flag
      if model.skipTitle is no
        # Bring in the motherfucking title page, initialize it
        titlePage = targetPDF.getTitlePage()
        titlePageLayer = @insertPage
          page: titlePage
          animate: yes

        trimTime = titlePageLayer.getInMarkerTime()
        prevGroup.trim trimTime if prevGroup?
        @hideGaussy trimTime + 1

        group = new NFPaperLayerGroup titlePageLayer.getPaperParentLayer()
        group.getCitationLayer().show @getTime()+0.5

        # If the target is a highlight, keep working...
        if model.highlight?
          # If the highlight we want is on the title page
          if targetPage.is titlePage
            # Move the time to the in marker and run moveTo
            @setTime titlePageLayer.getInMarkerTime()
            group.assignControlLayer model.highlight, @getTime() - 0.5

            group.moveTo
              highlight: model.highlight
              duration: model.animationDuration
              maxScale: model.maxPageScale
              fillPercentage: model.fillPercentage

          # Else (it's on a different page)
          else
            @setTime(titlePageLayer.getInMarkerTime() - 0.4)
            # Bring that page in below the title page layer
            targetPageLayer = @insertPage
              page: targetPage
              below: titlePageLayer
              frameUp:
                highlight: model.highlight
                fillPercentage: model.fillPercentage * 0.7

            if model.highlight?
              group.assignControlLayer model.highlight, titlePageLayer.getInMarkerTime() + 0.5

            titlePageLayer.animatePageTurn()

            if model.highlight?
              group.moveTo
                highlight: model.highlight
                duration: model.animationDuration
                fillPercentage: model.fillPercentage
                maxScale: model.maxPageScale

      #  else (we've been passed the 'no q' flag)
      else
        targetPageLayer = @insertPage
          page: targetPage
          animate: yes
          frameUp:
            highlight: model.highlight
            fillPercentage: model.fillPercentage

        group = new NFPaperLayerGroup targetPageLayer.getPaperParentLayer()
        group.getCitationLayer().show @getTime()+0.5

        # Trim the old layer to the end of the page turn
        trimTime = targetPageLayer.getInMarkerTime()
        prevGroup.trim trimTime
        @hideGaussy trimTime + 1

        if model.highlight?
          group.assignControlLayer model.highlight, @getTime() + 0.25

    # else (this pdf is in a part comp somewhere)
    else
      # Ensure there are no keyframes on the target's parent in the future
      targetGroup = @groupFromPDF targetPDF
      if targetGroup?
        posProp = targetGroup.paperParent.transform().position
        latestKeyTime = posProp.keyTime posProp.numKeys if posProp.numKeys > 0
        if latestKeyTime?
          if latestKeyTime > @getTime() + 2.0
            throw new Error "Can't animate to page or highlight because animations exist in the FUTURE on the target PDF"
          else if latestKeyTime > @getTime()
            @log "WARNING: This instruction is too close to the previous one, so we're bumping it forward up to two seconds."
            @setTime latestKeyTime + 0.1

      # If it's the active PDF now
      if @activePDF()?.is targetPDF
        activePageLayer = @activePage()
        group = new NFPaperLayerGroup activePageLayer.getPaperParentLayer()

        # if the target page is the visible page
        if targetPage.is activePageLayer.getPageComp()
          # RUN AS NORMAL, but move to a the title rect if not given a highlight
          group.moveTo
            highlight: model.highlight ? null
            rect: if model.highlight? then null else activePageLayer.sourceRectForFullTop()
            layer: if model.highlight? then null else activePageLayer
            duration: model.animationDuration
            fillPercentage: if model.highlight? then model.fillPercentage else 100
            maxScale: model.maxPageScale

          # Trim any active spotlights and placeholders
          group.trimActivePlaceholder @getTime()
          group.trimActiveSpotlights @getTime() + (model.animationDuration / 2)
          # FIXME: This should be El Sneako!
          @hideGaussy @getTime()

          if model.highlight?
            group.assignControlLayer model.highlight, @getTime() + (model.animationDuration / 2)
            model.highlight.getControlLayer().setSpotlightMarkerInPoint @getTime() + (model.animationDuration / 2)


        # else (the highlight is on a different page)
        else

          # If the target page was used in this part and it was above the currently active layer
          # or if we're going to the title page
          layersForPage = @layersForPage targetPage
          isUsedInPartAboveCurrentLayer = layersForPage.count() > 0 and layersForPage.layers[0].index() < activePageLayer.index()
          isTitlePage = targetPDF.getTitlePage().getPageNumber() is targetPage.getPageNumber()
          if isUsedInPartAboveCurrentLayer or isTitlePage

              # Add the page layer above this current one, but peeled up.
              # Also frame it up
              targetPageLayer = @insertPage
                page: targetPage
                above: activePageLayer
                time: @getTime() - 0.5
                pageTurn: NFPageLayer.PAGETURN_FLIPPED_UP
                continuous: yes
                frameUp:
                  highlight: model.highlight
                  fillPercentage: model.fillPercentage * 2

              # Run a page turn flip down starting half a second back from now
              pageTurnDuration = 2.0
              targetPageLayer.animatePageTurn
                time: @getTime() - 0.5
                duration: pageTurnDuration

              # Move the whole shabang to frame up the target highlight
              if model.highlight?
                group.moveTo
                  highlight: model.highlight
                  duration: model.animationDuration
                  fillPercentage: model.fillPercentage

              # Trim the old layer to the end of the page turn
              activePageLayer.layer.outPoint = @getTime() - 0.5 + 2.0

              group.trimActivePlaceholder @getTime()
              group.trimActiveSpotlights @getTime() + 0.5
              # FIXME: This should be El Sneako!
              @hideGaussy @getTime()

              if model.highlight?
                group.assignControlLayer model.highlight, @getTime() + 0.5
                model.highlight.getControlLayer().setSpotlightMarkerInPoint @getTime() + 0.5

          # else (we haven't seen it in this part or it was below)
          else
            # Add the page layer below this current one.
            # Also frame it up
            targetPageLayer = @insertPage
              page: targetPage
              below: activePageLayer
              time: @getTime() - 0.5
              continuous: yes
              frameUp:
                highlight: model.highlight
                fillPercentage: model.fillPercentage * 0.7

            # Run a page turn flip down starting half a second back from now
            activePageLayer.animatePageTurn
              time: @getTime() - 0.5
              duration: 2.0

            # Move the whole shabang to frame up the target highlight
            if model.highlight?
              group.moveTo
                highlight: model.highlight
                duration: model.animationDuration
                fillPercentage: model.fillPercentage

            group.trimActivePlaceholder @getTime()
            group.trimActiveSpotlights @getTime() + 0.5
            # FIXME: This should be El Sneako!
            @hideGaussy @getTime()

            if model.highlight?
              group.assignControlLayer model.highlight, @getTime() + 0.5
              model.highlight.getControlLayer().setSpotlightMarkerInPoint @getTime() + 0.5

      # else (not the active PDF)
      else
        # Animate in the page ALREADY focused on the highlight or page
        activePageLayer = @activePage()
        targetGroup = @groupFromPDF targetPDF
        activePDF = @activePDF()
        prevGroup = @groupFromPDF activePDF if activePDF?
        alreadyInThisPart = targetGroup?

        targetPageLayer = @insertPage
          page: targetPage
          continuous: yes
          frameUp:
            highlight: model.highlight
            fillPercentage: model.fillPercentage

        targetGroup = @groupFromPDF targetPDF
        targetGroup.getCitationLayer().show @getTime()+0.5

        if alreadyInThisPart
          targetGroup.gatherLayers new NFLayerCollection [targetPageLayer]

          # If it's above, the active layer, slide it in
          # Otherwise, slide the active layer out
          if targetPageLayer.index() < activePageLayer.index()
            targetPageLayer.slideIn()
            trimTime = targetPageLayer.getInMarkerTime()
            prevGroup?.trim trimTime
            @hideGaussy trimTime + 1
          else
            trimTime = targetPageLayer.layer.inPoint + 2.0
            prevGroup?.trim trimTime
            @hideGaussy @getTime()
            activePageLayer.slideOut()
        else
          targetPageLayer.slideIn()
          trimTime = targetPageLayer.getInMarkerTime()
          prevGroup?.trim trimTime
          @hideGaussy trimTime + 1

        if model.highlight?
          targetGroup.assignControlLayer model.highlight, @getTime() + 0.25


    @setTime preAnimationTime
    return model.page or model.highlight

  ###*
  Inserts a page at the current time
  @memberof NFPartComp
  @returns {NFPageLayer} the new page layer
  @param {Object} model - the parameters
  @param {NFPageComp} model.page - the page to insert
  @param {boolean} [model.init=yes] - if the page should be initialized
  @param {NFLayer} [model.above] - the layer to insert the page above. Can use
  only one of .above, .below or .at
  @param {NFLayer} [model.below] - the layer to insert the page below. Can use
  only one of .above, .below or .at
  @param {int} [model.at=1] - the index to insert the page at. Can use only
  one of .above, .below or .at
  @param {boolean} [model.animate=no] whether to animate the page in
  @param {float} [model.time=Current Time] The time to insert at
  @param {Enum} [model.pageTurn=PAGETURN_NONE] the pageTurn of the page
  @param {boolean} [model.continuous=no] whether to start the page at the
  first frame of it's composition that we haven't seen yet.
  @throws Throw error if given values for more than one of .above, .below,
  and .at
  ###
  insertPage: (model) ->
    @log "Inserting page: #{model.page.comp.name}"
    throw new Error "No page given to insert..." unless model.page? and model.page instanceof NFPageComp

    model.at = 1 unless model.above? or model.below? or model.at?
    model.time = model.time ? @getTime()
    model.pageTurn = model.pageTurn ? NFPageLayer.PAGETURN_NONE
    model.continuous = model.continuous ? no
    pageLayer = @insertComp
      comp: model.page
      above: model.above
      below: model.below
      at: model.at
      time: model.time

    unless model.init is no
      pageLayer.initTransforms().init()
      group = new NFPaperLayerGroup pageLayer.assignPaperParentLayer()
      group.assignCitationLayer()
      group.extend()


    if model.frameUp? and model.frameUp.highlight?
      pageLayer.frameUpHighlight model.frameUp

    if model.animate is yes
      pageLayer.slideIn()

    if model.pageTurn is NFPageLayer.PAGETURN_FLIPPED_UP or model.pageTurn is NFPageLayer.PAGETURN_FLIPPED_DOWN
      pageLayer.setupPageTurnEffect model.pageTurn
    else if model.pageTurn isnt NFPageLayer.PAGETURN_NONE
      throw new Error "Invalid pageturn type to insert page with"

    pageLayer.makeContinuous() if model.continuous

    layersForPage = @layersForPage model.page
    layersForPage.differentiate() unless layersForPage.count() < 2

    return pageLayer

  ###*
  Adds a new placeholder layer to the comp, above the currently active group. If a
  placeholder is already active, replace the placeholder text with the new one at
  the given time.
  @memberof NFPartComp
  @param {Object} model
  @param {String} [model.text] - the placeholder text to show over the layer
  @param {float} [model.time=currTime] - the start time of the placeholder layer
  @param {float} [model.duration] - the length of the placeholder layer. If not
  given a duration, the layer will continue indefinitely.
  @returns {NFPartComp} self
  ###
  addPlaceholder: (model) ->
    model.time = model.time ? @getTime()
    model.duration = model.duration ? @comp.duration - model.time

    activePDF = @activePDF model.time
    if activePDF?
      activeGroup = @groupFromPDF activePDF
      activeGroup.trimActivePlaceholder model.time

      placeholder = @addTextLayer
        text: model.text
        time: model.time
        duration: model.duration
        fillColor: [0,0.6,0.9]
        strokeWidth: 10
        strokeColor: [0,0,0]
        applyStroke: yes
        below: activeGroup.getCitationLayer()
        justification: ParagraphJustification.CENTER_JUSTIFY
        fontSize: 60
      placeholder.transform().property("Position").setValue [960, 980]
      placeholder.layer.name = "INSTRUCTION: #{model.text}"

    else
      # FIXME: Should be able to catch these non-attached ones and trim...
      placeholder = @addTextLayer
        text: model.text
        time: model.time
        duration: model.duration
        fillColor: [0,0.6,0.9]
        strokeWidth: 10
        strokeColor: [0,0,0]
        applyStroke: yes
        justification: ParagraphJustification.CENTER_JUSTIFY
        fontSize: 60
      placeholder.transform().property("Position").setValue [960, 980]
      placeholder.layer.name = "INSTRUCTION: #{model.text}"

    @

  ###*
  Adds a new gaussy layer to the comp, above the currently active group. If a
  gaussy is already active, replace the placeholder text with the new one at
  the given time.
  @memberof NFPartComp
  @param {Object} model
  @param {String} [model.placeholder] - the placeholder text to show over the layer
  @param {float} [model.time=currTime] - the start time of the gaussy layer
  @param {float} [model.duration] - the length of the gaussy layer. If not given
  a duration, the layer will continue indefinitely.
  @returns {NFPartComp} self
  ###
  addGaussy: (model) ->
    model ?= {}
    model.time = model.time ? @getTime()
    model.duration = model.duration ? @comp.duration - model.time

    activePDF = @activePDF model.time
    if activePDF?
      activeGroup = @groupFromPDF activePDF

      activeGaussy = @activeGaussy model.time
      if activeGaussy?
        # If there's already an active one, switch the placeholder if possible.
        children = activeGaussy.getChildren()
        belowTarget = null
        unless children.isEmpty()
          children.forEach (testChild) =>
            if testChild.layer instanceof TextLayer
              testChild.layer.outPoint = model.time
              belowTarget = testChild
        belowTarget = belowTarget ? activeGaussy


      else
        @log "Adding a gaussy layer at time: #{model.time}"
        gaussy = NFGaussyLayer.newGaussyLayer
          group: activeGroup
          time: model.time
          duration: model.duration

        activeGroup.trimActiveSpotlights model.time + 0.5

      if model.placeholder?
        placeholder = @addTextLayer
          text: model.placeholder
          time: model.time
          duration: model.duration
          fillColor: [1,0,0]
          above: belowTarget ? gaussy
          justification: ParagraphJustification.CENTER_JUSTIFY
          fontSize: 100
        placeholder.setParent activeGaussy ? gaussy
        placeholder.layer.name = "FIXME: #{model.placeholder}"

    else
      throw new Error "No active group to create a gaussy layer on top of"

    @

  ###*
  Hides the active gaussy layer, if one exists.
  @memberof NFPartComp
  @param {float} [time=currTime] - the end time of the gaussy layer
  @returns {NFPartComp} self
  ###
  hideGaussy: (time) ->
    time = time ? @getTime()
    activeGaussies = @activeLayers(time).searchLayers "Gaussy"
    activeGaussies.forEach (testLayer) =>
      if testLayer.layer.isSolid()
        @log "Hiding gaussy layer at time: #{time}"
        testLayer.layer.outPoint = time
        children = testLayer.getChildren()
        unless children.isEmpty()
          children.forEach (child) =>
            child.layer.outPoint = time unless child.layer.outPoint < time

    @

  ###*
  Returns whether or not there's an active gaussy layer at the given time
  @memberof NFPartComp
  @param {float} [time=currTime] - the time to check
  @returns {Boolean} if there is a gaussy active at the current time
  ###
  gaussyActive: (time) ->
    return @activeGaussy(time)?

  ###*
  Trims all the animation layers in this comp to the given time
  @memberof NFPartComp
  @param {float} [time=currTime] - the time to check
  @returns {Boolean} if there is a gaussy active at the current time
  ###
  trimTo: (time) ->
    @activeLayers(time).forEach (layer) =>
      layer.layer.outPoint = time

  ###*
  Returns an active gaussy if one exists, or null. DIFFERENT FROM #gaussyActive
  @memberof NFPartComp
  @param {float} [time=currTime] - the time to check
  @returns {NFGaussyLayer | null} the active gaussy at the given time, or null
  ###
  activeGaussy: (time) ->
    time = time ? @getTime()

    searchResults = @activeLayers(time).searchLayers "Gaussy"
    if searchResults.isEmpty()
      return null
    else
      gaussyFound = null
      searchResults.forEach (testLayer) =>
        gaussyFound = testLayer if testLayer.layer.isSolid()
      return gaussyFound


  ###*
  Returns an active placeholder if one exists, or null.
  @memberof NFPartComp
  @param {float} [time=currTime] - the time to check
  @returns {NFLayer} the active placeholder layer at the given time, or null
  ###
  activePlaceholder: (time) ->
    time = time ? @getTime()

    foundPlaceholder = null
    @activeLayers(time).forEach (activeLayer) =>
      if activeLayer.getName().indexOf("INSTRUCTION:") >= 0
        foundPlaceholder = activeLayer
    return foundPlaceholder

  ###*
  Gets the zoomer layer
  @memberof NFPartComp
  @override
  @throws Will throw an error if the zoomer comp cannot be found
  @returns {NFLayer} The zoomer NFLayer
  ###
  getZoomer: ->
    zoomer = @layerWithName 'Zoomer'
    throw new Error "This NFPartComp has no zoomer!" unless zoomer?
    return zoomer

  ###*
  Gets the active PDF at an optional time
  @memberof NFPartComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFPDF | null} The active PDF or null if none active
  ###
  activePDF: (time) ->
    activePage = @activePage(time)
    return activePage?.getPDF()

  ###*
  Gets the active NFPageLayer at a time (or current time by default). In this
  case, that means the topmost Page Layer that is not folded back, invisible,
  disabled, pre-start or post-end.
  @memberof NFPartComp
  @param {float} [time] - the time to check at, or the current time by default
  @returns {NFPageLayer | null} The active page layer or null if none
  ###
  activePage: (time) ->
    # Set the current time to the test time, but we'll need to set it back later.
    if time?
      originalTime = @getTime()
      @setTime(time)

    activePage = null
    activeLayers = @activeLayers time
    until activeLayers.isEmpty()
      topLayer = activeLayers.getTopmostLayer()
      if topLayer instanceof NFPageLayer
        if topLayer.pageTurnStatus(time) isnt NFPageLayer.PAGETURN_FLIPPED_UP and topLayer.property("Transform").property("Opacity").value is 100
          activePage = topLayer
          break

      activeLayers.remove(topLayer)

    @setTime originalTime if originalTime?
    return activePage


  ###*
  Returns an NFPaperLayerGroup for a given PDF in the part comp
  @memberof NFPartComp
  @param {NFPDF} pdf - the PDF to look for
  @returns {NFPaperLayerGroup | null} The found group
  ###
  groupFromPDF: (pdf) ->
    throw new Error "given pdf is not an NFPDF" unless pdf instanceof NFPDF
    matchedLayers = new NFLayerCollection
    parentLayer = @layerWithName pdf.getName()

    if parentLayer?
      return new NFPaperLayerGroup parentLayer
    else
      return null


  ###*
  Returns an NFPageLayerCollection of NFPageLayers in this comp that
  contain the given NFPageComp
  @memberof NFPartComp
  @param {NFPageComp} page - the page to look for
  @returns {NFPageLayerCollection} The found page layers
  ###
  layersForPage: (page) ->
    throw new Error "given page is not an NFPageComp" unless page instanceof NFPageComp
    matchedPages = new NFPageLayerCollection
    @allLayers().forEach (theLayer) =>
      if theLayer instanceof NFPageLayer and theLayer.getPageComp().is page
        matchedPages.add theLayer
    return matchedPages
