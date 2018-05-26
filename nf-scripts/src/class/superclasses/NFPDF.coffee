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
  Returns a general use name for the PDF
  @memberof NFPDF
  @returns {string} the PDF name
  ###
  getName: ->
    return 'PDF ' + @getPDFNumber()

  ###*
  Returns the PDF Number as a string
  @memberof NFPDF
  @returns {string} the PDF Number
  @throws Throws error if no PDF number (if this object is empty)
  ###
  getPDFNumber: ->
    throw "NO PDF number" if @pages.length is 0
    return @pages[0].getPDFNumber()

  ###*
  Looks for a highlight layer in the PDF
  @memberof NFPDF
  @param {string} name - the name of the highlight layer
  @returns {NFHighlightLayer | null} the found highlight or null
  ###
  findHighlight: (name) ->
    for page in @pages
      highlight = page.highlightWithName(name)
      return highlight if highlight?
    null

  ###*
  Returns an arrayof part comps this PDF can be found in
  @memberof NFPDF
  @returns {NFPartComp[]} An array of part comps this PDF is in
  ###
  containingPartComps: ->
    folder = NFProject.findItem "Parts"
    items = NFProject.searchItems("Part", folder)
    containingParts = []
    for item in items
      part = new NFPartComp item
      containingParts.push(part) if part.layerWithName(@getName())?
    return containingParts

  ###*
  Returns the title page of the PDF
  @memberof NFPDF
  @returns {NFPageComp} The page in the PDF with the lowest page number
  ###
  getTitlePage: ->
    count = @pages.length
    if count is 0
      throw "Can't get the title page because there are no pages"
    else if count is 1
      return @pages[0]
    else
      lowestPage = null
      lowestNum = parseInt @pages[0].getPageNumber()
      for page in @pages
        thisNum = parseInt page.getPageNumber()
        lowestPage = page if thisNum <= lowestNum
      return lowestPage


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
    return NFPDF.fromPDFNumber pageLayer.getPDFNumber()

  ###*
  Gets a new PDF object from a given PDF Number string
  @memberof NFPDF
  @param {string} theNumber - the PDF Number
  @returns {NFPDF} the new NFPDF
  @throws throws error if cannot find the pages for the given number
  ###
  fromPDFNumber: (theNumber) ->
    folder = NFProject.findItem "PDF Precomps"
    items = NFProject.searchItems(theNumber + "_", folder)

    throw "Cannot find PDF pages for the given number: '#{theNumber}'" if items.length is 0

    return new NFPDF(items)
