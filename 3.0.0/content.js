chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.stream) {
		var tag = JSON.parse(request.stream);
		var word = "FB™ Easy Tag : ";
		for (var a = 0; a < tag.length; a++)
		word = word.concat("@[", tag[a].uid, ":FB™EasyTag]")
		$(".textInput.mentionsTextarea.uiTextareaAutogrow.uiTextareaNoResize.UFIAddCommentInput").not(".DOMControl_placeholder").parent().parent().parent().next().val(word);
	}
	if (request.sp == "save") {
		var val = $(".textInput.mentionsTextarea.uiTextareaAutogrow.uiTextareaNoResize.UFIAddCommentInput").not(".DOMControl_placeholder").parent().parent().parent().next().val();
		sendResponse({
			data: val
		});
	}
});