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

var ironman_record_pv = function(tag){
	get_uid(function(uid){
		var params = {"tag": tag, "uid": uid};
		dy_$.ajax({
			"url": "//mchat.moojing.com/track_ad_pv", 
			"data": params, 
			"success": function(){console.log("pv record finish")},
			"type": "POST",
			"dataType": "json"
		});
	})
	
};

function log_visit(ad_id) {
    console.log('log 3pad visit');
    get_uid(function(uid){
        var params = {
                partners: ad_id,
                "uid": uid,
                username: localStorage.ironman_username,
                url: location.href,
                ref: document.referrer,
            }

        params.ww = dy_$('.user-nick').text();
        dy_$.post('//mchat.moojing.com/log_3pad', params);
    });
};

/** AD option
 * img_src  广告图片地址
 * link     广告目标着陆页
 * id       广告ID，唯一
 * place    广告投放位置 (目前有 卖家中心, 已卖出宝贝， 京东后台，百度搜索结果页)
 * group    投放分组 (-1为全量)
 * ***可选***
 * close_weekend 周末是否投放
 * start_time    投放起始时间 (小时)
 * end_time      投放截止时间 (小时)
 * disabled      是否启用, 默认启用
 */
/***/
if(window.ironman_user_term_sycm_btn && !dy_$.cookie('close_cps')){
	dy_$.getJSON('//ironman.moojing.com/static/ads_place.json', function(places){
	    dy_$.getJSON('//ironman.moojing.com/static/ads.json', function(data){
	       parse_ads_config(data, places);	
	    });
	});
}

function parse_ads_config(config, places){
	var date = new Date();
	var days = date.getDay();
	var hour = date.getHours();
	
	var ads = {};
	dy_$.each(config, function(i,o){
		//console.log(o);
        //handle ad enbale config		
		if(o.disabled) return true;
		if(o.close_weekend && days % 6 == 0) return true;
		if(o.start_time && hour < o.start_time) return true;
		if(o.end_time && hour >= o.end_time) return true;
		var click_id = "ironman_"+o.id+"_ad";
		if(dy_$.cookie(click_id)){
			return true;
		}
		if(!ads[o.place]){
			ads[o.place] = [];
		}
        ads[o.place].push(o);
	});
	
	console.log(ads);
	check_inject_ad(ads, places);
};

function calc_ad_priority(ads){
	var weights = 0;
	dy_$.each(ads, function(i, o){
		if(o.priority){
			weights = weights + o.priority;
		}else{
			weights = weights + 1;
		}
	});
	
	var last_percent = 0;
	dy_$.each(ads, function(i, o){
		var priority = o.priority ? o.priority : 1;
		o.percent = last_percent + Math.round(priority * 10000 / weights) / 10000;
		last_percent = o.percent;
	});
	
	return ads;
};

function check_inject_ad(ads, places){
    dy_$.each(places, function(i, place){
    	var pat = place['regex'];
    	var pid = place['id'];
    	if(!new RegExp(pat).exec(location.href)){
    		return true;
    	}
    	if(!ads[pid]){
    		return true;
    	}
    	
    	var tmp = calc_ad_priority(ads[pid]);
    	var rand = Math.random();
    	
    	for(var i=0; i<tmp.length; i++){
    		if(rand <= tmp[i].percent){
    			inject_ad(tmp[i], place);
    			break;
    		}
    	}
    });
};

var ads_container_html = '<div id="ironman_ads_container" style="margin:10px auto;padding:5px;width:1190px;text-align:center;position:relative;box-shadow: 0 0 1px 1px #f3f3f4;background: #f3f3f4;">'+
'<p style="font-size: 11px;" class="ironman-ad-tip">以下推广内容由'+ get_extension_name() +'提供</p></div>';

function ad_html(option, click_id){
	return '<div class="ironman_ad_container" style="position: relative;"><div class="ironman-ad-tip" style="position: absolute;right: 37px;top: 0;color: whitesmoke;font-size: 8px;">此推广内容由'+ get_extension_name() +'提供</div>'+
	    '<div class="ironman-ad-close" data-ad-id="'+ click_id +'">x</div>'+
        '<a href="'+ option.link +'" target="_blank" id="'+ click_id +'">' +
            '<img src="'+ option.img_src +'"></img>' +
        '</a></div>';
};

function get_domain(){
	var domain = location.href.replace('http://', '').replace('https://').split('/')[0];
	var segs = domain.split('.');
    if(segs.length < 2) {
        return null;
    }
    
    var suffix = '.' + [segs[segs.length-2], segs[segs.length-1]].join('.');
    return suffix;
}

function inject_ad(option, place){
	
	var click_id = "ironman_"+option.id+"_ad";
	var ads_obj = dy_$('#ironman_ads_container');
	
	if(!ads_obj[0]){
		var place_id = place['id'];
		var dom_id = place['inject_dom'];
		var method = place['inject_method'];
		if(typeof dy_$(dom_id)[method] == 'function'){
			dy_$(dom_id)[method](ads_container_html);
		}else{
			console.log('Unsupported method!', place);
		}
		ads_obj = dy_$('#ironman_ads_container');
		if(place['style']){
			dy_$.each(place['style'], function(k,v){
				ads_obj.css(k, v);
			});
		}
	}
	
	if(ads_obj[0]){
		ads_obj.append(ad_html(option, click_id));
	    //console.log(option);
	}
	var shown = window.ironman_ad_tip_hide ? "none" : "block";
	ads_obj.find('.ironman-ad-tip').css("display", shown);
	
	dy_$('#'+click_id).click(function() {
		log_visit(option.id);
    });
	
	dy_$('.ironman-ad-close').on('click', function(){
		var id = dy_$(this).data("ad-id");
		dy_$.cookie(id, true, {expires: 1, domain: get_domain()});
		dy_$(this).parent('.ironman_ad_container').hide();
	})
	
    ironman_record_pv(option.id);
};
		
		
		
