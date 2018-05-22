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
  Adds an NFPageComp to the PDF
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

# Class Methods
NFPDF = Object.assign NFPDF,

  ###*
  Gets a new PDF object from a given page layer
  @memberof NFPDF
  @param {pageLayer} NFPageLayer - the page layer
  @returns {NFPDF} the new NFPDF
  @throws throws error if not given an NFPageLayer
  ###
  fromPageLayer: (pageLayer) ->
    throw "Can't make an NFPDF using fromPageLayer() without a NFPageLayer..." unless pageLayer instanceof NFPageLayer

    searchNumber = pageLayer.getPageNumber()
    folder = NFProject.findItem "PDF Precomps"
    items = NFProject.searchItems ""

    # Search the page comps folder for items with that PDF number

    # Create the new NFPDF

    # FIXME: Pickup here - This is for NFPageLayer's getPDF() which is for NFPartComp's activePDF()  which is for AutoLayout
