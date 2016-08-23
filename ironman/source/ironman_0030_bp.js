
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

function check_bp_page(obj){
	var href = location.href;
	if(obj){
		href = obj.attr('href');		
	}
    var pat = /(\/campaigns\/standards\/keyword|\/campaigns\/standards\/adgroups\/items\/detail(.*)&adGroupId=(\d+))/;
    if(pat.exec(href)){
      inject_similar_item_icon();	
    }
    return;
}

var timer;
var loading_html = '<div class="tc"><img src="http://g.tbcdn.cn/mm/subway/2016.0817.1732/app/common/assets/images/loading.gif"></div>';

function inject_similar_item_icon(){
	if(timer) clearTimeout(timer);
	var words = dy_$('span.bidtext');
	if(!words[0]){
		timer = setTimeout(inject_similar_item_icon, 2000);
		return;
	}
	
	var dialog = dy_$('.ironman-dialog');
	if(!dialog[0]){
		dy_$(document.body).append(
			'<div class="ironman-dialog ironman-container dialog dialog-overlay-hidden" style="width: 820px; visibility: hidden; left: 409px; top: 561px; z-index: 100000;">' +
			'<a href="#!/home" role="button" style="z-index:9" class="dialog-ext-close dialog-close"><span class="dialog-ext-close-x">ß</span></a>' +
			'<div class="dialog-contentbox"></div></div>'
		);
		
		dy_$('a.dialog-close').live('click', function(e){
			e.preventDefault();
			dy_$('.ironman-dialog').addClass('dialog-overlay-hidden');
			dy_$('.ironman-dialog').removeClass('dialog-overlay-shown');
			dy_$('.ironman-dialog').css("visibility", "hidden");
		});
	}
	
	//1. change th width & span padding
	dy_$('th.th-widthmax').css('width', "160px");
	words.css('padding-right', "85px");
	//2. add similar icon
	dy_$.each(words, function(i,o){
		var word_id = dy_$(o).parents('tr').attr("keywordid");
		if(!word_id){
			return true;
		}
		if(dy_$(o).next().find('.ironman-similar-item')[0]){
			return true;
		}
		dy_$(o).next().append('<a class="bpicon f14 ml5 ironman-similar-item" style="display: none"; href="#!/home" title="查看相似宝贝" data-word="'+ dy_$(o).text() +'">'+
				'<img alt="查看相似宝贝" src="https://img.alicdn.com/imgextra/i3/2134812306/TB2YGvPaeTyQeBjSspaXXcjjFXa_!!2134812306.png" style="width: 20px;"></a>');
	});
	
	dy_$('.bp-table tr').hover(function(){
		dy_$(this).find('.ironman-similar-item').css("display", "block");
	}, function(){
		dy_$(this).find('.ironman-similar-item').css("display", "none");
	});
	
	dy_$('a.ironman-similar-item').click(function(e){
		e.preventDefault();
		var word = dy_$(this).data("word");
		get_similar_items(word);
	});
	
}

function get_similar_items(word){
	dy_$('.ironman-dialog').addClass('dialog-overlay-shown');
	dy_$('.ironman-dialog').removeClass('dialog-overlay-hidden');
	dy_$('.ironman-dialog').css("visibility", "visible");
	dy_$('.ironman-dialog .dialog-contentbox').html(loading_html);
	//1.get user token
	dy_$.post('http://subway.simba.taobao.com/bpenv/getLoginUserInfo.htm', {}, function(r){
		if(r.code == '200'){
			var token = r.result.token;
			//2.get simliar items list
			dy_$.post('http://subway.simba.taobao.com/report/getWhoIs.htm?bidword='+ encodeURIComponent(word) +'&queryAdType=0', {'sla': 'json', 'isAjaxRequest': true, 'token': token}, function(r){
				if(r.code == '200'){
					show_similar_items(r.result, word);
				}else{
					ironman_show_error(r.msg);
				}
			}, 'json');
		}else if(r.msg){
			ironman_show_error(r.msg);
		}else{
			ironman_show_error("获取用户信息出错，请重新登录，谢谢！");
		}
	},'json');
}

function fix_img_path(img_src){
	var index = img_src.indexOf('.jpg');
	var tmp = img_src;
	if(index > 0){
	    tmp = img_src.substring(0, index+4);
	}
	return tmp + '_60x60.jpg';
	
}

function similar_items_cell(items, itemsmap){
	var tbody = dy_$('.ironman-dialog .bp-table tbody');
	tbody.html('');
	var tbl = '';
	dy_$.each(items, function(i, o){
		tbl += '<tr>';
		tbl += '<td>'+itemsmap[o.itemId]+'</td>';
		tbl += '<td><a class="img60" href="http://console.moojing.com/dashboard#/item/'+encodeURIComponent(o.info.ww)+'/'+o.itemId+'/pv/simba/f=syy_'+get_uid()+'" target="_blank"><img src="'+fix_img_path(o.info.img)+'"/></a></td>';
		var title = o.info.title;
		if(o.info.creative){
			title = o.info.creative;
		}
		tbl += '<td><a href="http://console.moojing.com/dashboard#/item/'+encodeURIComponent(o.info.ww)+'/'+o.itemId+'/pv/simba/f=syy_'+get_uid()+'" target="_blank">'+ title +'</a></td>';
		tbl += '<td>'+(o.simba_wordcount ? o.simba_wordcount : '--')+'</td>';
		if(o.simba_words){
			tbl += '<td style="position: relative;">';
			dy_$.each(o.simba_words, function(i, wd){
				if(i > 4){
					return true;
				}
				var size = Math.floor(Math.log(wd.exposure));
				tbl += '<span class="label label-info" style="font-size: '+ size +'px; margin-right: 5px; margin-bottom: 5px;">'+wd.word+'</span>';
			});
			tbl += '<a href="http://console.moojing.com/dashboard#/item/'+encodeURIComponent(o.info.ww)+'/'+o.itemId+'/pv/simba/f=syy_'+get_uid()+'" style="float: right;margin-right: 10px;" target="_blank">更多关键词>></a>';
			tbl += '</td>';
		}else{
			tbl += '<td>--</td>';
		}
		tbl += '</tr>';
	});
	tbody.append(tbl);
}

var page_info = {'count': 0, 'pages': 0, 'current': 1};

function calc_page_info(count, page){
	if(count){
		page_info.count = count;
		page_info.pages = Math.ceil(count/10);
	}
	if(page){
		page_info.current = page_info.current + page;
	}
}

function show_page_info(items, itemsmap){
	var start = (page_info.current - 1) * 10 + 1;
	var end = page_info.current * 10 > page_info.count ? page_info.count : page_info.current * 10;
	similar_items_cell(items.slice(start-1, end-1), itemsmap);
    
	var page = 	dy_$('.ironman-dialog .pagination-container');
    page.find('.count').html(page_info.count);
    var show_info = start + ' - ' + end;
    page.find('.current').html("<strong>"+show_info+"</strong>");
    page.find('.current_page').html("<strong>"+page_info.current + '/' + page_info.pages+"</strong>");
    
    if(page_info.current == 1){
    	page.find('.prev_page').parents('li').addClass('disabled');
    }else{
    	page.find('.prev_page').parents('li').removeClass('disabled');
    }
    
    if(page_info.current >= page_info.pages){
    	page.find('.next_page').parents('li').addClass('disabled');
    }else{
    	page.find('.next_page').parents('li').removeClass('disabled');
    }
}

function show_similar_items(similar_items, word){
	var items = [];
	var itemsmap = {};
	dy_$.each(similar_items, function(i, o){
		var pat = /id=(\d+)/.exec(o.linkUrl);
		if(pat){
			items.push(['', pat[1]]);
			itemsmap[pat[1]] = i+1;
		}
	});
	
	dy_$.ajax({
	    url: MOJINGHOST + '/item_info_get',
	    type: 'POST',
        crossDomain: true,
        data: $.toJSON({'items': items, 'include_words': true, 'include_iteminfo': true}),
        success: function(r) {
        	var box = dy_$('.ironman-dialog .dialog-contentbox');
        	box.html('');
        	box.append('<div class="dialog-body"></div>');
        	box = box.find('.dialog-body');
        	box.append('<h2 class="mb15">'+word+'</h2>');
        	box.append('<div class="clearfix"><span class="">购买了此关键词的宝贝</span><strong class="text-error">(*此功能由直通车魔镜提供)</strong></div>');
        	if(r.length == 0){
        		box.append('<div class="tc f16" style="line-height:200px;"><i class="iconfont mr15" style="font-size: 60px;color:#FA8F23;vertical-align:middle;">û</i>亲，目前暂无数据~</div>');
        	}else{
        		calc_page_info(r.length);
        		var tbl = '<div class="mt10">'+
        		    '<table class="bp-table"><thead><th class="th-width0">排名</th><th class="th-width1">宝贝图片</th><th>宝贝标题</th><th class="th-width1">关键词数量</th><th>直通车曝光关键词</th></thead><tbody></tbody></table>'+
        		    '<div class="pagination-container" style="background-color: #F5F5F5;padding: 8px;border: 1px solid #CCC;border-top: 0;line-height: 25px;height: 25px;">'+
        		      '<div class="pagination-info pull-left"><span>当前</span><span class="current b"></span><span>条</span><span class="mr">共</span><span class="b count"></span><span>条</span></div>'+
                      '<div class="pagination pull-right" style="margin: 0;"><ul>'+
                        '<li class="disabled"><a class="prev_page" data-page="-1" href="#">上一页</a></li>'+
                        '<li class="active"><span class="current_page"></span></li>'+
                        '<li class="disabled"><a class="next_page" data-page="1" href="#">下一页</a></li>'+
                      '</ul></div>'+
        		    '</div>';
        		
        		box.append(tbl);
        		show_page_info(r, itemsmap);
        		
        		dy_$('.ironman-dialog .pagination a').click(function(e){
        			e.preventDefault();
        			if(dy_$(this).parents('li').hasClass("disabled")){
        				return true;
        			}
        			
        			var p = dy_$(this).data("page");
        			calc_page_info(null, parseInt(p, 10));
        			show_page_info(r, itemsmap);
        		});
        	}
        },
        dataType: 'json',
        xhrFields: {withCredentials: true}
	});
}

var new_bp_home = /subway.simba.taobao.com/;
if(new_bp_home.exec(window.location) && window == window.top) {
    handle_bp_ad();
    check_bp_page();
    dy_$('a').live('click', function(e){
    	check_bp_page(dy_$(this));
    });
}
