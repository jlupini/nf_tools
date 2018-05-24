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
	blueHighlight:
		code: ['b']
		look: "Blue"
		display: "Blue Highlight"
		type: NFLayoutType.HIGHLIGHT

	doNothing:
		code: ['do nothing', 'nothing']
		display: "Do Nothing"
		type: NFLayoutType.INSTRUCTION
	iconSequence:
		code: ['icons', 'icon sequence']
		display: "Icon Sequence Placeholder"
		type: NFLayoutType.INSTRUCTION

NFLayoutType =
	HIGHLIGHT: 100
	INSTRUCTION: 200
	FLAG: 300
