module.exports = {
    Init: () => {
        mp.bizes = [];
        initBizesUtils();
        DB.Handle.query("SELECT * FROM bizes WHERE status != ?", [-1], (e, result) => {
            for (var i = 0; i < result.length; i++) {
                result[i].sqlId = result[i].id;
                delete result[i].id;

                var marker = mp.createBizMarker(result[i]);
                mp.bizes.push(marker);
            }
            console.log(`Businesses loaded: ${i} units.`);
        });
    }
}

var bizesInfo = [{
        name: "Diner",
        blip: 106
    },
    {
        name: "Bar",
        blip: 93
    },
    {
        name: "Clothing store",
        blip: 73
    },
    {
        name: "Barbershop",
        blip: 71
    },
    {
        name: "Petrol station",
        blip: 361
    },
    {
        name: "24/7",
        blip: 52
    },
    {
        name: "Tattoo salon",
        blip: 75
    },
    {
        name: "Gun shop",
        blip: 110
    },
    {
        name: "Dealership",
        blip: 524
    },
    {
        name: "LS Customs",
        blip: 72
    },
    {
        name: "СТО",
        blip: 446
    }
];

function initBizesUtils() {
    mp.bizes.getBySqlId = (sqlId) => {
        if (!sqlId) return null;
        var result;
        mp.bizes.forEach((biz) => {
            if (biz.sqlId == sqlId) {
                result = biz;
                return;
            }
        });
        return result;
    };

    mp.bizes.getArrayByOwner = (owner) => {
        if (!owner) return [];
        var array = [];
        mp.bizes.forEach((biz) => {
            if (biz.owner == owner) {
                array.push({
                    sqlId: biz.sqlId,
                    balance: biz.balance,
                    owner: biz.owner,
                    ownerName: biz.ownerName,
                    name: biz.name,
                    price: biz.price,
                    maxProducts: biz.maxProducts,
                    productPrice: biz.productPrice,
                    bizType: biz.bizType,
                    balance: biz.balance,
                    status: biz.class,
                    x: biz.h,
                    y: biz.y,
                    z: biz.z
                });
            }
        });
        return array;
    };

    mp.bizes.getNameByType = (type) => {
        return bizesInfo[type - 1].name;
    };

    mp.bizes.create = (name, price, bizType, pos) => {
        if (price < 1) price = 1;
        bizType = Math.clamp(bizType, 1, 11);
        DB.Handle.query("SELECT id FROM bizes WHERE status=?", [-1], (e, result) => {
            if (result.length == 0) {
                DB.Handle.query("INSERT INTO bizes (name,price,bizType,staff,x,y,z) VALUES (?,?,?,?,?,?,?)", [name, price, bizType, '[]', pos.x, pos.y, pos.z], (e, result) => {
                    if (e) return terminal.error(e);

                    DB.Handle.query("SELECT * FROM bizes WHERE id=?", result.insertId, (e, result) => {
                        result[0].sqlId = result[0].id;
                        delete result[0].id;
                        var marker = mp.createBizMarker(result[0]);
                        mp.bizes.push(marker);
                    });
                });
            } else {
                var sqlId = result[0].id;
                DB.Handle.query("UPDATE bizes SET name=?,owner=?,ownerName=?,price=?,products=?,maxProducts=?,productPrice=?,balance=?,bizType=?,status=?,staff=?,x=?,y=?,z=? WHERE id=?",
                    [name, 0, '', price, 0, 1000, 1, 0, bizType, 0, '[]', pos.x, pos.y, pos.z, sqlId], () => {
                        DB.Handle.query("SELECT * FROM bizes WHERE id=?", sqlId, (e, result) => {
                            result[0].sqlId = result[0].id;
                            delete result[0].id;
                            var marker = mp.createBizMarker(result[0]);
                            mp.bizes.push(marker);
                        });
                    });
            }
        });
    };

    mp.bizes.delete = (bizSqlId, callback) => {
        var biz = mp.bizes.getBySqlId(bizSqlId);
        if (!biz) return callback("Business not found!");

        var i = mp.bizes.indexOf(biz);

        mp.players.forEachInRange(biz.position, 2, (rec) => {
            if (biz.colshape.isPointWithin(rec.position)) rec.call("selectMenu.hide");
        });

        mp.bizes.splice(i, 1);
        biz.blip.destroy();
        biz.colshape.destroy();
        biz.showColshape.destroy();
        biz.destroy();

        //DB.Handle.query("DELETE FROM bizes WHERE id=?", biz.sqlId);
        DB.Handle.query("UPDATE bizes SET status=? WHERE id=?", [-1, bizSqlId]);
        callback();
        delete biz;
    }
}

function initBizUtils(biz) {
    biz.setName = (name) => {
        biz.name = name;
        biz.blip.name = biz.name;
        DB.Handle.query("UPDATE bizes SET name=? WHERE id=?", [biz.name, biz.sqlId]);
    };
    biz.setOwner = (ownerSqlId, ownerName) => {
        // debug(`biz.setOwner: ${ownerSqlId} ${ownerName}`);
        if (ownerSqlId < 1) {
            ownerSqlId = 0;
            ownerName = "";

            // biz.blip.color = 2;
        } else {
            // biz.blip.color = 49;
        }
        biz.owner = ownerSqlId;
        biz.ownerName = ownerName;
        biz.products = 0;
        biz.productPrice = 1;
        // biz.balance = biz.getTax() * 24;
        biz.balance = 0;
        biz.status = 1;
        biz.staff = [];
        DB.Handle.query("UPDATE bizes SET owner=?,ownerName=?,products=?,productPrice=?,balance=?,status=?,staff=? WHERE id=?",
            [biz.owner, biz.ownerName, biz.products, biz.productPrice, biz.balance, biz.status, JSON.stringify(biz.staff), biz.sqlId]);
    };
    biz.setPrice = (price) => {
        if (price < 1) price = 1;
        biz.price = price;
        DB.Handle.query("UPDATE bizes SET price=? WHERE id=?", [price, biz.sqlId]);
    };
    biz.setProducts = (products) => {
        biz.products = Math.clamp(products, 0, biz.maxProducts);
        DB.Handle.query("UPDATE bizes SET products=? WHERE id=?", [biz.products, biz.sqlId]);
    };
    biz.setMaxProducts = (maxProducts) => {
        if (maxProducts < 1) maxProducts = 1;
        biz.maxProducts = maxProducts;
        DB.Handle.query("UPDATE bizes SET maxProducts=? WHERE id=?", [maxProducts, biz.sqlId]);
    };
    biz.setProductPrice = (productPrice) => {
        biz.productPrice = Math.clamp(productPrice, 1, 10);
        DB.Handle.query("UPDATE bizes SET productPrice=? WHERE id=?", [biz.productPrice, biz.sqlId]);
    };
    biz.setBalance = (balance) => {
        if (balance < 0) balance = 0;
        biz.balance = balance;
        DB.Handle.query("UPDATE bizes SET balance=? WHERE id=?", [balance, biz.sqlId]);
    };
    biz.setType = (bizType) => {
        biz.bizType = Math.clamp(bizType, 1, 11);
        biz.colshape.menuName = `enter_biz_${biz.bizType}`;
        biz.blip.model = bizesInfo[biz.bizType - 1].blip;
        DB.Handle.query("UPDATE bizes SET bizType=? WHERE id=?", [biz.bizType, biz.sqlId]);
    };
    biz.setStatus = (status) => {
        biz.status = Math.clamp(status, 0, 1);
        DB.Handle.query("UPDATE bizes SET status=? WHERE id=?", [biz.status, biz.sqlId]);
    };
    biz.setPosition = (pos) => {
        pos.z--;
        biz.position = pos;
        pos.z++;
        biz.blip.position = pos;

        /* It desn't work */
        //biz.showColshape.position = pos;
        //biz.colshape.position = pos;

        biz.showColshape.destroy();
        biz.colshape.destroy();

        //для стриминга игрокам, которые в радиусе
        biz.showColshape = mp.colshapes.newCircle(biz.position.x, biz.position.y, 60);
        biz.showColshape.marker = biz;

        //для отловки события входа
        biz.colshape = mp.colshapes.newSphere(biz.position.x, biz.position.y, biz.position.z, 2);
        biz.colshape.biz = biz;
        biz.colshape.menuName = `enter_biz_${biz.bizType}`;

        DB.Handle.query("UPDATE bizes SET x=?,y=?,z=? WHERE id=?", [pos.x, pos.y, pos.z, biz.sqlId]);
    };
    biz.isOwner = (player) => {
        return player.sqlId == biz.owner;
    };
    biz.getTax = () => {
        return parseInt(biz.price / 100) * mp.economy["biz_tax"].value;
    };
    biz.log = (playerId, text, price, products) => {
        DB.Handle.query("INSERT INTO logs_bizes (bizId,playerId,text,price,products) VALUES (?,?,?,?,?)",
            [biz.sqlId, playerId, text, price, products]);
    };

}

mp.createBizMarker = (data) => {
    var pos = new mp.Vector3(data["x"], data["y"], data["z"] - 1);
    pos.z += mp.economy["markers_deltaz"].value;
    var alpha = mp.economy["markers_alpha"].value;

    var marker = mp.markers.new(1, pos, mp.economy["markers_scale"].value, {
        color: [187, 255, 0, alpha],
        visible: false
    });

    var keys = ["sqlId", "name", "owner", "ownerName", "price", "products", "maxProducts", "productPrice", "balance", "bizType", "status", "staff"];
    keys.forEach((key) => {
        marker[key] = data[key];
    });
    marker.staff = JSON.parse(marker.staff);

    initBizUtils(marker);

    var blip = mp.blips.new(bizesInfo[data.bizType - 1].blip, pos, {
        color: 0,
        name: bizesInfo[data.bizType - 1].name,
        shortRange: 10,
        scale: 0.7
    });

    marker.blip = blip;

    //для стриминга домов для игроков, которые в радиусе
    var colshape = mp.colshapes.newCircle(pos["x"], pos["y"], mp.economy["markers_stream_dist"].value);
    colshape.marker = marker;
    marker.showColshape = colshape;

    //для отловки события входа в дом
    var colshape = mp.colshapes.newSphere(pos["x"], pos["y"], pos["z"], 2);
    colshape.biz = marker;
    marker.colshape = colshape;
    colshape.menuName = `enter_biz_${data.bizType}`;

    return marker;
}
