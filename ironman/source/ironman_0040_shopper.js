
var orders_trend;
var order_url;
var skuMap;
var itemPrice;
var itemSkuProp = {};

var pat_item_detail = /(item\.taobao\.com|detail\.tmall\.com|\.95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/;
if(pat_item_detail.exec(window.location) && window == window.top) {
    main();
}

var pat_tmall = /(detail\.tmall\.com|95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/;

function get_sku_info(){
  var is_tmall = /(detail\.tmall\.com|95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/.exec(window.location);
  if(is_tmall){
	  order_url = $('#J_listBuyerOnView').data('api');
	  if(order_url == null || order_url == undefined) {
	      order_url = $('#J_listBuyerOnView').attr('detail:params');
	      order_url = /(.*),\w+$/.exec(order_url)[1];
	  }
	  var m  = /\"skuMap\"\:(.*)\}\,/.exec(document.documentElement.innerHTML);
	  if(m){
		  skuMap = JSON.parse(m[1]);
	  }
      
      var sku_url = "https://mdskip.taobao.com/core/initItemDetail.htm";
      $('head script').each(function(i, o) {
        var src = $(o).attr('src');
        console.log(src);
        if(!src) {
            return;
        }
        if(src.indexOf('initItemDetail') >= 0) {
            sku_url = src;
            return;
        }
      });

      console.log('sku_url ' + sku_url);

	  dy_$.ajax({
		  url: sku_url,
		  data:{itemId: /id=(\d+)/.exec(window.location)[1]}, 
		  dataType: 'jsonp', 
          jsonpCallback: 'setMdskip',
		  success: function(r){
			  itemPrice = r.defaultModel.itemPriceResultDO.priceInfo;
			  console.log(itemPrice);
              start_orders();
		  }
	  });
	  $('.tm-sale-prop .J_TSaleProp').each(function(i, o){
		 var prop = $(o).data("property");
		 $(o).find('li').each(function(j, li){
			var s = $(li).find('a').text().trim();
			var skuTag = $(li).data("value");
			var key = prop+":"+s ;
			itemSkuProp[key] = skuTag;
		 });
	  });
	  console.log("skuMap", skuMap);
	  console.log("itemSkuProp", itemSkuProp);
  }else{
	  order_url = g_config.recordsApi;
	  itemPrice = g_config.PromoData;
	  $('.tb-prop .J_TSaleProp').each(function(i, o){
		  var prop = $(o).data("property");
		  $(o).find('li').each(function(j, li){
			var s = $(li).find('a').text().trim();
			var skuTag = $(li).data("value");	
			var key = prop+":"+s ;
			itemSkuProp[key] = skuTag;
		  });
	  });
	  skuMap = Hub.config.get("sku").valItemInfo.skuMap;

      start_orders();
  }
}
  
function main() {
  //check();
  inject_module();
  //inject_table();
  get_shopper_records();
}

function format_date(d) {
    return d.getFullYear() + '-' + (d.getMonth + 1 > 9?'':'0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9?'':'0') + d.getDate() +
        ' ' + (d.getHours() > 9?'':'0') + d.getHours() + ':' + (d.getMinutes() > 9?'':'0') + d.getMinutes();
}

function inject_table() {
    $('#ironman_orders_chart_container .widget-container').append(
        '<div>' +
            '<ul class="inline">' +
                '<li><strong>上架时间</strong>: ' + format_date(get_onshelf_time()) + '</li>' +
                '<li><strong>下架时间</strong>: ' + format_date(get_offshelf_time()) + '</li>' +
            '</ul>' +
        '</div>'
    );
}

function get_onshelf_time() {
    var d = new Date();
    var timeleft;
    var is_tmall = /(detail\.tmall\.com|95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/.exec(window.location);
    if(is_tmall) {
    	var obj = dy_$('#J_listBuyerOnView');
    	if(obj[0]){
    		var m = /starts=(\d+)/.exec(obj.attr("detail:params"));
    	    if(m){
    	    	d.setTime(m[1]);
    	    }	
    	}else{
    		 var m = /date=(\d+)/.exec(TShop.cfg().apiBidCount);
    	      if(m) {
    	          d.setTime(m[1]);
    	      } else {
    	          timeleft = TShop.cfg().valTimeLeft;
                  d.setTime(d.getTime() + parseInt(timeleft)*1000 - 3600*24*7*1000);
   	          }
    	}
       
    } else {
        var m = /date=(\d+)/.exec(Hub.config.get('sku').apiBidCount);
        if(m) {
            d.setTime(m[1]);
        } else {
            timeleft = Hub.config.get('sku').valTimeLeft;
            if(timeleft) {
                d.setTime(d.getTime() + parseInt(timeleft)*1000 - 3600*24*7*1000);
            } else {
                console.log(g_config.recordsApi);
                var m = /starts=(\d+)/.exec(g_config.recordsApi);
                d.setTime(m[1]);
            }
        }
    }
    
    //d.setTime(d.getTime() + parseInt(timeleft)*1000 - 3600*24*7*1000);
    return d;
}

function get_shopper_records(){
  var m = /shopId=(\d+)\;/.exec(document.documentElement.innerHTML);
  if(!m) return;
  var shop_id = m[1];
  var item_id = /id=(\d+)/.exec(window.location)[1];
  
  /*
  $.ajax({
        type: 'get',
        url: HOST + '/shopper/get_item_info',
        data: {'sid': shop_id, 'itemid': item_id, 'fields': 'trend'}, 
        dataType: 'json',
        success: function(data){
        	console.log(data);
            if(false && data.item_id && data.item_id.trend){
                get_item_trends(data);
                update_orders_chart();
            }else{
                $('#refresh_order').show();
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr, status, error);
            $('#refresh_order').show();
        },
        timeout: 10000
  });
  */

  $('#refresh_order').show();
}

function get_offshelf_time() {
    var d = new Date();
    d.setTime(get_onshelf_time().getTime() + 3600*24*7*1000);
    return d;
}

var parseItemDetailWW = function(ww_raw){
	ww_raw = $('.ww-light').data('nick');
	//console.log("get ww from timer", ww_raw);
};

var item_ww_timer;

function inject_module() {
   if(item_ww_timer) clearTimeout(item_ww_timer);
   var item_id = /id=(\d+)/.exec(window.location)[1];

   $('#ironman_shopper').remove();
   $('#ironman_orders_chart_container').remove();
   
   var ww_node = $('.ww-light');
   var ww_raw;
   var is_tmall = /(detail\.tmall\.com|95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/.exec(window.location);
   if(/chaoshi\.detail\.tmall\.com/.exec(window.location)){
   	   ww_raw = "天猫超市";
   }else if(is_tmall){
	   ww_raw = /sellerNickName\"*:\"([\%a-zA-Z0-9]+)\",/.exec(document.documentElement.innerHTML)[1];
   }else{
	   ww_raw = /sellerNick\s*:\s*'(.*)',/.exec(document.documentElement.innerHTML)[1];
   }	
   
   if(!ww_raw){
   	if(ww_node[0]){
   		ww_raw = ww_node.data('nick');
   	}else if($('.J_WangWang')[0]){
   		ww_raw =  $('.J_WangWang').data('nick');
   	}else{
   		item_ww_timer = setTimeout(inject_module, 1000);
   	}
   }

    var shopper_html =
        '<div class="row-fluid ironman-mojing-func ironman-item-sales hide" id="ironman_orders_chart_container">' +
            '<div class="widget">' +
                '<div class="widget-header">' +
                    '<span class="text-h3" style="font-size:18px">宝贝实时销售统计</span>' +
                    '<h4>由于淘宝关闭了交易记录展示，本功能已无法以低成本的技术实现。</h4>'+
                    '<h4>了解宝贝最新销售情况，推荐使用： <a href="http://www.moojing.com/pages/features-sales-data/" target="_blank">[魔镜销售分析]</a> </h4>'+
                    //'<h4 style="font-size:17px">需要实时跟踪竞品价格和库存（即销量）的用户，建议使用： <a href="http://moojing.com/high-frequency-monitoring" target="_blank">[高频竞品监测]</a> </h4>'+
                    
                    
                '</div>' +
                 
            '</div>' +
            
        '</div>';

    var html = '<div id="ironman_shopper" class="ironman-detail-hover inline" data-group="func" data-subtype="sales" ironman-itemid="' + item_id + '" "><span class="ironman-item-func">销售趋势</span></div>';

    $('#box' + item_id + ' .ironman-item-detail-base').append(html);
    $('#box' + item_id + ' .ironman-mojing-func:last').after(shopper_html);

    console.log(is_tmall);
    
}

function verify_permission() {
    $.ajax({
        url: 'https://ext.moojing.com/cas/userInfo',
        //dataType: 'jsonp',
        xhrFields: {
            withCredentials: true
        }, 
        success: function(r) {
            r = JSON.parse(r);
            if(max_page > 99) {
                alert('成交记录最多只能往前翻99页');
                return;
            }
            if(!r.paid && !(r.username && r.username.indexOf('@moojing.com') >= 0)) {
                var max_page = parseInt($('#ironman_max_page').val(), 10);
                if(max_page > 10) {
                    alert('免费用户最多只能分析10页销售记录');
                    return;
                }
            }
            
            get_sku_info();
        }
    });
}

function update_sku_table(orders) {
    var html = '<table>';
    html += 
        '<tr>' +
            '<td>SKU名称</td>' +
            '<td style="padding:5px">销量</td>' +
            '<td style="padding:5px">占比</td>' +
        '</tr>';

    var sku_dist = {};
    $.each(orders, function(i, o) {
        if(!sku_dist[o.prop]) {
            sku_dist[o.prop] = 0;
        }

        sku_dist[o.prop] += parseInt(o.amount, 10);
    });

    var skulist = [];
    var sum = 0;
    $.each(sku_dist, function(k, v) {
        skulist.push({prop: k, count: v});
        sum += v;
    });

    skulist.sort(function(a, b) { return (a.count < b.count)? 1: (a.count > b.count? -1: 0); });
    console.log(skulist);

    $.each(skulist, function(i, o) {
        html += 
            '<tr>' +
                '<td>' + o.prop + '</td>' +
                '<td style="padding:5px">' + o.count + '</td>' +
                '<td style="padding:5px">' + (o.count * 100.0 / sum).toFixed(0) + '%</td>' +
            '</tr>';

    });

    $('#ironman_sku_dist').html(html);


}

function update_orders_chart() {

    var options = {
        chart: {
            renderTo: "ironman_orders_chart",
            type: "column",
            backgroundColor: "#0C0C1E"
        },
        legend: {
            enabled: false
        },  
        title: {
            text: null
        },
        tooltip: {
            xDateFormat: "%m-%d",
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
                    return (d.getMonth()+1) + '-' + d.getDate();
                }
            }
        },
        yAxis: [{
            title: {
                text: '销量'
            }
        },{
            title: {
                text: '销售额'
            },
            opposite: true
        }],
        series: [
            {name: '销量', data: orders_trend.vol, tooltip: { valueSuffix: '件'}},
            {name: '销售额', data: orders_trend.sales, yAxis: 1, tooltip: { valueSuffix: '元'}}
        ],
        credits: { enabled: false},
        plotOptions: {
            
        }
    };
    
    console.log(orders_trend);
    
    var chart = new dy_Highcharts.Chart(options);                
    $('#ironman_orders_loading').hide();
    $('#refresh_order').attr('disabled', null);
}

function get_item_trends(data){
    var vol_trend = [];
    var sales_trend = [];
    
    $.each(data, function(i,o){
        var d = to_date(o.date).getTime();
        sales_trend.push([d, o.sales]);
        vol_trend.push([d, o.sales_amount]);
    });
    
    vol_trend.sort(function(a,b){return a[0]>b[0]?1:-1});
    sales_trend.sort(function(a,b){return a[0]>b[0]?1:-1});
    
    orders_trend = {vol: vol_trend, sales: sales_trend};
}

function get_orders_trend(orders) {
    orders_map = get_orders_map(orders);
    
    trend = [];
    $.each(orders_map, function(k, arr) {
        var dlist = k.split('-');
        var t = Date.UTC(parseInt(dlist[0]), parseInt(dlist[1]) - 1, parseInt(dlist[2]));
        console.log(dlist, t);
        trend.push([t, arr]);
    });
    trend = trend.sort(function(a, b) { return (a[0]>b[0])?1:-1 });
    if(trend.length > 1) trend.shift();
    console.log(trend);
    
    var vol_trend = [];
    var sales_trend = [];
    $.each(trend, function(i, rec) {
        var t = rec[0];
        var arr = rec[1];
        var sales = 0;
        $.each(arr, function(i, o) {
            sales += parseFloat(o.price) * parseInt(o.amount);
        });
        sales = Math.round(sales * 100) / 100;
        var vol = arr.length;
        console.log(t, vol, sales);
        vol_trend.push([t, vol]);
        sales_trend.push([t, sales]);
        
    });
    console.log(vol_trend, sales_trend);
    
    orders_trend = {vol: vol_trend, sales: sales_trend};
}

function show_progress(msg) {
    $('#ironman_orders_loading').html(msg);
}

function start_orders(){
  //check();
  $('#ironman_orders_loading').show();
  $('#refresh_order').attr('disabled', 'disabled');
  
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var start_time = today.getTime() - 1000*3600*24*7;
  var d = new Date();
  d.setTime(start_time);
  var start_date = format_date(d);
  console.log('start_date ' + start_date, is_tmall);
 
  var max_page = parseInt($('#ironman_max_page').val(), 10);
  get_orders(order_url, is_tmall, max_page, 1, start_date, function(orders) {
      $.each(orders, function(i, o) {
          console.log(i, o);
      });

      show_progress('完成。销售趋势如下图所示');

      console.log(orders);
      get_orders_trend(orders);
      
      update_orders_chart();

      update_sku_table(orders);

  });
}

function get_orders_map(orders) {
    orders_map = {};
    $.each(orders, function(i, o) {
        var day = o.time.split(' ')[0];
        if(orders_map[day] == null) {
            orders_map[day] = [];
        }
    	console.log(day, o);
        orders_map[day].push(o);
    });
    return orders_map;
}

function get_orders(order_url, is_tmall, n_pages, page_no, old_date, callback) {
    console.log('get_orders ' + page_no, n_pages, is_tmall, old_date);
    show_progress('正在获取第' + page_no + '页成交记录......');

    slow_order_page(order_url, is_tmall, page_no, function(orders) {
    	//console.log(orders.length);
        if(page_no == n_pages || orders.length == 0) {
            callback(orders);
        } else if(orders[orders.length - 1].time < old_date) {
            callback(orders);
        } else {
            get_orders(order_url, is_tmall, n_pages, page_no+1, old_date, function(orders_more) {
                callback(orders.concat(orders_more));
            });
        }
    });
    //console.log('get_orders out ' + page_no);
}

var order_page_timer;

function slow_order_page(order_url, is_tmall, page_no, callback){
  if(order_page_timer) clearTimeout(order_page_timer);
  console.log('timeout', order_url, is_tmall, page_no);
  var page_delay = parseInt($('#ironman_page_delay').val(), 10) * 1000;

  order_page_timer = setTimeout(get_orders_page.bind(this, order_url, is_tmall, page_no, callback), page_delay);
}

function choose_tmall_price(tags){
	var tmp_tags = permutate(tags);
	console.log(tags, tmp_tags);
	for(var i=0; i<tmp_tags.length; i++){
		var tag = ";"+tmp_tags[i].join(";")+";";
		console.log(tag);
		if(skuMap[tag]){
			var skuId = skuMap[tag].skuId;
			var priceInfo = itemPrice[skuId];
			console.log(skuId, priceInfo);
			if(priceInfo.promotionList && priceInfo.promotionList.length > 0){
				return priceInfo.promotionList[0].price;
			}else if(priceInfo.suggestivePromotionList && priceInfo.suggestivePromotionList.length > 0){
				return priceInfo.suggestivePromotionList[0].price;
			}else{
				return priceInfo.price;
			}
		}
	}
	return '';
}

function permutate(array, permutatedArray) {
	console.log(array, permutatedArray);
	if (!permutatedArray) {
		permutatedArray = [];
	}

	if (array.length > 1) {
		// 弹出第一个数
		var elementCur = array.shift();
		// 排列剩余的数组
		permutate(array, permutatedArray);
		// 返回剩余的数组的排列长度
		var permutatedArrayLen = permutatedArray.length;
		// 第一个数与其他剩余数组所有数组组合
		for (var j = 0; j < permutatedArrayLen; j++) {
			// 弹出不齐的组
			var p = permutatedArray.shift();
			// 把当前元素放到排列好的数组的所有位置
			for (var i = 0; i <= p.length; i++) {
				// 复制排列好的数组
				var r = p.slice(0);
				// 插入数据到数组的位置
				r.splice(i, 0, elementCur);
				// 保存
				permutatedArray.push(r);
			}
		}
		// 退出条件
	} else {
		permutatedArray.push([ array[0] ]);
	}
	return permutatedArray;
}

function handle_tmall_order(data){
	var orders = [];
	$('#ironman_order_list').remove();
    $(document.body).append('<div id="ironman_order_list" style="display:none">' + data.html + '</div>');
    $('#ironman_order_list table tr').each(function(i, o) {
        if(i == 0) return;
        console.log("order_list ", i, o);
        var  price, amount, time, prop;
        if(!is_tmall) {
            price = $(o).find('.tb-rmb-num').text();
            amount = $(o).find('.tb-amount').text();
            time = $(o).find('.tb-start').text();
        } else {
        	prop = $(o).find('td:eq(1)').html().trim();
            amount = $(o).find('td:eq(2)').text().trim();
            time = $(o).find('td:eq(3)').text().trim();
            console.log(prop, amount, time);
            var tags = [];
            $.each(prop.split('<br>'), function(i,o){
            	var propTag = itemSkuProp[o];
            	//console.log(o, propTag);
            	if(!propTag){
            		var m = /\[(.*)\]/.exec(o);
            		if(m){
            			var extra = m[1];
            			var orig = o.replace("["+extra+"]", "");
            			propTag = itemSkuProp[orig];
            			//console.log(orig, propTag);
            		}
            	}
            	tags.push(propTag);
            });
            //console.log(tags);
            price = choose_tmall_price(tags);
            //console.log(price);
        }
        console.log(price + ',' + amount + ',' + time + ',' + prop);
        if(price == '' || amount == '' || time == '') {
            return;
        }
        orders.push({price: price, amount: amount, time: time, prop: prop});
    });
    return orders;
}

function get_orders_page(order_url, is_tmall, page_no, callback) {
    console.log('page', order_url, is_tmall, page_no);
    var mpage = /bid_page=\d+/.exec(order_url);
    if(mpage){
        order_url = order_url.replace(/bid_page=\d+/, 'bid_page=' + page_no);
    }else{
    	order_url = order_url + "&bid_page="+page_no;
    }
    $.ajax({
        type: 'get',
        url: order_url, 
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
        	var orders = [];
        	if(is_tmall){
        		orders = handle_tmall_order(data);
        	}else{
        		orders = handle_cshop_order(data);
        	}
            //console.log(orders);
            callback(orders);
        }
    });
}

function handle_cshop_order(data){
	var orders = [];
	if(data.code.code == '0'){
		var result = data.data.showBuyerList.data;
		$.each(result, function(i,o){
			var amount = o.amount;
			var time = o.payTime;
			var price = o.price;
            var props = o.skuInfo.join(',');
			if(!price){
				var tags = [];
				$.each(o.skuInfo, function(j, prop){
					var propTag = itemSkuProp[prop];
	            	console.log(prop, propTag);
	            	if(!propTag){
	            		var m = /\[(.*)\]/.exec(prop);
	            		if(m){
	            			var extra = m[1];
	            			var orig = prop.replace("["+extra+"]", "");
	            			propTag = itemSkuProp[orig];
	            			console.log(orig, propTag);
	            		}
	            	}
	            	tags.push(propTag);
				});
				console.log(tags);
	            price = choose_cshop_price(tags);
			}
            console.log(price + ',' + amount + ',' + time + ',' + props);
            if(price == '' || amount == '' || time == '') {
                return;
            }
            orders.push({price: price, amount: amount, time: time, prop: props});
		});
	}
	return orders;
}

function choose_cshop_price(tags){
	var tmp_tags = permutate(tags);
	console.log(tags, tmp_tags);
	for(var i=0; i<tmp_tags.length; i++){
		var tag = ";"+tmp_tags[i].join(";")+";";
		console.log(tag);
		if(itemPrice[tag] && itemPrice[tag][0]){
			return itemPrice[tag][0].price;
		}
	}
	console.log("invalid tag use default price");
    if(itemPrice['def'] && itemPrice['def'][0]) {
    	return itemPrice['def'][0].price;
    }

    return parseFloat(g_config.Price);
}
/**
var test_timer;
var req_count = 1;
var test_page_no = 1;
var is_tmall = true;

var order_url = dy_$('#J_listBuyerOnView').data('api');
if(order_url == null || order_url == undefined) {
    order_url = dy_$('#J_listBuyerOnView').attr('detail:params');
    var m = /(.*),\w+$/.exec(order_url);
    if(m){
    	order_url = m[1];
    }else{
        order_url = g_config.recordsApi;
        is_tmall = false;
    }
}
var start_time;

var urls = [{"url": , "is_tmall"}];


function test_ajax(){
	if(test_timer) clearTimeout(test_timer);
	if(!start_time) {
		start_time = new Date();
		dy_$.cookie("page_start", start_time.getTime());
	}
	console.log('page', new Date(), req_count, test_page_no);
    var mpage = /bid_page=\d+/.exec(order_url);
    if(mpage){
        order_url = order_url.replace(/bid_page=\d+/, 'bid_page=' + test_page_no);
    }else{
    	order_url = order_url + "&bid_page="+test_page_no;
    }
    console.log(order_url);
	
    dy_$.ajax({
        type: 'get',
        url: order_url, 
        dataType: 'jsonp',
        success: function(data) {
            console.log(data);
            if(is_tmall){
            	if(!data.html){
            		var delta = (new Date()).getTime() - start_time.getTime();
                	console.log('flood', start_time, new Date(), req_count);
                	dy_$.cookie("page_end", {"delta": delta, "count": req_count});
                	return;
            	}
            }else if(data.code.code) {
            	var delta = (new Date()).getTime() - start_time.getTime();
            	console.log('flood', start_time, new Date(), req_count);
            	dy_$.cookie("page_end", {"delta": delta, "count": req_count});
            	return;
            }
        	test_page_no++;
        	req_count++;
        	if(test_page_no > 99) test_page_no = 1;
        	test_timer = setTimeout(test_ajax, 700);
        },
        error: function(xhr, status, txt){
        	console.log("error", xhr, status, txt);
        }
    });
}
*/
