###*
Creates a new NFPaperLayerGroup from an NFPaperParentLayer
@class NFPaperLayerGroup
@classdesc An object that manages and manipulates a group of layers that are part of the same PDF
@param {NFPaperParentLayer} paperParent - the NFPaperParentLayer to create the group with
@property {NFPaperParentLayer} paperParent - the NFPaperParentLayer for the group
@throws Will throw an error if not created with a valid NFPaperParentLayer object
###
class NFPaperLayerGroup
  constructor: (paperParent) ->
    @paperParent = paperParent
    throw "Not a valid paper parent" unless @paperParent instanceof NFPaperParentLayer
  getInfo: ->
    # FIXME: Write this function
    return "NFPaperLayerGroup: #{paperParent.layer.name}"

  ###*
  Gets all the NFLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFLayerCollection} the layers
  ###
  getChildren: ->
    return @paperParent.getChildren()

  ###*
  Gets all the NFPageLayers in the group
  @memberof NFPaperLayerGroup
  @returns {NFPageLayerCollection} the page layers
  ###
  getPages: ->
    allChildren = @getChildren()
    pageChildren = new NFPageLayerCollection()
    for layer in allChildren.layers
      pageChildren.addNFPageLayer layer if layer instanceof NFPageLayer
    return pageChildren

  ###*
  Moves the given layers into the group and parents if indicated. Layers below
  the bottommost layer in the group will go at the bottom, and layers above the
  parent will go immediately below it.
  @memberof NFPaperLayerGroup
  @param {NFLayerCollection} layersToGather - the layers to gather up
  @param {boolean} [shouldParent=true] - whether or not to parent the new layers
  to the paper parent
  @returns {NFPaperLayerGroup} self
  ###
  gatherLayers: (layersToGather, shouldParent = yes) ->
    childLayers = @getChildren()

    layersAboveGroup = new NFLayerCollection()
    layersBelowGroup = new NFLayerCollection()
    for layer in layersToGather.layers
      layersAboveGroup.addNFLayer layer if layer.index() < @paperParent.index()
      layersBelowGroup.addNFLayer layer if layer.index() > childLayers.getBottommostLayer().index()

    # For the layers in this collection above the group
    while layersAboveGroup.count() > 0
      # starting with the bottommost and working up, move each one just below the parent
      bottomLayer = layersAboveGroup.getBottommostLayer()
      bottomLayer.moveAfter @paperParent
      layersAboveGroup.remove bottomLayer
    # for the layers in this coll below the group
    while layersBelowGroup.count() > 0
      # starting with the toppest and workingdown, move each one just below the bottomest layer in the group
      topLayer = layersBelowGroup.getTopmostLayer()
      topLayer.moveAfter childLayers.getBottommostLayer()
      layersBelowGroup.remove topLayer

      layersToGather.setParents(@paperParent) if shouldParent
    @
