app.NF ?= {}
app.NF.Util ?= {}

write "Loading NF Libraries..."

eval '#include "../lib/extendscript.prototypes.js"'
eval '#include "../lib/json3.js"'
eval '#include "../lib/aequery.js"'
eval '#include "easingEquations.jsx"'
eval '#include "utilFunctions.jsx"'
eval '#include "objectModel.jsx"'
eval '#include "extensions.jsx"'
eval '#include "layoutDictionary.jsx"'
eval '#include "NFProject.jsx"'
eval '#include "NFTools.jsx"'
eval '#include "NFPDFManager.jsx"'
eval '#include "Rect.jsx"'


write "Done!"
writeLn ""
