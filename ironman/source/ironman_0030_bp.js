
/* ===========================================================
 * handle subway taobao ad 
 * ========================================================== */

var inject_timer;

var handle_bp_ad = function(){
	var header = dy_$('#J_common_header');
    if(inject_timer){
    	clearTimeout(inject_timer);
    }	
	if(!header[0]){
		inject_timer = setTimeout(handle_bp_ad, 5000);
	    return;
	}
	
	dy_$.getJSON(HOST + '/static/bp.json', function(data){
    	var ads = [];
    	dy_$.each(data, function(i, o){
    		if(o.disabled) return;
    		if(dy_$.cookie('ironman_'+o.id)){
    			return;
    		}
    		ads.push(o);
    	});
    	if(ads.length > 0){
            parse_ads_config(ads);	
    	}	
    });
}

function parse_ads_config(ads){
	var rand = Math.ceil(Math.random()*ads.length);
	var cfg = ads[rand-1];
	var adHtml= '<div id="ironman_ad_left" style="margin-top:5px; position:relative; padding:5px;background:#f3f3f4;text-align: center;">' +
        '<p style="text-align: center; font-size: 8px;">此推广内容由'+ get_extension_name() +'提供</p>' +
        '<a href="'+ cfg.link +'" target="_blank"><img src="'+ cfg.img_src +'"></a>' +
        '<div class="ironman_ad_close" style="background: #FFFFFF; color: #000000; font-size: 18px; font-weight: bold; line-height: 18px; padding: 1px 6px; position: absolute; right: 1px; text-shadow: 0 1px 0 #FFFFFF; top: 1px; cursor:pointer;">x</div>' +
        '</div>';
    dy_$('#J_common_header').before(adHtml);

    dy_$('.ironman_ad_close').on('click', function(){
        dy_$.cookie("ironman_"+cfg.id, true, {expires: 1, domain: ".taobao.com"});
        dy_$('#ironman_ad_left').hide();
    });
}

var new_bp_home = /subway.simba.taobao.com/;
if(new_bp_home.exec(window.location) && window == window.top) {
    handle_bp_ad();
}
