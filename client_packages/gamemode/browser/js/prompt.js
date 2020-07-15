$(document).ready(() => {
    const SHOW_TIME = 10000;

    var prompts = {
        "select_menu": {
            text: "Use <span>&uarr;</span> <span>&darr;</span> <span>&crarr;</span> to select an item in the menu.",
            showTime: 60000
        },
        "vehicle_engine": {
            text: "Press <span>2</span> to start the car engine."
        },
        "vehicle_repair": {
            text: "The car broke down. It is necessary to call the mechanic."
        },
        "choiceMenu_help": {
            text: "Use key <span>y</span> and <span>n</span>",
            header: "The dialogue is offered by",
        },
        "documents_help": {
            text: "Press <span>e</span> to close",
            header: "Documents",
        },
        "health_help": {
            text: "It's possible for a patient to be sick..",
            header: "Help Healing",
        },
        "police_service_recovery_carkeys": {
            text: "Call the service to get the car to the site.",
            header: "Key recovery",
        },
    }

    window.promptAPI = {
        showByName: (name) => {
            var info = prompts[name];
            if (!info) return;
            var showTime = SHOW_TIME;
            if (info.showTime) showTime = info.showTime;

            promptAPI.show(info.text, info.header, showTime);
        },
        show: (text, header = "HINT", showTime = SHOW_TIME) => {
            $(".prompt .header").text(header);
            $(".prompt .text").html(text);

            if (chatAPI.isLeft()) {
                $('.prompt').css('left', '');
                $('.prompt').css('top', '1vh');
                $('.prompt').css('right', '1vh');
                $('.prompt').css('bottom', '');
            } else {
                $('.prompt').css('left', '1vh');
                $('.prompt').css('top', '1vh');
                $('.prompt').css('right', '');
                $('.prompt').css('bottom', '');
            }

            var height = Math.abs(parseFloat($(".prompt .header").height()) + parseFloat($(".prompt .text").height()));
            $(".prompt .body").height(height);

            $(".prompt").slideDown("fast");
            setTimeout(() => {
                promptAPI.hide();
            }, showTime);
        },
        hide: () => {
            $(".prompt").slideUp("fast");
        }
    };
});
