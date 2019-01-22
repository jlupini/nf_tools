// Declare constants
var avocadoBlockStart = "<!-- BEGIN AVOCADO PSEUDO-EFFECTS -->";
var avocadoBlockEnd   = "<!-- END AVOCADO PSEUDO-EFFECTS -->";
var versionFlag       = "AV-PE-Version";

// Declare global variables
var currentVersion;
var latestVersion;

function installPseudoEffects() {
	var presetEffectResult = installPresetEffect();
	switch (presetEffectResult) {
		// Error
		case 0:
			alert("Sorry, the Avocado Pseudo-Effects could not be installed in PresetEffects.xml\n" +
				  "You may need to change permissions on the After Effects project folder, specifically the PresetEffects.xml file, or run After Effects as an Administrator.");
			break;

		// First Install
		case 1:
			alert("Avocado Pseudo-Effects installed (v" + latestVersion.toString() + ")!\n" +
				  "To use scripts dependent on them, you must restart After Effects\n" +
				  "(You do not need to run as Administrator anymore)");
			break;

		// No need to install - Already on latest verions
		// FIXME - Only show this when script is run manually
		case 2:
			// alert("Latest version of Avocado Pseudo-Effects already installed (v" + latestVersion.toString() + ")!\n" +
			// 	  "To use scripts dependent on them, you must restart After Effects\n" +
			// 	  "(You do not need to run as Administrator anymore)");
			break;

		// Installed latest version
		case 3:
			alert("Avocado Pseudo-Effects upgraded (v" + currentVersion.toString() + " --> " + latestVersion.toString() + ")!\n" +
				  "To use scripts dependent on them, you must restart After Effects\n" +
				  "(You do not need to run as Administrator anymore)");
			break;
	}
}

function searchText(regex, text) {
	var searcher = new RegExp(regex, "i");
	return searcher.exec(text);
}

function replaceBetween(sourceString, startIndex, endIndex, injectionString) {
    return sourceString.substring(0, startIndex) + injectionString + sourceString.substring(endIndex);
}

function injectString(sourceString, injectionString, index) {
	return sourceString.slice(0, index) + injectionString + sourceString.slice(index);
}

function installPresetEffect() {
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
	var appVersion = parseFloat(app.version.substr(0, app.version.indexOf('x')));
	var presetEffectFilePath;
	var regexWin = "win";
	var regexMac = "mac";
	if (searchText("win", os) != null) {
		if (appVersion >= 16.0) {
			alert("Sorry, CC 2019 on Windows is not yet supported");
			return false;
		}
    var appFolder = new Folder(Folder.appPackage.parent.absoluteURI).toString();
		presetEffectFilePath = (appFolder + "\\Support Files\\PresetEffects.xml");
  } else if (searchText("mac", os) != null) {
    var appFolder = new Folder(Folder.appPackage.absoluteURI).toString();
		if (appVersion >= 16.0) {
			presetEffectFilePath = (appFolder + "/Contents/Frameworks/aelib.framework/Versions/A/Resources/xml/PresetEffects.xml");
		} else {
			presetEffectFilePath = (appFolder + "/Contents/Resources/PresetEffects.xml");
		}
  } else {
		alert("Sorry, your operating system is not supported");
		return false;
	}

	// Open the PresetEffects.xml Files
	var presetEffectFile = new File(presetEffectFilePath);

	// Can we open it? Open with read permissions
	var openCheck = presetEffectFile.open("r");
	if (!openCheck) {
		alert("Error opening PresetEffects.xml at '" + presetEffectFilePath + "'");
		return 0;
	}

	// Is it Empty?
	var presetEffectFileText = presetEffectFile.read();
	if (presetEffectFileText == "") {return 0;}

	// Look for the Avocado PE Block
	// FIXME: The variable avHighlighterSearch and the else block of this if statement is
	//        for the sole purpose of upgrading everyone cleanly from the old, unversioned
	//        pseudo-effects to these new versioned ones. Do a cleanup later plz
	var avocadoStartSearch = searchText(avocadoBlockStart, presetEffectFileText);
	var avHighlighterSearch;
	if (avocadoStartSearch) {
		// Check the current version number and finish up if we don't need to upgrade
		currentVersion = getPseudoEffectVersion(presetEffectFileText);
		latestVersion = latestPseudoEffects[0];
		if (currentVersion >= latestVersion) {return 2;}
	} else {
		avHighlighterSearch = searchText("<Effect matchname=\"AV_Highlighter\"", presetEffectFileText);
		currentVersion = 0;
		latestVersion = latestPseudoEffects[0];
	}

    // Either the current version is behind the latest, or we can't find the file
	// Try to close and reopen the file with write permissions.
	var closeCheck = presetEffectFile.close();
	if (!closeCheck) {return 0;}
	openCheck = presetEffectFile.open("w");
	if (!openCheck) {
		alert("Error. I need permission to write to: '" + presetEffectFilePath + "'\n Change permissions and try again.");
		return 0;
	}

	// Get the new Preset Effect Text for either an upgrade or fresh install
	var newPresetEffectText;
	// If we've already got the avo block in there, it's an upgrade
	if (avocadoStartSearch) {
		// Search for and replace the avo block in the existing PresetEffects with the new avoBlock
		avocadoEndSearch = searchText(avocadoBlockEnd, presetEffectFileText);
		newPresetEffectText = replaceBetween(presetEffectFileText, avocadoStartSearch.index, avocadoEndSearch.index + avocadoBlockEnd.length, latestPseudoEffects[1]);
	} else if (avHighlighterSearch) {
		// FIXME: This peice of the if statement can also be deleted once we're all upgraded
		// We need to delete the effect block for the old AV Highlighter
		var endSearchIndex = presetEffectFileText.indexOf("</Effect>", avHighlighterSearch.index) + "</Effect>".length;
		var cleanedPresetEffectText = replaceBetween(presetEffectFileText, avHighlighterSearch.index, endSearchIndex, "");
		var injectionPointIndex = presetEffectFileText.indexOf("</Effects>");
		newPresetEffectText = injectString(presetEffectFileText, latestPseudoEffects[1] + "\n", injectionPointIndex);
	} else {
		// Not an upgrade
		// Append our new effect directly before the end Effects tag
		var injectionPointIndex = presetEffectFileText.indexOf("</Effects>");
		newPresetEffectText = injectString(presetEffectFileText, latestPseudoEffects[1] + "\n", injectionPointIndex);
	}

	// Try writing the new PresetEffect Text to the file
	var writeCheck = presetEffectFile.write(newPresetEffectText);
	if (!writeCheck) {return 0;}
	closeCheck = presetEffectFile.close();
	if (!closeCheck) {return 0;}

	// Script has installed. Return and let the user know that After Effects must be restarted now
	// Return 3 if its an upgrade, 1 if its the first install
	// FIXME: kill the or avHighlighter bit after we're all upgraded
	if (avocadoStartSearch || avHighlighterSearch) {
		return 3;
	} else {
		return 1;
	}
}

// Returns an array with the version number and content for the latest pseudo effects
function getLatestPseudoEffects() {

	// Get the Pseudo-Effects.xml folder from the same directory as this script file.
    var parentFolder = (new File($.fileName)).parent;
	var pseudoEffectSourceFilePath = (parentFolder.toString() + "/../lib/Pseudo-Effects.xml");
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

	var versionSearch = searchText(versionFlag, stringToSearch);
	if (versionSearch == null) {return 0}

	var versionStartIndex = versionSearch.index + versionFlag.length + 2;
	var versionString = stringToSearch.slice(versionStartIndex).split("\"")[0];
	var versionNumber = parseFloat(versionString);
	return versionNumber;
}

installPseudoEffects();
