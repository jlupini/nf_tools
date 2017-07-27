

function installLayerRepeater()
{
	var presetEffectResult = installPresetEffect();
	switch (presetEffectResult)
	{
		case 0:
			alert("Sorry, the Layer Repeater could not be installed in PresetEffects.xml\nYou may need to run After Effects as Administrator.\nYou will only need to do this the first time you run this script.");
			break;
		case 1:
			alert("Layer Repeater Installed!\nTo use it, you must restart After Effects and run this script again.\n(You do not need to run as Administrator anymore)");
			break;
		case 2:
			alert("Layer Repeater Already Installed!\nTo use it, you must restart After Effects and run this script again.\n(You do not need to run as Administrator anymore)");
			break;
	}
}

function searchText(regex, text)
{
	var searcher = new RegExp(regex, "i")
	return searcher.exec(text);
}

function replaceText(totalString, regex, replaceString)
{
	var searcher= new RegExp(regex,"g");
	return newString = totalString.replace(searcher, replaceString);
}

// we want this check to fail silently, since it will run before the gui is displayed in order to decide if the gui should show the "install" button or the Layer Repeater controls
// any errors that occur will be displayed to the user once they hit the "Install" button
function checkPresetEffect()
{
	var os = $.os;
	var presetEffectFilePath;
	var regexWin = "win";
	var regexMac = "mac";
	if (searchText("win", os) != null)
    {
         var appFolder = new Folder(Folder.appPackage.parent.absoluteURI).toString();        
		presetEffectFilePath = (appFolder + "\\Support Files\\PresetEffects.xml");
     }
	else if (searchText("mac", os) != null)
    {
         var appFolder = new Folder(Folder.appPackage.absoluteURI).toString();
		presetEffectFilePath = (appFolder + "/Contents/Resources/PresetEffects.xml");
        }
	else
	{
		//alert("Sorry, your operating system is not supported");
		return false;
	}

	var presetEffectFile = new File(presetEffectFilePath);
	var openCheck = presetEffectFile.open("r");
	if (!openCheck)
		{
			//alert("Could not open "+presetEffectFilePath+"\nYou may need to run After Effects as Administrator.\nYou will only need to do this the first time you run this script.");
			return 0;
		}
	presetEffectFileText = presetEffectFile.read();
	if (presetEffectFileText == "")
	{
		//alert(presetEffectFilePath+" is empty. Sorry, Layer Repeater can not be installed/");
		return 0;
	}
	var layerRepeaterFound = searchText("AV_Highlighter", presetEffectFileText);
	if (layerRepeaterFound)
		return 2;
	else
		return 0;
}

function installPresetEffect()
{
	var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
	if (securitySetting != 1) {
		alert("This script requires the scripting security preference to be set.\n" +
			"Go to the \"General\" panel of your application preferences,\n" +
			"and make sure that \"Allow Scripts to Write Files and Access Network\" is checked.");
		return false;
	}

	// Grab the latest version of the pseudo effects
	var latestPseudoEffects = getLatestPseudoEffects();
	
	// Try to access the PresetEffects.xml file
	var os = $.os;
	var presetEffectFilePath;
	var regexWin = "win";
	var regexMac = "mac";
	if (searchText("win", os) != null)
    {
         var appFolder = new Folder(Folder.appPackage.parent.absoluteURI).toString();        
		presetEffectFilePath = (appFolder + "\\Support Files\\PresetEffects.xml");
     }
	else if (searchText("mac", os) != null)
    {
         var appFolder = new Folder(Folder.appPackage.absoluteURI).toString();
		presetEffectFilePath = (appFolder + "/Contents/Resources/PresetEffects.xml");
        }
	else
	{
		alert("Sorry, your operating system is not supported");
		return false;
	}

	// Open the PresetEffects.xml Files
	var presetEffectFile = new File(presetEffectFilePath);

	// Can we open it? Open with read permissions
	var openCheck = presetEffectFile.open("r");
	if (!openCheck) {return 0;}

	// Is it Empty?
	var presetEffectFileText = presetEffectFile.read();
	if (presetEffectFileText == "") {return 0;}

	// Look for the Avocado PE Block
	var avocadoBlockFound = searchText("BEGIN AVOCADO PSEUDO-EFFECTS", presetEffectFileText);
	if (avocadoBlockFound) {
		// Check the current version number
		//$.bp();
		var currentVersion = getPseudoEffectVersion(presetEffectFileText);
		var latestVersion = latestPseudoEffects[0];

		if (currentVersion >= latestVersion) {
			alert("up to date");
			//$.bp();
			return 2;
		}
		alert("not up to date");
	
	}

    // Either the current version is behind the latest, or we can't find the file
	// Try to close and reopen the file with write permissions.
	var closeCheck = presetEffectFile.close();
	if (!closeCheck) {return 0;}
	openCheck = presetEffectFile.open("w");
	if (!openCheck) {return 0;}

	var presetEffectText = latestPseudoEffects[1] + "\n</Effects>";

	// TODO WHEN I RETURN!!! - Right now it adds the latest pseudo effects After the existing ones! Need to erase the old block and plop in the new one
	// Append our new effect directly before the end Effects tag
	var newPresetEffectText = replaceText(presetEffectFileText, "</Effects>", presetEffectText);
	var writeCheck = presetEffectFile.write(newPresetEffectText);
	if (!writeCheck) {return 0;}
	closeCheck = presetEffectFile.close();
	if (!closeCheck) {return 0;}

	// Script has installed. Return and let the user know that After Effects must be restarted now
	return 1;
}

// Returns an array with the version number and content for the latest pseudo effects
function getLatestPseudoEffects() {

	// Get the Pseudo-Effects.xml folder from the same directory as this script file.
    var parentFolder = (new File($.fileName)).parent;
	var pseudoEffectSourceFilePath = (parentFolder.toString() + "/Pseudo-Effects.xml");
	var pseudoEffectSourceFile = new File(pseudoEffectSourceFilePath);

	// Can we open it? Open with read permissions
	var openCheck = pseudoEffectSourceFile.open("r");
	if (!openCheck) {
		alert("Could not open " + pseudoEffectSourceFilePath + " - Check for missing file");
	}

	// Is the file empty?
	pseudoEffectSourceFileText = pseudoEffectSourceFile.read();
	if (pseudoEffectSourceFileText == "") {
		alert("Uh oh... " + pseudoEffectSourceFilePath + " is empty.");
	}

	// Figure out the current version
	var versionNumber = getPseudoEffectVersion(pseudoEffectSourceFileText);

	return [versionNumber, pseudoEffectSourceFileText];
}

// Returns the version from text passed in
function getPseudoEffectVersion(stringToSearch) {

	var versionFlag = "AV-PE-Version";
	var versionSearch = searchText(versionFlag, stringToSearch);
	var versionStartIndex = versionSearch.index + versionFlag.length + 2;
	var versionString = stringToSearch.slice(versionStartIndex).split("\"")[0];
	var versionNumber = parseFloat(versionString);
	return versionNumber;
}

function doStuff() {
	installLayerRepeater();
	// var makePresetEffectCheck = checkPresetEffect();
	// switch(makePresetEffectCheck)
	// {
	// 	// 0: Layer Repeater not installed, 2: Already install, let's repeat some layers!
	// 	// There is no case 1, because checkPresetEffect code matches installPresetEffect, and installPresetEffect returns 1 as soon as the preset effect has been installed
	// 	// Returning 1 makes no sense when we are just checking to see if the preset effect is already installed, not actually installing it
	// 	case 0:
	// 		installLayerRepeater();
	// 		break;
	// 	case 2: 
	// 		alert("Already Installed");
	// 		break;
	// }
}

doStuff();