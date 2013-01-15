var fs = require('fs');

var socket_url = fs.readFileSync('socket_url.txt').toString().trim();
//console.log("--" + socket_url + "--");

exports.index = function(req, res){
	var ua = req.headers['user-agent'];
	var isMobile = /mobile/i.test(ua);
//	isMobile = true;
//	console.log(socket_url);
	res.render('index', { title: "A's Chat" , socket_url: socket_url, isMobile: isMobile });
};
exports.test = function(req, res){
	var ua = req.headers['user-agent'];
	var setting = req.session.setting || "- UNSET -";
	if (/mobile/i.test(ua)){
		res.render('test_mobile', { title: "Test" });
	} else {
		res.render('test', { title: "Test", setting: setting });
	}
	console.log(req.headers);
//	res.send("got here");
}
exports.testpost = function(req, res){
	var dataIn = req.body.dataIn;
	console.log("TEST POST " + dataIn);
	req.session.setting = dataIn;
	res.send("Yo Yo " + dataIn);

}
