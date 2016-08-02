
shorter = ironman_shorter;

get_wordstats = function(word) {
	
	dy_$.ajax({
		url: MOJINGHOST + '/wordinsight',
        type: "GET",
        data: {"word": word},
        success: function(r){
        	 var box = dy_$('.ironman-item-detail-info');

             if(!r.pvi) {
            	 dy_$(box).find('.ironman_pv_s').html('-');
            	 dy_$(box).find('.ironman_pv').html('未收录');
            	 dy_$(box).find('.ironman_click_s').html('-');
            	 dy_$(box).find('.ironman_click').html('未收录');
            	 dy_$(box).find('.ironman_cost_s').html('-');
            	 dy_$(box).find('.ironman_cost').html('未收录');
            	 dy_$(box).find('.ironman_ctr').html('-');
            	 dy_$(box).find('.ironman_cvr').html('-');
            	 dy_$(box).find('.ironman_cpc').html('-');
             } else {
            	 dy_$(box).find('.ironman_pv_s').html(shorter(r.pvi));
            	 dy_$(box).find('.ironman_pv').html(r.pvi);
            	 dy_$(box).find('.ironman_click_s').html(shorter(r.clicki));
            	 dy_$(box).find('.ironman_click').html(r.clicki);
            	 dy_$(box).find('.ironman_cost_s').html('￥' + shorter(r.cost/100.0));
            	 dy_$(box).find('.ironman_cost').html('￥' + (r.cost/100.0).toFixed(0));
            	 dy_$(box).find('.ironman_ctr').html(r.ctr + '%');
            	 dy_$(box).find('.ironman_cvr').html(r.cvr + '%');
            	 dy_$(box).find('.ironman_cpc').html('￥' + (parseFloat(r.ppci)/100.0).toFixed(2));
             }
             dy_$(box).find('.ironman_ts').html(r.ts);
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
	});
};

if(/s\.taobao\.com/.exec(location.href)) {
  if(window == window.top){
      main();
  }
}

var search_timer;
function main() {
    if(search_timer) clearTimeout(search_timer);

    var r = /(\?|&)q=(.*?)(&|$)/.exec(location.href);
    var word = r[2];

    var body = dy_$('#main .grid-total:eq(1)');
    if(!body[0]){
    	search_timer = setTimeout(main, 500);
    	return;
    }
    console.log(body)

    body.before(
        '<div class="ironman-container ironman-item-detail-info ironman-topbar">' +
          '<div class="ironman-item-detail-avatar">' +
            '<a class="ironman-logo" href="http://www.moojing.com?f=syy_'+get_uid()+'" target="_blank"><img src="https://img.alicdn.com/imgextra/i3/599244911/TB2kCfxhpXXXXXGXXXXXXXXXXXX-599244911.png" /><span class="domain">moojing.com</span></a>'+
            '<div class="ironman-item-detail-base inline row-fluid" >' +
                '<div class="ironman-base ironman-detail-hover inline " data-group="mojing" data-subtype="pv">展现量<span class="ironman_pv_s ironman-num">加载中...</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="click">点击量<span class="ironman-num ironman_click_s">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="cost">花费<span class="ironman-num ironman_cost_s">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="ctr">点击率<span class="ironman-num ironman_ctr">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="cpc">点击单价<span class="ironman-num ironman_cpc">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline" data-group="mojing" data-subtype="cvr">转化率<span class="ironman-num ironman_cvr">-</span></div>' +
                '<div class="ironman-base ironman-detail-hover inline sales" data-group="mojing" data-subtype="sales" onmouseover="">本页销售<span class="ironman-num sales_count_s">-</span><span class="split">|</span><span class="ironman-num sales_amount_s">-</span></div>' +
                '<div class="ironman-detail-hover inline" data-group="func" data-subtype="find"><span class="ironman-item-func">找宝贝</span></div>' +
                '<a class="pull-right" style="color:#CECECE;padding-right:10px" href="http://shu.taobao.com/trendindex?query=' + word + '" target="_blank">淘宝指数</a>' +
          '</div></div>'+
          '<div class="ironman-item-detail-popover hide">'+
                '<img class="ironman-collapse-h" src="https://img.alicdn.com/imgextra/i2/599244911/TB2LobohpXXXXa7XXXXXXXXXXXX-599244911.png" style="max-width:100px"/>'+
                '<div class="ironman-mojing-detail ironman-item-pv hide"><h3>直通车展现量</h3>'+
                  '<h5>前一日，当前搜索词的全网（淘宝+天猫）直通车展现量</h5>' +
                  '<div class="ironman-num ironman_pv">加载中...</div>' +
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+

                '<div class="ironman-mojing-detail ironman-item-click hide"><h3>直通车点击量</h3>'+
                  '<h5>前一日，当前搜索词的全网（淘宝+天猫）直通车点击量</h5>' +
                  '<div class="ironman-num ironman_click">加载中...</div>' +
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+

                '<div class="ironman-mojing-detail ironman-item-cost hide"><h3>直通车花费</h3>'+
                  '<h5>前一日，当前搜索词的全网（淘宝+天猫）直通车花费</h5>' +
                  '<div class="ironman-num ironman_cost">加载中...</div>' +
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+

                '<div class="ironman-mojing-detail ironman-item-ctr hide"><h3>直通车点击率</h3>'+
                  '<h5>前一日，当前搜索词的全网（淘宝+天猫）直通车平均点击率。(点击率=点击量/展现量)</h5>' +
                  '<div class="ironman-num ironman_ctr">加载中...</div>' +
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+

                '<div class="ironman-mojing-detail ironman-item-cvr hide"><h3>直通车转化率</h3>'+
                  '<h5>前一日，当前搜索词的全网（淘宝+天猫）直通车平均转化率。（转化率=成交数量/点击量）</h5>' +
                  '<div class="ironman-num ironman_cvr">加载中...</div>' +
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+

                '<div class="ironman-mojing-detail ironman-item-cpc hide"><h3>直通车点击单价</h3>'+
                  '<h5>前一日，当前搜索词的全网（淘宝+天猫）直通车平均点击单价。（点击单价=花费/点击量）</h5>' +
                  '<div class="ironman-num ironman_cpc">加载中...</div>' +
                  '<h5>数据采集时间: <span class="ironman_ts">-</span></h5>' +
                  '<div class="ironman-data-orig">*数据来自淘宝官方接口</div>' +
                '</div>'+

                '<div class="ironman-mojing-detail ironman-item-sales hide"><h3>当前搜索结果页宝贝的销售总数</h3>'+
                  '<h5>即过去30天的总销售</h5>' +
                  '<h5>您可以将搜索结果按照销量排序，轻松获得关键词下总销量，即市场规模(通常前几页总销量占到80%市场规模）</h5>' +
                  '<div class="ironman-base">销售数量</div><div class="ironman-txt sales_count" >-</div>' +
                  '<div class="ironman-base">销售金额</div><div class="ironman-txt sales_amount" >-</div>' +
                  '<div class="ironman-data-orig">*销售数量由页面中宝贝显示的付款/收货人数加总得到。销售金额由页面中宝贝显示的价格与付款/收货人数相乘，然后加总得到。考虑到购买人数与销售件数在某些类目下差别比较大（一人购买多件商品），请自行调整销售数量和金额的误差。</div>' +
                '</div>'+
           '</div>' +
           '<div class="ironman-item-func-popover hide">'+
                '<div class="ironman-mojing-func ironman-item-find hide"><h3>自动翻页找到您的宝贝排在第几页的哪个位置</h3><h4>在您想要优化的重点关键词下，您应该随时关注您和竞争对手的宝贝排在什么位置</h4><h4>免费版用户：自动往后翻最多10页</h4><div class="widget">' +
                '<h5>输入要查找的宝贝链接</h5>' +
                '<input type="text" class="find_item_url"/>' +
                '&nbsp;&nbsp;<select class="find_item_scope">' +
                    '<option value="org">在自然搜索结果中查找</option>' +
                    '<option value="simba">在直通车广告中查找</option>' +
                    '<option value="both" selected>在所有结果中查找</option>' +
                '</select>' +
                '&nbsp;&nbsp;<button class="find_item_button btn btn-primary">查找</button>' +
                '<div class="find_item_result"></div>' +
                '</div>' +
                '<div class="ironman-data-orig">*数据来自淘宝官方接口<br/>' + 
                '*这个功能会自动访问多个页面，如果使用比较频繁，超过淘宝页面的访问频率限制，可能会不能正常工作。这时候您可能需要歇一歇再用。<br/>' +
                '*因为淘宝搜索页排名随时可能变化，本功能返回的是大致的位置。如果您在返回的位置找不到宝贝，可以周围四处找找，应该就在附近</div>' +
                '</div>' +
           '</div>' +
        '</div>'
    );

    var bar = dy_$('.ironman-item-detail-info');

    window.addEventListener('page_sold_ready', function() {
        console.log(window.ironman_page_sold_amount);
        dy_$(bar).find('.sales_count').html(window.ironman_page_sold + '人');
        dy_$(bar).find('.sales_count_s').html(shorter(window.ironman_page_sold) + '人');
        dy_$(bar).find('.sales_amount').html('￥' + window.ironman_page_sold_amount);
        dy_$(bar).find('.sales_amount_s').html('￥' + shorter(window.ironman_page_sold_amount));
    });


    get_wordstats(decodeURIComponent(word));
}

