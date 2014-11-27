if(!localStorage.FBAT_uid)
	localStorage.FBAT_uid = "[]";
if(!localStorage.FBAT_tag)
	localStorage.FBAT_tag = "[]";
if(!localStorage.FBAT_group)
	localStorage.FBAT_group = "[]";
function save()
{
	var arr = localStorage.FBAT_uid;
	chrome.tabs.getSelected(null, function(tabID)
	{
		chrome.tabs.sendRequest(tabID.id,{sp:"save"},function(response)
		{
			var dt = response.data;
			var sen = dt.split("]");
			for(var a in sen)
			{
				var check = 0;
				if(sen[a] == "")
					break;
				sen[a] = sen[a].replace(/(^.*@\[|^@\[)/,"");
				var ob = JSON.parse(localStorage.FBAT_uid);
				var sp = sen[a].split(":");
				for(var b in ob)
				    if(sp[0] == ob[b].uid)
					{
						check = 1;
						break;
					}
				if(check)
					continue;
				ob.push({"uid":sp[0],"name":sp[1]});
				localStorage.FBAT_uid = JSON.stringify(ob);
			}
		});
	});
}
function tag()
{
	chrome.tabs.getSelected(null, function(tabID)
	{
		chrome.tabs.sendRequest(tabID.id,{stream:localStorage.FBAT_tag},function(){console.log("Send Tag Success.");});
	});
}
function createMenu()
{}
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
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
	var obj = new RegExp("^(http://|https://).*\.facebook\.com/");
    if(obj.test(tab.url))
	{
        chrome.pageAction.show(tabId);
	}
});

/*
chrome.extension.onRequest.addListener(function(request,sender,sendResponse)
{
	if(request.loaded == "OK")
	{
		createMenu();
	}
});
*/