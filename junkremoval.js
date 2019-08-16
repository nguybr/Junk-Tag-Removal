	<!-- Returns a collection -->
	function getCollection(formId, cond) {
		var formElements = document.getElementById('form').elements;
		var formParts = [];
		if (cond) { 			<!-- If true, means to get element names -->
			var i;
			for (i = 0; i < formElements.length; i++) {
			formParts[i] = formElements[i].value;
			}
		}
		else {				<!-- If false, means to get whether each element is checked or not. -->
			var i;
			for (i = 0; i < formElements.length; i++) {
			formParts[i] = formElements[i].checked;
			}
		}
		return formParts;
	}

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


	<!-- This function cleans a user-inputted attribute -->
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

	<!-- This function cleans a user-inputted tag -->
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

	<!-- Cleans selected attributes -->
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

	<!-- Removes and replaces tags (FOR THE FUTURE THIS SHOULD BE SCALABLE TO ANY TAGS)-->
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

	<!-- Removes all comments -->
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

	<!-- Cleans script tags -->
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
	
	<!-- On click, this runs all the cleaning -->
	function clean() {
		<!-- Get all text inside the input textbox -->
		var sourceCode = document.getElementById("bigString").value;
		var newCode = sourceCode;
		
		<!-- Get a list of element names and whether they should be removed -->
		var elementNames = getCollection('form', true);
		var elementsChecked = getCollection('form', false);

		newCode = attriClean(newCode, elementNames, elementsChecked);
		newCode = executeCleanTags(newCode, elementNames, elementsChecked);
		newCode = cleanScript(newCode, elementsChecked);
		newCode = cleanComments(newCode);
		
		<!-- Return cleaned code -->
		document.getElementById("demo").innerHTML = newCode;
	}

	function copyText() {
		var copiedText = document.getElementById("demo");
		copiedText.select();
		document.execCommand("copy");
		alert("Text has been copied to clipboard!");
	}
