
window.ironman_model = {};

var $ = dy_$;
var DOMAIN = 'ironman.moojing.com';
var DOMAIN_TEST = 'ironman2.taosem.com';
var prefix = "http://";
if(/^https:/.exec(window.location.href)){
	prefix = "https://";
}
var HOST = prefix + DOMAIN;
var MOJINGHOST = prefix + "ext.moojing.com";
var HOST2 = prefix + DOMAIN_TEST;
var HOME_URL = 'http://www.moojing.com?f=yy';
var js_load_count;
var ironman_util;
window.ironman_util  = ironman_util = {};

// Helpers
window.dy_noty = function(options) {

  // This is for BC  -  Will be deleted on v2.2.0
  var using_old = 0
    , old_to_new = {
        'animateOpen':'animation.open',
        'animateClose':'animation.close',
        'easing':'animation.easing',
        'speed':'animation.speed',
        'onShow':'callback.onShow',
        'onShown':'callback.afterShow',
        'onClose':'callback.onClose',
        'onClosed':'callback.afterClose'
    };

  dy_jQuery.each(options, function (key, value) {
    if (old_to_new[key]) {
        using_old++;
        var _new = old_to_new[key].split('.');

        if (!options[_new[0]]) options[_new[0]] = {};

        options[_new[0]][_new[1]] = (value) ? value : function () {
        };
        delete options[key];
    }
  });

  if (!options.closeWith) {
    options.closeWith = dy_jQuery.noty.defaults.closeWith;
  }

  if (options.hasOwnProperty('closeButton')) {
    using_old++;
    if (options.closeButton) options.closeWith.push('button');
    delete options.closeButton;
  }

  if (options.hasOwnProperty('closeOnSelfClick')) {
    using_old++;
    if (options.closeOnSelfClick) options.closeWith.push('click');
    delete options.closeOnSelfClick;
  }

  if (options.hasOwnProperty('closeOnSelfOver')) {
    using_old++;
    if (options.closeOnSelfOver) options.closeWith.push('hover');
    delete options.closeOnSelfOver;
  }

  if (options.hasOwnProperty('custom')) {
    using_old++;
    if (options.custom.container != 'null') options.custom = options.custom.container;
  }

  if (options.hasOwnProperty('cssPrefix')) {
    using_old++;
    delete options.cssPrefix;
  }

  if (options.theme == 'noty_theme_default') {
    using_old++;
    options.theme = 'defaultTheme';
  }

  if (!options.hasOwnProperty('dismissQueue')) {
    if (options.layout == 'topLeft'
        || options.layout == 'topRight'
        || options.layout == 'bottomLeft'
        || options.layout == 'bottomRight') {
        options.dismissQueue = true;
    } else {
        options.dismissQueue = false;
    }
  }

  if (options.buttons) {
    dy_jQuery.each(options.buttons, function (i, button) {
        if (button.click) {
            using_old++;
            button.onClick = button.click;
            delete button.click;
        }
        if (button.type) {
            using_old++;
            button.addClass = button.type;
            delete button.type;
        }
    });
  }

  if (using_old) {
    if (typeof console !== "undefined" && console.warn) {
        console.warn('You are using noty v2 with v1.x.x options. @deprecated until v2.2.0 - Please update your options.');
    }
  }

// console.log(options);
// End of the BC

  return dy_jQuery.notyRenderer.init(options);
};

ironman_show_error = function(text) {
    if(text == null) {
      text = '发生错误';
    }
    dy_noty({
      'text': text,
      'layout': 'center',
      'type': 'error',
      'modal': true,
      'closeWith': ['button', 'click'],
      'timeout': 3000
    });
}

ironman_show_loader = function(text) {
    if(text == null) {
      text = '发生错误';
    }
    return dy_noty({
      'text': text,
      'layout': 'center',
      'type': 'information',
      'modal': true,
      'closeWith': []
    });
}

ironman_show_success = function(text) {
    if(text == null) {
      text = '成功';
    }
    dy_noty({
      'text': text,
      'layout': 'center',
      'type': 'success',
      'modal': false,
      'closeWith': ['button', 'click'],
      'timeout': 1000
    });
}
  
ironman_show_info = function(text, callback){
    if(text == null) {
      text = '';
    }
    dy_noty({
      'text': text,
      'layout': 'center',
      'type': 'warning',
      'buttons': [{addClass: 'btn btn-primary', text: '确定', onClick: function(x) {
          x.close();
          if(callback) callback();  
        }
      }],
      'modal': true,
      'closeWith': ['button']
    });
}  

function to_date(s) {
  var ts = s.split('-');
  return new Date(parseInt(ts[0]), parseInt(ts[1])-1, parseInt(ts[2]));
}

ironman_close_all = function(){
  dy_$.noty.closeAll();
}

if(!window.console) { window.console = {log: function() {}}; }

var xhr_get = function(url, callback) {
	send_xml_req(url, callback);
}

var bg_get = function(url, callback) {
    chrome.extension.sendMessage({
        method: 'bg_get',
        params:  {method: 'bg_get', url: url}
    }, function(result) {
        //console.log(result);
        callback(result);
    });
}

var prop_get =  function(msg, callback){
	chrome.extension.sendMessage({
        method: "prop_get",
        params: {"prop": msg}
    }, function(result) {
        //console.log(result);
        callback(result);
    });
}

var store_get = function(key, callback) {
    chrome.storage.local.get(key, function(data){
    	if(callback){
    		callback(data[key]);
    	}
    }); 
};

var store_set = function(key, value, callback) {
    var data = {};
    data[key] = value;
    chrome.storage.local.set(data);
    if(callback){
    	callback();
    }
};

var store_remove = function(key, callback) {
	chrome.storage.local.remove(key);
    if(callback){
    	callback();
    }
};

var get_extension_platform = function(callback) {
	prop_get("platforms", function(platform){
		if(callback){
			return callback(platform);
		}
		return platform;
	});
};

var get_uid = function(callback) {
	if(window.ironman_uid){
		if(callback){
			return callback(window.ironman_uid)
		}
		return window.ironman_uid;
	}
	chrome.extension.sendMessage({
        method: 'get_uid',
    }, function(uid) {
    	console.log(uid);
		window.ironman_uid = uid;
		if(callback){
			return callback(uid);
		}
		return uid;
    });
};

var get_extension_version = function(callback) {
	prop_get("version", function(version){
		if(callback){
			return callback(version);
		}
		return version;
	})
};

var get_extension_name = function(callback){
	if(window.ironman_extension_name){
		if(callback){
			return callback(window.ironman_extension_name);
		}
		return window.ironman_extension_name;
	}
	prop_get("name", function(name){
		window.ironman_extension_name = name;
		if(callback){
			return callback(name);
		}
		return name;
	});
}

insert_script = function(url, func) {
    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var script = document.createElement("script");
    script.src = url;
    
    // Handle Script loading
    var done = false;
    
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if ( !done && (!this.readyState ||
                this.readyState === "loaded" || this.readyState === "complete") ) {
            done = true;
    
            // do something
            if(func) func();
    
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            if ( head && script.parentNode ) {
                head.removeChild( script );
            }
        }
    };
    
    // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
    // This arises when a base node is used (#2709 and #4378).
    head.insertBefore( script, head.firstChild );
};

get_bp_domain = function(){
    var pat = /new.subway.simba.taobao.com/;
    var pat2 = /subway.simba.taobao.com/;
    if(pat.exec(window.location)){
        return 'http://new.subway.simba.taobao.com';
    }else{
        if(pat2.exec(window.location)){
            return 'http://subway.simba.taobao.com';
        }
    }
    //default
    return 'http://subway.simba.taobao.com';
}

get_script = function(url, callback) {
    dy_$.get(url, function(r) {
        eval(r);
        callback();
    });
}

send_to_contentjs = function(data, msg_id) {
    window.postMessage({type: 'ironman_page', id: msg_id, data: data}, '*');
}

var ironman_callmap = {};
call_contentjs = function(func_name, params, callback) {
    var msg_id = (new Date()).getTime() + '-' + Math.random();
    //console.log('msg_id:' + msg_id);
    ironman_callmap[msg_id] = callback;
    send_to_contentjs({'function': func_name, 'params': params}, msg_id);
}

start_callback_handler = function() {
    window.addEventListener('message', function(e) {
        if(e.source != window) {
            return;
        }
        if(!e.data.type || e.data.type != 'ironman_contentjs') {
            return;
        }

        var callback = ironman_callmap[e.data.id];
        //console.log("inject get callback ", e.data.id);
        if(callback) {
            callback(e.data.result);
        }
        delete ironman_callmap[e.data.id];

    }, false);
}

hashCode = function(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function create_XHR(){
    var dianyue_xmlhttp;
    if(window.XMLHttpRequest) {
        // code for all new browsers
        dianyue_xmlhttp = new XMLHttpRequest();
    }else if (window.ActiveXObject) {
        // code for IE5 and IE6
        dianyue_xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return dianyue_xmlhttp;
};

function send_xml_req(sUrl, callback){
    var xhr = create_XHR();
    if(sUrl.indexOf("static") == -1){
        xhr.withCredentials = true;
    }
    xhr.open("GET", sUrl, true);
    xhr.onreadystatechange = function(){
        4 === xhr.readyState && (xhr.status >= 200 && xhr.status < 300 || 304 === xhr.status) && callback(xhr.responseText)
    };
    xhr.send();
};

function inject_css(content){
    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var style = document.createElement("style");
    style.setAttribute("type", "text/css"); 
    if(style.styleSheet){// IE  
        style.styleSheet.cssText = content;  
    } else {// w3c  
        var cssText = document.createTextNode(content);  
        style.appendChild(cssText);  
    }
   
    head.appendChild(style);
};

start_callback_handler();

ironman_injected_script = function() {
    var a = 'ironman_loaded';
    if(window[a] && window == window.top) {
      return;
    }
    var pat_upload = /^(http:|https:)\/\/upload.taobao.com/;
    if(pat_upload.exec(window.location)) return;
    
    //only allow these site to run iframe js if location match these pats 
    var iframe_pats = [
        /^(http:|https:)\/\/(item.taobao.com|detail.tmall.com|)\/item\.htm.*[&|?]id=(\d+)/,
        /^(http:|https:)\/\/s\.taobao\.com\/search.*[&|?]q=(.*)/,
        /^(http:|https:)\/\/shu.taobao.com/,
        /^(http:|https:)\/\/tao.1688.com/,
        /^(http:|https:)\/\/www.baidu.com/
    ];
    
    if(window != window.top){
      var forbid_frame = true;
      for(var i=0, l=iframe_pats.length; i < l; i++){
        console.log('iframe check', window.location.href, iframe_pats[i].toString());
        if(iframe_pats[i].exec(window.location)){
          forbid_frame = false;
        }
      }
      if(forbid_frame){
        return;
      }
      console.log('iframe allow', window.location.href);
    }
    
    window[a] = 1;
    
    start = function() {
        //console.log('document ready');
        
        var model_keys = [];
        dy_$.map(ironman_model, function(v, k) {
            model_keys.push(k);
        });
        model_keys.sort(function(a, b) {
            if(a > b) { return 1; }
            else if(a < b) { return -1; }
            else { return 0; }
        });
 
        dy_$.each(model_keys, function(i, k){
            console.log(k);
            if(window != window.top && k.indexOf('iframe') < 0){
                return;
            }
            ironman_model[k].start_inject();
            //try{
            //     ironman_model[k].start_inject();
            //}catch(err){
            //    console.log(err);
            //}
        });
    }
    
    if(!window.ironman_user_term_sycm_btn){
    	var name = get_extension_name();
    	var uid = get_uid();
    	//console.log(name, uid);
    	dy_$(document.body).append('<div class="ironman-container">' +
            		'<div id="pop_user_term" class="alert center">' +
            			'<button type="button" class="close" data-dismiss="alert">&times;</button>' +
            			'<h4>尊敬的用户，请您阅读并接受<a href="http://ironman.moojing.com/terms_mj_btn?uid='+ uid +'" target="_blank">'+ name +'用户协议</a>.如果不同意协议的话，将不能使用'+ name +'任何功能，请停止使用并卸载'+ name +'软件，谢谢！</h4>' +
            		    '<form class="form-inline"><label class="checkbox" style="font-size: 18px; color: black;"><input class="term_sycm" name="user_term" type="checkbox" checked/> 同意服务条款</label><button class="term_sycm_btn btn btn-primary" type="button">确 定</button></form>' +
        	        '</div></div>');
    	dy_$('.term_sycm').change(function(){
                 var d = dy_$(this).attr("checked");
                 dy_$('.term_sycm_btn').attr("disabled", !d);
        });

        dy_$('.term_sycm_btn').on('click', function(){
                	dy_$.post(HOST+"/terms_sycm_btn",{"uid": uid}, function(r){
                		  alert("您已接受用户协议！页面将在5秒后自动刷新，您也可以手动刷新!");
                		  setTimeout(function(){window.location.reload();}, 5000);
                	}, 'json');
        });
    }
    
    console.log('loading scripts');
    start();
};

ironman_content_script = function() {
    console.log('remote content script start');

};

