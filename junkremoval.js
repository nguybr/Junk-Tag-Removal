	/*
	Returns a list of either the list of HTML junk code elements or booleans
	indicated whether a checkbox is checked.  In either case, the returned list
	contains information from the same order of form inputs.

	@param formId The id of the form from which to obtain all elements.
	@param cond If true, return a list of elements to remove.  Otherwise,
		     return booleans indicated checkbox status.
		
	@return A list containing 
	*/
	function getCollection(formId, cond) {
		var formElements = document.getElementById('form').elements;
		var formParts = [];
		if (cond) { 			// If true, means to get element names
			var i;
			for (i = 0; i < formElements.length; i++) {
			formParts[i] = formElements[i].value;
			}
		}
		else {				// If false, means to get whether each element is checked or not
			var i;
			for (i = 0; i < formElements.length; i++) {
			formParts[i] = formElements[i].checked;
			}
		}
		return formParts;
	}

	/* 
	Selects all checkboxes.
	*/
	<!-- Checks all boxes -->
	function checkMark() {
		var elements = document.getElementById('form').elements;
		var i;
		var bool = true;
		if (elements[0].checked) {
			bool = false;
		}

		for (i = 0; i < elements.length; i++) {
			elements[i].checked = bool;
		}
	}


	/*
	Searches for all instances of a user-inputted attribute and removes them.

	@param attributeName The name of the attribute to be removed.
	@param stringToClean The source that should be searched for instances of attributeName.

	@return A version of stringToClean without any instances of attributeName.
	*/
	function cleanAttribute(attributeName, stringToClean) {
		var newString = stringToClean;
		while (newString.indexOf(attributeName) > -1) {
			var indexStyle = newString.indexOf(attributeName);
			var indexQuote = (attributeName.length + 1) + indexStyle + newString.substring(indexStyle + 8).indexOf('"');
			var unwantedString = newString.substring(indexStyle, indexQuote + 1);
			newString = newString.replace(unwantedString, '');
		}
			return newString;
	}

	/*
	Searches for all instances of a user-inputted tag and removes them.

	@param tagName The name of the tag to be removed.
	@param replacement What to replace tagName with.
	@param stringToClean The source that should be searched for instances of tagName.

	@return A version of stringToClean without any instances of tagName.
	*/
	function cleanTag(tagName, replacement, stringToClean) {
		var newString = stringToClean;
		while (newString.indexOf(tagName) > -1) {
			var indexStyle = newString.indexOf(tagName);
			var indexGreater = indexStyle + newString.substring(indexStyle).indexOf('>');
			var unwantedString = newString.substring(indexStyle, indexGreater + 1);
			newString = newString.replace(unwantedString, replacement);

			var endTag = tagName.charAt(0) + '/' + tagName.substring(1);
			if (tagName.charAt(tagName.length-1) !== '>') {
				endTag = endTag + '>';
			}
			var replaceEnd = '';
			if (replacement.length > 0) {
				replaceEnd = replacement.charAt(0) + '/' + replacement.substring(1);
			}
			var deletedRegex = new RegExp(endTag, 'g');
			newString = newString.replace(deletedRegex, replaceEnd);
		}
		return newString;	
	}

	/*
	Iterates through all objects in listTags and determines whether to clean that tag from the source code.  The two lists
	are ordered in the same sequence.  If the current boolean being checked is true, then the current tag will be removed from the code.

	@param code The source code to be searched through.
	@param listTags The list of tags that are decided to be removed.
	@param listChecked The list of booleans identifying whether a tag should be removed.

	@return A cleaned version of code without certain desired attributes.
	*/
	function attriClean(code, listTags, listChecked) {
		var result = code;
		var i;
		for (i = 0; i < 2; i++) {
			if (listChecked[i]) {
				result = cleanAttribute(listTags[i], result);
			}
		}
		return result;
	}

	/*
	Decides whether to remove the span tag/ replace 'b' and 'i' tags using cleanTag().  It is different from
	attriClean() because it iterates through the items in listTags that are span, 'b', and 'i'.

	@param code The source code to be searched through.
	@param listTags The list of tags that are decided to be removed.
	@param listChecked The list of booleans identifying whether a tag should be removed.

	@return A cleaned version of code without certain desired tags.
	*/
	function executeCleanTags(code, listTags, listChecked) {
		var result = code;
		if (listChecked[2]) {
			result = cleanTag(listTags[2], '', result);
		}
		if (listChecked[4]) {
			result = cleanTag(listTags[4], '<strong>', result);
		}
		if (listChecked[5]) {
			result = cleanTag(listTags[5], '<em>', result);
		}
		return result;
	}

	/*
	Removes all comments.
	
	@param code The source code to be searched through.

	@return A cleaned version of code without comments.
	*/
	function cleanComments(code) {
		var newString = code;
		while (newString.indexOf('<!--') > -1) {
			var indexStyle = newString.indexOf('<!--');
			var indexGreater = indexStyle + newString.substring(indexStyle).indexOf('-->');
			var unwantedString = newString.substring(indexStyle, indexGreater + 3);
			newString = newString.replace(unwantedString, '');
		}
		return newString;
	}

	/*
	Removes everything between two script tags, including the tags themselves.

	@param sourceCode The source code to be searched through.
	@param listChecked The list of booleans identifying whether a tag should be removed.

	@return A cleaned version of sourceCode without script tags if desired.
	*/
	function cleanScript(sourceCode, listChecked) {
		var newCode = sourceCode;
		if (listChecked[3]) {
			while (newCode.indexOf('<script') > -1)
			{
				var indexStyle = newCode.indexOf('<script');
				var indexQuote = indexStyle + newCode.substring(indexStyle).indexOf('</scri');
				var unwantedString = newCode.substring(indexStyle, indexQuote + 9);
				newCode = newCode.replace(unwantedString, '');
			}
		}
		return newCode;
	}
	
	/*
	Runs all cleaning.  Takes in whatever is in the "bigString" textarea, removes certain elements as 
	designated by the checkbox form, then outputs it into the "demo" textarea.
	*/
	function clean() {
		// Get all text inside the input textbox
		var sourceCode = document.getElementById("bigString").value;
		var newCode = sourceCode;
		
		// Get a list of element names and whether they should be removed
		var elementNames = getCollection('form', true);
		var elementsChecked = getCollection('form', false);

		newCode = attriClean(newCode, elementNames, elementsChecked);
		newCode = executeCleanTags(newCode, elementNames, elementsChecked);
		newCode = cleanScript(newCode, elementsChecked);
		newCode = cleanComments(newCode);
		
		// Return cleaned code
		document.getElementById("demo").innerHTML = newCode;
	}

	/*
	Copies all the text inside the "demo" textarea.  Alerts the user when copied successfully.
	*/
	function copyText() {
		var copiedText = document.getElementById("demo");
		copiedText.select();
		document.execCommand("copy");
		alert("Text has been copied to clipboard!");
	}
