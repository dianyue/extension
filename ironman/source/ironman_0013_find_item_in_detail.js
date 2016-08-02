
var item_id;

var pat_item_detail = /(item\.taobao\.com|detail\.tmall\.com|\.95095\.com|detail\.tmall\.hk\/hk)\/item\.htm/;
if(pat_item_detail.exec(window.location) && window == window.top) {
    main();
}


function main() {
    inject_module();
    prepare_get_rank();
}

function inject_module() {

   item_id = /id=(\d+)/.exec(window.location)[1];

   $('.ironman-item-rank').remove();
   $('#ironman_get_rank').remove();

    var box_html =
        '<div class="ironman-mojing-func ironman-item-rank hide"><h3>自动用您指定的关键词在淘宝上搜索，然后自动翻页找到您的宝贝排在第几页的哪个位置</h3><h4>在您想要优化的重点关键词下，您应该随时关注您和竞争对手的宝贝排在什么位置</h4>'+
        '<h4 class="ask-to-login">免费版用户：自动往后翻最多10页! '+
        '<a class="ask-to-login" href="http://ext.moojing.com/please_login" target="_blank">登录后可自定义页数</a>'+
        '</h4><div class="widget">' +
        '<h5>输入要查询宝贝排名的关键词</h5>' +
        '<input type="text" class="find_item_word"/>' +
        '&nbsp;&nbsp;<select class="find_item_scope">' +
            '<option value="org">在自然搜索结果中查找</option>' +
            '<option value="simba">在直通车广告中查找</option>' +
            '<option value="both" selected>在所有结果中查找</option>' +
        '</select>' +
        '<span class="after-login-mj hide">&nbsp;&nbsp;<input style="width:50px" type="text" id="ironman_max_page" value="10"/>页</span>'+
        '&nbsp;&nbsp;<button class="find_item_button btn btn-primary">查找</button>' +
        '<div class="find_item_result"></div>' +
        '</div>' +
        '<div class="ironman-data-orig">*数据来自淘宝官方接口<br/>' +
        '*这个功能会自动访问多个页面，如果使用比较频繁，超过淘宝页面的访问频率限制，可能会不能正常工作。这时候您可能需要歇一歇再用。<br/>' +
        '*因为淘宝搜索页排名随时可能变化，本功能返回的是大致的位置。如果您在返回的位置找不到宝贝，可以周围四处找找，应该就在附近</div>'  +
        '</div>';

    var html = '<div id="ironman_get_rank" class="ironman-detail-hover inline" data-group="func" data-subtype="rank"><span class="ironman-item-func">查排名</span></div>';

    $('#box' + item_id + ' .ironman-item-detail-base').append(html);
    $('#box' + item_id + ' .ironman-mojing-func:last').after(box_html);

}

function prepare_get_rank() {
    var messenger = new Messenger('ironman_rank_parent', 'ironman_rank');
    messenger.listen(function (msg) {
        try {
            msg = JSON.parse(msg);
        } catch(e) {
            return;
        }

        if(msg.ironman_rank) {
            msg = msg.msg;
            console.log(msg);
            $('.find_item_result').html(msg);
        }
    });

    if(localStorage.get_rank_word) {
        $('.find_item_word').val(localStorage.get_rank_word);
        $('.find_item_scope').val(localStorage.get_rank_scope);
    }

    $('.find_item_button').click(function() {
        var word = $('.find_item_word').val();
        var scope = $('.find_item_scope').val(); 
        var maxpage = $('.ironman-item-rank').find('#ironman_max_page').val(); 

        localStorage.get_rank_word = word;
        localStorage.get_rank_scope = scope;
        localStorage.get_rank_maxpage = maxpage;

        var url = 'https://s.taobao.com/search?q=' + encodeURIComponent(word) + '&ie=utf8&ironman_get_rank=1&ironman_find_item_id=' + item_id + '&ironman_find_item_scope=' + scope+'&ironman_find_item_maxpage='+maxpage;
        create_serp_iframe(url);
    });
}


function create_serp_iframe(url) {
    $('#ironman_serp').remove();

    iframe = document.createElement("iframe");
    iframe.id = 'ironman_serp';
    iframe.src = url;
    iframe.setAttribute("style","width:1px;height:1px");
    document.body.appendChild(iframe);
}


