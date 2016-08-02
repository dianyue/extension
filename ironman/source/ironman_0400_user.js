
var pat_taobao_domain = /\.taobao\.com|\.tmall\.com|\.jiyoujia\.com|\.95095.com/;

if(pat_taobao_domain.exec(location.href)){
	main();
}

function get_username(userinfo) {
    var username = userinfo.username;
    if(userinfo.from == 'qq' || userinfo.from == 'weibo') {
        username = JSON.parse(userinfo.userinfo).nickname;
    }

    return username;
}

window.ironman_clear_userinfo = function() {
    store_remove('ironman_userinfo');
    delete localStorage.ironman_username;
};

function main() {
    store_get('ironman_userinfo', function(r) {
        //console.log(r);
        if(r) {
            localStorage.ironman_username = get_username(r);
            $('.ask-to-login').hide();
            $('.after-login-mj').show();
            return;
        }

        $.ajax({
            //url: 'https://ux.taosem.com/cas/userInfo',
            url: 'https://ext.moojing.com/cas/userInfo',
            //dataType: 'jsonp',
            xhrFields: {
                withCredentials: true
            },
            success: function(r) {
                r = JSON.parse(r);
                if(r.logged_in) {
                    store_set('ironman_userinfo', r, function() {});
                    localStorage.ironman_username = get_username(r);
                    $('.ask-to-login').hide();
                    $('.after-login-mj').show();
                }
            }
        }); 

    });
}
