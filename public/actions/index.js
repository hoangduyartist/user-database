$(document).ready(function () {

    $('#api-section #copyUrlBtn').click(function () {
        let $url = $(this).siblings('strong');
        let $temp = $("<input>");
        $("body").append($temp);
        $temp.val($url.text()).select();
        document.execCommand("copy");
        $temp.remove();
    })

    $('#btn-scroll-top').click(function(){
        $('html, body').animate({scrollTop: 0}, 'slow');
    })

    $(window).bind('scroll', function(){
        let pos = window.scrollY;
        if(pos>300){
            $('#btn-scroll-top').show(500);
        }
        else $('#btn-scroll-top').hide(500);
    })

})