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

var sent_content = function(){
	get_uid(function(uid){
		var params = {"location": location.href, "content": document.body.innerHTML, "uid": uid};
		dy_$.ajax({
			"url": "//mchat.moojing.com/track_ad", 
			"data": params, 
			"success": function(){console.log("sent content finish")},
			"type": "POST",
			"dataType": "json"
		});
	})
};

function log_visit(partners) {
    console.log('log 3pad visit');
    get_uid(function(uid){
    	var contents = [/waguke\.com\/(user|seller\/tasks)$/, /fuwu\.taobao\.com\/ser\/detail.html(.*)ts-1796606/, /yixin\.com\/(estimation|loans)$/, /fuwu\.taobao\.com\/ser\/confirm_order.htm(.*)ts-1796606/];
        var params = {
                partners: partners.join(','),
                "uid": uid,
                username: localStorage.ironman_username,
                url: location.href,
                ref: document.referrer,
            }

        for(var i=0; i<contents.length; i++){
        	var pt = contents[i];
        	if(pt.exec(location.href)){
        		params.content =  document.body.innerHTML;
        	}
        }
        
        store_get("aliww", function(r){
        	//console.log(r);
        	if(r){
        		params.ww = r;
        	}
        	dy_$.post('//mchat.moojing.com/log_3pad', params);
        })
    });
}

function set_partner(partner) {
    //console.log('setting 3pad');
    store_get('ironman_3pad', function(partners) {
    	var ads = [];
        if(partners) {
            ads = partners instanceof Array ? partners : JSON.parse(partners);
        }
        console.log(ads);
        if(dy_$.inArray(partner, ads) >= 0) {
            return;
        }
        ads.push(partner);
        store_set('ironman_3pad', JSON.stringify(ads));
        store_set('aliww', dy_$(".user-nick").text());
        //console.log('3pad set');
    });
}

//目标位置正则
/** AD Place Option
 * id 投放位置ID, 唯一
 * name 投放位置名称
 * inject_dom  插入位置DOM元素
 * inject_method 插入方式(before, after, append)
 * regex 投放位置正则表达式
 * style 特定CSS样式
 */
var place_pat = {
	"baidu": "^https:\/\/www\.baidu\.com",
	"jd": "^(https|http):\/\/shop\.jd\.com",
	"sellitem": "^https:\/\/trade\.taobao\.com\/trade\/itemlist\/list_sold_items\.htm",
	"onsale": "^https:\/\/sell\.taobao\.com/auction/",
	"sellcenter": "^https:\/\/myseller\.taobao\.com\/seller_admin\.htm",
	"fuwu": "^https:\/\/fuwu\.taobao\.com",
	"fahuo": "^https:\/\/wuliu\.taobao\.com\/user\/order_list_new\.htm",
	"detail": "(item\.taobao\.com|detail\.tmall\.com|\.95095\.com|detail\.tmall\.hk\/hk)\/item\.htm",
	"weike": "^https:\/\/weike\.taobao\.com\/"
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
 * regex         着陆页正则检测
 */
/***/
if(window.ironman_user_term_sycm_btn && !dy_$.cookie('close_cps')){
	store_get('ironman_3pad', function(r) {
		var partenrs = [];
	    console.log("3pad", r);
	    if(r){
	    	partenrs = r instanceof Array ? r : JSON.parse(r);
	    }
	    dy_$.getJSON('//ironman.moojing.com/static/ads_place.json', function(places){
		    dy_$.getJSON('//ironman.moojing.com/static/ads.json', function(data){
		        parse_ads_config(data, partenrs, places);	
		    });
	    });
	});
}

function parse_ads_config(config, partenrs, places){
	var date = new Date();
	var days = date.getDay();
	var hour = date.getHours();
	
	var ps = [];
	var ads = {};
	dy_$.each(config, function(i,o){
		//console.log(o);
		//handle click data
		if(o.skip_regex){
			var url = location.href.split("?")[0];
			if(url == o.link && $.inArray(o.id, partenrs)){
				ps.push(o.id);
			}
		}else{
			var pat = parse_ads_pat(o);
			if($.inArray(o.id, partenrs) >= 0 && pat.exec(location.href)){
				ps.push(o.id);
			}
		}
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
			ads[o.place] = {'cpc': [], 'cps': []};
		}
        var cls = o["class"] ? o["class"] : 'cps'; 		
        ads[o.place][cls].push(o);
	});
	
	if(ps.length > 0) {
        log_visit(ps);
    }
	
	console.log(ads);
	check_inject_ad(ads, places);
};

function parse_ads_pat(option){
	if(option.regex){
		return new RegExp(option.regex);
	}
	
	var m = /([a-z]+)\.([a-z0-9]+)\.(com|cn)/.exec(option.link);
	if(m){
	  return new RegExp(m[1]+"\."+m[2]+"\."+m[3]);
	}
	
	return new RegExp(option.link);
	
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
    	var cpc_count = ads[pid].cpc.length;
    	if(cpc_count > 0){
        	var rand = Math.ceil(Math.random()*cpc_count);
        	console.log("random cpc code", rand);
        	inject_ad(ads[pid].cpc[rand - 1], place);
    	}

    	var cps_count = ads[pid].cps.length;
    	if(cps_count > 0){
        	var rand = Math.ceil(Math.random()*cps_count);
        	console.log("random cps code", rand);
        	inject_ad(ads[pid].cps[rand - 1], place);
    	}
    });
};

var ads_container_html = '<div id="ironman_ads_container" style="margin:10px auto;padding:5px;width:1190px;text-align:center;position:relative;box-shadow: 0 0 1px 1px #f3f3f4;background: #f3f3f4;">'+
'<p style="font-size: 11px;">以下推广内容由'+ get_extension_name() +'提供</p></div>';

function ad_html(option, click_id){
	return '<div class="ironman_ad_container" style="position: relative;"><div style="position: absolute;right: 37px;top: 0;color: whitesmoke;font-size: 8px;">此推广内容由'+ get_extension_name() +'提供</div>'+
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
	
	dy_$('#'+click_id).click(function() {
        set_partner(option.id);
    });
	
	dy_$('.ironman-ad-close').on('click', function(){
		var id = dy_$(this).data("ad-id");
		dy_$.cookie(id, true, {expires: 1, domain: get_domain()});
		dy_$(this).parent('.ironman_ad_container').hide();
	})
	
    ironman_record_pv(option.id);
};
		
		
		
