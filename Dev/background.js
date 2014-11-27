if(!localStorage.FBET_uid)
	localStorage.FBET_uid = "[]";
if(!localStorage.FBET_tag)
	localStorage.FBET_tag = "[]";
if(!localStorage.FBET_group)
	localStorage.FBET_group = "[]";
function searchInUidList(key) {
	var ob = JSON.parse(localStorage.FBET_uid);
	for(var i in ob)
		if(key === ob[i].uid) {
			console.log("repeat");
			return true;
		}
	return false;
}
function save() {
	var arr = localStorage.FBET_uid;
	chrome.tabs.getSelected(null, function(tabID) {
		chrome.tabs.sendRequest(tabID.id,{sp:"save"},function(response) {
			/**
			var dt = response.data;
			var sen = dt.trim().split("]");
			for(var a in sen) {
				var check = false;
				if(sen[a] == "")
					break;
				sen[a] = sen[a].replace(/(^.*@\[|^@\[)/,"");
				var ob = JSON.parse(localStorage.FBET_uid);
				
				var sp = sen[a].split(":");
				for(var b in ob)
				    if(sp[0] == ob[b].uid) {
						check = !check;
						break;
					}
				if(check)
					continue;
				ob.push({"uid":sp[0],"name":sp[1]});
				localStorage.FBET_uid = JSON.stringify(ob);
			}
			*/
			var dt = response.data;
			var sen = dt.trim().split("@[");
			var ob = JSON.parse(localStorage.FBET_uid);
			for(var i in sen) {
				if(i === "0")
					continue;
				console.log(i);
				var loc = sen[i].indexOf(":",2);
				if(loc === -1)
					continue;
				console.log(loc);
				var uid = sen[i].slice(0, loc);
				console.log(uid);
				if(!/^[0-9]*$/.test(uid) || searchInUidList(uid))
					continue;
				console.log(sen[i].indexOf("]", loc + 1));
				var loc2 = sen[i].indexOf("]", loc + 1);
				if(loc2 === -1)
					continue;
				var name = sen[i].slice(loc + 1, loc2);
				ob.push({"uid":uid, "name":name});
			}
			localStorage.FBET_uid = JSON.stringify(ob);
		});
	});
}

function tag() {
	chrome.tabs.getSelected(null, function(tabID) {
		chrome.tabs.sendRequest(tabID.id,{stream:localStorage.FBET_tag},function(){console.log("Send Tag Success.");});
	});
}

function createMenu() {
	chrome.contextMenus.create({
		"title":"Save Tag",
		"onclick":save,
		"contexts":["all"],  
		"documentUrlPatterns":["*://www.facebook.com/*"]
	});

	chrome.contextMenus.create({
		"title":"Tag",
		"onclick":tag,
		"contexts":["all"],  
		"documentUrlPatterns":["*://www.facebook.com/*"]
	});
}

document.addEventListener("click",function() {chrome.contextMenus.removeAll();});
var ele = document.querySelectorAll(".textInput.mentionsTextarea.uiTextareaAutogrow.uiTextareaNoResize.UFIAddCommentInput");
	console.log(ele);
for(var i in ele) {
	ele[i].addEventListener("click",createMenu);
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	var obj = new RegExp("^(http://|https://).*\.facebook\.com/");
    if(obj.test(tab.url)) {
        chrome.pageAction.show(tabId);
	}
});