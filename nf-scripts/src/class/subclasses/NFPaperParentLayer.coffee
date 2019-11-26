###*
Creates a new NFPaperParentLayer from a given null AVLayer
@class NFPaperParentLayer
@classdesc Subclass of {@link NFLayer} for the parent null layer of a group of page layers from the same PDF
@param {AVLayer | NFLayer} layer - the target AVLayer or NFLayer
@property {AVLayer} layer - the wrapped AVLayer
@extends NFLayer
@throws Will throw an error if not given an AVLayer that's a null layer or an NFLayer with a similar layer property
###
class NFPaperParentLayer extends NFLayer
  constructor: (layer) ->
    NFLayer.call(this, layer)
    throw new Error "Can only create a NFPaperParentLayer from a solid layer" unless @$.isSolid()
    @
  # MARK: Instance Methods
  toString: ->
    return "NFPaperParentLayer: '#{@$.name}'"

  ###*
  Returns the NFPaperLayerGroup for this parent layer
  @memberof NFPaperParentLayer
  @returns {NFPaperLayerGroup} the group
  ###
  getGroup: ->
    return new NFPaperLayerGroup @

# Class Methods
NFPaperParentLayer = Object.assign NFPaperParentLayer,
  ###*
  Class Method. Tests an AV layer to see if it can be a paper parent Layer
  @memberof NFPaperParentLayer
  @param {AVLayer} layer - the AVLayer to test
  @returns {boolean} whether or not the layer is a valid paper parent
  ###
  isPaperParentLayer: (layer) ->
    return layer.isSolid() and layer.name.indexOf('PDF') >= 0

  ###*
  Class Method. Returns the name string for the paper parent for a given layer or NFPDF
  @memberof NFPaperParentLayer
  @param {NFPageLayer | NFPDF} object - the page layer or pdf to use to determine the name
  @returns {string} The name of the paperParentLayer for the given layer or pdf
  ###
  getPaperParentNameForObject: (object) ->
    return 'PDF ' + object.getPDFNumber()
