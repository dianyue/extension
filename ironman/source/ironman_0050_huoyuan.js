
var base64_encode = function(input){
	var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	if (!input) {
        return "";
    }
	var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) enc3 = enc4 = 64;
        else if (isNaN(chr3)) enc4 = 64;
        output += key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
    } while (i < input.length);
    return output;
}

function main() {
    var item_id = get_item_id();
    console.log(item_id);
    var t = (new Date).getTime();
    var d = base64_encode("taosellerran;"+t);
    console.log(t, d);
    var tp = window.g_config ? "jsonp" : "json";
    dy_$.ajax({
    	url:'https://open-s.1688.com/openservice/taoOfferSameSimilarBusinessService?appName=taosellerran&appKey='+ d +'&fromOfferId=' + item_id,
    	type: "GET",
    	dataType: tp,
    	success: function(data) {
    		console.log(data);
    		inject_box(item_id);
    		if(!data.data) {
            	data.data = {'offerList': []};
            }
            show_simitems(data.data.offerList, data.data.totalCount);
        }
    });
}


function inject_box(item_id) {

    $('#ironman_huoyuan').remove();
    $('#ironman_simitem_container').remove();

    var huoyuan_html =
        '<div class="row-fluid ironman-mojing-func ironman-item-huo hide" id="ironman_simitem_container">' +
            '<div class="widget">' +
                '<div class="widget-header">' +
                    '<span class="text-h3" style="font-size:18px">同款/相似货源</span>' +
                '</div>' +
                '<div class="widget-container clearfix">' +
                    '<div id="ironman_simitem_row" class="">' +
                        '<ul class="clearfix inline"></ul>' +
            
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ironman-data-orig">*数据来自淘宝官方接口<br/>' +
        '</div>';
                    

    var html = '<div id="ironman_huoyuan" class="ironman-detail-hover inline" data-group="func" data-subtype="huo" ironman-itemid="' + item_id + '" "><span class="ironman-item-func">同款货源</span></div>';

    $('#box' + item_id + ' .ironman-item-detail-base').append(html);
    $('#box' + item_id + ' .ironman-mojing-func:last').after(huoyuan_html);

}

function show_simitems(items, count) {
	var first_price=null;
    if(!items) {
    	$('#ironman_simitem_row ul').append('<li>暂无数据</li>');
    	return;
    }
    var detail_url;
    $.each(items, function(i, o) {
        //console.log(o);
        first_price = o.price;
        detail_url = o.detailUrl;
        var img_url = o.imageUrl.replace(/\.\d+x\d+\.jpg/, '.120x120.jpg');
        $('#ironman_simitem_row ul').append(
            '<li>' + 
                '<dt><a target="_blank" href="' + detail_url + '"><img style="border:1px solid #a5a5a5" src="' + img_url + '"></img></a></dt>' +
                '<dd><h6>¥' + o.price + '</h6></dd>' +
            '</li>'
        );
    });
    if(detail_url){
    	$('#ironman_simitem_row').append('<div id="G_1688" class="G_TMALL" style="margin: auto;width: 100%;"><div id="g_none"><p>共'+count+'件商品, <a class="ironman-m-link" href="'+detail_url+'" target="_blank" >查看更多同类商品</a></p></div></div>');
    }
    
}

function get_item_id() {
    return /(\?|\&)(id|itemid)=(\d+)/.exec(location.href)[3];
}    

var pat_item_detail = /(item\.taobao\.com|detail\.tmall\.com|\.95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/;
if(pat_item_detail.exec(window.location) && window == window.top) {
    main();
}

