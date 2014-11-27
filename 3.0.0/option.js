var arr = JSON.parse(localStorage.FBET_uid);
var act = JSON.parse(localStorage.FBET_tag);
var kind;
var reader = new FileReader();
$(
function() {
	// Load name
	var art = localStorage.FBET_tag;
	for (var a = 0; a < arr.length; a++)
	$("#nameG").append('<button type="button" class="ET-name btn btn-default active" data-uid="'.concat(arr[a].uid, '"><div style="float:left">', arr[a].name, '</div><span class="glyphicon glyphicon-tag" style="float:right;opacity:0;"></span></button>'));
	filter(art);
	Write();

	// Load group
	var NofGroup = JSON.parse(localStorage.FBET_group);
	for (var a = 0; a < NofGroup.length; a++)
	$("#groupG").append('<label class="btn btn-default group" data-gid="'.concat(NofGroup[a], '"><input type="radio" class="" name="options">', NofGroup[a], '</input></label>'));

	// Panel animation
	$(".ET-panel").slideDown("slow");

	// Alert close
	$("#close").click(function() {
		$(this).parent().slideUp("slow");
	});

	// Write on tag
	$("#Btn-Write").click(function() {
		Write();
	});

	// Save into group
	$("#Btn-Save").click(function() {
		Save();
	});

	// Click group
	$(".group").click(function() {
		filter(localStorage[$(this).data("gid")]);
	});

	// Click remove name
	$("#Remove_name").click(function() {
		$("#alert").slideDown("slow");
		kind = "name";
	});

	// Click remove group
	$("#Remove_group").click(function() {
		$("#alert").slideDown("slow");
		kind = "group";
	});

	// Click remove group
	$("#Remove_group").click(function() {
		// Alert animation
		$("#alert").slideDown("slow");
		var m = $(this).parent().data("uid")
		for (var a = 0; a < arr.length; a++)
		if (arr[a].uid == m) {
			arr.splice(a, 1);
			break;
		}
		localStorage.FBET_uid = JSON.stringify(arr);
	});

	// Click continue
	$("#continue").click(function() {
		continued();
	})

	// Create a new group
	var tar = document.getElementById("In-Name")
	$("#In-Name").keypress(function(event) {
		if (event.keyCode == 13 && !tar.value.match(/^(|FBET_group|FBET_uid|FBET_tag|")$/) && $(this).val().length < 8) {
			var ch = false;
			tar.value = tar.value.trim();
			if (SearchInGlist(tar.value) == -1) Event_Enter(tar);
		}
	});

	// Load extension version
	var g_chromeManifest = (function() {
		var manifestObject = null;
		if (typeof(chrome) != "undefined" && typeof(chrome.extension) != "undefined") {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) 
					manifestObject = JSON.parse(xhr.responseText);
			};
			xhr.open("GET", chrome.extension.getURL('/manifest.json'), false);
			try {
				xhr.send();
			} catch(e) {
				console.log('Could not load manifest.json');
			}
		}
		return manifestObject;
	})();
	document.getElementById("ver").innerHTML = "version ".concat(g_chromeManifest.version);

	// Select file location
	document.getElementById("upload").onchange = function() {
		reader.readAsText(this.files[0]);
		reader.onload = function() {
			var data = JSON.parse(reader.result);
			for (var i in data) {
				localStorage.setItem(i, JSON.stringify(data[i]));
			}
		}
	}
	
	// Load list
	document.getElementById("btn-upload").onclick = function() {
		document.getElementById("upload").click();
	}
	
	// Make list
	document.getElementById("btn-save").onclick = function() {
		var storage = localStorage;
		var storageAll = "{";
		for(var i in storage) {
			storageAll = storageAll.concat('"', i, '"', ":" , storage[i], "," );
		}
		storageAll = storageAll.replace(/.$/,"}");
		var blob = new Blob([storageAll], {type:'text/plain;charset=UTF-8'}); // Note: window.WebKitBlobBuilder in Chrome 12.
		document.querySelectorAll("#dl")[0].href = URL.createObjectURL(blob);
		document.querySelectorAll("#dl")[0].click();
	}

	// Select all when Ctrl + A
	var db = false;
	document.onkeydown = function(e) {
		if (e.ctrlKey) {
			if (e.keyCode == 65) {
				if (db) for (var i in document.querySelectorAll(".ET-name")) 
					document.querySelectorAll(".ET-name")[i].className = "ET-name btn btn-default";
				else for (var i in document.querySelectorAll(".ET-name")) 
					document.querySelectorAll(".ET-name")[i].className = "ET-name btn btn-default active";
				db = !db;
			}
		}
	}
	var s = document.querySelectorAll(".ET-name");
	for (var i in s) 
		s[i].onclick = function() {
			db = false;
		}
		
});

function Event_Enter(tar) {
	var NofGroup = JSON.parse(localStorage.FBET_group);
	$("#groupG").append('<label class="btn btn-default group" data-gid="'.concat(tar.value, '"><input type="radio" class="" name="options">', tar.value, '</input></label>'));
	NofGroup.push(tar.value);
	localStorage.FBET_group = JSON.stringify(NofGroup);
	var tag = new Array();
	var loc = $(".ET-name.active");
	for (var a = 0; a < loc.length; a++)
	tag[a] = {
		"uid": loc.eq(a).data("uid"),
		"name": loc.eq(a).text()
	};
	localStorage[tar.value] = JSON.stringify(tag);
	tar.value = "";
}

function continued() {
	$("#close").parent().slideUp("slow");
	if (kind == "name") {
		var tar = $(".ET-name");
		var length = arr.length;
		for (var a = 0; a < length; a++)
		if (tar.eq(a).hasClass("active")) {
			arr.splice(a, 1);
			tar.eq(a).remove();
		}
		localStorage.FBET_uid = JSON.stringify(arr);
	} else {
		var NofGroup = JSON.parse(localStorage.FBET_group);
		var tar = $(".group.active")
		NofGroup.splice(SearchInGlist(tar.data("gid")), 1);
		console.log(NofGroup);
		localStorage.FBET_group = JSON.stringify(NofGroup);
		localStorage.removeItem(tar.data("gid"));
		tar.remove();
	}
}

function Write() {
	var tag = new Array();
	var loc = $(".ET-name.active");
	for (var a = 0; a < loc.length; a++)
	tag[a] = {
		"uid": loc.eq(a).data("uid"),
		"name": loc.eq(a).text()
	};
	$(".ET-name>.glyphicon-tag").css("opacity", "0");
	$(".ET-name.active>.glyphicon-tag").css("opacity", "0.8");
	localStorage.FBET_tag = JSON.stringify(tag);
}

function Save() {
	var tag = new Array();
	var loc = $(".ET-name.active");
	var NofGroup = JSON.parse(localStorage.FBET_group);
	for (var a = 0; a < loc.length; a++)
	tag[a] = {
		"uid": loc.eq(a).data("uid"),
		"name": loc.eq(a).text()
	};
	localStorage[$(".group.active").data("gid")] = JSON.stringify(tag);
	NofGroup = JSON.parse(localStorage.FBET_group);
	if (SearchInGlist($(".group.active").data("gid")) == -1) {
		NofGroup.push($(".group.active").data("gid"));
		localStorage.FBET_group = JSON.stringify(NofGroup);
	}
}

function filter(content) {
	var tar;
	for (var a = 0; a < arr.length; a++) {
		tar = $(".ET-name").eq(a);
		if (content.match(tar.data("uid"))) tar.addClass("active");
		else tar.removeClass("active");
	}
}

function SearchInGlist(tar) {
	var ch = true;
	var NofGroup = JSON.parse(localStorage.FBET_group);
	for (var a = 0; a < NofGroup.length; a++)
	if (NofGroup[a] == tar) {
		ch = !ch;
		return a;
	}
	if (ch) return - 1;
}

