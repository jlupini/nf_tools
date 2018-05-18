###*
Creates a new NFPDF from a given array of pages
@class NFPDF
@classdesc NF Wrapper object for a group of NFPageItems
@param {NFPageItem[]} pageArr - an array of NFPageItems
@property {NFPageItem[]} pages - the array ofitems
@throws Throws error if one object in the array is not an NFPageItem
###
class NFPDF
  constructor: (pageArr) ->
    # FIXME: Should throw error if not all pages are from same PDF
    @pages = pageArr ? []
    if @pages.length > 0
      throw "You can only add NFPageItems to an NFPDF" unless page instanceof NFPageItem for page in @pages
  getInfo: ->
    # FIXME: Write this function
    return "NFPDF: 'FIXME'"

  ###*
  Checks if this layer is a valid page Layer
  @memberof NFPDF
  @param {NFPageItem} newPage - the page to add
  @throws Throws error if you try to add a non-NFPageItem
  @returns {NFPDF} self
  ###
  addNFPageItem: (newPage) ->
    if newPage instanceof NFPageItem
      @layers.push newPage
    else
      throw "You can only add NFPageItems to an NFPDF"
    @
