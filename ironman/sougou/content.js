

function insert_XHR_script(js_content){
  var head = document.getElementsByTagName("head")[0] || document.documentElement;
  var script = document.createElement("script");
  script.language = "javascript";
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.text = js_content;
  head.appendChild(script);
}

/**
 * send user info to server
 * @returns
 */
function main(uid, version){
	console.log(uid, version);
	window.ironman_uid = uid;
    var url = "https://ironman.moojing.com/ironp?version="+ version +"&uid=" + uid;
	dy_$.get(url, function(result) {
		dy_$.each(result, function(k, v){
			window[k] = v;
		});
        ironman_content_script();
        ironman_injected_script();
	}, 'json');
};

sogouExplorer.extension.sendRequest({
	method: 'prop_get',
	params: {"prop": "version"},
}, function(version){
	sogouExplorer.extension.sendRequest({
		method: 'get_uid',
		params: {},
	}, function(uid){
		main(uid, version);
	});
});

sogouExplorer.extension.sendMessage({
	method: 'prop_get',
	params: {"prop": "name"},
}, function(name){
	window.ironman_extension_name = name;
});