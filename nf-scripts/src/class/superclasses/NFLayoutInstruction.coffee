###*
Creates a new NFLayoutInstruction
@class NFLayoutInstruction
@classdesc An object that represents a parsed instruction to do a certain thing
at a certain time.
@param {Object} model
@property {float} time - the time of the instruction
@property {String} raw - the original instruction string from the script
@property {String} pdf - the pdf number. Use #getPDF instead!
@property {Object} flags - an object of NFLayoutFlagDict objects
@property {Object} instruction - an NFLayoutInstructionDict object
@property {String} line - the script line that goes along with this instruction
@property {boolean} validated - Whether or not the instruction has been validated
@property {boolean} valid - If the instruction is valid
@property {String} validationMessage - Message with validation result.
due to the instructions before or after this one
@property {NFLayoutInstruction} next - the next instruction
@property {NFLayoutInstruction} prev - the previous instruction
@property {int} expandNumber - which expand this is. Set by the validator
@property {int} expandUpNumber - which expandUp this is. Set by the validator
@property {boolean} break - if the script should add a breakpoint before processing
@property {String} expandLookString - the string to search for when looking for
this highlight if it's an expand. Set by the validator
###
class NFLayoutInstruction extends NFObject
  constructor: (model) ->
    NFObject.call(this)
    @time = model.time
    @raw = model.raw
    @pdf = model.pdf
    @flags = model.flags
    @instruction = model.instruction
    @line = model.line
    @next = model.next
    @prev = model.prev
    @expandLookString = model.expandLookString
    @break = model.break
  toString: ->
    return "NFLayoutInstruction: [#{@raw}]"

  ###*
  Validates the instruction
  @memberof NFLayoutInstruction
  @returns {boolean} if valid
  ###
  validate: ->
    $.bp() if @break

    @valid = yes

    if not @time?
      @validationMessage = "Missing Time."
      return @valid = no

    # If there's a native PDF, make sure it exists
    if @pdf?
      targetPDF = NFPDF.fromPDFNumber @pdf
      if not targetPDF?
        @validationMessage = "Missing PDF: '#{@pdf}'."
        return @valid = no

    # If the instruction is an expand and there's no look string yet, find one
    if @flags.expand? and not @assignLookStringForExpand()?
      @validationMessage = "No look string for expand."
      return @valid = no

    switch @instruction.type
      when NFLayoutType.HIGHLIGHT, NFLayoutType.EXPAND
        # Fail if we can't find any PDF we're supposed to use
        searchPDF = @getPDF()
        unless searchPDF?
          @validationMessage = "Can't determine PDF."
          return @valid = no

        # Fail if we can't find the PDF
        targetPDF = NFPDF.fromPDFNumber searchPDF
        unless targetPDF?
          @validationMessage = "Can't find PDF: #{searchPDF}"
          return @valid = no

        lookString = if @flags.expand? then @expandLookString else @instruction.look
        highlight = targetPDF.findHighlight lookString

        unless highlight?
          @validationMessage = "Can't find highlight '#{@instruction.look}' in PDF #{targetPDF.toString()}"
          return @valid = no

    return @valid



  ###*
  Gets the look string for the expand
  @memberof NFLayoutInstruction
  @returns {string | null} the look String
  ###
  assignLookStringForExpand: ->
    return null unless @flags.expand?

    unless @expandLookString?
      # First, get the highlight THIS expand is for
      testHighlight = @getHighlight()
      return null unless testHighlight?

      # Now go through every previous instruction looking for similar expands
      foundExpands = []
      testIns = @
      while testIns?
        if testIns.flags.expand?
          if @flags.expandUp? is testIns.flags.expandUp? and testIns.getHighlight()?.look is testHighlight.look and testIns.getPDF() is @getPDF()
            foundExpands.push testIns
        testIns = testIns.prev

      @expandLookString = "#{testHighlight.look} Expand"
      @expandLookString += " Up" if @flags.expandUp?
      @expandLookString += " #{foundExpands.length}" if foundExpands.length > 1

    return @expandLookString


  ###*
  Gets the pdf, looking recursively back through previous instructions until
  one is found
  @memberof NFLayoutInstruction
  @returns {string | null} the PDF number
  ###
  getPDF: ->
    return @pdf or @prev?.getPDF() or null

  ###*
  Gets the instruction. If an expand flag exists and the instruction is
  unrecognized, looks backwards until a highlight is found.
  @memberof NFLayoutInstruction
  @returns {Object} the instruction (from NFLayoutInstructionDict)
  ###
  getInstruction: ->
    if (@instruction.behavior is NFLayoutBehavior.UNRECOGNIZED or @instruction.behavior is NFLayoutBehavior.NONE) and @flags.expand?
      # We have an expand but not the highlight - go back and find it
      return @getHighlight() or @instruction
    else return @instruction

  ###*
  Returns the most recent highlight instruction
  @memberof NFLayoutInstruction
  @returns {Object | null} the highlight instruction (from NFLayoutInstructionDict)
  ###
  getHighlight: ->
    if @instruction.type is NFLayoutType.HIGHLIGHT
      return @instruction
    else if @prev?
      return @prev.getHighlight()
    else return null
