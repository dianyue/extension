
/* ===========================================================
 * ironman_taobao.js
 * support taobao page show mojing data
 * ========================================================== */


var exposure_tip =  '曝光指数: 只通过宝贝的曝光关键词数量无法直接比较两个宝贝获取的流量大小。因为同样有10个词曝光的两个宝贝，其中一个可能都排在关键词下第一页，而另外一个都排在关键词下第5页。这样，虽然两者曝光词数量相同，但获取的流量却相差很大。还有另一种情况，同样都是10个曝光词的两个宝贝，关键词的排名也接近，但是其中一个宝贝在热词上曝光，而另外一个宝贝在长尾词上曝光，那么获得的流量也大不相同。曝光指数综合考虑 1) >关键词的全网搜索量 2) 宝贝在搜索结果中得排名 3) 曝光关键词数量，通过模型做出宝贝获取流量的最佳估计。近似于宝贝在搜索结果中获得的展现数量。';

var shorter = function(x) {
    if (x == null || x == undefined) {
        return '<span class="ironman-num">0</span>';
    }

    x = parseInt(x, 10);
    if (x > 100000000) {
        x = '<span class="ironman-num">' + (x / 100000000).toFixed(1) + '亿</span>';
    } else if(x > 10000000) {
        x = '<span class="ironman-num">' + (x / 100000000).toFixed(2) + '亿</span>';
    } else if(x > 100000) {
        x = '<span class="ironman-num">' + (x / 10000).toFixed(0) + '万</span>';
    }else if (x > 10000) {
        x = '<span class="ironman-num">' + (x / 10000).toFixed(1) + '万</span>';
    } else if(x > 1000) {
        x = '<span class="ironman-num">' + (x / 10000).toFixed(2) + '万</span>';
    } else if(x > 100) {
        x = '<span class="ironman-num">' + x.toFixed(0) + '</span>';
    } else if(x > 10) {
        x = '<span class="ironman-num">' + x.toFixed(0) + '</span>';
    }else if (x > 0) {
            x = '<span class="ironman-num">' + x.toFixed(0) + '</span>';
    }else {
            x = '<span class="ironman-num">' + x + '</span>';
    }
    return x;
};

window.ironman_shorter = shorter;


//parse lazyload data in textarea
var parseLazyWangWang = function(o) {
    var id = $(o).attr('id');
    //console.log($(o).attr('id'));
    var nick, sid;
    if (id == undefined) {
    	var nick_obj = $(o).find('span.shop-info-list .ww-light');
    	if(!nick_obj[0]){
    		nick_obj = $(o).find('span.shop-info-list .J_WangWang');
    	}
    	if(nick_obj[0]){
            nick = decodeURIComponent(nick_obj.data('nick'));
            sid = nick_obj.data('item');
            return {'nick': nick, 'sid': sid};
    	}else{
    		var tmp = $(o).find('textarea').val();
    		var pat_shop_nick = /data-nick=\"(.*)\" data-display/;
            var m = pat_shop_nick.exec(tmp);
            if (m) {
                nick = decodeURIComponent(m[1]);
            }else {
                console.log(tmp, 'parse data-nick fail.');
            }
            var m2 = /data-item=\"(\d+)\"/.exec(tmp);
            if (m2) {
                sid = m2[1];
            }
            return {'nick': nick, 'sid': sid};
    	}
    }else {
        var lazy_pat = /ks-lazyload(\d*)/;
        if (lazy_pat.exec(id)) {
            var tmp = $(o).find('textarea').val();
            var pat_shop_nick = /data-nick=\"(.*)\" data-display/;
            var m = pat_shop_nick.exec(tmp);
            if (m) {
                nick = decodeURIComponent(m[1]);
            }else {
                console.log(tmp, 'parse data-nick fail.');
            }
            var m2 = /data-item=\"(\d+)\"/.exec(tmp);
            if (m2) {
                sid = m2[1];
            }
            return {'nick': nick, 'sid': sid};
        }else {
            console.log(id, 'is not lazyload element. parse nick fail');
            return {'nick': nick, 'sid': sid};
        }
    }
};

//show shop mojing data for taobao shop search url
var handle_shop_search = function() {
    var wws = [];

    $('div#list-content li.list-item').each(function(i, o) {
        var ww = parseLazyWangWang(o);
        //console.log(ww);
        $(o).css({'height': (parseInt($(o).css('height')) + 125) + 'px'});
        $(o).append(
            '<div class="ironman-container"><div class="ironman-data">' +
                '<a href="http://www.moojing.com?f=syy_'+get_uid()+'" target="_blank" style="position: absolute;width: 77px;height: 83px;background-color: transparent;"></a>'+
                '<em class="ironman_large_up"></em>' +
                '<div class="row-fluid" style="color:white; margin-left:10%">' +
                    '<table class="ironman_shop_table">' +
                        '<tr>' +
                            '<td class="rtxt"><h3 style="display:inline;">自然搜索:</h3></td>' +
                            '<td><span class="ironman-txt">曝光指数</span></td>' +
                            '<td><span class="org_exposure"><a class="btn disabled">加载中...</a></span><span class="split">|</span></td>' +
                            '<td><span class="ironman-txt">宝贝数量</span></td>' +
                            '<td><span class="org_itemcount ironman-num">-</span>个<span class="split">|</span></td>' +
                            '<td><span class="ironman-txt">关键词数量</span></td>' +
                            '<td><span class="org_wordcount ironman-num">-</span>个<span class="split">|</span></td>' +
                            '<td><span class="ironman-txt">近30天销售额</span></td>' +
                            '<td><span class="sales">-</span>元<span class="split">|</span></td>' +
                            '<td><span class="ironman-txt">近30天销量</span></td>' +
                            '<td><span class="vol">-</span>件</td>' +
                            '<td class="ironman-link"><a target="_blank" href="http://console.moojing.com/dashboard#/shop_organic/' + ww.nick + '/general?f=syy_'+get_uid()+'">详情&gt;&gt;</a></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="rtxt"><h3 style="display:inline;">直通车:</h3></td>' +
                            '<td><span class="ironman-txt">曝光指数</span></td>' +
                            '<td><span class="simba_exposure">0</span><span class="split">|</span></td>' +
                            '<td><span class="ironman-txt">宝贝数量</span></td>' +
                            '<td><span class="simba_itemcount ironman-num">0</span>个<span class="split">|</span></td>' +
                            '<td><span class="ironman-txt">关键词数量</span></td>' +
                            '<td><span class="simba_wordcount ironman-num">0</span>个<span class="split">|</span></td>' +
                            '<td class="ironman-link"><a class="ironman-txt" target="_blank" href="http://console.moojing.com/dashboard#/shop_simba/' + ww.nick + '/general?f=syy_'+get_uid()+'">详情&gt;&gt;</a></td>' +
                            '<td></td><td></td><td></td><td></td>' +
                        '</tr>' +
                    '</table>' +
                '</div>' +
            '</div></div>'
        );

        wws.push(ww);
    });

    //console.log(wws);
    var ww_nicks = [];
    $.each(wws, function(i, o) {
        if (o.nick) {
            ww_nicks.push(o.nick);
        }
    });
    var jsonstr = $.toJSON({'wws': ww_nicks, 'moyan_fields': 'shop_sales30,shop_amount30'});
    var shop_map = {};
    //console.log(jsonstr);

    dy_$.ajax({
        url: MOJINGHOST + '/shop_info_get',
        type: "POST",
        data: jsonstr,
        success: function(data) {
            //console.log(data);
            $.each(data, function(i, o) {
                shop_map[o.shopinfo.ww] = o;
            });
            
            $('div#list-content li.list-item').each(function(i, o) {
                var ww = parseLazyWangWang(o);
                var d = shop_map[ww.nick];
                if (!d) {
                    d = {'shop_organic_expos': 0, 'shop_organic_sales': 0, 'shop_organic_vol': 0, 'shop_organic_itemcount': 0, 'shop_organic_wordcount': 0, 'shop_simba_expos': 0, 'shop_simba_itemcount': 0, 'shop_simba_wordcount': 0};
                }
                
                var s = {}
                if (d.moyan_res) {
                    for(var x in d.moyan_res){
                      s = d.moyan_res[x];
                    }
                    if(s.shop_sale30)    d.shop_organic_sales = s.shop_sales30;
                    if(s.shop_amount30)  d.shop_organic_vol = s.shop_amount30;
                }
                $(o).find('.org_exposure').html(shorter(d.shop_organic_expos));
                $(o).find('.sales').html(shorter(d.shop_organic_sales));
                $(o).find('.vol').html(shorter(d.shop_organic_vol));
                $(o).find('.org_itemcount').html(d.shop_organic_itemcount);
                $(o).find('.org_wordcount').html(d.shop_organic_wordcount);

                $(o).find('.simba_exposure').html(shorter(d.shop_simba_expos));
                $(o).find('.simba_itemcount').html(d.shop_simba_itemcount);
                $(o).find('.simba_wordcount').html(d.shop_simba_wordcount);
            });
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
    });

    function finish_sales(tag, data) {
        shopper_data[tag].finish = true;
        shopper_data[tag].data = data;

        if (shopper_data.mojing.finish && shopper_data.shopper.finish) {
            $.each(shopper_data.mojing.data, function(i, o) {
                shop_map[o.shopinfo.ww] = o;
            });
            
        }
    }
};

var parseItemDetailWW = function(ww_raw){
	ww_raw = $('.ww-light').data('nick');
	//console.log("get ww from timer", ww_raw);
};

//show single item mojing data for taobao item detail url
var handle_item_detail = function() {
    var m = /id=(\d+)/.exec(window.location);
    if (m == null) { return; }
    var item_id = m[1];

    var ww_node = $('.ww-light');
    var ww_raw;
    var is_tmall = /(detail\.tmall\.com|95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/.exec(window.location);
    try{
    	if(is_tmall){
 		   ww_raw = /sellerNickName\"*:\"([\%a-zA-Z0-9]+)\",/.exec(document.documentElement.innerHTML)[1];
 	   }else{
 		   ww_raw = /sellerNick\s*:\s*'(.*)',/.exec(document.documentElement.innerHTML)[1];
 	   }
    }catch(err){
    	console.log("g_config ", err);
    }
    
    if(!ww_raw){
    	if(ww_node[0]){
    		ww_raw = ww_node.data('nick');
    	}else if($('.J_WangWang')[0]){
    		ww_raw =  $('.J_WangWang').data('nick');
    	}else{
    		var timer;
    		while(!ww_raw){
    			if(timer) clearTimeout(timer);
    			timer = setTimeout(parseItemDetailWW, 200, [ww_raw]);
    		}
    	}
    }
    var ww = decodeURIComponent(ww_raw);
    //console.log(ww);

    var nav = $('.site-nav');
    var tmall_shop = false;
    if (!nav[0]) {
        nav = $('#site-nav');
        tmall_shop = true;
    }

    var body;
    if(tmall_shop) {
        body = $('#detail');
    } else {
        body = $('#bd');
    }

    body.before(
        '<div class="ironman-container ironman-item-detail-info" id="box' + item_id + '">' +
          '<div class="ironman-item-detail-avatar">' +
            '<a class="ironman-logo" href="http://www.moojing.com?f=syy_'+get_uid()+'" target="_blank"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /><span class="domain">moojing.com</span></a>'+
            '<div class="ironman-item-detail-base inline row-fluid" >' +
                '<div class="ironman-base ironman-detail-hover inline " data-group="mojing" data-subtype="organic">自然搜索<span class="org_exposure">加载中...</span><span class="split">|</span><span class="org_word_count ironman-num ironman-word-num">-</span>词</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="simba">直通车<span class="simba_exposure">-</span><span class="split">|</span><span class="simba_word_count ironman-num ironman-word-num">-</span>词</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="mobile">手机搜索<span class="mobile_exposure">-</span><span class="split">|</span><span class="mobile_word_count ironman-num ironman-word-num">-</span>词</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="online">下架时间<span class="offshelf_time ironman-num">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="user_count">在线人数<span class="user_count">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline cat" data-group="mojing" data-subtype="cat" >类目<span class="ironman-num catinfo_' + item_id + '">加载中...</span></div>' +
                '<div class="price-trend ironman-detail-hover inline" data-group="func" data-subtype="price" ironman-itemid="' + item_id + '"><span class="ironman-item-func">调价记录</span></div>' +
          '</div></div>'+
          '<div class="ironman-item-detail-popover hide">'+
                '<img class="ironman-collapse-h" src="https://img.alicdn.com/imgextra/i2/599244911/TB2LobohpXXXXa7XXXXXXXXXXXX-599244911.png"/>'+
                '<div class="ironman-mojing-detail ironman-item-organic hide"><h3>昨日自然搜索曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="org_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="org_exposure ironman-num">-</span></div></div>'+
                  '曝光关键词列表:  <span style="font-size:12px" class="ask-to-login hide">(未登录此处只能查看最多3个词，<a href="http://ext.moojing.com/please_login" target="_blank">登录</a>后可看更多)</span>' +
                  '<div class="orgdata ironman-ext-tbl" id="org_words_' + item_id + '">加载中...</div>' +
                  '<a class="ironman-mojing-more" href="http://console.moojing.com/dashboard#/shop_organic/' + ww_raw + '/general?f=syy_'+get_uid()+'" target="_blank">更多关键词数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>曝光指数:' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-simba hide"><h3>昨日直通车曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="simba_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="simba_exposure ironman-num">-</span></div></div>'+
                  '曝光关键词列表:  <span style="font-size:12px" class="ask-to-login hide">(未登录此处只能查看最多3个词，<a href="http://ext.moojing.com/please_login" target="_blank">登录</a>后可看更多)</span>' +
                  '<div class="simbadata ironman-ext-tbl" id="simba_words_' + item_id + '">加载中...</div>' +
                  '<a class="ironman-mojing-more" href="http://console.moojing.com/dashboard#/shop_simba/' + ww_raw + '/general?f=syy_'+get_uid()+'" target="_blank">更多关键词数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>曝光指数:' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-mobile hide"><h3>昨日手机搜索曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="mobile_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="mobile_exposure ironman-num">-</span></div></div>'+
                  '曝光关键词列表:  <span style="font-size:12px" class="ask-to-login hide">(未登录此处只能查看最多3个词，<a href="http://ext.moojing.com/please_login" target="_blank">登录</a>后可看更多)</span>' +
                  '<div class="mobiledata ironman-ext-tbl" id="mobile_words_' + item_id + '">加载中...</div>' +
                  '<a class="ironman-mojing-more" href="http://console.moojing.com/dashboard#/shop_mobile/' + ww_raw + '/general?f=syy_'+get_uid()+'" target="_blank">更多关键词数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>曝光指数:' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-online hide"><h3>下架时间</h3>'+
                  '<div class="row-fluid ironman-txt"><div class="ironman-data"><span class="offshelf_time_full ironman-num">-</span></div></div>'+
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-user_count hide"><h3>宝贝详情页实时在线人数</h3>'+
                  '<div class="row-fluid ironman-txt"><div id="box' + item_id + '" class="ironman-data"><span id="user_count_' + item_id + '" class="ironman-num">-</span></div></div>'+
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-cat hide"><h3>宝贝类目</h3>'+
                  '<div class="row-fluid ironman-txt"><div class="ironman-cat-data"><span class="ironman-num catinfo_full_' + item_id + '">-</span></div></div>'+
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+
           '</div>' +
           '<div class="ironman-item-func-popover hide">'+
                '<div class="ironman-mojing-func ironman-item-price hide"><h3>宝贝调价记录</h3><div class="widget">' +
                    '<div class="widget-header">宝贝历史最低价: <span class="lowest">-</span></div>' +
                    '<div class="widget-container clearfix">' +
                        '<div class="ironman-price-chart" id="price_trend_' + item_id + '">加载中...</div>' +
                    '</div>' +
                '</div>' + 
                '<div class="ironman-data-orig">*数据来自淘宝官方接口<br/>' +
                '</div>' +
           '</div>' +
        '</div>'
    );
    
    dy_$.ajax({
        url: MOJINGHOST + '/item_info_get',
        type: 'POST',
        crossDomain: true,
        data: $.toJSON({'items': [[ww, item_id]], 'include_words': true, 'include_mobile': true, 'moyan_fields': 'sales30,amount30'}),
        success: function(data) {
            if(data.length == 0){
              data = [{'organic_expos': 0, 'sales': 0, 'vol': 0, 'organic_wordcount': 0, 'simba_expos': 0, 'simba_wordcount': 0}];
            }
            var o = $('.ironman-item-detail-info');
            var d = data[0];
            //if(d.moyan_res){
            //  for(var a in d.moyan_res){
            //    if(d.moyan_res[a].sales30)    d.sales = d.moyan_res[a].sales30;
            //    if(d.moyan_res[a].amount30)  d.vol = d.moyan_res[a].amount30;
            //  } 
            //}
            //$(o).find('.org_sales').html(shorter(d.sales));
            //$(o).find('.org_vol').html(shorter(d.vol));
            var zero = '<span class="ironman-num">0</span>';
            var logged_in = d.logged_in;  
            //console.log('logged_in ' + logged_in);
            if(logged_in) {
                $('.ask-to-login').addClass("hide");
                $('.after-login-mj').removeClass("hide");
            }

            $(o).find('.org_exposure').html(d.organic_expos ? shorter(d.organic_expos) : zero);
            $(o).find('.simba_exposure').html(d.simba_expos ? shorter(d.simba_expos) : zero);
            $(o).find('.mobile_exposure').html(d.mobile_expos ? shorter(d.mobile_expos) : zero);
            
            var org_s = show_words_table(d.org_words, "organic", d.organic_expos);
            $(o).find('.orgdata').html(org_s);
            $(o).find('.org_word_count').html(d.organic_wordcount);

            var simba_s = show_words_table(d.simba_words, "simba", d.simba_expos);
            $(o).find('.simbadata').html(simba_s);
            $(o).find('.simba_word_count').html(d.simba_wordcount);

            var mobile_s = show_words_table(d.mobile_words, "mobile", d.mobile_expos);
            $(o).find('.mobiledata').html(mobile_s);
            $(o).find('.mobile_word_count').html(d.mobile_wordcount);

            $(o).find('.ironman_ts').html(d.ts);
            
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
    });

    if(tmall_shop){
    	parse_tmall_shelf_time(document.documentElement.innerHTML);
    }else{
    	parse_tb_shelf_time(document.documentElement.innerHTML);
    }
    online_user_count_get(item_id);
};

var detail_hover_timer;
var detail_func_timer;

dy_$('.ironman-detail-hover').live("hover", function(event){
	//console.log(event);
	var o = dy_$(this);
	var parent = o.parents('.ironman-container');
	if(event.type == "mouseenter" && o.data("group")){
		if(o.data("group") == "mojing"){
			if(detail_hover_timer) clearTimeout(detail_hover_timer);
			var offset = o.position().left + 13;
			parent.find(".ironman-item-detail-popover").css("left", offset+"px");
			parent.find(".ironman-item-detail-popover").removeClass("hide");
			var cname = "ironman-item-" + o.data("subtype");
			parent.find(".ironman-mojing-detail").addClass("hide");
			parent.find("." + cname).removeClass("hide");
			parent.find('.ironman-collapse-h').css("width", o.width()+"px");
		}else if(o.data("group") == "func"){
			if(detail_func_timer) clearTimeout(detail_func_timer);
			var width = parent.width();
			parent.find(".ironman-item-func-popover").css("width", (width-20)+"px");
			parent.find(".ironman-item-func-popover").removeClass("hide");
			var cname = "ironman-item-" + o.data("subtype");
			parent.find(".ironman-mojing-func").addClass("hide");
			parent.find("." + cname).removeClass("hide");
		}
	}else if(event.type == "mouseleave"){
		if(o.data("group") == "mojing"){
			detail_hover_timer = setTimeout(function(){parent.find(".ironman-item-detail-popover").addClass("hide");}, 200);
		}else if(o.data("group") == "func"){
			detail_func_timer = setTimeout(function(){parent.find(".ironman-item-func-popover").addClass("hide");}, 200);
		}
		
	}
});

dy_$('.ironman-item-detail-popover').live("hover", function(event){
	if(event.type == "mouseenter"){
		if(detail_hover_timer) clearTimeout(detail_hover_timer);
	}else if(event.type == "mouseleave"){
		dy_$('.ironman-item-detail-popover').addClass("hide");
	}
});

dy_$('.ironman-item-func-popover').live("hover", function(event){
	if(event.type == "mouseenter"){
		if(detail_func_timer) clearTimeout(detail_func_timer);
	}else if(event.type == "mouseleave"){
		dy_$('.ironman-item-func-popover').addClass("hide");
	}
});

//show list items mojing data for taobao item search url

window.ironman_page_sold = 0;
window.ironman_page_sold_amount = 0;
var handle_item_search = function() {
    //console.log('item search');
    if (itemSearch_timer) clearTimeout(itemSearch_timer);

    var ww_item_list = [];
    var item_ids = [];
    //console.log($('.list-content .list-item, .tb-content .item-box'));
    $('.list-content .list-item, .tb-content .item-box, .m-itemlist .items .item').each(function(i, o) {
    	if($(o).find('.ironman-container').length > 0) return;
        var item_id = ironman_item_id($(o));
        if (!item_id) return;
        var ww = ironman_item_nick($(o));
        if (!ww) return;
        try {
            var sold = ironman_item_sales($(o));
            window.ironman_page_sold += sold.sales_count;
            window.ironman_page_sold_amount += sold.sales_amount;
        }
        catch(e) {
                
        }
        var is_tmall = dy_$(o).find('.icon-service-tianmao').length > 0;

        ironman_itemSearch_UI($(o));

        //console.log(ww + ' ' + item_id);
        ww_item_list.push([ww, ''+item_id]);
        item_ids.push({"item_id": item_id, "is_tmall": is_tmall});
    });

    //console.log(window.ironman_page_sold);
    window.dispatchEvent(new CustomEvent('page_sold_ready'));

    if(ww_item_list.length > 0){
        mojing_iteminfo_get(ww_item_list);
        bg_offshelf_time_get(item_ids);
        
        $.each(ww_item_list, function(i, o) {
            //taobao_offshelf_time_get(o[1]);
            online_user_count_get(o[1]);
            //etao_price_trend_get(o[1]);
        });

    }
};

//search element data-itemid/ nid/ item_url to find itemid
var ironman_item_id = function(obj) {
    if (obj.data('itemid')) {
        return obj.data('itemid');
    }

    if (obj.hasClass('item-box') && obj.parents('.item').attr('nid')) {
        return obj.parents('.item').attr('nid');
    }

    var aobj = obj.find('.pic a, .photo a');
    if(aobj[0] && aobj.data('nid')){
        return aobj.data('nid');	
    }
    
    var item_url = aobj.attr('href');
    var m = /id=(\d+)/.exec(item_url);
    if (m) {
        return m[1];
    }
    
    return null;
};

var ironman_item_sales = function(o) {
    var soldstr = o.find('.deal-cnt').text();
    var r = /(.*)人/.exec(soldstr);
    var sold = parseInt(r[1]);

    var pricestr = o.find('.price strong').text();
    var price = parseFloat(pricestr);
    //console.log(price);

    if(!sold) {
        sold = 0;
    }
    if(!price) {
        price = 0;
    }

    return {sales_count: sold, sales_amount: price * sold};
};


var mojing_iteminfo_get = function(ww_item_list, not_words, not_mobile) {
    var item_map = {};
    var include_mobile = true;
    if(not_mobile) include_mobile = false;
    var include_words = true;
    if(not_words) include_words = false;

    dy_$.ajax({
        url: MOJINGHOST + '/item_info_get',
        type: "POST",
        crossDomain: true,
        data: $.toJSON({'items': ww_item_list, 'include_words': include_words, 'include_mobile': include_mobile}),
        success: function(data) {
            //console.log(data);
            if (data.length > 0) {
                $.each(data, function(i, o) {
                    item_map[o.itemId] = o;
                });
            }
            
            $('.ironman-container.ironman-item-info').each(function(i, o) {
                var item_id = ironman_item_id($(o).parent());
                //console.log(item_id);
                if (!item_id) return;

                var d = item_map[""+item_id];
                //console.log(d);
                if (!d) {
                    d = {'organic_expos': 0, 'simba_expos': 0};
                }
                
                var logged_in = d.logged_in;  
                //console.log('logged_in ' + logged_in);
                if(logged_in) {
                    $('.ask-to-login').addClass("hide");
                }

                var zero = '<span class="ironman-num">0</span>';

                $(o).find('.org_exposure').html(d.organic_expos ? shorter(d.organic_expos) : zero);
                $(o).find('.simba_exposure').html(d.simba_expos ? shorter(d.simba_expos) : zero);
                $(o).find('.mobile_exposure').html(d.mobile_expos ? shorter(d.mobile_expos) : zero);
                
                var org_s = show_words_table(d.org_words, "organic", d.organic_expos);
                $(o).find('.orgdata').html(org_s);
                $(o).find('.org_word_count').html(d.organic_wordcount);

                var simba_s = show_words_table(d.simba_words, "simba", d.simba_expos);
                $(o).find('.simbadata').html(simba_s);
                $(o).find('.simba_word_count').html(d.simba_wordcount);

                var mobile_s = show_words_table(d.mobile_words, "mobile", d.mobile_expos);
                $(o).find('.mobiledata').html(mobile_s);
                $(o).find('.mobile_word_count').html(d.mobile_wordcount);

                $(o).find('.ironman_ts').html(d.ts);

            });
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
    });
};

var nodata = {
	"organic": "没有自然搜索曝光数据",
	"simba": "没有直通车曝光数据",
	"mobile": "没有手机搜索曝光数据"
};
function show_words_table(data, dataType, expos){
	if(data == undefined){
		return nodata[dataType];
	}
	var tbl = '<table class="ironman-mojing-table '+dataType+'"><thead><tr><td>关键词</td><td>曝光指数</td><td class="ironman-word-rank">排名</td></tr></thead>'; 
	$.each(data, function(j, word) {
		var ratio = word.exposure * 100 / expos;
        tbl += '<tr><td>' + word.word + '</td>'+
          '<td><div class="ironman-num">' + word.exposure + '</div><div class="ironman-progress"><div class="ironman-trend" style="width: ' + ratio + '%"></div></div></td>'+
          '<td class="ironman-word-rank">' + word.rank + '</td></tr>';
    });
	tbl += '</table>';
	return tbl;
};

function format_date(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1 > 9?'':'0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9?'':'0') + d.getDate() +
        ' ' + (d.getHours() > 9?'':'0') + d.getHours() + ':' + (d.getMinutes() > 9?'':'0') + d.getMinutes();
};

var taobao_offshelf_time_get = function(item_id, callback) {
    bg_get('http://md.item.taobao.com/modulet/jsonp.do?id=' + item_id + '&name=itemSalesProperties', function(r) {
    	console.log(r);
    	try{
    		r = r.replace('___jsonp___(', '').replace(');', '');
            r = JSON.parse(r);
            var end = r.itemSalesProperties.data.itemEnds;
            var catid = r.itemSalesProperties.data.leafCategoryId;
            //console.log(catid);
            var d = new Date(end);
            $('#box' + item_id + ' .offshelf_time').html(format_date(d).substr(5));
            $('#box' + item_id + ' .offshelf_time_full').html(format_date(d));
            $('#box' + item_id + ' .cat').attr('ironman-catid', catid);
            $('#box' + item_id + ' .cat').attr('ironman-itemid', item_id);

            if(callback) {
                callback();
            }
    	}catch(err){
    		
    	}
    });

};

//var parse_category_info = function(item_ids){
//	var m = /g_page_config\s*=\s*(.*?\});/.exec(document.documentElement.innerHTML);
//	if(m){
//		var g_page_config = JSON.parse(m[1]);
//		console.log(g_page_config);
//		var p4p_data = JSON.parse(g_page_config.mods.p4p.data.p4pdata);
//	}
//	
//};

var parse_tb_shelf_time = function(content){
	var m = /dbst\s*:\s*(\d+),/.exec(content);
	var item_id = /itemId\s*:\s*'(\d+)',/.exec(content)[1];
	var catid = /\scid\s*:\s*'(\d+)',/.exec(content)[1];
	//console.log(content);
	if(m){
		var dbst = parseInt(m[1], 10);
		var now = new Date();
		var delta = Math.ceil((now.getTime() - dbst)/ (7*24*3600*1000));
		var d = new Date(dbst + (delta * 7*24*3600*1000));
		//console.log(false, item_id, d);
		dy_$('#box' + item_id + ' .offshelf_time').html(format_date(d).substr(5));
		dy_$('#box' + item_id + ' .offshelf_time_full').html(format_date(d));
		dy_$('#box' + item_id + ' .cat').attr('ironman-catid', catid);
        dy_$('#box' + item_id + ' .cat').attr('ironman-itemid', item_id);
        
        var o = dy_$('#box'+item_id);
        if(o.hasClass('ironman-item-detail-info')){
        	ironman_get_catinfo(o.find('.cat'));
        }
	}
};

var parse_tmall_shelf_time = function(content){
	var m = /tbskip\.taobao\.com\/json\/show_bid_count\.htm\?itemNumId=(\d+)&old_quantity=(\d+)&date=(\d+)/.exec(content);
	//console.log(content);
	if(m){
		var item_id = m[1];
		var d = new Date(parseInt(m[3], 10) + 7*24*3600*1000);
		var catid = /\"categoryId\"\s*:\s*\"(\d+)\",/.exec(content)[1];
		//console.log(true, item_id, d);
		dy_$('#box' + item_id + ' .offshelf_time').html(format_date(d).substr(5));
		dy_$('#box' + item_id + ' .offshelf_time_full').html(format_date(d));
		dy_$('#box' + item_id + ' .cat').attr('ironman-catid', catid);
        dy_$('#box' + item_id + ' .cat').attr('ironman-itemid', item_id);
        
        var o = dy_$('#box'+item_id);
        if(o.hasClass('ironman-item-detail-info')){
        	ironman_get_catinfo(o.find('.cat'));
        }
	}
};

var bg_offshelf_time_get = function(item_ids, callback){
	$.each(item_ids, function(i, o){
		var url = o.is_tmall ? "https://detail.tmall.com/item.htm?id=" : "https://item.taobao.com/item.htm?id=";
		bg_get(url+o.item_id, function(r){
			//console.log(o);
			if(o.is_tmall){
				parse_tmall_shelf_time(r);
			}else{
				parse_tb_shelf_time(r);
			}
		});
	});
};

var online_user_count_get = function(item_id) {
	xhr_get('https://lu.taobao.com/api/item?type=view_count&id='+ item_id +'&_ksTS=1412581008734_87&callback=jsonp112&p=u&from=mypath&f=jp&jsonpCallback=jsonp', function(r) {
        r = r.replace('jsonp112(', '').replace(')', '');
        r = JSON.parse(r);
        var c = r.listDesc.view_count;
        $('#box' + item_id + ' .user_count').html(shorter(c));
        $('#box' + item_id + ' #user_count_'+item_id).html(c);
    });
};

var update_price_chart = function(series, item_id) {
	dy_Highcharts.setOptions({colors: ['#4A90E2', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']});
    var options = {
        chart: {
            renderTo: "price_trend_" + item_id,
            type: "line",
            backgroundColor: "#0C0C1E"
        },
        legend: {
            enabled: false
        },
        title: {
            text: null
        },
        tooltip: {
            xDateFormat: "%Y-%m-%d",
            shared: true
        },
        xAxis: {
            type: "datetime",
            minTickInterval: 24*3600*1000,
            title: {
                text: null
            },
            labels: {
                formatter: function() {
                    var d = new Date(0);
                    d.setUTCSeconds(this.value/1000);
                    return (d.getMonth() + 1 > 9?'':'0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9?'':'0') + d.getDate();
                }
            }
        },
        yAxis: [{
            title: {
                text: '价格'
            }
        }],
        series: [
            {
                name: '价格', 
                data: series, 
                tooltip: { valueSuffix: '元'},
                marker: {radius: 1},
                lineWidth: 1
            },
        ],
        credits: { enabled: false},
        plotOptions: {

        }
    };

    var chart = new dy_Highcharts.Chart(options);

};

var str_to_date = function(k, s) {
	if(!s){
		s = '-';
	}
    var dlist = k.split(s);
    var t = Date.UTC(parseInt(dlist[0]), parseInt(dlist[1]) - 1, parseInt(dlist[2]));
    return t;
};

var date_to_str = function(t, s) {
    var d = new Date(t);
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth() + 1;
    var day = d.getUTCDate();
    if(!s){
    	s = '-'
    }
    return year + s + (month > 9? month: '0' + month) + s + (day > 9? day: '0' + day);
};

var generate_price_series = function(data) {

    var start_k = data.pcinfo.info[0].dt;
    var start_t = str_to_date(start_k, '/');

    var today = new Date();
    var end_t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    var pricemap = {};
    $.each(data.pcinfo.info, function(i, o) {
        pricemap[o.dt] = parseFloat(o.pr);
    });


    var t = start_t;
    var price = null;
    var price_series = [];
    while(t <= end_t) {
        k = date_to_str(t, '/');
        if(pricemap[k]) {
            price = pricemap[k];
        }
        price_series.push([t, price]);
        t += 1000 * 3600 * 24;
    }
    console.log(price_series);
    return price_series;
    
};

var etao_price_trend_get = function(o) {
    if($(o).parents('.ironman-container').find('.ironman-price-chart').attr('done')) {
        return;
    }

    var item_id = $(o).attr('ironman-itemid');
    var item_url = "https://item.taobao.com/item.htm?id="+item_id;
    var base_url = 'https://gouwudai.360.cn/api.html?' +
    	'path1=qihoo-mall-goodsinfo&path2=goodspricecmp&prevpop=&v=v5&bfrom=normal&pop=1&cv=4.2.0.3' +
        '&hisOpn=0&toolbar_state=open&isGulike=false&mid=&tPrice=&tSale=&fromTp=0' +
    	'&url=' + encodeURIComponent(item_url) +
    	'&ref=' + encodeURIComponent(item_url);
    
    //console.log(base_url);
    bg_get(base_url, function(r) {
    	r = JSON.parse(r);
        console.log(r);
        var series = generate_price_series(r);
        update_price_chart(series, item_id);
        $(o).parents('.ironman-container').find('.ironman-price-chart').attr('done', 1);

        /*
        var price_box = $(o).find('div.ironman-price-chart');
        price_box.html('<table class="price-table" border="1"><tr><td>日期</td><td>价格</td></tr></table>');
        $.each(r.result[0].data, function(i, o) {
            price_box.find('table').append('<tr><td>' + o[0] + '</td><td>' + o[1] + '&nbsp;元</td></tr>');
        });
        */
        $(o).parents('.ironman-container').find('.lowest').html(r.pcinfo.lpr + '&nbsp;元');
    });
};

function pic_reg_hover(){
  $('.pic-box').hover(function(){
      var obj = $(this).parents('.item');
      if(obj){
        obj.find('.similar-btns').removeClass("hide");
        obj.find('.similars .btn').removeClass("hide");
        obj.find('.report').removeClass("hide");
      }
    }, function(){
      var obj = $(this).parents('.item');
      if(obj){
        obj.find('.similar-btns').addClass("hide");
        obj.find('.similars .btn').addClass("hide");
        obj.find('.report').addClass("hide");
      }
  });
}

var ironman_itemSearch_UI = function(obj) {
    var p = /s\.taobao\.com\/search(.*)type=similar/;
    var p2 = /s\.taobao\.com\/list(.*)/;
    //console.log(obj);
    if(obj.hasClass('st-itembox') || p.exec(location.href)){
      //console.log(obj);
      obj.parents('.st-item').css({'height': (parseInt(obj.css('height')) + 70) + 'px'});
      //obj.parents('.st-item')
      obj.find('.pic').css('overflow','visible');
      obj.find('.pic-box').css('height', 'auto');
      obj.find('.pic-box').css('padding', 0);
      obj.find('.similar-btns').addClass("hide");
      pic_reg_hover();
    }else if(p2.exec(location.href)){
      obj.css({'height': (parseInt(obj.css('height')) + 70) + 'px'});
      obj.find('.summary').css({'top': (parseInt(obj.find('.summary').css('top')) + 70) + 'px'});
    }else{
      obj.css({'height': (parseInt(obj.css('height')) + 70) + 'px'});
      //obj.parents('.st-item')
      obj.find('.pic-box').css('overflow','visible');
      obj.find('.pic-box').css('height', 'auto');
      obj.find('.pic-box').css('padding', 0);
      obj.find('.report').css({'top': '0px'});
      obj.find('.report').css({'right': '0px'});
      obj.find('.report').addClass("hide");
      obj.find('.similars .btn').addClass("hide");
      pic_reg_hover();
    }
    var item_id = ironman_item_id(obj);
    var ww = ironman_item_nick(obj);
    var ww_raw = encodeURIComponent(ww);


    obj.prepend(
        '<div class="ironman-container ironman-item-info"  id="box' + item_id + '">' +
            '<div class="ironman-item-avatar">'+
                '<a class="ironman-logo" href="http://www.moojing.com?f=syy" target="_blank"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /></a>'+
                '<div class="row-fluid">' +
                      '<span class="ironman-data ironman-hover" data-group="mojing" data-subtype="organic">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_organic.png" />' + 
                        '<span class="org_exposure">加载中...</span>' +
                      '</span><span class="ironman-data ironman-hover" data-group="mojing" data-subtype="simba">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_simba.png" />' + '<span class="simba_exposure">-</span>' +
                      '</span>' +
                '</div><div class="row-fluid">' + 
                      '<span class="ironman-data ironman-hover" data-group="mojing" data-subtype="mobile">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_mobile.png" />' + ' <span class="mobile_exposure">-</span>' +
                      '</span><span class="ironman-data ironman-hover" data-group="more" data-subtype="online">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_online.png" /><span class="user_count">-</span>' + 
                      '</span>'+
                '</div><div class="row-fluid">' +
                      '<span class="ironman-data ironman-hover" data-group="more" data-subtype="offshelf" style="width:70%;">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_unshelf.png" /><span class="offshelf_time ironman-num">-</span>' +
                      '</span><span class="price-trend ironman-hover pull-right" data-group="mojing" data-subtype="price" ironman-itemid="' + item_id + '">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_price.png" /></span>' +
                      '<span class="cat ironman-hover pull-right" data-group="more" data-subtype="cat">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_cat.png" /></span>' + 
                '</div>' +
            '</div>' +
            '<div class="ironman-item-more hide">'+
                '<div class="ironman-detail ironman-offshelf hide"><div class="ironman-tag-title">宝贝的下架时间:</div><div class="offshelf_time_full" id="offshelf_time_' + item_id + '">加载中...</div><div class="ironman-data-orig">*数据来自淘宝官方接口</div></div>' +
                '<div class="ironman-detail ironman-online hide"><div class="ironman-tag-title">宝贝详情页上的实时在线人数:</div><div id="user_count_' + item_id + '">加载中...</div><div class="ironman-data-orig">*数据来自淘宝官方接口</div></div>' +
                '<div class="ironman-detail ironman-cat hide"><div class="ironman-tag-title">宝贝所属类目:</div><div class="catinfo_full_' + item_id + '">加载中...</div><div class="ironman-data-orig">*数据来自淘宝官方接口</div></div>' +
            '</div>' +
            '<div class="ironman-item-popover hide">'+
                 '<img class="ironman-collapse" src="'+ HOST +'/static/image/m/m_collage.png"/>'+
                 '<div class="ironman-mojing-detail ironman-item-organic hide"><h3>昨日自然搜索曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                   '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="org_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="org_exposure ironman-num">-</span></div></div>'+
                   '曝光关键词列表:<div class="orgdata ironman-ext-tbl" id="org_words_' + item_id + '">加载中...</div>' +
                   '<a class="ironman-mojing-more" href="http://console.moojing.com/dashboard#/shop_organic/' + ww_raw + '/general?f=syy_'+get_uid()+'" target="_blank">更多关键词数据查询></a><br/>'+
                   '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                 '</div>'+
                 '<div class="ironman-mojing-detail ironman-item-simba hide"><h3>昨日直通车曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                   '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="simba_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="simba_exposure ironman-num">-</span></div></div>'+
                   '曝光关键词列表:<div class="simbadata ironman-ext-tbl" id="simba_words_' + item_id + '">加载中...</div>' +
                   '<a class="ironman-mojing-more" href="http://console.moojing.com/dashboard#/shop_simba/' + ww_raw + '/general?f=syy_'+get_uid()+'" target="_blank">更多关键词数据查询></a><br/>'+
                   '<div class="ironman-data-orig">*数据来自魔镜<br/>曝光指数:' + exposure_tip + '</div>' +
                 '</div>'+
                 '<div class="ironman-mojing-detail ironman-item-mobile hide"><h3>昨日手机搜索曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                   '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="mobile_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="mobile_exposure ironman-num">-</span></div></div>'+
                   '曝光关键词列表:<div class="mobiledata ironman-ext-tbl" id="mobile_words_' + item_id + '">加载中...</div>' +
                   '<a class="ironman-mojing-more" href="http://console.moojing.com/dashboard#/shop_mobile/' + ww_raw + '/general?f=syy_'+get_uid()+'" target="_blank">更多关键词数据查询></a><br/>'+
                   '<div class="ironman-data-orig">*数据来自魔镜<br/>曝光指数:' + exposure_tip + '</div>' + 
                 '</div>'+
                 '<div class="ironman-mojing-detail ironman-item-price hide">' +
                   '<div class="ironman-tag-title">宝贝调价记录</div><div class="ironman-tag-title">宝贝历史最低价: <span class="lowest">-</span></div><div class="ironman-price-chart" id="price_trend_' + item_id + '">加载中...</div>'+
                   '<div class="ironman-data-orig ironman-data-price">*数据来自淘宝官方接口</div>' +
                 '</div>' +
            '</div>' +
        '</div>'
    );
    
};

var hover_timer;
var more_timer;

dy_$('.ironman-item-info .price-trend').live("hover", function(){etao_price_trend_get(this)});

dy_$('.ironman-item-info .cat').live("hover", function(){ironman_get_catinfo(this);});

dy_$('.ironman-item-detail-info .price-trend').live("hover", function(){etao_price_trend_get(this)});

dy_$('.ironman-hover').live("hover", function(event){
	//console.log(event);
	var o = dy_$(this);
	var img = o.find('img.ironman-img-tag');
	var parent = o.parents('.ironman-container');
	if(img[0]){
		var img_url = img.attr("src");
		//console.log(img_url);
		if(event.type == "mouseenter"){
			img.attr("src", img_url.substring(0, img_url.length - 4) + "_hover.png");
			dy_$(".ironman-item-more").addClass("hide");
			dy_$(".ironman-item-popover").addClass("hide");
			if(o.data("group") == "more"){
				if(more_timer) clearTimeout(more_timer);
				parent.find(".ironman-item-more").removeClass("hide");
				parent.find(".ironman-detail").addClass("hide");
				var cname = "ironman-" + o.data("subtype");
				parent.find(".ironman-data-orig").removeClass("hide");
				parent.find("." + cname).removeClass("hide");
			}else if(o.data("group") == "mojing"){
				if(hover_timer) clearTimeout(hover_timer);
				//console.log(o.offset(), o.position(), o.width());
				var offset = o.position().left + o.width() - 20;
				parent.find(".ironman-item-popover").css("left", offset+"px");
				parent.find(".ironman-item-popover").removeClass("hide");
				parent.find(".ironman-mojing-detail").addClass("hide");
				var cname = "ironman-item-" + o.data("subtype");
				parent.find("." + cname).removeClass("hide");
			}
		}else if(event.type == "mouseleave"){
			img.attr("src", img_url.substring(0, img_url.length-10) + ".png");
			if(o.data("group") == "more"){
				more_timer = setTimeout(function(){parent.find(".ironman-item-more").addClass("hide");}, 200);
			}else if(o.data("group") == "mojing"){
				hover_timer = setTimeout(function(){parent.find(".ironman-item-popover").addClass("hide");}, 200);
			}
		}
	}
});

dy_$('.ironman-item-popover').live("hover", function(event){
	if(event.type == "mouseenter"){
		if(hover_timer) clearTimeout(hover_timer);
	}else if(event.type == "mouseleave"){
		dy_$('.ironman-item-popover').addClass("hide");
	}
});

dy_$('.ironman-item-more').live("hover", function(event){
	if(event.type == "mouseenter"){
		if(more_timer) clearTimeout(more_timer);
	}else if(event.type == "mouseleave"){
		dy_$('.ironman-item-more').addClass("hide");
	}
});

var catinfo_cache = {};
window.ironman_get_catinfo = function(o) {
    var cid = $(o).attr('ironman-catid');
    cid = parseInt(cid);
    var item_id = $(o).attr('ironman-itemid');

    var catname = catinfo_cache[cid];
    if(!catname) {
    	dy_$.ajax({
    		url: 'https://ironman.taosem.com/catinfo?cat_ids=' + cid, 
    		type: "GET",
    		success: function(r) {
    			catname = r.catinfo[cid];
    	        $('.catinfo_' + item_id).html(catname.cname);
    	        $('.catinfo_full_' + item_id).html(catname.full_cname);
    	        catinfo_cache[cid] = catname;
    	    },
    	    dataType: 'json',
            xhrFields: {withCredentials: true}
        });
    } else {
        $('.catinfo_' + item_id).html(catname.cname);
        $('.catinfo_full_' + item_id).html(catname.full_cname);
    }
};

var ironman_item_nick = function(obj) {
	var p4p = obj.find('a.p4p-shopname, a.shopname');
	//console.log(p4p);
	if(p4p[0]){
		var ww_node = p4p.find('span:last');
		//console.log(ww_node);
		return ww_node.text();
	}
    var ww_node = obj.find('.ww-light');
    var ww_raw;
    if (ww_node.length == 0) {
        ww_raw = obj.find('.J_WangWang').data('nick');
    }else {
        ww_raw = ww_node.data('nick');
    }
    var ww = ww_raw ? decodeURIComponent(ww_raw) : ww_raw;
    return ww;
}

var listItem_timer;

var check_listItem_load = function(){
    if ($('.list-container').hasClass('list-container-loading')){
    	//console.log("list timer start");
        listItem_timer = setTimeout(check_listItem_load, 200);
    }else{
        clearTimeout(listItem_timer);
        handle_itemlist_search();
        window.onscroll = handle_itemlist_search;
    }
}

var handle_itemlist_search = function() {
    var ww_item_list = [];
    var item_ids = [];

    dy_$('.items .item').each(function(i, o) {
    	//console.log(dy_$(o));
        if(dy_$(o).find('.ironman-container').length > 0) return;
        var item_id = ironman_item_id(dy_$(o));
        if (!item_id) return;
        var ww = ironman_item_nick(dy_$(o));
        if (!ww) return;

        ironman_itemSearch_UI(dy_$(o));
        var is_tmall = dy_$(o).find('.icon-service-tianmao').length > 0;

        //console.log(ww + ' ' + item_id);
        ww_item_list.push([ww, ''+item_id]);
        item_ids.push({"item_id": item_id, "is_tmall": is_tmall});
    });
    
    if(ww_item_list.length > 0){
        mojing_iteminfo_get(ww_item_list);   
        bg_offshelf_time_get(item_ids);

        $.each(ww_item_list, function(i, o) {
            //taobao_offshelf_time_get(o[1]);
            online_user_count_get(o[1]);
        });
    }
};

//show shop mojing data for taobao shop homepage
handle_shop_detail = function() {
    var shoplogos = [$('#shop-head'), $('.industry-logo'), $('.shop-logo'), $('.logo-search'), $('#shop-info'), $('#mallLogo'), $('.tbsHeader-logo')];
    var isShop = false;
    $.each(shoplogos, function(i, o) {
        if (o.length > 0) {
            isShop = true;
        }
    });

    if (!isShop) {
          return;
    }

    var obj = $('div#header');
    if (!obj[0]) {
        obj = $('div#tbsHeader');
    }

    var ww_node = $('.ww-light');
    var ww_raw;
    if (ww_node.length == 0) {
        ww_raw = $('.J_WangWang').data('nick');
    } else {
        ww_raw = ww_node.data('nick');
    }

    var ww = decodeURIComponent(ww_raw);

    if (ww_raw == null || ww_raw == undefined) {
        //console.log('no ww skip');
        return;
    }

    if (!obj[0]) {
        //console.log('shop header missed!');
        return;
    }

    var nav = $('.site-nav');
    var tmall_shop = false;
    if (!nav[0]) {
        nav = $('#site-nav');
        tmall_shop = true;
    }

    nav.after(
        '<div class="ironman-container"><div class="ironman-shop-info"><div class="ironman-shop-detail">' +
            '<a href="http://www.moojing.com?f=syy_'+get_uid()+'" target="_blank" style="position: absolute;width: 77px;height: 83px;background-color: transparent;"></a>'+
            '<div class="row-fluid" style="color:white; margin-left:10%">' +
                '<table class="ironman_shop_table">' +
                    '<tr>' +
                        '<td class="rtxt"><h3 style="display:inline;">自然搜索:</h3></td>' +
                        '<td><span class="ironman-txt">曝光指数</span></td>' +
                        '<td><span class="org_exposure"><a class="btn disabled">加载中...</a></span><span class="split">|</span></td>' +
                        '<td><span class="ironman-txt">宝贝数量</span></td>' +
                        '<td><span class="org_itemcount ironman-num">-</span>个<span class="split">|</span></td>' +
                        '<td><span class="ironman-txt">关键词数量</span></td>' +
                        '<td><span class="org_wordcount ironman-num">-</span>个<span class="split">|</span></td>' +
                        '<td><span class="ironman-txt">近30天销售额</span></td>' +
                        '<td><span class="sales">-</span>元<span class="split">|</span></td>' +
                        '<td><span class="ironman-txt">近30天销量</span></td>' +
                        '<td><span class="vol">-</span>件</td>' +
                        '<td class="ironman-link"><a target="_blank" href="http://console.moojing.com/dashboard#/shop_organic/' + ww + '/general?f=syy_'+get_uid()+'">详情&gt;&gt;</a></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="rtxt"><h3 style="display:inline;">直通车:</h3></td>' +
                        '<td><span class="ironman-txt">曝光指数</span></td>' +
                        '<td><span class="simba_exposure">0</span><span class="split">|</span></td>' +
                        '<td><span class="ironman-txt">宝贝数量</span></td>' +
                        '<td><span class="simba_itemcount ironman-num">0</span>个<span class="split">|</span></td>' +
                        '<td><span class="ironman-txt">关键词数量</span></td>' +
                        '<td><span class="simba_wordcount ironman-num">0</span>个<span class="split">|</span></td>' +
                        '<td class="ironman-link"><a class="ironman-txt" target="_blank" href="http://console.moojing.com/dashboard#/shop_simba/' + ww + '/general?f=syy_'+get_uid()+'">详情&gt;&gt;</a></td>' +
                        '<td></td><td></td><td></td><td></td>' +
                    '</tr>' +
                '</table>' +
            '</div>' +
        '</div></div></div>'
    );
    //add padding for taobao css
    if (tmall_shop) {
        $('.ironman-shop-info').css('padding-bottom', '30px');
    }
    
    var ww_item_list = [];
    //for list and grid
    if (/&viewType=list/.exec(window.location)) {
        $('.main-wrap .skin-box-bd .item-wrap').each(function(i, o) {
            $(o).before(
                '<div class="ironman-container ironman-item-info">' +
                    '<div class="row-fluid">' +
                        '<div class="span2" style="text-align: left;"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /></div>' +
                        '<div class="span5">' +
                            '<div class="row-fluid">' +
                            '<span class="ltxt span6">自然搜索曝光:</span> <span class="org_exposure pull-right"><a class="btn disabled">加载中...</a></span>' +
                            '</div><div class="row-fluid">' +
                            '<span class="ltxt span6">直通车曝光:</span> <span class="simba_exposure pull-right">-</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
            var item_url = $(o).find('.item').find('.pic a, .photo a').attr('href');
            var m = /id=(\d+)/.exec(item_url);
            if (m) { 
            	ww_item_list.push([ww, '' + m[1]]);
            }
        });
    }else {
        $('.main-wrap .skin-box-bd .item').each(function(i, o) {
            $(o).prepend(
                '<div class="ironman-container ironman-item-info">' +
                    '<div class="row-fluid">' +
                        '<div class="span3" style="text-align: left;"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /></div>' +
                        '<div class="span9">' +
                        '<div class="row-fluid">' +
                            '<span class="ltxt span6">自然搜索:</span> <span class="org_exposure pull-right"><a class="btn disabled">加载中...</a></span>' +
                            '</div><div class="row-fluid">' +
                            '<span class="ltxt span6">直通车:</span> <span class="simba_exposure pull-right">-</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
            var item_url = $(o).find('.pic a, .photo a').attr('href');
            var m = /id=(\d+)/.exec(item_url);
            if (m) { 
            	ww_item_list.push([ww, '' + m[1]]);
            }
        });
    }

    dy_$.ajax({
        url: MOJINGHOST + '/shop_info_get',
        type: 'POST',
        data: $.toJSON({'wws': [ww], 'include_items': false, 'moyan_fields': 'shop_sales30,shop_amount30'}),
        success: function(data) {
            if (data.length == 0) {
                data = [{'shop_organic_expos': 0, 'shop_organic_sales': 0, 'shop_organic_vol': 0, 'shop_organic_itemcount': 0, 'shop_organic_itemcount': 0, 'shop_organic_wordcount': 0, 'shop_simba_expos': 0, 'shop_simba_itemcount': 0, 'shop_simba_wordcount': 0, 'items': []}];
            }
            var o = $('.ironman-shop-detail');
            var d = data[0];
            if (d.moyan_res) {
                var moyan_data = {};
                for(var k in d.moyan_res){
                    moyan_data = d.moyan_res[k];
                }
                if(moyan_data.shop_sales30)    d.shop_organic_sales = moyan_data.shop_sales30;
                if(moyan_data.shop_amount30)    d.shop_organic_vol = moyan_data.shop_amount30;
            }
            $(o).find('.sales').html(shorter(d.shop_organic_sales));
            $(o).find('.vol').html(shorter(d.shop_organic_vol));
            $(o).find('.org_exposure').html(shorter(d.shop_organic_expos));
            $(o).find('.org_itemcount').html(d.shop_organic_itemcount);
            $(o).find('.org_wordcount').html(d.shop_organic_wordcount);

            $(o).find('.simba_exposure').html(shorter(d.shop_simba_expos));
            $(o).find('.simba_itemcount').html(d.shop_simba_itemcount);
            $(o).find('.simba_wordcount').html(d.shop_simba_wordcount);

        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
    });
    
    //console.log(ww_item_list);
    if(ww_item_list.length > 0){
    	mojing_iteminfo_get(ww_item_list, true, true);
    }
}

function check_search() {
	var pat = /s\.taobao\.com\/search(.*)app=shopsearch/;
	if (pat.exec(window.location)) {
		$(document).ready(handle_shop_search);
	}

	var pat_shop_detail = /\.taobao\.com|\.tmall\.com|\.jiyoujia\.com|\.95095.com/;
	var pat_shop_detail2 = /^(http:|https:)\/\/(item\.taobao\.com|detail\.tmall\.com|trade\.taobao\.com|list\.tmall\.com|(.*)\.tmall\.com\/service|(.*)\.95095\.com\/item\.htm)/;
	if (pat_shop_detail.exec(window.location)
			&& !pat_shop_detail2.exec(window.location)) {
		handle_shop_detail();
	}

	var pat_item_detail = /(item\.taobao\.com|detail\.tmall\.com|\.95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/;
	if (pat_item_detail.exec(window.location)) {
		handle_item_detail();
	}

	var pat_item_search = /s\.taobao\.com/;
	if (pat_item_search.exec(window.location)) {
		var shop_pat = /s\.taobao\.com\/search(.*)app=shopsearch/;
		if (shop_pat.exec(window.location)) {
			console.log('this is shop url');
		} else {
			//$(document).scrollTop(700);
			//sleep to lazyload finish
			itemSearch_timer = setTimeout(handle_item_search, 200);
			window.onscroll = handle_item_search;
		}
	}

	var pat_cat_search = /^(http:\/\/|https:\/\/)list\.taobao\.com\/itemlist\/(.*)style=grid/;
	if (pat_cat_search.exec(window.location)) {
		listItem_timer = setTimeout(check_listItem_load, 200);
		//console.log('skip now');
	}
}

//start inject taobao page
if (window.ironman_mojing == 1 && window == window.top) {
   check_search();
   //console.log("new dbg");
}
