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
@property {int} expandNumber - which expand this is.
@property {int} expandUpNumber - which expandUp this is.
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
    @validated = no
    @next = model.next
    @prev = model.prev
    @expandNumber = 0
    @expandUpNumber = 0
  toString: ->
    return "NFLayoutInstruction: '#{@instruction.display}' @ #{@time} in PDF #{@pdf}"

  ###*
  Gets the pdf, looking recursively back through previous instructions until
  one is found
  @memberof NFLayoutInstruction
  @returns {string} the PDF number
  ###
  getPDF: ->
    return @pdf or @prev.getPDF()

  ###*
  Gets the instruction. If an expand flag exists and the instruction is
  unrecognized, looks backwards until a highlight is found.
  @memberof NFLayoutInstruction
  @returns {Object} the instruction (from NFLayoutInstructionDict)
  ###
  getInstruction: ->
    if @instruction.behavior is NFLayoutBehavior.UNRECOGNIZED and @flags.expand?
      # We have an expand but not the highlight - go back and find it
      return @getHighlight()
    else return @instruction

  ###*
  Internal use only. Returns the most recent highlight instruction
  @memberof NFLayoutInstruction
  @returns {Object} the highlight instruction (from NFLayoutInstructionDict)
  ###
  getHighlight: ->
    if @instruction.type is NFLayoutType.HIGHLIGHT
      return @instruction
    else if @prev?
      return @prev.getHighlight()
    else return throw new Error "Could not get highlight for instruction!"
