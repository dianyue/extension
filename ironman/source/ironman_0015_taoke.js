
/* ===========================================================
 * ironman_taoke.js
 * support taoke item
 * ========================================================== */

var get_taoke_item = function(){
	dy_$.ajax({
		"url": HOST+"/taoke_item", 
		"data": {}, 
		"success": function(r){
			if(r.status == 'ok'){
				show_taoke_item(r.item);
			}
		},
		"type": "GET",
		"dataType": "json",
		xhrFields: {withCredentials: true}
	});
};

var show_taoke_item = function(item){
	console.log(item);
	var name = get_extension_name();
	var tk_obj = dy_$('#ironman_tk_container');
	if(!tk_obj[0]){
		var tk_html = '<div class="ironman_ad_container" id="ironman_tk_container" style="text-align: center;position: relative;box-shadow: 0 0 1px 1px #f3f3f4;background: #f3f3f4;">' +
		    '<p style="font-size: 11px;">'+ name +'热卖</p>'+
			'<ul class="ironman_tk_list item-list"></ul>'+
	    '</div>';
		dy_$('#J_shopkeeper').before(tk_html);
		tk_obj = dy_$('#ironman_tk_container');
	}
	console.log(tk_obj);
	var item_link = 'http://12.moojing.com/item.htm?id='+item.item_id;
	var item_html = '<li class="item oneline">' +
	    '<div class="imgwrap"><a class="imglink" target="_blank" href="'+ item_link +'" title="'+ item.title +'"><img src="'+ item.pic_url+'"></a></div>' +
	    '<div class="line1">'+
	      '<a target="_blank" href="'+ item_link +'" class="price" ><em>¥</em>'+ item.discount_price +'<span class="orig-price" >'+ item.price +'</span></a>'+
	      '<div><a target="_blank" href="'+ item_link +'" class="sell">销量:<em>'+item.sales_count+'</em></a></div>'+
	    '</div>'+
		'<a class="red" target="_blank" href="'+ item_link +'">' +
		    '<div class="bgred"></div>' +
			'<div class="redtitle">'+ item.title +'</div>'+
			'<div class="hover"></div>' +
			'<div class="go"></div>' +
	    '</a></li>';
	tk_obj.find('.ironman_tk_list').append(item_html);
	dy_$(".ironman_ad_container .item").hover(function(){
		dy_$(this).addClass("item-hover");
	}, function(){
		dy_$(this).removeClass("item-hover");
	})
};

if(/s\.taobao\.com/.exec(location.href)){
	get_taoke_item();
}