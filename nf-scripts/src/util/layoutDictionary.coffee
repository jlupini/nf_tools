NFLayoutType =
	HIGHLIGHT: 100
	INSTRUCTION: 200
	FLAG: 300

NFLayoutInstruction =
	DO_NOTHING: 101
	SHOW_TITLE: 102
	ICON_SEQUENCE: 103
	GAUSSY: 104
	FIGURE: 105
	TABLE: 106

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
	greenUnderlineHighlight:
		code: ['gunderline']
		look: "Green Underline"
		display: "Green Underline Highlight"
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
	greyHighlight:
		code: ['r']
		look: "Grey"
		display: "Grey Highlight"
		type: NFLayoutType.HIGHLIGHT

	doNothing:
		code: ['do nothing', 'nothing']
		priority: 4
		display: "Do Nothing"
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.DO_NOTHING
	showTitle:
		code: ['title', 'show title', 'clear']
		display: "Show title"
		type: NFLayoutType.INSTRUCTION
		priority: 1
		instruction: NFLayoutInstruction.SHOW_TITLE
	iconSequence:
		code: ['icons', 'icon sequence']
		display: "Icon Sequence Placeholder"
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.ICON_SEQUENCE
	gaussy:
		code: ['gaussy', 'blur']
		display: "Gaussy Placeholder"
		priority: 3
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.GAUSSY
	figure:
		code: ['figure', 'fig', 'graph', 'chart', 'f']
		display: "Figure Placeholder"
		priority: 2
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.FIGURE
	table:
		code: ['table', 'tab', 't']
		display: "Table Placeholder"
		priority: 2
		type: NFLayoutType.INSTRUCTION
		instruction: NFLayoutInstruction.TABLE
