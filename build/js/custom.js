/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function ($, sr) {
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize 
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
$(document).ready(function () {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }
    });

    // simple calendar
    var dt = $('#calendar').datepicker({
        inline: true,
        firstDay: 1,
        showOtherMonths: true,
        regional: "ko"
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();

        $('.dataTable').each(function () {
            $(this).dataTable().fnDraw();
        });
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: {
                preventDefault: true
            }
        });
    }
});
// /Sidebar

// Panel toolbox
$(document).ready(function () {
    $('.collapse-link').on('click', function () {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function () {
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Progressbar
$(document).ready(function () {
    if ($(".progress .progress-bar")[0]) {
        $('.progress .progress-bar').progressbar();
    }
});
// /Progressbar

// Switchery
$(document).ready(function () {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery

// iCheck
$(document).ready(function () {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' 개 선택되었습니다.');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
$(document).ready(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).on('load', function () {
        NProgress.done();
    });
}

$(document).ready(function () {
    // Login Notisfy
    // new PNotify({
    //     title: '서동필님 안녕하세요.',
    //     text: '신규 쪽지 <a href="#!" class="red"><strong>2</strong></a>건<br/> 주요 일정 <a href="#!" class="red"><strong>3</strong></a>건',
    //     type: 'info',
    //     hide: false,
    //     styling: 'bootstrap3'
    // });

})


// ---------------------작성자 이지현--------------------------

////서비스금액창 스크롤시 나타나게 하기  (마우스 엔터버전 사용으로 사용 안함)
//
//// Hide Header on on scroll down
//var didScroll;
//var lastScrollTop = 0;
//var delta = 5;
//var navbarHeight = $('.servicePriceFix').outerHeight();
//
//
//
//$(window).scroll(function (event) {
//    didScroll = true;
//});
//
//setInterval(function () {
//    if (didScroll) {
//        hasScrolled();
//        didScroll = false;
//    }
//}, 250);
//
//function hasScrolled() {
//    var st = $(this).scrollTop();
//
//    // Make sure they scroll more than delta
//    if (Math.abs(lastScrollTop - st) <= delta)
//        return;
//
//    // If they scrolled down and are past the navbar, add class .nav-up.
//    // This is necessary so you never see what is "behind" the navbar.
//    if (st > lastScrollTop && st > navbarHeight) {
//        // Scroll Down (계산기 나타내기)
//        $('.servicePriceFix').removeClass('nav-down').addClass('nav-up');
//    } else {
//        // Scroll Up (계산기 숨기기)
//        if (st + $(window).height() < $(document).height()) {
//            $('.servicePriceFix').removeClass('nav-up').addClass('nav-down');
//        }
//    }
//
//    lastScrollTop = st;
//}
//
////스크롤 끝나면 서비스금액 창 사라지게하기
//
//$(window).scroll(function () {
//    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
//        $('.servicePriceFix').css('opacity', '0');
//    }else{
//        $('.servicePriceFix').css('opacity', '1');
//    }
//});


//서비스금액창 마우스 호버시 more버튼 클릭하여 고정하기로 변하게 하기, 창 올라오게하기
$('.servicePriceFix').mouseenter(function () { //마우스 엔터시
    if ($(".servicePriceFix").hasClass("nav-stop") === false) { //servicePriceFix가 nav-stop으로 고정되어있지 않을때 
        $('.servicePriceMore').text('클릭하여 고정하기'); //more를 클릭하여 고정하기로 변경
    }
    $('.servicePriceFix').removeClass('nav-down').addClass('nav-up'); //servicePriceFix에 nav-up클래스 추가, 위로 나타나게함
    $('.service-price').removeClass('priceHide'); //타이틀 제외 내용 표시
});
$('.servicePriceFix').mouseleave(function () { //마우스 리브시
    if ($(".servicePriceFix").hasClass("nav-stop") === false) { //servicePriceFix가 nav-stop으로 고정되어있지 않을때 
        $('.servicePriceMore').text('More'); //클릭하여 고정하기를 More로 변경
        $('.service-price').addClass('priceHide'); //타이틀 제외 내용 숨김 (고정버튼 사용 안하고 모달 사용시 오류 방지)
    }
    $('.servicePriceFix').removeClass('nav-up').addClass('nav-down'); //servicePriceFix에 nav-down클래스 추가, 아래로 숨김
});

//클릭하여 고정하기 클릭 시 서비스창 고정하기
$('.servicePriceMore').click(function () { //servicePriceMore 클릭시
    $('.servicePriceFix').toggleClass('nav-stop'); //nav-stop클래스 토글, nav-stop은 bottom: 0px !important임
})

//서비스창 고정 시 텍스트 변경
$('.servicePriceMore').click(function () {
    if ($(this).text() == '클릭하여 고정하기') {
        $(this).text('클릭하여 고정해제');
    } else {
        $(this).text('클릭하여 고정하기');
    }
});


//html 인클루드
$("#include_top_nav").load("include_top_nav.html")
//$("#include_sidebar_menu").load("include_sidebar_menu.html")
