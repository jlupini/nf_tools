NFLayoutType =
	HIGHLIGHT: 100
	EXPAND: 150
	INSTRUCTION: 200
	FLAG: 300

NFLayoutBehavior =
	NONE: 88
	UNRECOGNIZED: 99
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
	expandUp:
		code: ['up']
		display: "Expand Up"
	expand:
		code: ['expand']
		display: "Expand"

NFLayoutInstructionNotFound =
	display: "Unrecognized"
	type: NFLayoutType.INSTRUCTION
	behavior: NFLayoutBehavior.UNRECOGNIZED

NFLayoutInstructionExpand =
	display: "Expand"
	type: NFLayoutType.EXPAND

NFLayoutInstructionNone =
	display: "No Instruction"
	type: NFLayoutType.INSTRUCTION
	behavior: NFLayoutBehavior.NONE

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
		code: ['g', 'gq']
		look: "Green"
		display: "Green Highlight"
		type: NFLayoutType.HIGHLIGHT
	orangeHighlight:
		code: ['o', 'oq']
		look: "Orange"
		display: "Orange Highlight"
		type: NFLayoutType.HIGHLIGHT
	yellowHighlight:
		code: ['y', 'yq']
		look: "Yellow"
		display: "Yellow Highlight"
		type: NFLayoutType.HIGHLIGHT
	pinkHighlight:
		code: ['i', 'iq']
		look: "Pink"
		display: "Pink Highlight"
		type: NFLayoutType.HIGHLIGHT
	purpleHighlight:
		code: ['u', 'uq']
		look: "Purple"
		display: "Purple Highlight"
		type: NFLayoutType.HIGHLIGHT
	blueHighlight:
		code: ['b', 'bq']
		look: "Blue"
		display: "Blue Highlight"
		type: NFLayoutType.HIGHLIGHT
	greyHighlight:
		code: ['r', 'rq']
		look: "Grey"
		display: "Grey Highlight"
		type: NFLayoutType.HIGHLIGHT

	doNothing:
		code: ['do nothing', 'nothing']
		priority: 4
		display: "Do Nothing"
		type: NFLayoutType.INSTRUCTION
		behavior: NFLayoutBehavior.DO_NOTHING
	showTitle:
		code: ['title', 'show title', 'clear']
		display: "Show title"
		type: NFLayoutType.INSTRUCTION
		priority: 1
		behavior: NFLayoutBehavior.SHOW_TITLE
	iconSequence:
		code: ['icons', 'icon sequence', 'animation', 'icon']
		display: "Icon Sequence Placeholder"
		type: NFLayoutType.INSTRUCTION
		behavior: NFLayoutBehavior.ICON_SEQUENCE
	gaussy:
		code: ['gaussy', 'blur']
		display: "Gaussy Placeholder"
		priority: 3
		type: NFLayoutType.INSTRUCTION
		behavior: NFLayoutBehavior.GAUSSY
	figure:
		code: ['figure', 'fig', 'graph', 'chart', 'f']
		regex: /(^f\d+)/i
		display: "Figure Placeholder"
		priority: 2
		type: NFLayoutType.INSTRUCTION
		behavior: NFLayoutBehavior.FIGURE
	table:
		code: ['table', 'tab', 't']
		regex: /(^t\d+)/i
		display: "Table Placeholder"
		priority: 2
		type: NFLayoutType.INSTRUCTION
		behavior: NFLayoutBehavior.TABLE
