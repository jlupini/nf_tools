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

    targetPDF = model.highlight.getPDF()
    containingPartComps = targetPDF.containingPartComps()

    # If we've NEVER SEEN THIS PDF before
    if containingPartComps.length is 0
      #  If we don't have the 'no q' flag
      if model.skipTitle is no
        # Bring in the motherfucking title page, initialize it
        titlePage = targetPDF.getTitlePage()
        titlePageLayer = @insertPage
          page: titlePage
          animate: yes

        targetPage = model.highlight.getPageComp()
        # If the highlight we want is on the title page
        if targetPage.is titlePage
          # Move the time to the in marker and run goToHighlight
          titlePageLayer.bubbleUp model.highlight
          @setTime titlePageLayer.getInMarkerTime()

          # Gotta actually do the goToHighlight here...
          # FIXME: Pick up here and get going!
        # Else (it's on a different page)
        else
          @setTime(titlePageLayer.getInMarkerTime() - 0.4)
          targetPageLayer = @insertPage
            page: targetPage
            below: titlePageLayer
          targetPageLayer.bubbleUp model.highlight
          # bring that motherfucker in below the title page layer
          # RUN goToHighlight


      #  else (we've been passed the 'no q' flag)
      else
        @
        # Animate in the page ALREADY focused on the highlight

    # else (this pdf is in a part comp somewhere)
    else
        @
    #   If it's the active PDF now
    #     if the target page is the visible page
    #       RUN AS NORMAL
    #     else (the highlight is on a different page)
    #       If the target page was used in this part
    #         if it was above the current layer
    #           Add the page layer above this current one, but peeled up
    #           RUN AS NORMAL
    #         else (it was below)
    #           Add the page layer below this current one
    #           RUN AS NORMAL
    #       else (we haven't seen it in a while)
    #         Add the page layer below this current one
    #         RUN AS NORMAL
    #   else (not the active PDF)
    #     Animate in the page ALREADY focused on the highlight
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
  @throws Throw error if given values for more than one of .above, .below,
  and .at
  ###
  insertPage: (model) ->
    throw "No page given to insert..." unless model.page? and model.page instanceof NFPageComp
    model.at = 1 unless model.above? or model.below? or model.at?
    pageLayer = @insertComp
      comp: model.page
      above: model.above
      below: model.below
      at: model.at

    unless model.init is no
      pageLayer.initTransforms().init()
      pageLayer.assignPaperParentLayer()

    if model.animate is yes
      pageLayer.slideIn()

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
