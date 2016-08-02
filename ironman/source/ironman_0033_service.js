/* ===========================================================
 * ironman_service.js 
 * add mojing ad on service
 * ========================================================== */
var no_ad_users = ['智域母婴专营店'];

var handle_mai = function(){
    var userNick = $('.user-nick').text();
    if($.cookie("close_service_ad")){
      return;
    }
    for(var i=0; i < no_ad_users.length; i++){
        if(userNick.indexOf(no_ad_users) >= 0){
            return;
        }
    }
    
    dy_$.getJSON(HOST + '/static/services.json', function(data){
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
	var adHtml= '<div id="ironman_ad_left" style="position: fixed; width: 100px; z-index: 100010; top: 5%; left: 5px;background: #f3f3f4;">' +
        '<div style="position: absolute;right: 37px;top: 0;color: whitesmoke;font-size: 8px;">此推广内容由'+ get_extension_name() +'提供</div>'+
        '<a href="'+ cfg.link +'"><img src="'+ cfg.img_src+'" width="100"></a>' +
        '<div class="ironman_ad_close" style="color: #000000; font-size: 18px; font-weight: bold; line-height: 18px; padding: 1px 6px; position: absolute; right: 1px; text-shadow: 0 1px 0 #FFFFFF; top: 1px; cursor:pointer;">x</div>' +
        '</div>';
    dy_$(document.body).append(adHtml);
    dy_$('.ironman_ad_close').live('click', function(){
        dy_$.cookie("ironman_"+cfg.id, true, {expires: 1, domain: ".taobao.com"});
        dy_$('#ironman_ad_left').hide();
    });
}

var mai_home = /^(http:|https:)\/\/(mai.taobao.com\/seller_admin.htm|myseller.taobao.com\/seller_admin.htm|trade.taobao.com\/trade\/itemlist)/;
var mPart = mai_home.exec(window.location);
if( mPart && window == window.top){
    handle_mai();
}

