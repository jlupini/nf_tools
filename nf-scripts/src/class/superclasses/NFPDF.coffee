###
#    NF PDF
#
#    A collection of Page Items
#
###
class NFPDF
  constructor: (pageArr) ->
    @pages = pageArr
# Instance Methods
NFPDF:: = Object.assign NFPDF::,
  getInfo: ->
    # FIXME: Write this function
    return "NFPDF: 'FIXME'"
  addNFPageItem: (newPage) ->
    if newPage instanceof NFPageItem
      @layers.push newPage
    else
      throw "You can only add NFPageItems to an NFPDF"
