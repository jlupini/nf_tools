###*
Creates a new NFPDF from a given array of pages
@class NFPDF
@classdesc NF Wrapper object for a group of NFPageComps
@param {NFPageComp[]} pageArr - an array of NFPageComps
@property {NFPageComp[]} pages - the array ofitems
@throws Throws error if one object in the array is not an NFPageComp
###
class NFPDF
  constructor: (pageArr) ->
    # FIXME: Should throw error if not all pages are from same PDF
    @pages = pageArr ? []
    if @pages.length > 0
      throw "You can only add NFPageComps to an NFPDF" unless page instanceof NFPageComp for page in @pages
  getInfo: ->
    # FIXME: Write this function
    return "NFPDF: 'FIXME'"

  ###*
  Checks if this layer is a valid page Layer
  @memberof NFPDF
  @param {NFPageComp} newPage - the page to add
  @throws Throws error if you try to add a non-NFPageComp
  @returns {NFPDF} self
  ###
  addNFPageComp: (newPage) ->
    if newPage instanceof NFPageComp
      @layers.push newPage
    else
      throw "You can only add NFPageComps to an NFPDF"
    @
