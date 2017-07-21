# Instructions for Scripts

### Installation

AE will only recognize scripts in the `Scripts` directory in its application folder. To easily allow updating, we recommend using symlinks or aliases to the files in this repo. That way you can have the repo somewhere else on your drive, and when you update you don't have to copy over any scripts that changed. If the previous sentence sounds like nonsense to you, _ask for help_ since this step can be a little tricky.

**IMPORTANT:** Scripts now require up-to-date pseudo effects. To install these, you need to add the xml tags in the **`Pseudo-Effects.xml`** file to a file After Effects uses called **`PresetEffects.xml`**. This file can be found _inside_ the After Effects app file. Right click the .app and click “Show Package Contents”. In the window that opens, navigate to Contents > Resources and open PresetEffects.xml in a text editor (We like Sublime Text 3, which is a free download). You’ll see a large number of Effects, each one beginning with `<Effect matchname…` and ending a few lines later with `</Effect>`. Copy and paste the contents of the Pseudo-Effects.xml file in this folder after the `<Effects>` tag on or around line 106, making sure to _replace previous versions of the relevant pseudo effects_ if you’re updating to a new version.

### Current Droplets

- **IconPrep** - Run this app and select the folder with your Noun Projet SVGs - sit back and watch it run (don't interfere with what's going on). It'll remove the author credit and convert each SVG to an AI file so After Effects can read it.

- **IsolateAnnotations** - _You will need Adobe Acrobat installed for this app to work._ After you've pulled all the PDF pages into the `PDF Pages` folder, but before you import them to AE, run this script and select all the PDF pages when prompted. Once more, sit back and let it run. It will duplicate each PDF page, then use Acrobat to create a version with only the annotations. Import _all files (including the new ones that end in `annot.pdf`) in the `PDF Pages` folder into the corresponding folder in AE and, with them _all_ selected, run the `Precompose PDF Pages` script. This extra step is to create a guide layer for you to show the PDF highlights in AE so you can easily find quotes and boxes.

### Current Scripts

- **Create Comp from Audio** - With an audio file selected in the project panel, run the script. It will create a comp with the same duration as, and containing, the audio file.

- **Separate Audio by Markers** - Add markers to your audio layer where you want the divisions of parts to be, then run this script with the audio layer selected. A new folder called ‘Parts’ will be created, with the new part pre comps. These will be added to the timeline above the audio track, with their own audio muted to avoid doubling up. A zoomer will also be created for each layer.

- **Nullify** - Create a null parent for the selected layers.

- **Setup Highlight Layer** - Create a new shape layer, then click the pen tool and add a single line, across the first line you’ll want to highlight. With your shape layer selected, run this script. You’ll be asked to enter the number of highlight lines. Use the effect controls to adjust highlight color, thickness and spacing, as well as trim end percentages.

- **Precompose PDF Pages** - Select all the PDF pages you want to precompose in the project panel, and run this script. It will precompose all selected assets, and put them in a new folder with the paper background layer. Your project must contain the root folder ‘Assets’ and a composition called ‘Paper BG’ for this script to work.

- **Create Spotlight Layer** - Draw a mask on the target layer, around the quote you want to spotlight (the last mask to have been created will be used). Then run this script, and a spotlight layer will be created above the target layer, with the same dimensions and position (and the target layer as its parent). In and out points are automatically set as markers, drag them to the appropriate positions. If you want to bring in/out the spotlight multiple times, just add more markers (every odd marker is an in point, every even marker is an out point). Effect controls will be created on the target layer for maximum Opacity and minimum Feather. The spotlight path is derived from the spotlight mask on the target layer, so you shouldn’t need to touch the spotlight layer itself (besides trimming it to reduce needless rendering).

- **Citation Overlay** - Adds a citation in the top right hand corner of the comp. Set the in/out points using the markers.

- **Bubble Up Highlights** - Run this with a pdf precomp selected to bubble highlight controls up into the parent.

- **PageInit** - Parents and resizes PDF Precomps. Select all page pre comps from a single paper and run the script. Adds a drop shadow to the bottom page (with the assumption that the page turn preset will add it to any pages above). Bubbles up controls from the child highlights to the parent layer.

- **Emphasizer** - Creates highlights, underlines, and circles. Create a new shape layer and draw a path in the shape you would like to emphasize, then run the script. Will only act on the most recently created shape within a shape layer. 

### Resources for Scripting:

- [AE Enhancers docs](http://docs.aenhancers.com/) - This is the best reference once you've figured out the basics

- [Refinery Fundamentals](http://www.redefinery.com/ae/fundamentals/)

- [Extendscript training series](http://www.provideocoalition.com/after-effects-extendscript-training-complete-series/)

- [Full Adobe Scripting Guide](http://blogs.adobe.com/wp-content/blogs.dir/48/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf?file=2012/06/After-Effects-CS6-Scripting-Guide.pdf)