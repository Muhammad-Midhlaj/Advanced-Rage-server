$(document).ready(() => {
    window.mapAPI = {
        on: () => {
            $('#userInterface .serverIndicator').css('left', '42.5vh');

            $('#userInterface .serverInfo').css('width', '41vh');
            $('#userInterface .serverInfo').css('left', '0.2vh');
            $('#userInterface .serverInfo').css('text-align', 'left');

            $('#userInterface .serverInfo a:first-child, #userInterface .serverInfo a:nth-child(2)').css('margin-right', '9.2vh');
        },
        off: () => {
            $('#userInterface .serverIndicator').css('left', '26.66666666666667vh');

            $('#userInterface .serverInfo').css('width', '26vh');
            $('#userInterface .serverInfo').css('left', '-0.5vh');
            $('#userInterface .serverInfo').css('text-align', 'center');

            $('#userInterface .serverInfo a:first-child, #userInterface .serverInfo a:nth-child(2)').css('margin-right', '2vh');
        },
    };
});
