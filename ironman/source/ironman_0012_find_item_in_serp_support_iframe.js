

var is_iframe = false;
var messenger = new Messenger(item_id, 'ironman_rank');
messenger.addTarget(top, 'ironman_rank_parent');

var orgs = [];
var simbas = [];

var pager_url;
var max_page = 10;

function send(msg) {
    messenger.targets['ironman_rank_parent'].send(JSON.stringify({ironman_rank: true, msg: msg}));
}

if(/s\.taobao\.com/.exec(location.href)) {
  if(window == window.top){
      main();
  } else if(/ironman_get_rank/.exec(location.href)) {
    var r = /ironman_find_item_maxpage=(\d+)(&|$)/.exec(location.href);
    if(r){
    	max_page = r[1];
    }
    console.log("ironman mj rank max page", max_page, localStorage);

    console.log('got get_rank command from parent window');
    is_iframe = true;
    var r = /ironman_find_item_id=(\d+)(&|$)/.exec(location.href);
    var item_id = r[1];
    var r = /ironman_find_item_scope=(.*?)(&|$)/.exec(location.href);
    var scope = r[1];
    find(item_id, scope);
  }
}

function main() {

    if(localStorage.find_item_url) {
        $('.find_item_url').val(localStorage.find_item_url);
        $('.find_item_scope').val(localStorage.find_item_scope);
    }
    
    $('.find_item_button').live('click', function() {
        console.log('here');
        var item_url = $('.find_item_url').val();
        var r = /id=(\d+)/.exec(item_url);
        if(!r) {
            show_error('宝贝链接地址格式不正确');
            return;
        }

        var scope = $('.find_item_scope').val();

        localStorage.find_item_url = item_url;
        localStorage.find_item_scope = scope;

        var item_id = r[1];
        find(item_id, scope);

    });
}

function find(item_id, scope) {

    show_progress(1);
    var pconfig = get_mainpage_config();

    pager_url = 'https:' + pconfig.mainInfo.modLinks.pager;
    var page_no = is_iframe?1:pconfig.mods.pager.data.currentPage;

    var found = find_item(item_id, scope, pconfig);
    if(found) {
        console.log(found);
        show_result(page_no, found.position, found.section);
    } else {
        next_page(page_no + 1, item_id, scope);
    }

}

function show_progress(page_no) {
    var msg = '正在查找第' + page_no + '页...';
    if(is_iframe) {
        send(msg);
    } else {
        $('.find_item_result').html(msg);
    }
}

function show_result(page_no, position, section) {
    section = {left: '左侧', right: '右侧', bottom: '底部'}[section];
    var msg = '找到了。在第' + page_no + '页，' + section + ', 第' + position + '个';

    if(is_iframe) {
        send(msg);
    } else {
        $('.find_item_result').html(msg);
    }
}

function no_result() {
    var msg = '翻了' + max_page + '页，没有找到这个宝贝';

    if(is_iframe) {
        send(msg);
    } else {
        $('.find_item_result').html(msg);
    }
}

function show_error(msg) {
    if(is_iframe) {
        send(msg);
    } else {
        $('.find_item_result').html(msg);
    }
}


function next_page(page_no, item_id, scope) {
    if(page_no >= max_page) {
        no_result();
        return;
    }

    console.log('serp page ' + page_no);
    show_progress(page_no);

    var offset = (page_no - 1) * 44;
    var url = pager_url + '&data-key=s&data-value=' + offset + '&ajax=true';
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(r) {
            console.log(r);
            var found = find_item(item_id, scope, r);
            if(found) {
                console.log(found);
                show_result(page_no, found.position, found.section);
                return;
            }

            pager_url = r.mainInfo.modLinks.pager; 
            next_page(page_no + 1, item_id, scope);
        }
    });

}

function get_mainpage_config() {
    var html = document.head.innerHTML;
    var r = /g_page_config\s*=\s*(\{.*?\});/.exec(html);
    r = JSON.parse(r[1]);
    console.log(r);

    return r;
}

function find_item(item_id, scope, config) {
    for(var i=0;i<config.mods.itemlist.data.auctions.length;i++) {
        var o = config.mods.itemlist.data.auctions[i];
        console.log(o.nid + '--' + item_id);
        if(o.nid == item_id) {
            if(scope == 'org') {
                if(o.p4p == 1) {
                    continue; 
                }
            } else if(scope == 'simba') {
                if(o.p4p != 1) {
                    continue;
                }
            }
            console.log('found');
            o.position = i + 1;
            o.section = 'left';
            return o;
        }
    }

    if(scope == 'org') {
        return null;
    }

    if(!config.mods.p4p.data) {
        return null;
    }

    var p4pdata = JSON.parse(config.mods.p4p.data.p4pdata);
    for(var i=0;i<p4pdata.right.data.ds1.length;i++) {
        var o = p4pdata.right.data.ds1[i];
        console.log(o.RESOURCEID + '--' + item_id);
        if(o.RESOURCEID == item_id) {
            console.log('found');
            o.position = i + 1;
            o.section = 'right';
            return o;
        }
    }

    for(var i=0;i<p4pdata.bottom.data.ds1.length;i++) {
        var o = p4pdata.bottom.data.ds1[i];
        console.log(o.RESOURCEID + '--' + item_id);
        if(o.RESOURCEID == item_id) {
            console.log('found');
            o.position = i + 1;
            o.section = 'bottom';
            return o;
        }
    }

    return null;
}
