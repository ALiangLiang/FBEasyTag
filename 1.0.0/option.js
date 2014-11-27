var arr = JSON.parse(localStorage.uid);
var act = JSON.parse(localStorage.tag);
$(
function()
{
	var temp ="";
	var art = localStorage.tag;
	for(var a = 0;a<arr.length;a++)
		$("#AT-Fname").after("<button type=\"button\" class=\"AT-name btn btn-default active\" data-uid=\"".concat(arr[a].uid,"\">",arr[a].name,"</button>"));
	for(var a = 0;a<arr.length-1;a++)
	{
		if(art.match($(".AT-name").eq(a).data("uid")))
			$(".AT-name").eq(a).addClass("active");
		else
			$(".AT-name").eq(a).removeClass("active");
	}
	$(".AT-panel").slideDown("slow");
	$("#save").click(function(){save();})
});


function save()
{
	var tag = new Array();
	var loc = $(".AT-name.active");
	for(var a = 0;a<loc.length;a++)
		tag[a] = {"uid":loc.eq(a).data("uid"),"name":loc.eq(a).text()};
	localStorage.tag = JSON.stringify(tag);
}