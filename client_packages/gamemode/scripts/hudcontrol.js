exports = (menu) => {
  mp.events.add("control.player.hud", (type) => {
      menu.execute(`controlServerHud(${type})`);
  });
}