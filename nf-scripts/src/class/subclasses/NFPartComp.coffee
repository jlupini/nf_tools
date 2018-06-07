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
    throw "Can't create an NFPartComp from a non-part comp" unless @name.indexOf("Part") >= 0
    @

  toString: ->
    return "NFPartComp: '#{@name}'"

  ###*
  Animates to a given highlight, with options.
  @memberof NFPartComp
  @param {Object} model - the model object
  @param {NFHighlightLayer} model.highlight - the highlight to animate to
  @param {float} [model.animationDuration=3] - the length of the move and scale
  @param {float} [model.pageTurnDuration=2] - the length of the pageturn
  @param {float} [model.maxPageScale=115] - the maximum a page will scale
  @param {float} [model.fillPercentage=85] - the percentage of the comp width
  for the final highlight to take up
  @param {boolean} [model.skipTitle=false] - whether we should skip going to the
  title page if this PDF is new in the project
  @returns {NFPartComp} self
  ###
  animateToHighlight: (model) ->
    throw "Can't animate to a highlight because I don't have one..." unless model.highlight instanceof NFHighlightLayer
    model =
      highlight: model.highlight
      duration: model.animationDuration ? 3
      pageTurnDuration: model.pageTurnDuration ? 2
      maxPageScale: model.maxPageScale ? 115
      skipTitle: model.skipTitle ? no
      fillPercentage: model.fillPercentage ? 85

    targetPDF = model.highlight.getPDF()
    containingPartComps = targetPDF.containingPartComps()
    targetPage = model.highlight.getPageComp()

    # If we've NEVER SEEN THIS PDF before
    if containingPartComps.length is 0
      #  If we don't have the 'no q' flag
      if model.skipTitle is no
        # Bring in the motherfucking title page, initialize it
        titlePage = targetPDF.getTitlePage()
        titlePageLayer = @insertPage
          page: titlePage
          animate: yes

        group = new NFPaperLayerGroup titlePageLayer.getPaperParentLayer()
        # If the highlight we want is on the title page
        if targetPage.is titlePage
          # Move the time to the in marker and run goToHighlight
          titlePageLayer.bubbleUp model.highlight
          @setTime titlePageLayer.getInMarkerTime()

          group.moveToHighlight
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
          targetPageLayer.bubbleUp model.highlight

          titlePageLayer.animatePageTurn()

          targetPageLayer.frameUpHighlight
            highlight: model.highlight
            fillPercentage: model.fillPercentage * 0.8
          group.moveToHighlight
            highlight: model.highlight
            duration: model.animationDuration
            fillPercentage: model.fillPercentage
            maxScale: model.maxPageScale

      #  else (we've been passed the 'no q' flag)
      else
        alert "No q - I don't know how to deal yet"
        # TODO: Animate in the page ALREADY focused on the highlight

    # else (this pdf is in a part comp somewhere)
    else

    # If it's the active PDF now
      if @activePDF().is targetPDF
        activePageLayer = @activePage()
        group = new NFPaperLayerGroup activePageLayer.getPaperParentLayer()
        # if the target page is the visible page
        if targetPage.is activePageLayer.getPageComp()
          # RUN AS NORMAL
          group.moveToHighlight
            highlight: model.highlight
            duration: model.animationDuration
            fillPercentage: model.fillPercentage
            maxScale: model.maxPageScale

          activePageLayer.bubbleUp model.highlight

        # else (the highlight is on a different page)
        else
          # If the target page was used in this part and it was above the currently active layer
          layersForPage = @layersForPage targetPage
          if layersForPage.count() > 0 and layersForPage.layers[0].index() < activePageLayer.index()
              # Add the page layer above this current one, but peeled up.
              # Also frame it up
              targetPageLayer = @insertPage
                page: targetPage
                above: activePageLayer
                time: @getTime() - 0.5
                pageTurn: NFPageLayer.PAGETURN_FLIPPED_UP
                frameUp:
                  highlight: model.highlight
                  fillPercentage: model.fillPercentage * 2

              targetPageLayer.bubbleUp model.highlight

              # Run a page turn flip down starting half a second back from now
              targetPageLayer.animatePageTurn
                time: @getTime() - 0.5
                duration: 2.0

              # Move the whole shabang to frame up the target highlight
              group.moveToHighlight
                highlight: model.highlight
                duration: model.animationDuration
                fillPercentage: model.fillPercentage

              # Trim the old layer to the end of the page turn
              activePageLayer.layer.outPoint = @getTime() - 0.5 + 2.0

          # else (we haven't seen it in a while or it was below)
          else
            # Add the page layer below this current one.
            # Also frame it up
            targetPageLayer = @insertPage
              page: targetPage
              below: activePageLayer
              time: @getTime() - 0.5
              frameUp:
                highlight: model.highlight
                fillPercentage: model.fillPercentage * 0.8

            targetPageLayer.bubbleUp model.highlight

            # Run a page turn flip down starting half a second back from now
            activePageLayer.animatePageTurn
              time: @getTime() - 0.5
              duration: 2.0

            # Move the whole shabang to frame up the target highlight
            group.moveToHighlight
              highlight: model.highlight
              duration: model.animationDuration
              fillPercentage: model.fillPercentage

      # else (not the active PDF)
      else
        # Animate in the page ALREADY focused on the highlight
        alert "Bring in page already focused on the highlight"
    @

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
  @throws Throw error if given values for more than one of .above, .below,
  and .at
  ###
  insertPage: (model) ->
    throw "No page given to insert..." unless model.page? and model.page instanceof NFPageComp

    # Check if this page has been used in this comp already...
    layersForPage = @layersForPage model.page
    unless layersForPage.isEmpty()
      layersForPage.differentiate()

    model.at = 1 unless model.above? or model.below? or model.at?
    model.time = model.time ? @getTime()
    model.pageTurn = model.pageTurn ? NFPageLayer.PAGETURN_NONE
    pageLayer = @insertComp
      comp: model.page
      above: model.above
      below: model.below
      at: model.at
      time: model.time

    unless model.init is no
      pageLayer.initTransforms().init()
      pageLayer.assignPaperParentLayer()

    if model.animate is yes
      pageLayer.slideIn()

    if model.frameUp?
      pageLayer.frameUpHighlight model.frameUp

    if model.pageTurn is NFPageLayer.PAGETURN_FLIPPED_UP or model.pageTurn is NFPageLayer.PAGETURN_FLIPPED_DOWN
      pageLayer.setupPageTurnEffect model.pageTurn
    else if model.pageTurn isnt NFPageLayer.PAGETURN_NONE
      throw "Invalid pageturn type to insert page with"

    unless layersForPage.isEmpty()
      layersForPage = @layersForPage(model.page).differentiate()

    return pageLayer

  ###*
  Gets the zoomer layer
  @memberof NFPartComp
  @override
  @throws Will throw an error if the zoomer comp cannot be found
  @returns {NFLayer} The zoomer NFLayer
  ###
  getZoomer: ->
    zoomer = @layerWithName 'Zoomer'
    throw "This NFPartComp has no zoomer!" unless zoomer?
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
    activeLayers = @activeLayers()
    until activeLayers.isEmpty()
      topLayer = activeLayers.getTopmostLayer()
      if topLayer instanceof NFPageLayer
        if topLayer.pageTurnStatus() isnt NFPageLayer.PAGETURN_FLIPPED_UP and topLayer.property("Transform").property("Opacity").value is 100
          activePage = topLayer
          break

      activeLayers.remove(topLayer)

    @setTime originalTime if originalTime?
    return activePage


  ###*
  Returns an NFPageLayerCollection of NFPageLayers in this comp that
  contain the given NFPageComp
  @memberof NFPartComp
  @param {NFPageComp} page - the page to look for
  @returns {NFPageLayerCollection} The found page layers
  ###
  layersForPage: (page) ->
    throw "given page is not an NFPageComp" unless page instanceof NFPageComp
    matchedPages = new NFPageLayerCollection
    for theLayer in @allLayers().layers
      if theLayer instanceof NFPageLayer and theLayer.getPageComp().is page
        matchedPages.addLayer theLayer
    return matchedPages
