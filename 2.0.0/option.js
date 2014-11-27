var arr = JSON.parse(localStorage.FBAT_uid);
var act = JSON.parse(localStorage.FBAT_tag);
var kind;
$(
function()
{
	// Load name
	var art = localStorage.FBAT_tag;
	for(var a = 0;a<arr.length;a++)
		$("#nameG").append('<button type="button" class="AT-name btn btn-default active" data-uid="'.concat(arr[a].uid,'"><div style="float:left">',arr[a].name,'</div><span class="glyphicon glyphicon-tag" style="float:right;opacity:0;"></span></button>'));
	filter(art);
	Write();
	
	// Load group
	var NofGroup = JSON.parse(localStorage.FBAT_group);
	for(var a = 0;a<NofGroup.length;a++)
		$("#groupG").append('<label class="btn btn-default group" data-gid="'.concat(NofGroup[a],'"><input type="radio" class="" name="options">',NofGroup[a],'</input></label>'));
	
	// Panel animation
	$(".AT-panel").slideDown("slow");
	
	// Alert close
	$("#close").click(function(){$(this).parent().slideUp("slow");});
	
	// Write on tag
	$("#Btn-Write").click(function(){Write();});
	
	// Save into group
	$("#Btn-Save").click(function(){Save();});
	
	// Click group
	$(".group").click(function(){filter(localStorage[$(this).data("gid")]);});
	
	// Click remove name
	$("#Remove_name").click(function(){$("#alert").slideDown("slow");kind = "name";});
	
	// Click remove group
	$("#Remove_group").click(function(){$("#alert").slideDown("slow");kind = "group";});
	
	// Click remove group
	$("#Remove_group").click(function()
	{
		// Alert animation
		$("#alert").slideDown("slow");
		var m = $(this).parent().data("uid")
		for(var a = 0;a < arr.length;a++)
			if(arr[a].uid == m)
			{
				arr.splice(a,1);
				break;
			}
		localStorage.FBAT_uid = JSON.stringify(arr);
	});
	
	// Click continue
	$("#continue").click(function(){continued();})
	
	// Hover on remove
	/**
	$(".glyphicon-remove").hover(function()
	{
		$(this).css("opacity","1");
	},function()
	{
		$(this).css("opacity","0.1");
	});
	**/
	
	// Create a new group
	var tar = document.getElementById("In-Name")
	$("#In-Name").keypress(function(event)
	{
		if(event.keyCode == 13 && !tar.value.match(/^(|FBAT_group|FBAT_uid|FBAT_tag|")$/) && $(this).val().length < 8 )
		{
			var ch = false;
			tar.value = tar.value.trim();
			if(SearchInGlist(tar.value) == -1)
				Event_Enter(tar);
		}
	});
	
	// Load extension version
	var g_chromeManifest = (function()
	{
		var manifestObject = null;
		if (typeof(chrome) != "undefined" && typeof(chrome.extension) != "undefined")
		{
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4)
					manifestObject = JSON.parse(xhr.responseText);
			};
			xhr.open("GET", chrome.extension.getURL('/manifest.json'), false);
			try
			{
				xhr.send();
			}
			catch(e) 
			{
				console.log('Could not load manifest.json');
			}
		}
		return manifestObject;
	})();
	document.getElementById("ver").innerHTML = "version ".concat(g_chromeManifest.version);
});

function Event_Enter(tar)
{
	var NofGroup = JSON.parse(localStorage.FBAT_group);
	$("#groupG").append('<label class="btn btn-default group" data-gid="'.concat(tar.value,'"><input type="radio" class="" name="options">',tar.value,'</input></label>'));
	NofGroup.push(tar.value);
	localStorage.FBAT_group = JSON.stringify(NofGroup);
	var tag = new Array();
	var loc = $(".AT-name.active");
	for(var a = 0;a<loc.length;a++)
		tag[a] = {"uid":loc.eq(a).data("uid"),"name":loc.eq(a).text()};
	localStorage[tar.value] = JSON.stringify(tag);
	tar.value = "";
}

function continued()
{
	$("#close").parent().slideUp("slow");
	if(kind == "name")
	{
		var tar = $(".AT-name");
		var length = arr.length;
		for(var a = 0;a < length;a++)
			if(tar.eq(a).hasClass("active"))
			{
				arr.splice(a,1);
				tar.eq(a).remove();
			}
		localStorage.FBAT_uid = JSON.stringify(arr);
	}
	else
	{
		var NofGroup = JSON.parse(localStorage.FBAT_group);
		var tar = $(".group.active")
		NofGroup.splice(SearchInGlist(tar.data("gid")),1);
		console.log(NofGroup);
		localStorage.FBAT_group = JSON.stringify(NofGroup);
		localStorage.removeItem(tar.data("gid"));
		tar.remove();
	}
}

function Write()
{
	var tag = new Array();
	var loc = $(".AT-name.active");
	for(var a = 0;a<loc.length;a++)
		tag[a] = {"uid":loc.eq(a).data("uid"),"name":loc.eq(a).text()};
	$(".AT-name>.glyphicon-tag").css("opacity","0");
	$(".AT-name.active>.glyphicon-tag").css("opacity","0.8");
	localStorage.FBAT_tag = JSON.stringify(tag);
}

function Save()
{
	var tag = new Array();
	var loc = $(".AT-name.active");
	var NofGroup = JSON.parse(localStorage.FBAT_group);
	for(var a = 0;a<loc.length;a++)
		tag[a] = {"uid":loc.eq(a).data("uid"),"name":loc.eq(a).text()};
	localStorage[$(".group.active").data("gid")] = JSON.stringify(tag);
	NofGroup = JSON.parse(localStorage.FBAT_group);
	if(SearchInGlist($(".group.active").data("gid")) == -1)
	{
		NofGroup.push($(".group.active").data("gid"));
		localStorage.FBAT_group = JSON.stringify(NofGroup);
	}
}

function filter(content)
{
	var tar;
	for(var a = 0;a<arr.length;a++)
	{
		tar = $(".AT-name").eq(a);
		if(content.match(tar.data("uid")))
			tar.addClass("active");
		else
			tar.removeClass("active");
	}
}

function SearchInGlist(tar)
{
	var ch = true;
	var NofGroup = JSON.parse(localStorage.FBAT_group);
	for(var a = 0;a < NofGroup.length;a++)
		if(NofGroup[a] == tar)
		{
			ch = !ch;
			return a;
		}
	if(ch)
		return -1;
}