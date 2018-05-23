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
    pageArr = pageArr ? []
    if pageArr.length > 0
      newArr = []
      for page in pageArr
        if page instanceof CompItem
          newArr.push(new NFPageComp(page))
        else if page instanceof NFPageComp
          newArr.push(page)
        else
          throw "You can only add NFPageComps to an NFPDF"
    @pages = newArr
  toString: ->
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
      @pages.push newPage
    else if newPage instanceof CompItem
      @pages.push new NFPageComp(newPage)
    else
      throw "You can only add NFPageComps to an NFPDF"
    @

  ###*
  Returns the PDF Number as a string
  @memberof NFPDF
  @returns {string} the PDF Number
  @throws Throws error if no PDF number (if this object is empty)
  ###
  getPDFNumber: ->
    throw "NO PDF number" if @pages.length is 0
    return @pages[0].getPDFNumber()

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

    searchNumber = pageLayer.getPDFNumber()
    folder = NFProject.findItem "PDF Precomps"
    items = NFProject.searchItems(searchNumber + "_", folder)

    return new NFPDF(items)
