
var pat_mojing_site = /^http:\/\/[a-z]+\.moojing\.com/;
if(pat_mojing_site.exec(window.location)) {
	get_extension_platform(main);
}

function main(platform){
	if( platform == undefined || platform == null || platform == ''){
		platform = "mojing";
	}
	dy_$.cookie("fx", platform, {"expires": 365, "domain": ".moojing.com"});
}