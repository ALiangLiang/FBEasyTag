chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var ele = document.querySelectorAll(".textInput.mentionsTextarea.uiTextareaAutogrow.uiTextareaNoResize.UFIAddCommentInput:not(.DOMControl_placeholder)")[0];
	if (request.stream) {
		var tag = JSON.parse(request.stream);
		var word = "FB™ Easy Tag : ";
		for (var a = 0; a < tag.length; a++)
			word = word.concat("@[", tag[a].uid, ":FB™EasyTag]");
		ele.dispatchEvent(new Event("change"));
		ele.parentNode.parentNode.parentNode.nextSibling.value = word;
		

		document.addEventListener("keypress",function(e){console.log(e)});
		var e = new KeyboardEvent("keypress", {bubbles : true, cancelable : true, charCode : 13, keyIdentifier : "Enter", view : window, which : 13});
		delete e.keyCode;
		delete e.which;
		delete e.charCode;
		Object.defineProperty(e, "keyCode", {"value" : 13});
		Object.defineProperty(e, "which", {"value" : 13});
		Object.defineProperty(e, "charCode", {"value" : 13});
		console.log(e);
		document.dispatchEvent(e);
	}
	if (request.sp == "save") {
		var val = ele.parentNode.parentNode.parentNode.nextSibling.value;
		sendResponse({
			data: val
		});
	}
});