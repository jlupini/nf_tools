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
    throw new Error "Can't create an NFPartComp from a non-part comp" unless @name.indexOf("Part") >= 0
    @

  toString: ->
    return "NFPartComp: '#{@name}'"

  ###*
  Animates to a given highlight or page, with options. Will throw an error if
  there are
  other animations that take place after the current time on the same PDF in
  this comp. Must include one of model.highlight or model.page
  @memberof NFPartComp
  @param {Object} model - the model object
  @param {NFHighlightLayer} [model.highlight] - the highlight to animate to
  @param {NFPageComp} [model.page] - the page to animate to
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
  @returns {NFPageLayer || NFHighlightLayer} model.page || model.highlight
  ###
  animateTo: (model) ->
    model =
      highlight: model.highlight
      page: model.page
      duration: model.animationDuration ? 3
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

        activePageLayer?.layer.outPoint = titlePageLayer.getInMarkerTime()

        group = new NFPaperLayerGroup titlePageLayer.getPaperParentLayer()

        # If the highlight we want is on the title page
        if model.highlight? and targetPage.is titlePage
          # Move the time to the in marker and run moveToHighlight
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
            frameUp:
              highlight: model.highlight
              fillPercentage: model.fillPercentage * 0.7

          if model.highlight?
            targetPageLayer.bubbleUp model.highlight unless model.highlight.isBubbled()

          titlePageLayer.animatePageTurn()

          if model.highlight?
            group.moveToHighlight
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

        if model.highlight?
          targetPageLayer.bubbleUp model.highlight unless model.highlight.isBubbled()

        # Trim the old layer to the end of the page turn
        activePageLayer?.layer.outPoint = targetPageLayer.getInMarkerTime()

    # else (this pdf is in a part comp somewhere)
    else

      # Ensure there are no keyframes on the target's parent in the future
      targetGroup = @groupFromPDF targetPDF
      if targetGroup?
        posProp = targetGroup.paperParent.transform().position
        if posProp.numKeys > 0
          for i in [1..posProp.numKeys]
            if posProp.keyTime(i) > @getTime()
              throw new Error "Can't animate to page or highlight because animations exist in the FUTURE on the target PDF"

      # If it's the active PDF now
      if @activePDF().is targetPDF
        activePageLayer = @activePage()
        group = new NFPaperLayerGroup activePageLayer.getPaperParentLayer()
        # if the target page is the visible page
        if targetPage.is activePageLayer.getPageComp()
          # RUN AS NORMAL
          if model.highlight?
            group.moveToHighlight
              highlight: model.highlight
              duration: model.animationDuration
              fillPercentage: model.fillPercentage
              maxScale: model.maxPageScale

          if model.highlight?
            activePageLayer.bubbleUp model.highlight unless model.highlight.isBubbled()

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
                continuous: yes
                frameUp:
                  highlight: model.highlight
                  fillPercentage: model.fillPercentage * 2

              if model.highlight?
                targetPageLayer.bubbleUp model.highlight unless model.highlight.isBubbled()

              # Run a page turn flip down starting half a second back from now
              targetPageLayer.animatePageTurn
                time: @getTime() - 0.5
                duration: 2.0

              # Move the whole shabang to frame up the target highlight
              if model.highlight?
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
              continuous: yes
              frameUp:
                highlight: model.highlight
                fillPercentage: model.fillPercentage * 0.7

            if model.highlight?
              targetPageLayer.bubbleUp model.highlight unless model.highlight.isBubbled()

            # Run a page turn flip down starting half a second back from now
            activePageLayer.animatePageTurn
              time: @getTime() - 0.5
              duration: 2.0

            # Move the whole shabang to frame up the target highlight
            if model.highlight?
              group.moveToHighlight
                highlight: model.highlight
                duration: model.animationDuration
                fillPercentage: model.fillPercentage

      # else (not the active PDF)
      else
        # Animate in the page ALREADY focused on the highlight
        activePageLayer = @activePage()
        targetGroup = @groupFromPDF targetPDF
        alreadyInThisPart = targetGroup?

        targetPageLayer = @insertPage
          page: targetPage
          continuous: yes
          frameUp:
            highlight: model.highlight
            fillPercentage: model.fillPercentage

        if model.highlight?
          targetPageLayer.bubbleUp model.highlight unless model.highlight.isBubbled()

        targetGroup = @groupFromPDF targetPDF

        if alreadyInThisPart
          targetGroup.gatherLayers new NFLayerCollection [targetPageLayer]

          if targetPageLayer.index() < activePageLayer.index()
            targetPageLayer.slideIn()

            activePageLayer.layer.outPoint = targetPageLayer.getInMarkerTime()
          else
            activePageLayer.layer.outPoint = targetPageLayer.layer.inPoint + 2.0
            activePageLayer.slideOut()
        else
          targetPageLayer.slideIn()
          activePageLayer.layer.outPoint = targetPageLayer.getInMarkerTime()

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
      pageLayer.assignPaperParentLayer()

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
