# Instructions for Scripts

### What's New

- **September 28, 2017** - Big updates to PageInit and SetupHighlightLayer, and includes a Pseudo Effect update, so don't forget to restart AE after the update notification. *Important*: There's a new script called `nf_startup.jsx`. An alias to that script needs to go in your scripts startup folder, and should replace `InstallPseudoEffects` which is probably already in there. Restart AE if it's open while you make that change. PageInit now prompts for which highlights and guide layers you want to bubble up. It can be run again later with already initialized layers selected to disconnect them. SetupHighlightLayer now supports splitting highlights into multiple parts! Run it on an already created highlight layer and it will add a "Splitter" point effect to the layer. Position that point at your chosen split point then run it again to split the layers. If a layer you're splitting is bubbled up, you'll see a warning with an option to cancel, or continue with the split and disconnect the layer in the process. This can also be used to fix expression errors by simply letting you quickly disconnect properties on a highlight layer.

- **August 7, 2017** - Added a new script called GoToHighlight, which lets you automatically keyframe the movement of a page or its parent null to a given highlight. Run the script with a page layer selected, then pick options and click the button for the highlight you want to move to.

- **August 3, 2017** - Huge update to CreateSpotlightLayer. It now allows you to automatically create spotlights for highlights in the selected comp, and natively supports many different spotlight masks at once. In other words, no more keyframing mask paths! New version is **not** back-compatible with older spotlight layers. Can be used fine in the same project, but you shouldn't run it on anything that already has a spotlight layer (unless you're cool re-doing it with this slick new version). Updates Pseudo-Effects to version 0.71, so don't forget to restart After Effects after installing.

### Installation

AE will only recognize scripts in the `Scripts` directory in its application folder. To easily allow updating, we recommend using symlinks or aliases to the files in this repo. That way you can have the repo somewhere else on your drive, and when you update you don't have to copy over any scripts that changed. If the previous sentence sounds like nonsense to you, _ask for help_ since this step can be a little tricky.

**IMPORTANT:** Scripts now require up-to-date pseudo effects and the Before-Effects library. If you add an alias to the `nf_startup.jsx` script in your `Scripts > Startup` folder, pseudo effects will be automatically updated whenever you open AE. See the notes for `Startup` for more details.

### Current Droplets

- **IconPrep** - Run this app and select the folder with your Noun Projet SVGs - sit back and watch it run (don't interfere with what's going on). It'll remove the author credit and convert each SVG to an AI file so After Effects can read it.

- **IsolateAnnotations** - _You will need Adobe Acrobat installed for this app to work._ After you've pulled all the PDF pages into the `PDF Pages` folder, but before you import them to AE, run this script and select all the PDF pages when prompted. Once more, sit back and let it run. It will duplicate each PDF page, then use Acrobat to create a version with only the annotations. Import _all files (including the new ones that end in `annot.pdf`) in the `PDF Pages` folder into the corresponding folder in AE and, with them _all_ selected, run the `Precompose PDF Pages` script. This extra step is to create a guide layer for you to show the PDF highlights in AE so you can easily find quotes and boxes.

### Current Scripts

- **GoToHighlight** - Lets you automatically keyframe the movement of a page or its parent null to a given highlight. Run the script with a page layer selected, then pick options and click the button for the highlight you want to move to. A page turn effect is applied if you target a layer below the active page.

- **Startup** - Put an alias to this script in the `Startup` folder inside your AE `Scripts` Folder. Whenever you open After Effects, the script will automatically run any required scripts. Right now that means importing a library we use called `Before-Effects` and running the `InstallPseudoEffects` script.

- **InstallPseudoEffects** - Whenever you open After Effects, the script will run (via the `Startup` script) and check to see if you have the latest versions of the pseudo-effects contained in `Pseudo-Effects.xml`. This script replaces the previous method of manually copying and pasting the pseudo effect code into the AE application package. If you install the script with AE already open, quit and reopen it so the script can run (or run it from the scripts menu, then restart). If the script runs silently, you were already running the latest versions. If an install or upgrade is made, you'll see an alert telling you to restart AE. Note for scripting: Do not change the comment flags in `Pseudo-Effects.xml`, except to increment the version number.

- **Create Comp from Audio** - With an audio file selected in the project panel, run the script. It will create a comp with the same duration as, and containing, the audio file.

- **Separate Audio by Markers** - Add markers to your audio layer where you want the divisions of parts to be, then run this script with the audio layer selected. A new folder called ‘Parts’ will be created, with the new part pre comps. These will be added to the timeline above the audio track, with their own audio muted to avoid doubling up. A zoomer will also be created for each layer.

- **Nullify** - Create a null parent for the selected layers.

- **Setup Highlight Layer** - Run on a PDF layer to create a new shape layer. Then click the pen tool and add a single line, across the first line you’ll want to highlight. With your shape layer selected, run this script again. You’ll be asked to enter the number of highlight lines. Use the effect controls to adjust highlight color, thickness and spacing, as well as trim end percentages. To create a new highlight layer, run this script on the PDF layer again to create another shape layer. Run it on an already created highlight layer and it will add a "Splitter" point effect to the layer. Position that point at your chosen split point then run it again to split the layers. If a layer you're splitting is bubbled up, you'll see a warning with an option to cancel, or continue with the split and disconnect the layer in the process. This can also be used to fix expression errors by simply letting you quickly disconnect properties on a highlight layer.

- **Precompose PDF Pages** - Select all the PDF pages you want to precompose in the project panel, and run this script. It will precompose all selected assets, and put them in a new folder with the paper background layer. Your project must contain the root folder ‘Assets’ and a composition called ‘Paper BG’ for this script to work. If guide layers for each page are selected as well, the new comps will contain that guide layer, with a checkbox toggle for its opacity. Use the checkbox instead of the layer's visibility to show or hide it, since the visibility control is used in PageInit as well.

- **Create Spotlight Layer** - Adds a spotlight layer (if none already exists) for the selected page, and allows you to either convert highlights on the page, or a custom-drawn mask on the layer, to a spotlight mask. The first time this script is run, it will generate a Spotlight layer which is actually creating the visible effect. For each spotlight mask you have on a page, the script will create a Span layer above the main Spotlight layer. The Span layer indicates the in and out points of that particular spotlight mask. If you need to make adjustments to the mask path itself, perform those adjustments to the mask on the Span layer. Main Spotlight layer needs to be active for the spotlight mask in a Span to work. Controls for opacity, duration of fadeIn/fadeOut and feather are on the relevant Span layer. If multiple Span layers overlap, try to make sure they have *more overlap than the duration setting* or you'll see an opacity jump halfway through the overlap area.

- **Citation Overlay** - Adds a citation in the top right hand corner of the comp. To use, first select a page layer, then apply the script. In and out points will be represented by markers on the page layer's null parent. Note 1: additional markers on this layer will affect in/out fading. Note 2: ensure that there are no other layers that share a name with the null parent.

- **Bubble Up Highlights** - Run this with a pdf precomp selected to bubble highlight controls up into the parent. Note: Bubbled up controls can only be changed from the top level, so you can't change highlight parameters from within the pdf precomp anymore - all the highlight controls are effectively moved to the pdf precomp layer in the parent comp (`Part 1`, `Part 2`, etc).

- **PageInit** - Parents and resizes PDF Precomps. Select all page pre comps from a single paper and run the script. Adds a drop shadow to the bottom page (with the assumption that the page turn preset will add it to any pages above). Bubbles up the selected controls (highlight and guide layer checkbox) from the child highlights to the parent layer. Note: Bubbled up controls can only be changed from the top level, so you can't change highlight parameters from within the pdf precomp anymore - all the highlight controls are effectively moved to the pdf precomp layer in the parent comp (`Part 1`, `Part 2`, etc). Run the script again with already initialized pages selected to disconnect chosen controls.

- **Emphasizer** - Creates emphasis effects Scribble (Chunky Highlight), PenLine (Circle/Underline), and Cylon. Run the script with the target layer selected (or selection if no target) to create the shape layer, then draw with the pen tool to setup the line for your shape. Will only act on the most recently created shape within a shape layer. 

- **Gaussy** - Adds a gaussian blur effect. Instructions: run nf_gaussy.jsx above the layers you want to blur. It will create a new adjustment layer with in and out points represented by markers that control the blur effect. Note: Gaussy only works on layers with unique names. So if you name a layer 'XYZ', apply Gaussy, and then duplicate layer XYZ, the effect will only apply to the upmost layer called 'XYZ'.

- **Setup Main Comp** - Creates sub-comps with zoomers based off your audio marker data, a vignette effect, a background, and a fade in/out at the head and tail of the main comp. To use, select your main audio track, and run `nf_SetupMainComp.jsx`.


### Resources for Scripting:

- [AE Enhancers docs](http://docs.aenhancers.com/) - This is the best reference once you've figured out the basics

- [Refinery Fundamentals](http://www.redefinery.com/ae/fundamentals/)

- [Extendscript training series](http://www.provideocoalition.com/after-effects-extendscript-training-complete-series/)

- [Full Adobe Scripting Guide](http://blogs.adobe.com/wp-content/blogs.dir/48/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf?file=2012/06/After-Effects-CS6-Scripting-Guide.pdf)
