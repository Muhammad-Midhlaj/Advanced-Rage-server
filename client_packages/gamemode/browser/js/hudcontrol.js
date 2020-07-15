function controlServerHud(type) {
   $(`#safezone .serverIndicator`).css("display", (type === false ? "none" : "block"));
   $(`#safezone .serverInfo`).css("display", (type === false ? "none" : "block"));
}
