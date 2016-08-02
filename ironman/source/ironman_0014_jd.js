
console.log('jd running');
var JDHOST = 'https://jd.moojing.com' ;
var exposure_tip =  '曝光指数: 只通过宝贝的曝光关键词数量无法直接比较两个宝贝获取的流量大小。因为同样有10个词曝光的两个宝贝，其中一个可能都排在关键词下第一页，而另外一个都排在关键词下第5页。这样，虽然两者曝光词数量相同，但获取的流量却相差很大。还有另一种情况，同样都是10个曝光词的两个宝贝，关键词的排名也接近，但是其中一个宝贝在热词上曝光，而另外一个宝贝在长尾词上曝光，那么获得的流量也大不相同。曝光指数综合考虑 1) >关键词的全网搜索量 2) 宝贝在搜索结果中得排名 3) 曝光关键词数量，通过模型做出宝贝获取流量的最佳估计。近似于宝贝在搜索结果中获得的展现数量。';
var vol_tip = '根据每日评价数、价格通过模型估计得到';
var nodata = {
    "organic": "没有自然搜索曝光数据",
    "simba": "没有京东快车曝光数据",
    "mobile": "没有手机搜索曝光数据"
};

var shorter = function(x) {
  if (x == null || x == undefined) {
      return '<span class="ironman-num">未收录</span>';
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

var ironman_item_id = function(obj) {
    var sku = obj.data('sku') || obj.find('.j-sku-item').data('sku');
    if (sku) {
        return sku;
    };
  
    return null;
};
var ironman_itemSearch_UI = function(obj) {
    var item_id = ironman_item_id(obj);
    
    obj.css({'height': (parseInt(obj.css('height')) + 82) + 'px'});
    obj.find('.gl-i-wrap').css({'top': '82px'});
    obj.prepend(
        '<div class="ironman-container ironman-item-info"  id="box' + item_id + '">' +
            '<div class="ironman-item-avatar">'+
                '<a class="ironman-logo" href="http://jd.moojing.com?f=syy" target="_blank"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /></a>'+
                '<div class="row-fluid">' +
                      '<span class="ironman-data ironman-hover" data-group="mojing" data-subtype="organic">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_organic.png" />' + 
                        '<span class="org_exposure">加载中...</span>' +
                      '</span><span class="ironman-data ironman-hover" data-group="mojing" data-subtype="simba">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_simba_jd.png" />' + '<span class="simba_exposure">-</span>' +
                      '</span>' +
                '</div>'+
                '<div class="row-fluid">' +
                      '<span class="ironman-data ironman-hover" data-group="more" data-subtype="vol">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_vol.png" />' + 
                        '<span class="vol_i">-</span>' +
                      '</span><span class="ironman-data ironman-hover" data-group="more" data-subtype="sales">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_sales.png" />' + 
                        '<span class="sales_i">-</span>' +
                      '</span>' +
                '</div>'+
                '<div class="row-fluid">' +
                      '<span class="ironman-data">'+
                        
                      ' </span>'+
                '</div>'+
                /*
                '<div class="row-fluid">' + 
                      '<span class="ironman-data ironman-hover" data-group="mojing" data-subtype="mobile">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_mobile.png" />' + ' <span class="mobile_exposure">-</span>' +
                      '</span><span class="ironman-data ironman-hover" data-group="more" data-subtype="online">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_online.png" /><span class="user_count">-</span>' + 
                      '</span>'+
                '</div>'+

                '<div class="row-fluid">' +
                      '<span class="ironman-data ironman-hover" data-group="more" data-subtype="offshelf" style="width:70%;">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_unshelf.png" /><span class="offshelf_time ironman-num">-</span>' +
                      '</span><span class="price-trend ironman-hover pull-right" data-group="mojing" data-subtype="price" ironman-itemid="' + item_id + '" onmouseover="etao_price_trend_get(this);">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_price.png" /></span>' +
                      '<span class="cat ironman-hover pull-right" data-group="more" data-subtype="cat" onmouseover="ironman_get_catinfo(this);">'+
                        '<img class="ironman-img-tag" src="'+ HOST + '/static/image/m/m_cat.png" /></span>' + 
                '</div>' +
                */
            '</div>' +
            
            '<div class="ironman-item-more hide">'+
              '<div class="ironman-detail ironman-vol hide"><h5>数据采集时间: <span class="ironman_ts_sales">-</span></h5><span class="ironman-tag-title">30天销量指数:</span><span class="vol_i" id="vol_' + item_id + '">加载中...</span><div class="ironman-data-orig">*数据来自魔镜<br/>' + vol_tip + '</div></div>' +
              '<div class="ironman-detail ironman-sales hide"><h5>数据采集时间: <span class="ironman_ts_sales">-</span></h5><span class="ironman-tag-title">30天销售额指数:</span><span class="sales_i" id="sales_' + item_id + '">加载中...</span><div class="ironman-data-orig">*数据来自魔镜<br/>' + vol_tip + '</div></div>' +
            /*
                '<div class="ironman-detail ironman-offshelf hide"><div class="ironman-tag-title">宝贝的下架时间:</div><div class="offshelf_time_full" id="offshelf_time_' + item_id + '">加载中...</div><div class="ironman-data-orig">*数据来自淘宝官方接口</div></div>' +
                '<div class="ironman-detail ironman-online hide"><div class="ironman-tag-title">宝贝详情页上的实时在线人数:</div><div id="user_count_' + item_id + '">加载中...</div><div class="ironman-data-orig">*数据来自淘宝官方接口</div></div>' +
                '<div class="ironman-detail ironman-cat hide"><div class="ironman-tag-title">宝贝所属类目:</div><div class="catinfo_full_' + item_id + '">加载中...</div><div class="ironman-data-orig">*数据来自淘宝官方接口</div></div>' +
            */
            '</div>' +
            
            '<div class="ironman-item-popover hide">'+
                 '<img class="ironman-collapse" src="'+ HOST +'/static/image/m/m_collage.png"/>'+
                 '<div class="ironman-mojing-detail ironman-item-organic hide"><h3>昨日自然搜索曝光</h3>'+
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                   '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="org_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="org_exposure">-</span></div></div>'+
                   '曝光关键词列表（仅显示前3个）:<div class="orgdata ironman-ext-tbl" id="org_words_' + item_id + '">加载中...</div>' +
                   '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">查看所有关键词></a><br/>'+
                   '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                 '</div>'+
                 '<div class="ironman-mojing-detail ironman-item-simba hide"><h3>昨日京东快车曝光</h3>'+
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                   '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="simba_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="simba_exposure ">-</span></div></div>'+
                   '曝光关键词列表（仅显示前3个）:<div class="simbadata ironman-ext-tbl" id="simba_words_' + item_id + '">加载中...</div>' +
                   '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">查看所有关键词></a><br/>'+
                   '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                 '</div>'+
                 /*
                 '<div class="ironman-mojing-detail ironman-item-mobile hide"><h3>昨日手机搜索曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                   '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="mobile_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="mobile_exposure ironman-num">-</span></div></div>'+
                   '曝光关键词列表:<div class="mobiledata ironman-ext-tbl" id="mobile_words_' + item_id + '">加载中...</div>' +
                   '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">查看所有关键词></a><br/>'+
                   '<div class="ironman-data-orig">*数据来自魔镜<br/>曝光指数:' + exposure_tip + '</div>' + 
                 '</div>'+
                 '<div class="ironman-mojing-detail ironman-item-price hide">' +
                   '<div class="ironman-tag-title">宝贝调价记录</div><div class="ironman-tag-title">宝贝历史最低价: <span class="lowest">-</span></div><div class="ironman-price-chart" id="price_trend_' + item_id + '">加载中...</div>'+
                   '<div class="ironman-data-orig ironman-data-price">*数据来自淘宝官方接口</div>' +
                 '</div>' +
                 */
            '</div>' +
        '</div>'
    );
};

var mojing_iteminfo_get = function(ww_item_list, not_words, not_mobile) {
    var item_map = {};
    var include_mobile = true;
    if(not_mobile) include_mobile = false;
    var include_words = true;
    if(not_words) include_words = false;

    dy_$.ajax({
        url: JDHOST + '/item_info_get',
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
            
            $('.ironman-container.ironman-item-info:not(.finished)').each(function(i, o) {
                var item_id = ironman_item_id($(o).parent());
                
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
                //$(o).find('.mobile_exposure').html(d.mobile_expos ? shorter(d.mobile_expos) : zero);
                $(o).find('.sales_i').html(d.organic_sales ? shorter(d.organic_sales) : zero);
                $(o).find('.vol_i').html(d.organic_vol ? shorter(d.organic_vol) : zero);
                
                var org_s = show_words_table(d.org_words, "organic", d.organic_expos);
                $(o).find('.orgdata').html(org_s);
                $(o).find('.org_word_count').html(d.organic_wordcount);

                var simba_s = show_words_table(d.simba_words, "simba", d.simba_expos);
                $(o).find('.simbadata').html(simba_s);
                $(o).find('.simba_word_count').html(d.simba_wordcount);
                /*
                var mobile_s = show_words_table(d.mobile_words, "mobile", d.mobile_expos);
                $(o).find('.mobiledata').html(mobile_s);
                $(o).find('.mobile_word_count').html(d.mobile_wordcount);
                */
                $(o).find('.ironman_ts').html(d.ts);
                $(o).find('.ironman_ts_sales').html(d.ts_sales);
                $(o).addClass('finished');
            });
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
    });
};

var handle_item_search = function() {
    var ww_item_list = [];

    dy_$('.gl-warp .gl-item').each(function(i, o) {
        //console.log(dy_$(o));
        if(dy_$(o).find('.ironman-container').length > 0) return;
        var item_id = ironman_item_id(dy_$(o));
        if (!item_id) return;
        
        ironman_itemSearch_UI(dy_$(o));

        //console.log(ww + ' ' + item_id);
        ww_item_list.push(item_id);
    });
    
    if(ww_item_list.length > 0){
        mojing_iteminfo_get(ww_item_list); 
        /*  
        $.each(ww_item_list, function(i, o) {
            taobao_offshelf_time_get(o[1]);
            online_user_count_get(o[1]);
        });
        */
    }
    
};


var handle_item_detail = function() {
    
    var m = /item\.jd\.(com|hk)\/(\d+)\.html/i.exec(window.location);
    if (m == null) { return; }
    var item_id = m[2];
    
    var body;
    if(m[1] == 'com'){
        body = dy_$('#product-intro').parent();
        if(body.length == 0){
          body = dy_$('.product-intro').parent();
        }
    }else if(m[1] == 'hk'){
        body = dy_$('.product-detail');
    }
    

    var ww_raw = '';

    
    body.before(
        '<div class="w"> <div class="ironman-container ironman-item-detail-info-jd" id="box' + item_id + '">' +
          '<div class="ironman-item-detail-avatar">' +
            '<a class="ironman-logo" href="http://jd.moojing.com?f=syy_'+get_uid()+'" target="_blank"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /><span class="domain">moojing.com</span></a>'+
            '<div class="ironman-item-detail-base inline row-fluid" >' +
                '<div class="ironman-base ironman-detail-hover inline " data-group="mojing" data-subtype="organic">自然搜索<span class="org_exposure">加载中...</span><span class="split">|</span><span class="org_word_count ironman-num ironman-word-num">-</span>词</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="simba">京东快车<span class="simba_exposure">-</span><span class="split">|</span><span class="simba_word_count ironman-num ironman-word-num">-</span>词</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="vol">30天销量指数<span class="vol_i">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="sales">30天销售额指数<span class="sales_i">-</span></div>' +
                /*
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="mobile">手机搜索<span class="mobile_exposure">-</span><span class="split">|</span><span class="mobile_word_count ironman-num ironman-word-num">-</span>词</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="online">下架时间<span class="offshelf_time ironman-num">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="user_count">在线人数<span class="user_count">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline cat" data-group="mojing" data-subtype="cat" onmouseover="">类目<span class="ironman-num catinfo_' + item_id + '">加载中...</span></div>' +
                */
                '<div class="ironman-detail-hover ironman-jd-trend inline" data-group="func" data-subtype="expos" ironman-itemid="' + item_id + '"><span class="ironman-item-func">曝光趋势</span></div>' +
                '<div class="ironman-detail-hover ironman-jd-trend inline" data-group="func" data-subtype="sales" ironman-itemid="' + item_id + '"><span class="ironman-item-func">销售趋势</span></div>' +
                '<div class="ironman-detail-hover ironman-jd-trend inline" data-group="func" data-subtype="comment" ironman-itemid="' + item_id + '"><span class="ironman-item-func">评价趋势</span></div>' +
          '</div></div>'+
          '<div class="ironman-item-detail-popover hide">'+
                '<img class="ironman-collapse-h" src="https://img.alicdn.com/imgextra/i2/599244911/TB2LobohpXXXXa7XXXXXXXXXXXX-599244911.png"/>'+
                '<div class="ironman-mojing-detail ironman-item-organic hide"><h3>昨日自然搜索曝光</h3>'+
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="org_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="org_exposure">-</span></div></div>'+
                  '曝光关键词列表（仅显示前3个）:  <span style="font-size:12px" class="ask-to-login hide">(未登录此处只能查看最多3个词，<a href="http://ext.moojing.com/please_login" target="_blank">登录</a>后可看更多)</span>' +
                  '<div class="orgdata ironman-ext-tbl" id="org_words_' + item_id + '">加载中...</div>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">查看所有关键词></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-simba hide"><h3>昨日京东快车曝光</h3>'+
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="simba_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="simba_exposure">-</span></div></div>'+
                  '曝光关键词列表（仅显示前3个）:  <span style="font-size:12px" class="ask-to-login hide">(未登录此处只能查看最多3个词，<a href="http://ext.moojing.com/please_login" target="_blank">登录</a>后可看更多)</span>' +
                  '<div class="simbadata ironman-ext-tbl" id="simba_words_' + item_id + '">加载中...</div>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">查看所有关键词></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-vol hide"><h3>30天销量指数</h3>'+
                  '<div class="row-fluid ironman-txt"><div class="ironman-data vol_i"><span class="ironman-num">-</span></div></div>'+
                  '<h5>数据采集时间: <span class="ironman_ts_sales">-</span></h5>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '/sales?f=syy_'+get_uid()+'" target="_blank">更多销售数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + vol_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-sales hide"><h3>30天销售额指数</h3>'+
                  '<div class="row-fluid ironman-txt"><div class="ironman-data sales_i "><span class="ironman-num">-</span></div></div>'+
                  '<h5>数据采集时间: <span class="ironman_ts_sales">-</span></h5>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '/sales?f=syy_'+get_uid()+'" target="_blank">更多销售数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + vol_tip + '</div>' +
                '</div>'+
                /*
                '<div class="ironman-mojing-detail ironman-item-mobile hide"><h3>昨日手机搜索曝光</h3>'+
                  '<h5>数据采集时间:<span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="mobile_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="mobile_exposure ironman-num">-</span></div></div>'+
                  '曝光关键词列表:  <span style="font-size:12px" class="ask-to-login hide">(未登录此处只能查看最多3个词，<a href="http://ext.moojing.com/please_login" target="_blank">登录</a>后可看更多)</span>' +
                  '<div class="mobiledata ironman-ext-tbl" id="mobile_words_' + item_id + '">加载中...</div>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">查看所有关键词></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
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
                  '<div class="row-fluid ironman-txt"><div class="ironman-data"><span class="ironman-num catinfo_full_' + item_id + '">-</span></div></div>'+
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+
                */
           '</div>' +
           
           '<div class="ironman-item-func-popover hide">'+
              '<div class="ironman-mojing-func ironman-item-expos hide"><h3>宝贝曝光趋势（仅显示7天数据，使用【<a href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">京东魔镜</a>】查看所有数据）</h3>'+
                '<div class="widget">' +
                  '<div class="widget-container clearfix">' +
                      '<div class="ironman-trend-chart" id="expos_trend_' + item_id + '">加载中...</div>' +
                      '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '?f=syy_'+get_uid()+'" target="_blank">更多曝光数据查询></a><br/>'+
                  '</div>' +
                '</div>' + 
                '<div class="ironman-data-orig">*数据来自魔镜</div>' +
              '</div>' +

              '<div class="ironman-mojing-func ironman-item-sales hide"><h3>宝贝月销售趋势（仅显示6个月数据，使用【<a href="http://jd.moojing.com/item/' + item_id + '/sales?f=syy_'+get_uid()+'" target="_blank">京东魔镜</a>】查看所有数据）</h3><div class="widget">' +
                  '<div class="widget-container clearfix">' +
                      '<div class="ironman-trend-chart" id="sales_trend_' + item_id + '">加载中...</div>' +
                      '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '/sales?f=syy_'+get_uid()+'" target="_blank">更多销售数据查询></a><br/>'+
                  '</div>' +
                '</div>' + 
                '<div class="ironman-data-orig">*数据来自魔镜</div>' +
              '</div>' +

              '<div class="ironman-mojing-func ironman-item-comment hide"><h3>宝贝评价数趋势（仅显示7天数据，使用【<a href="http://jd.moojing.com/item/' + item_id + '/sales?f=syy_'+get_uid()+'" target="_blank">京东魔镜</a>】查看所有数据）</h3><div class="widget">' +
                  '<div class="widget-container clearfix">' +
                      '<div class="ironman-trend-chart" id="comment_trend_' + item_id + '">加载中...</div>' +
                      '<a class="ironman-mojing-more" href="http://jd.moojing.com/item/' + item_id + '/sales?f=syy_'+get_uid()+'" target="_blank">更多评价数据查询></a><br/>'+
                  '</div>' +
              ' </div>' + 
                '<div class="ironman-data-orig">*数据来自魔镜</div>' +
              '</div>' +

           '</div>' +
           
        '</div> </div> '
    );
    
    dy_$.ajax({
        url: JDHOST + '/item_info_get',
        type: 'POST',
        crossDomain: true,
        data: $.toJSON({'items': [item_id], 'include_words': true, 'include_mobile': true, 'moyan_fields': 'sales30,amount30'}),
        success: function(data) {
            if(data.length == 0){
              data = [{'organic_expos': 0, 'sales': 0, 'vol': 0, 'organic_wordcount': 0, 'simba_expos': 0, 'simba_wordcount': 0}];
            }
            var o = $('.ironman-item-detail-info-jd');
            var d = data[0];
            
            var zero = '<span class="ironman-num">0</span>';
            var logged_in = d.logged_in;  
            //console.log('logged_in ' + logged_in);
            if(logged_in) {
                $('.ask-to-login').addClass("hide");
                $('.after-login-mj').removeClass("hide");
            }

            $(o).find('.org_exposure').html(d.organic_expos ? shorter(d.organic_expos) : zero);
            $(o).find('.simba_exposure').html(d.simba_expos ? shorter(d.simba_expos) : zero);
            //$(o).find('.mobile_exposure').html(d.mobile_expos ? shorter(d.mobile_expos) : zero);
            $(o).find('.sales_i').html(d.organic_sales ? shorter(d.organic_sales) : zero);
            $(o).find('.vol_i').html(d.organic_vol ? shorter(d.organic_vol) : zero);
            
            var org_s = show_words_table(d.org_words, "organic", d.organic_expos);
            $(o).find('.orgdata').html(org_s);
            $(o).find('.org_word_count').html(d.organic_wordcount);

            var simba_s = show_words_table(d.simba_words, "simba", d.simba_expos);
            $(o).find('.simbadata').html(simba_s);
            $(o).find('.simba_word_count').html(d.simba_wordcount);
            /*
            var mobile_s = show_words_table(d.mobile_words, "mobile", d.mobile_expos);
            $(o).find('.mobiledata').html(mobile_s);
            $(o).find('.mobile_word_count').html(d.mobile_wordcount);
            */
            $(o).find('.ironman_ts').html(d.ts);
            $(o).find('.ironman_ts_sales').html(d.ts_sales);
            
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
    });
    /*
    taobao_offshelf_time_get(item_id, function() {
        ironman_get_catinfo($('.ironman-item-detail-info').find('.cat'));
    });
    online_user_count_get(item_id);
    */
};

dy_$('.ironman-jd-trend').live('hover', function(){
	console.log(dy_$(this));
	console.log(dy_$(this).parents('.ironman-shop-detail-jd'));
	if(dy_$(this).parents('.ironman-shop-detail-jd')[0]){
		jd_shop_trend_get(this);
	}else{
		jd_item_trend_get(this);
	}
});

function update_trend_chart(data, names, type, item_id) {
  
  dy_Highcharts.setOptions({
    colors: ['#4A90E2', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
    global:{
      timezoneOffset: 480,
      useUTC:false
    }
  });

  var xDateFormat;
  var xAxis;
  if(type == 'sales'){
    xDateFormat = "%Y-%m";
    xAxis = {
        type: "datetime",
        minTickInterval: 24*3600*1000*28,
        title: {
            text: null
        },
        labels: {
            formatter: function() {
              //return this.value;
                var d = new Date(0);
                d.setTime(this.value);
                return d.getFullYear()+'-'+(d.getMonth() + 1 > 9?'':'0') + (d.getMonth() + 1) ;
            }
        }
    };
  }else{
    xDateFormat = "%Y-%m-%d";
    xAxis = {
        type: "datetime",
        minTickInterval: 24*3600*1000,
        title: {
            text: null
        },
        labels: {
            formatter: function() {
              //return this.value;
                var d = new Date(0);
                d.setTime(this.value);
                return (d.getMonth() + 1 > 9?'':'0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9?'':'0') + d.getDate();
            }
        }
    };
    /*
    if(type == 'comment'){
      var tsArr = data.ts_sales.split('_');
      var tsDate = new Date(tsArr[0], tsArr[1]-1, tsArr[2]);
    }
    */
  };
  var yAxis = [];
  
  var series = [];
  var opposite = false;
  var index = 0;

  for (var n in names) {
    yAxis.push({
      min:0,
      labels:{
        format: '{value}'
      },
      title: {
        text: names[n].name
      },
      opposite: opposite
    });
    opposite = !opposite;
    series.push({
      yAxis: index++,
      name: names[n].name, 
      type: names[n].type || 'spline',
      data: data[n], 
      marker: {radius: 4},
      lineWidth: 2
    });
  }

  var options = {
      chart: {
          renderTo: type+"_trend_" + item_id,
          type: "spline",
          backgroundColor: "#0C0C1E"
      },
      legend: {
          enabled: false
      },
      title: {
          text: null
      },
      tooltip: {
          xDateFormat: xDateFormat,
          shared: true
      },
      xAxis: xAxis,
      yAxis: yAxis,
      series: series,
      credits: { enabled: false},
      
  };

  var chart = new dy_Highcharts.Chart(options);

};

function show_words_table(data, dataType, expos){
    if(data == undefined){
        return nodata[dataType];
    }
    var tbl = '<table class="ironman-mojing-table '+dataType+'"><thead><tr><td>关键词</td><td>曝光指数</td><td class="ironman-word-rank">排名</td></tr></thead>'; 
    var n;
    if(dataType == 'organic'){
      n = 60;
    }else if(dataType == 'simba'){
      n = 13;
    }
    $.each(data, function(j, word) {
      var page = Math.ceil(word.rank / n);
      var pos = (word.rank - 1) % n + 1;
        var ratio = word.exposure * 100 / expos;
        tbl += '<tr><td>' + word.word + '</td>'+
          '<td><div class="ironman-num">' + word.exposure + '</div><div class="ironman-progress"><div class="ironman-trend" style="width: ' + ratio + '%"></div></div></td>'+
          '<td class="ironman-word-rank">第' + page +'页/'+ pos + '名</td></tr>';
    });
    tbl += '</table>';
    return tbl;
};
var trendData;

var jd_item_trend_get = function(o) {
    if($(o).attr('done')) {
        return;
    }
    var item_id = $(o).attr('ironman-itemid');
    var type = $(o).data('subtype');
    var names;
    if (type == 'expos') {
      names = {organic:{name:'自然搜索曝光指数'}, simba:{name:'京东快车曝光指数'}};
    }else if (type == 'sales') {
      names = {sales:{name:'月销售额指数', type:'column'}, vol:{name:'月销量指数', type:'column'}};
    }else if (type == 'comment'){
      names = {comment:{name:'日评价数', type:'column'}};
    }
    if(trendData){
      update_trend_chart(trendData, names, type, item_id);
      dy_$(o).attr('done', 1);
    }else{
      dy_$.getJSON(JDHOST + '/item_trend_get', {id: item_id},function(r){
        for(var n in r){
          if(n.indexOf('ts') == 0){
            continue;
          }

          for(var i in r[n]){
            r[n][i][0] *= 1000;
          }
        }
        trendData = r;
        update_trend_chart(trendData, names, type, item_id);
        dy_$(o).attr('done', 1);
      });
    }
};


var jd_shop_trend_get = function(o) {
    if($(o).attr('done')) {
        return;
    }
    var item_id = $(o).attr('ironman-shopname');
    var type = $(o).data('subtype');
    var names;
    if (type == 'expos') {
      names = {organic:{name:'自然搜索曝光指数'}, simba:{name:'京东快车曝光指数'}};
    }else if (type == 'sales') {
      names = {sales:{name:'月销售额指数', type:'column'}, vol:{name:'月销量指数', type:'column'}};
    }else if (type == 'comment'){
      names = {comment:{name:'日评价数', type:'column'}};
    }
    if(trendData){
      update_trend_chart(trendData, names, type, 'shop');
      dy_$(o).attr('done', 1);
    }else{
      dy_$.getJSON(JDHOST + '/shop_trend_get', {ww: item_id},function(r){
        for(var n in r){
          if(n.indexOf('ts') == 0){
            continue;
          }

          for(var i in r[n]){
            r[n][i][0] *= 1000;
          }
        }
        trendData = r;
        update_trend_chart(trendData, names, type, 'shop');
        dy_$(o).attr('done', 1);
      });
    }
};

handle_shop_detail = function() {
  
  var shop_header_length = dy_$('#j_jshop_header').length + dy_$('[class*=shopheader]').length + dy_$('[class*=ShopHeader]').length + dy_$('[class*=shopHeader]').length;
  if(shop_header_length == 0){
    return;
  }

  function _waitingShopName(){
    var shopName = dy_$('.jLogo, .shopName').find('a').text();
    console.log('shopname', shopName);
    if(shopName){
      _getData(shopName);
    }else{
      setTimeout(_waitingShopName, 1000);
    }
  }
  _waitingShopName();
  
  function _getData(shopName){
    dy_$('.layout-container').before(
      '<div class="ironman-shop-detail-jd">'+
        '<div class="ironman-container ironman-item-detail-info-jd">' +
          '<div class="ironman-item-detail-avatar">' +
            '<a class="ironman-logo" href="http://jd.moojing.com?f=syy_'+get_uid()+'" target="_blank"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /><span class="domain">moojing.com</span></a>'+
            '<div class="ironman-item-detail-base inline row-fluid" >' +
                '<div class="ironman-base ironman-detail-hover inline " data-group="mojing" data-subtype="organic">自然搜索<span class="org_exposure">加载中...</span><span class="split">|</span><span class="org_word_count ironman-num ironman-word-num">-</span>词<span class="split">|</span><span class="org_item_count ironman-num ironman-word-num">-</span>宝贝</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="simba">京东快车<span class="simba_exposure">-</span><span class="split">|</span><span class="simba_word_count ironman-num ironman-word-num">-</span>词<span class="split">|</span><span class="simba_item_count ironman-num ironman-word-num">-</span>宝贝</div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="vol">30天销量指数<span class="vol_i">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="sales">30天销售额指数<span class="sales_i">-</span></div>' +

                '<div class="ironman-detail-hover ironman-jd-trend inline" data-group="func" data-subtype="expos" ironman-shopname="' + shopName + '"><span class="ironman-item-func">曝光趋势</span></div>' +
                '<div class="ironman-detail-hover ironman-jd-trend inline" data-group="func" data-subtype="sales" ironman-shopname="' + shopName + '"><span class="ironman-item-func">销售趋势</span></div>' +
                '<div class="ironman-detail-hover ironman-jd-trend inline" data-group="func" data-subtype="comment" ironman-shopname="' + shopName + '"><span class="ironman-item-func">评价趋势</span></div>' +
                
          '</div></div>'+
          '<div class="ironman-item-detail-popover hide">'+
                '<img class="ironman-collapse-h" src="https://img.alicdn.com/imgextra/i2/599244911/TB2LobohpXXXXa7XXXXXXXXXXXX-599244911.png"/>'+
                '<div class="ironman-mojing-detail ironman-item-organic hide"><h3>昨日自然搜索曝光</h3>'+
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="org_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="org_exposure ">-</span></div><div class="ironman-data">宝贝数量:<span class="org_item_count ironman-num">-</span></div></div>'+
                  
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'?f=syy_'+get_uid()+'" target="_blank">更多店铺数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-simba hide"><h3>昨日京东快车曝光</h3>'+
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="row-fluid ironman-txt"><div class="ironman-data">关键词数量:<span class="simba_word_count ironman-num">-</span></div><div class="ironman-data">曝光指数:<span class="simba_exposure ">-</span></div><div class="ironman-data">宝贝数量:<span class="simba_item_count ironman-num">-</span></div></div>'+
                  
                  
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'?f=syy_'+get_uid()+'" target="_blank">更多店铺数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + exposure_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-vol hide"><h3>30天销量指数</h3>'+
                  '<div class="row-fluid ironman-txt"><div class="ironman-data vol_i"><span class="ironman-num">-</span></div></div>'+
                  '<h5>数据采集时间: <span class="ironman_ts_sales">-</span></h5>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'/sales?f=syy_'+get_uid()+'" target="_blank">更多销售数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + vol_tip + '</div>' +
                '</div>'+
                '<div class="ironman-mojing-detail ironman-item-sales hide"><h3>30天销售额指数</h3>'+
                  '<div class="row-fluid ironman-txt"><div class="ironman-data sales_i "><span class="ironman-num">-</span></div></div>'+
                  '<h5>数据采集时间: <span class="ironman_ts_sales">-</span></h5>' +
                  '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'/sales?f=syy_'+get_uid()+'" target="_blank">更多销售数据查询></a><br/>'+
                  '<div class="ironman-data-orig">*数据来自魔镜<br/>' + vol_tip + '</div>' +
                '</div>'+
                
           '</div>' +
           '<div class="ironman-item-func-popover hide">'+
              '<div class="ironman-mojing-func ironman-item-expos hide"><h3>店铺曝光趋势（仅显示7天数据，使用【<a href="http://jd.moojing.com/shop/'+shopName+'?f=syy_'+get_uid()+'" target="_blank">京东魔镜</a>】查看所有数据）</h3>'+
                '<div class="widget">' +
                  '<div class="widget-container clearfix">' +
                      '<div class="ironman-trend-chart" id="expos_trend_shop">加载中...</div>' +
                      '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'?f=syy_'+get_uid()+'" target="_blank">更多曝光数据查询></a><br/>'+
                  '</div>' +
                '</div>' + 
                '<div class="ironman-data-orig">*数据来自魔镜</div>' +
              '</div>' +

              '<div class="ironman-mojing-func ironman-item-sales hide"><h3>店铺月销售趋势（仅显示6个月数据，使用【<a href="http://jd.moojing.com/shop/'+shopName+'/sales?f=syy_'+get_uid()+'" target="_blank">京东魔镜</a>】查看所有数据）</h3><div class="widget">' +
                  '<div class="widget-container clearfix">' +
                      '<div class="ironman-trend-chart" id="sales_trend_shop">加载中...</div>' +
                      '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'/sales?f=syy_'+get_uid()+'" target="_blank">更多销售数据查询></a><br/>'+
                  '</div>' +
                '</div>' + 
                '<div class="ironman-data-orig">*数据来自魔镜</div>' +
              '</div>' +

              '<div class="ironman-mojing-func ironman-item-comment hide"><h3>店铺评价数趋势（仅显示7天数据，使用【<a href="http://jd.moojing.com/shop/'+shopName+'/sales?f=syy_'+get_uid()+'" target="_blank">京东魔镜</a>】查看所有数据）</h3><div class="widget">' +
                  '<div class="widget-container clearfix">' +
                      '<div class="ironman-trend-chart" id="comment_trend_shop">加载中...</div>' +
                      '<a class="ironman-mojing-more" href="http://jd.moojing.com/shop/'+shopName+'/sales?f=syy_'+get_uid()+'" target="_blank">更多评价数据查询></a><br/>'+
                  '</div>' +
              ' </div>' + 
                '<div class="ironman-data-orig">*数据来自魔镜</div>' +
              '</div>' +

           '</div>' +
        '</div>'+
      '</div>'
      
    );

    dy_$.ajax({
      url: JDHOST + '/shop_info_get',
      type: 'POST',
      data: $.toJSON({'wws': [shopName], 'include_items': false, 'moyan_fields': 'shop_sales30,shop_amount30'}),
      success: function(data) {
          if (data.length == 0) {
              data = [{'shop_organic_expos': 0, 'shop_organic_sales': 0, 'shop_organic_vol': 0, 'shop_organic_itemcount': 0, 'shop_organic_itemcount': 0, 'shop_organic_wordcount': 0, 'shop_simba_expos': 0, 'shop_simba_itemcount': 0, 'shop_simba_wordcount': 0, 'items': []}];
          }
          var o = $('.ironman-shop-detail-jd');
          var d = data[0];
          if (d.moyan_res) {
              var moyan_data = {};
              for(var k in d.moyan_res){
                  moyan_data = d.moyan_res[k];
              }
              if(moyan_data.shop_sales30)    d.shop_organic_sales = moyan_data.shop_sales30;
              if(moyan_data.shop_amount30)    d.shop_organic_vol = moyan_data.shop_amount30;
          }
          $(o).find('.sales_i').html(shorter(d.shop_organic_sales));
          $(o).find('.vol_i').html(shorter(d.shop_organic_vol));
          $(o).find('.sales').html(shorter(d.shop_organic_sales));
          $(o).find('.vol').html(shorter(d.shop_organic_vol));
          $(o).find('.org_exposure').html(shorter(d.shop_organic_expos));
          $(o).find('.org_item_count').html(d.shop_organic_itemcount);
          $(o).find('.org_word_count').html(d.shop_organic_wordcount);
          $(o).find('.org_itemcount').html(d.shop_organic_itemcount);
          $(o).find('.org_wordcount').html(d.shop_organic_wordcount);

          $(o).find('.simba_exposure').html(shorter(d.shop_simba_expos));
          $(o).find('.simba_item_count').html(d.shop_simba_itemcount);
          $(o).find('.simba_word_count').html(d.shop_simba_wordcount);
          $(o).find('.simba_itemcount').html(d.shop_simba_itemcount);
          $(o).find('.simba_wordcount').html(d.shop_simba_wordcount);
          $(o).find('.simba_wordcount').html(d.shop_simba_wordcount);
          $(o).find('.ironman_ts').html(d.ts);
          $(o).find('.ironman_ts_sales').html(d.ts_sales);
      },
      dataType: 'json',
      xhrFields: {withCredentials: true}
    });
  
  };
  
};


function check_search() {

    

    var pat_item_detail = /item\.jd\.(.*)\/(\d+)\.html/i;
    if (pat_item_detail.exec(window.location)) {
        handle_item_detail();
        return;
    }
    

    var pat_item_search = /(search|list)\.jd\.(com|hk)\/(search|list)/i;
    if (pat_item_search.exec(window.location)) {
        
        handle_item_search();
        window.onscroll = handle_item_search;
        return;
        
    }
    var pat_shop_detail = /mall\.jd\.hk|\.jd\.com/i;
    if (pat_shop_detail.exec(window.location)) {
        handle_shop_detail();
    }

}

//start inject taobao page
if (/*window.ironman_mojing == 1 &&*/ window == window.top) {
   check_search();
   //console.log("new dbg");
}
