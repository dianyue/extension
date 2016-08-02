if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
}

/**
 * Base64 encode
 */
var Base64 = {
	    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	    encode: function($input) {
	        if (!$input) {
	            return false;
	        }
	        //$input = UTF8.encode($input);
	        var $output = "";
	        var $chr1, $chr2, $chr3;
	        var $enc1, $enc2, $enc3, $enc4;
	        var $i = 0;
	        do {
	            $chr1 = $input.charCodeAt($i++);
	            $chr2 = $input.charCodeAt($i++);
	            $chr3 = $input.charCodeAt($i++);
	            $enc1 = $chr1 >> 2;
	            $enc2 = (($chr1 & 3) << 4) | ($chr2 >> 4);
	            $enc3 = (($chr2 & 15) << 2) | ($chr3 >> 6);
	            $enc4 = $chr3 & 63;
	            if (isNaN($chr2)) $enc3 = $enc4 = 64;
	            else if (isNaN($chr3)) $enc4 = 64;
	            $output += this.base64.charAt($enc1) + this.base64.charAt($enc2) + this.base64.charAt($enc3) + this.base64.charAt($enc4);
	        } while ($i < $input.length);
	        return $output;
	    },
	    decode: function($input) {
	        if(!$input) return false;
	        $input = $input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	        var $output = "";
	        var $enc1, $enc2, $enc3, $enc4;
	        var $i = 0;
	        do {
	            $enc1 = this.base64.indexOf($input.charAt($i++));
	            $enc2 = this.base64.indexOf($input.charAt($i++));
	            $enc3 = this.base64.indexOf($input.charAt($i++));
	            $enc4 = this.base64.indexOf($input.charAt($i++));
	            $output += String.fromCharCode(($enc1 << 2) | ($enc2 >> 4));
	            if ($enc3 != 64) $output += String.fromCharCode((($enc2 & 15) << 4) | ($enc3 >> 2));
	            if ($enc4 != 64) $output += String.fromCharCode((($enc3 & 3) << 6) | $enc4);
	        } while ($i < $input.length);
	        return $output; //UTF8.decode($output);
	    }
};

function get_url(cookie) {
    var prefix = cookie.secure ? "https://" : "http://";
    if (cookie.domain.charAt(0) == ".")
        prefix += "www";

    return prefix + cookie.domain + cookie.path;
}

function get_suffix(url) {
    var cookiestr = '';
    var domain = url.replace('http://', '').replace('https://').split('/')[0];
    var segs = domain.split('.');
    if(segs.length < 2) {
        return null;
    }
    
    var suffix = '.' + [segs[segs.length-2], segs[segs.length-1]].join('.');
    return suffix;
}

function get_domain(url){
    var domain = url.replace('http://', '').replace('https://').split('/')[0];
    return domain;
}


/**
 * handle message
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.method == 'get_uid'){
    	get_uid(sendResponse);
    	return true;
    } else if(request.method == 'bg_get') {
        console.log('bg_get ' + request.params.url);
        dy_$.ajax({
            url: request.params.url, 
            dataType: 'text',
            success: function(r) {
                sendResponse(r);
            }
        });
        return true;
    } else if(request.method == 'bg_post') {
        dy_$.ajax({
            url: request.params.url,
            data: request.params.data,
            dataType: 'text',
            success: sendResponse
        });
        return true;
    } else if(request.method == 'prop_get'){
        var prop = request.params.prop;
        sendResponse(chrome.app.getDetails()[prop]);
        return true;
    }else {
    	console.log("Unsupport method", request.method);
    	return false;
    }
});

function get_version(callback){
  callback(chrome.app.getDetails().version);
}

function get_platforms(callback){
  var platform = chrome.app.getDetails().platforms;
  if(!platform){
	  platform = 'mojing';
  }
  callback(platform);
}

function create_uid(){
	var d = new Date();
	var uid = Base64.encode(""+d.getTime()+""+Math.random());
	return uid;
};

function get_uid(callback){
	chrome.storage.local.get("uid", function(data){
		//console.log("init.js uid", data)
		var uid = data.uid;
		if(!uid){
			uid = create_uid();
			chrome.storage.local.set({"uid": uid});
		}
		if(callback){
			callback(uid);
		}
	});
}

/**
 * handle install event
 */
chrome.runtime.onInstalled.addListener(function(){
	get_uid();
});

