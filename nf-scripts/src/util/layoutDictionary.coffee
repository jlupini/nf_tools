NFLayoutType =
	HIGHLIGHT: 100
	INSTRUCTION: 200
	FLAG: 300

NFLayoutInstruction =
	DO_NOTHING: 101
	SHOW_TITLE: 102
	ICON_SEQUENCE: 103

NFLayoutFlagDict =
	skipTitle:
		code: ['no q', 'noq', 'no q just citation', 'no q just citation bar']
		display: "Skip Paper Title Page"

NFLayoutInstructionDict =
	yellowUnderlineHighlight:
		code: ['yunderline']
		look: "Yellow Underline"
		display: "Yellow Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	greenHighlight:
		code: ['g']
		look: "Green"
		display: "Green Highlight"
		type: NFLayoutType.HIGHLIGHT
	orangeHighlight:
		code: ['o']
		look: "Orange"
		display: "Orange Highlight"
		type: NFLayoutType.HIGHLIGHT
	yellowHighlight:
		code: ['y']
		look: "Yellow"
		display: "Yellow Highlight"
		type: NFLayoutType.HIGHLIGHT
	pinkHighlight:
		code: ['i']
		look: "Pink"
		display: "Pink Highlight"
		type: NFLayoutType.HIGHLIGHT
	purpleHighlight:
		code: ['u']
		look: "Purple"
		display: "Purple Highlight"
		type: NFLayoutType.HIGHLIGHT
	blueHighlight:
		code: ['b']
		look: "Blue"
		display: "Blue Highlight"
		type: NFLayoutType.HIGHLIGHT

	doNothing:
		code: ['do nothing', 'nothing']
		display: "Do Nothing"
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.DO_NOTHING
	showTitle:
		code: ['title', 'show title', 'clear']
		display: "Show title"
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.SHOW_TITLE
	iconSequence:
		code: ['icons', 'icon sequence']
		display: "Icon Sequence Placeholder"
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.ICON_SEQUENCE
