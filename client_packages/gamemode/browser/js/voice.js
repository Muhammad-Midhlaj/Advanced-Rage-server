$(document).ready(() => {
    window.voiceAPI = {
        on: () => {
            $("#userInterface .serverIndicator #micro_control").css("opacity", 1.0);
        },
        off: () => {
            $("#userInterface .serverIndicator #micro_control").css("opacity", 0.3);
        }
    };
});
