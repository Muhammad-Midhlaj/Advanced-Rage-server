/*
      API для работы с окнами GUI
*/

function showWindow(el) {
    $(el).css('top', Math.max(0, (($(window).height() - $(el).outerHeight()) / 2) + $(window).scrollTop()) + 'px');
    $(el).css('left', Math.max(0, (($(window).width() - $(el).outerWidth()) / 2) + $(window).scrollLeft()) + 'px');
    $(el).fadeIn(1000);
}

function hideWindow(el) {
    $(el).fadeOut(1000);
}

function isVisible(el) {
    return $(el).css("display") != "none";
}
