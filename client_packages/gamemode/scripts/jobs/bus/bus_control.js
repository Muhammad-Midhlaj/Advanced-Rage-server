const BusControl = {
  pos: [],
	blips: [],
	markers: []
};

mp.events.add('create.all.map.bus', (way, after) => {
    for (let i = 0; i < BusControl.blips.length; i++) if (BusControl.blips[i] !== undefined) BusControl.blips[i].destroy(), BusControl.markers[i].destroy();
    BusControl.blips = [], BusControl.pos = [], BusControl.markers = [];
    if (after === "cancel") return;
    let arr = JSON.parse(way);
    BusControl.pos = arr;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === 0) {
          BusControl.blips.push(mp.blips.new(1, new mp.Vector3(arr[i].x, arr[i].y), { alpha: 255, scale: 1.1, name: "Interval #" + arr[i].id, color: 2 }));
          BusControl.markers.push(mp.markers.new(1, new mp.Vector3(arr[i].x, arr[i].y, arr[i].z - 1.25), 6, { visible: true, color: [0, 128, 0, 100] }));
        } else {
          BusControl.blips.push(mp.blips.new(1, new mp.Vector3(arr[i].x, arr[i].y), { alpha: 255, scale: 1.1, name: "Stop #" + arr[i].id, color: 1 }));
          BusControl.markers.push(mp.markers.new(1, new mp.Vector3(arr[i].x, arr[i].y, arr[i].z - 1.25), 6, { visible: true, color: [255, 0, 0, 100] }));
        }
    }
});

mp.events.add('create.one.map.bus', (x, y, z, type, id) => {
    BusControl.pos.push({ id: id, x: x, y: y, z: z, type: type });
    if (type === 0) {
      BusControl.blips.push(mp.blips.new(1, new mp.Vector3(x, y), { alpha: 255, scale: 1.1, name: "Interval #" + id, color: 2 }));
      BusControl.markers.push(mp.markers.new(1, new mp.Vector3(x, y, z - 1.25), 6, { visible: true, color: [0, 128, 0, 100] }));
    } else {
      BusControl.blips.push(mp.blips.new(1, new mp.Vector3(x, y), { alpha: 255, scale: 1.1, name: "Stop #" + id, color: 1 }));
      BusControl.markers.push(mp.markers.new(1, new mp.Vector3(x, y, z - 1.25), 6, { visible: true, color: [255, 0, 0, 100] }));
    }
});
mp.events.add('change.one.map.bus.position', (num, x, y, z) => {
    for (let i = 0; i < BusControl.pos.length; i++) {
      if (BusControl.pos[i].id === num) {
        let need = BusControl.pos.indexOf(BusControl.pos[i]);
        BusControl.blips[need].position = new mp.Vector3(x, y, z);
        BusControl.markers[need].position = new mp.Vector3(x, y, z - 1.25);
        BusControl.pos[i].x = x, BusControl.pos[i].y = y, BusControl.pos[i].z = z;
      }
    }
});
mp.events.add('change.one.map.bus.name', (num, type) => {
    for (let i = 0; i < BusControl.pos.length; i++) {
      if (BusControl.pos[i].id === num) {
        let need = BusControl.pos.indexOf(BusControl.pos[i]);
        if (BusControl.blips[need]) BusControl.blips[need].destroy(), BusControl.markers[need].destroy();
        if (type === 0) {
          BusControl.blips[need] = mp.blips.new(1, new mp.Vector3(BusControl.pos[i].x, BusControl.pos[i].y), { alpha: 255, scale: 1.1, name: "Interval #" + num, color: 2 });
          BusControl.markers[need] = mp.markers.new(1, new mp.Vector3(BusControl.pos[i].x, BusControl.pos[i].y, BusControl.pos[i].z - 1.25), 6, { visible: true, color: [0, 128, 0, 100] });
        } else {
          BusControl.blips[need] = mp.blips.new(1, new mp.Vector3(BusControl.pos[i].x, BusControl.pos[i].y), { alpha: 255, scale: 1.1, name: "Stop #" + num, color: 1 });
          BusControl.markers[need] = mp.markers.new(1, new mp.Vector3(BusControl.pos[i].x, BusControl.pos[i].y, BusControl.pos[i].z - 1.25), 6, { visible: true, color: [255, 0, 0, 100] });
        }
      }
    }
});
mp.events.add('delete.one.map.bus', (num) => {
    for (let i = 0; i < BusControl.pos.length; i++) {
      if (BusControl.pos[i].id === num) {
        let need = BusControl.pos.indexOf(BusControl.pos[i]);
        BusControl.blips[need].destroy();
        BusControl.markers[need].destroy();
        BusControl.pos.splice(need, 1), BusControl.blips.splice(need, 1), BusControl.markers.splice(need, 1);
      }
    }
});
