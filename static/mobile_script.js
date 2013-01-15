$(function(){
	$('#topline').hide();
	$('#userListHeader').hide();
//	$('#ta').height(24);
	$('#sendButt').hide();
	sizeWin();
	$(window).resize(sizeWin);
});


function sizeWin(){
	addMsg("RESIZE");
	var winh = $(window).height();
	var winw = $(window).width();
//	var inph = $('#nameInput').height();
//	$('#first').height(inph);
	msgsh = winh - $('#first').height() - $('#userListBox').height() - 10;
//	console.log("H: " + msgsh);
	$('#msgBox').height(msgsh);
	$('#ta').width(winw - 4);
	enable_scroll();

}

function mobile_listUsers(users){
	var html = "Users: ";
	for (var user in users){
		html += "<b>" + user + "</b>, "
	}
	$('#userList').html(html);
//	console.log("HTML: " + html);

}
