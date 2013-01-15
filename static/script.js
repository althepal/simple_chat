var scrollEnabled = true;
function enable_scroll(){
	var a = $('#msgBox');
//	console.log("SCROLL " + a[0].scrollHeight + " -- " + a.height());
	a.scrollTop( a[0].scrollHeight - a.height() + 150);
}

var socket;
var username;

function setup_socket(){
	socket = io.connect(socket_url);
	socket.on('connect', function(){
		console.log("connected");
		if (username) {
			sendName(username);
		}
	});
	socket.on('name-set', function(data) {
		var code = data.code;
		if (code == 'OK'){
			addMsg("<b>Welcome, " + data.username + "</b>");
			nameOK(data.username);
		} else {
			alert(code);
		}
	});
	socket.on('users', function (data) {
		var users = data.users;
		if (isMobile){
			mobile_listUsers(users);
		} else {
			var html = "";
			for (var user in users){
				var d = new Date(users[user].time);
				d = d.toISOString();
				var addt = "<abbr class=timeago title='"+d+"'>"+d+"</abbr>";
				var xxx = "<div><strong>" + user + "</strong>"+addt;//+"<span class='msgTime " + users[user].time + "'></span>";
				html += "<li>" + xxx + "</li>";
			}
			$('#userList').html(html);
			setTimes();
		}
	});
	socket.on('news', function (data) {
		document.title = data.msg;
		if (data.time) {
			var d = new Date(data.time);
			d = d.toISOString();
		} else {
			d = "";
		}
		var addt = "<abbr class=timeago title='"+d+"'></abbr>";
		var xxx = "<strong>" + data.username + "</strong>"+addt+"<span class='msgTime " + data.time + "'></span><div>" + data.msg;
		addMsg(xxx);
//		$('#msgBox').append(xxx);
//
//		if (scrollEnabled) {
//			enable_scroll();
//		}
//		setTimes();
	});
}

function addMsg(msg){
	var xxx = $("<div title='hello'>" + msg + "</div>");
	$('#msgBox').append(xxx);
//	xxx.tooltip("hello");
	if (scrollEnabled) {
		enable_scroll();
	}
	setTimes();

}

function setTimes() {
	jQuery("abbr.timeago").timeago();
}
function sendMsg(){
	var msg = $('#ta').val().trim();
	if (msg)
		socket.emit('newMsg', { msg: msg , username: username, time: Date.now() });
	$('#ta').val("");
	enable_scroll();
}
function setNameFromField(){
	var name = $('#nameInput').val().trim();
	sendName(name);
	return;
	if (name){
		username = name;
		$('#username_span').html(name);
		$('#nameDiv').hide();
		$('#msgDiv').show();
		$('#ta').focus();
	} else {
		$('#nameInput').focus();
	}
}
function nameOK(name){
	username = name;
	$('#username_span').html(name);
	$('#nameDiv').hide();
	$('#msgDiv').show();
	$('#ta').focus();
}
function sendName(name){
	socket.emit('im_here', { username: name });
}
//var username = 'User' + parseInt(Math.random() * 10000);
$(function(){
	jQuery("abbr.timeago").timeago();
//	$('#username_span').html(username);
	$('#ta').keypress(function(e){
		var keycode = (e.keyCode ? e.keyCode : e.which);
		if (keycode == '13'){
			sendMsg();
			return false;
		}
	});
	$('#msgBox').scroll(function(){
		var a = $('#msgBox');
		var diff = a[0].scrollHeight - a.height() - a.scrollTop();
		scrollEnabled = (diff == 6);
//		console.log("SIFF: " + diff);
	});
	$('#nameInput').focus().keypress(function(e){
		var keycode = (e.keyCode ? e.keyCode : e.which);
		if (keycode == '13'){
			setNameFromField()
		}
	});
	setup_socket();
//	$(document).tootip();
//	tu = $('#testui');
//	$('#testui').click(function(){
////		$(this).toggle("bounce", {pieces: 64}, 900);
////		$(this).toggle({duration: 1000, pieces: 64, type: "clip"});
//	});
//	$('#progbar').progressbar({value: 33});
});

