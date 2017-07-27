// Declare constants


// Declare global variables
var currentVersion;
var latestVersion;

function installPseudoEffects()
{
	var presetEffectResult = installPresetEffect();
	switch (presetEffectResult)
	{
		// Error
		case 0:
			alert("Sorry, the Avocado Pseudo-Effects could not be installed in PresetEffects.xml\n" +
				  "You may need to change permissions on your After Effects application folder, or run After Effects as an Administrator.");
			break;

		// First Install
		case 1:
			alert("Avocado Pseudo-Effects installed (v" + latestVersion.toString() + ")!\n" +
				  "To use scripts dependent on them, you must restart After Effects\n" +
				  "(You do not need to run as Administrator anymore)");
			break;

		// No need to install - Already on latest verions
		case 2:
			alert("Latest version of Avocado Pseudo-Effects already installed (v" + latestVersion.toString() + ")!\n" +
				  "To use scripts dependent on them, you must restart After Effects\n" +
				  "(You do not need to run as Administrator anymore)");
			break;

		// Installed latest version
		case 3:
			alert("Avocado Pseudo-Effects upgraded (v" + currentVersion.toString() + " --> " + latestVersion.toString() + ")!\n" +
				  "To use scripts dependent on them, you must restart After Effects\n" +
				  "(You do not need to run as Administrator anymore)");
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
		currentVersion = getPseudoEffectVersion(presetEffectFileText);
		latestVersion = latestPseudoEffects[0];

		if (currentVersion >= latestVersion) {
			return 2;
		}
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
	// Return 3 if its an upgrade, 1 if its the first install
	if (avocadoBlockFound) {
		return 3;
	} else {
		return 1;
	}
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

installPseudoEffects();