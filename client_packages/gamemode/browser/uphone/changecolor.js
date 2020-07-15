
// ЦВЕТ ТЕЛЕФОНА	(https://colorscheme.ru/html-colors.html) <-- ЦВЕТА
document.getElementById("iphone").style.background = "black"; // КРЫШКА АЙФОНА, ВМЕСТО black ПИШЕМ СВОЙ ЦВЕТ
document.getElementById("camera1").style.background = "black"; // ЗАМЕНЯЕМ НА ОДИН ЦВЕТ ВСЕ ЭТИ ЧЕТЫРЕ ПУНКТА
document.getElementById("camera2").style.background = "black"; // ЭТОТ ТОЖЕ
document.getElementById("camera3").style.background = "black"; // И ЭТОТ
// ВСЁ, ЦВЕТ КРЫШКИ МЫ ПОМЕНЯЛИ, ИДЁМ ДАЛЬШЕ


// ВОКРУГ ЭКРАНА У НАС ЕСТЬ BORDER, ЕГО ЦВЕТ МЕНЯЕМ ТУТ:
document.getElementById("screen").style.border = "4px solid #303030"; // ИЗМЕНЯЙТЕ ТОЛЬКО #303030 (ЭТО ЦВЕТ)
document.getElementById("camera1").style.border = "4px solid #303030";
// "4px solid" НЕ ТРОГАЙТЕ, А ТО ВСЁ СЛЕТИТ


// ЦВЕТ ДИНАМИКА
document.getElementById("camera4dinamic").style.background = "dimgrey";


// ФОН
document.getElementById("screen").style.background = "linear-gradient(to top left, purple, crimson, orangered, gold)";
// ЗАМЕНЯЕМ ЦВЕТА
// "to top left" <-- направление градиента, погуглите какие есть ещё и выберите для себя какой хотите.

// Если что-то забыл - пишите в комментарии