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
		code: ['no q just citation bar', 'no q just citation', 'no q', 'noq']
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

NFLayoutInstructionIgnore =
	display: "Ignore"
	type: NFLayoutType.INSTRUCTION
	behavior: NFLayoutBehavior.DO_NOTHING

NFLayoutInstructionNone =
	display: "No Instruction"
	type: NFLayoutType.INSTRUCTION
	behavior: NFLayoutBehavior.NONE

NFLayoutInstructionDict =
	greenStrikethroughHighlight:
		code: ['g strikethrough', 'gstrikethrough']
		look: "Green Strikethrough"
		display: "Green Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	yellowStrikethroughHighlight:
		code: ['y strikethrough', 'ystrikethrough']
		look: "Yellow Strikethrough"
		display: "Yellow Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	orangeStrikethroughHighlight:
		code: ['o strikethrough', 'ostrikethrough']
		look: "Orange Strikethrough"
		display: "Oran ge Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	blueStrikethroughHighlight:
		code: ['b strikethrough', 'bstrikethrough']
		look: "Blue Strikethrough"
		display: "Blue Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	pinkStrikethroughHighlight:
		code: ['i strikethrough', 'istrikethrough']
		look: "Pink Strikethrough"
		display: "Pink Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	purpleStrikethroughHighlight:
		code: ['u strikethrough', 'ustrikethrough']
		look: "Purple Strikethrough"
		display: "Purple Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	yellowUnderlineHighlight:
		code: ['yunderline', 'y underline']
		look: "Yellow Underline"
		display: "Yellow Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	greenUnderlineHighlight:
		code: ['gunderline', 'g underline']
		look: "Green Underline"
		display: "Green Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	blueUnderlineHighlight:
		code: ['bunderline', 'b underline']
		look: "Blue Underline"
		display: "Blue Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	orangeUnderlineHighlight:
		code: ['ounderline', 'o underline']
		look: "Orange Underline"
		display: "Orange Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	pinkUnderlineHighlight:
		code: ['iunderline', 'i underline']
		look: "Pink Underline"
		display: "Pink Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	purpleUnderlineHighlight:
		code: ['uunderline', 'u underline']
		look: "Purple Underline"
		display: "Purple Underline Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	blueDashedHighlight:
		code: ['bdashed', 'b dashed']
		look: "Blue Dashed"
		display: "Blue Dashed Highlight"
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
		code: ['b', 'bq', 'bh']
		look: "Blue"
		display: "Blue Highlight"
		type: NFLayoutType.HIGHLIGHT
	greyHighlight:
		code: ['r', 'rq']
		look: "Grey"
		display: "Grey Highlight"
		type: NFLayoutType.HIGHLIGHT
	blackHighlight:
		code: ['l', 'lq']
		look: "Black"
		display: "Black Highlight"
		type: NFLayoutType.HIGHLIGHT
	underlineHighlight:
		code: ['underline']
		look: "Underline"
		display: "Underline Highlight"
		type: NFLayoutType.HIGHLIGHT
	strikethroughHighlight:
		code: ['strikethrough']
		look: "Strikethrough"
		display: "Strikethrough Highlight"
		type: NFLayoutType.HIGHLIGHT
	blueUnderlineStrikethroughHighlight:
		code: ['b underline strikethrough', 'b strikethrough underline']
		look: "Blue Underline Strikethrough"
		display: "Blue Underline Strikethrough Highlight"
		priority: 0.5
		type: NFLayoutType.HIGHLIGHT
	underlineStrikethroughHighlight:
		code: ['underline strikethrough', 'strikethrough underline']
		look: "Underline Strikethrough"
		display: "Underline Strikethrough Highlight"
		priority: 1
		type: NFLayoutType.HIGHLIGHT
	brownHighlight:
		code: ['brown']
		look: "Brown"
		display: "Brown Highlight"
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
