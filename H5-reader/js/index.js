// 自调用函数闭包（bin）
(function () {
    var Util = (function () {
        var prefix = 'html5_reader_';
        var StorageGetter = function (key) {
            return localStorage.getItem(prefix + key);

        }
        var StorageSetter = function (key, val) {
            return localStorage.setItem(prefix + key, val);
        }

        var getJsonp = function (url, callback) {
            return $.jsonp({
                url: url,
                cache: true,
                callback: 'duokan_fiction_chapter',
                success: function (result) {
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(data);
                }
            })
        }
        return {
            StorageGetter: StorageGetter,
            StorageSetter: StorageSetter,
            getJsonp:getJsonp
        }

    })();

    var Dom = {
        nav_top: $('#nav_top'),
        nav_bottom: $('#nav_bottom'),
        pannerWrapper: $('#pannerWrapper'),
        tap_panel: $('.tap_panel'),
        fontSize: $('#fontSize'),
        content: $('.content'),
        bigfontsize: $('#bigfontsize'),
        smallfontsize: $('#smallfontsize'),
        bg_color: $('.bg_color'),
        night: $('#night')
    }
    var Win_dom = $(Window);
    var initFontSize = parseInt(Util.StorageGetter('panel_fontSize'));
    console.log(typeof initFontSize);
    if (!initFontSize) {
        initFontSize = 14;
    }
    Dom.content.css('fontSize', initFontSize + 'px');

    // 背景颜色
    var _bg_color = '#e9dfc7';
    var _bg_index = Util.StorageGetter('bg_color_index');
    _bg_color = Util.StorageGetter('color');
    var night_color = Util.StorageGetter('night_color');
    if (!_bg_color) {
        $('html,body').css('background-color', '#e9dfc7');
    }
    $('html,body').css('background-color', _bg_color);
    if (_bg_index == 3 || _bg_index == 4) {
        Dom.content.css('color', '#fff');
    }
    if (night_color) {
        Dom.content.css('color', night_color);
    }
    console.log(_bg_color);
    console.log(_bg_index)
    function main() {
        // TODO整个项目的入口函数
        // var readerModel = ReaderModel();
        // readerModel.init();
        EventHanlder();
    }
    function ReaderModel() {
        // TODO 实现和阅读器的相关的数据交互的方法
        var Chapter_id;
        var init = function () {
           getFictionInfo (function () {
               getCurChapterContent(Chapter_id,function () {

               });
           })
        } 
        var getFictionInfo = function(callback) {
            $.get('../data/chapter.json',function (data) {
                Chapter_id = data.chapters[1].chapter_id;
                callback && callback();
            },'json');
        }
        var getCurChapterContent = function (chapter_id,data) {
            $.get('../data/data' + chapter_id + '.json',function (data) {
                if (data.result == 0) {
                    var url = data.jsonp;
                    Util.getJsonp(url,function (data) {
                        callback && callback(data)
                    })
                }
            },'json')
        }
        return {
            init:init
        }
    }
    function ReaderBaseFrame() {
        // TODO 渲染基本的Ui结构
    }
    function EventHanlder() {
        // TODO 事件的交互的绑定
        //  点击面板焕出导航栏
        Dom.tap_panel.on('click', function () {
            if (Dom.nav_top.css('display') == 'none') {
                Dom.nav_top.show();
                Dom.nav_bottom.show();
            } else {
                Dom.nav_top.hide();
                Dom.nav_bottom.hide();

            }
        });
        Win_dom.scroll(function () {
            Dom.nav_top.hide();
            Dom.nav_bottom.hide();
            Dom.pannerWrapper.hide();
        });
        // 点击切换字体面板
        var isPanel = true;
        Dom.fontSize.click(function () {
            if (isPanel) {
                Dom.pannerWrapper.show().css('opacity', '.8');
                isPanel = false;
            } else {
                Dom.pannerWrapper.hide();
                isPanel = true;
            }
        });
        Dom.bigfontsize.click(function () {
            initFontSize++;
            if (initFontSize > 20) {
                initFontSize = 20;
                return;
            }
            Dom.content.css('fontSize', initFontSize + 'px');
            $(this).addClass('fontSize_bg').siblings().removeClass('fontSize_bg');
            // 把字体大小存进localstorage中
            Util.StorageSetter('panel_fontSize', initFontSize);
        })
        Dom.smallfontsize.click(function () {
            initFontSize--;
            if (initFontSize < 12) {
                initFontSize = 12;
                return;
            }
            Dom.content.css('fontSize', initFontSize + 'px');
            $(this).addClass('fontSize_bg').siblings().removeClass('fontSize_bg');
            // 把字体大小存进localstorage中
            Util.StorageSetter('panel_fontSize', initFontSize);
        });
        Dom.bg_color.click(function () {
            $(this).addClass('bj_color').siblings().removeClass('bj_color');
            var color = ($('.bj_color').css('background-color'));
            var bg_color_index = ($('.bj_color').index());
            if (bg_color_index == 3 || bg_color_index == 4) {
                $('body,html').css({ backgroundColor: color });
                Dom.content.css({ color: '#fff' });
            } else {
                Dom.content.css({ color: '#555' });
            }
            $('body,html').css('backgroundColor', color);
            Util.StorageSetter('color', color);
            Util.StorageSetter('bg_color_index', bg_color_index);
        });

        // 夜间
        Dom.night.click(function () {
            $('.nav_bottom_icon3').toggleClass('night');
            var _switch = $('.nav_bottom_icon3').hasClass('night');
            console.log(_switch);
            var night_color;
            var night_bgcolor;
            if (_switch) {
                night_color = '#e9dfc7]';
                night_bgcolor = '#333';
                $('.night_title').html('日间');
                Dom.content.css({ backgroundColor: night_bgcolor, color: night_color });
            } else {
                night_color = '#555';
                night_bgcolor = '#e9dfc7';
                $('.night_title').html('夜间');
                Dom.content.css({ backgroundColor: night_bgcolor, color: night_color });

            }
            Util.StorageSetter('color', night_bgcolor);
            Util.StorageSetter('night_color', night_color);
        })

    }
    main();
})();