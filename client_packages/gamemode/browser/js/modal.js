$(document).ready(() => {
    var modals = {
        "character_reg": {
            header: "New character",
            location: "center",
            noClose: true,
            content: `The last step remains to complete character creation..<br/>
                        Create a name in the format of "Name / Surname".<br/>


                        <br/><br />

                        <span>Enter your name:</span>
                        <input type="text" placeholder="Character name" class="characterName"/>
                        <br/><br/>
                        <center><button onclick="regCharacterHandler()">Create</button></center>`,
            on: () => {
                modals["character_reg"].off();
                $(".modal .characterName").on("keydown", (e) => {
                    if (e.keyCode == 13) regCharacterHandler();
                });
            },
            off: () => {
                $(".modal .characterName").off("keydown");
            },
        },
        "closed_mode": {
            header: "Closed access",
            location: "center",
            content: `Above the server are those. work.<br/>
                        Discord information: <span style='color: #0bf'>discord.gg/khpRnAZ.</span><br/>


                        <br/><br />

                        <span>Enter password:</span>
                        <input type="text" placeholder="PIN" class="pin"/>
                        <br/><br/>
                        <center><button onclick="closedModeHandler()">Enter</button></center>`,
            on: () => {
                modals["closed_mode"].off();
                $(".modal .pin").on("keydown", (e) => {
                    if (e.keyCode == 13) closedModeHandler();
                });
            },
            off: () => {
                $(".modal .pin").off("keydown");
            }
        },
        "biz_balance_add": {
            header: "Cash replenishment",
            location: "center",
            content: `Staff salaries paid from the cashier.<br/>


                        <br/><br />

                        <span>Enter amount:</span>
                        <input type="text" placeholder="Amount" class="sum"/>
                        <br/><br/>
                        <center><button>Top up</button></center>`,
            on: () => {
                modals["biz_balance_add"].off();
                setOnlyInt(".modal .sum");
                var handler = () => {
                    var sum = parseInt($(".modal .sum").val().trim());
                    if (isNaN(sum) || sum <= 0) return lightTextFieldError(".modal .sum", `Invalid amount!`);
                    if (!isFlood()) {
                        mp.eventCallRemote("biz.balance.add", sum);
                        modalAPI.hide();
                    }
                };
                $(".modal .sum").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .sum");
                $(".modal .sum").off("keydown");
                $(".modal button").off("click");
            },
        },
        "biz_balance_take": {
            header: "Withdrawal from the cash register",
            location: "center",
            content: `Staff salaries paid from the cashier.<br/>


                        <br/><br />

                        <span>Enter amount:</span>
                        <input type="text" placeholder="Amount" class="sum"/>
                        <br/><br/>
                        <center><button>Take off</button></center>`,
            on: () => {
                modals["biz_balance_take"].off();
                setOnlyInt(".modal .sum");
                var handler = () => {
                    var sum = parseInt($(".modal .sum").val().trim());
                    if (isNaN(sum) || sum <= 0) return lightTextFieldError(".modal .sum", `Invalid amount!`);
                    if (!isFlood()) {
                        mp.eventCallRemote("biz.balance.take", sum);
                        modalAPI.hide();
                    }
                };
                $(".modal .sum").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .sum");
                $(".modal .sum").off("keydown");
                $(".modal button").off("click");
            },
        },
        "biz_products_buy": {
            header: "Purchase of goods",
            location: "center",
            content: `You are going to order a product for business.<br/>
                        You have in stock: <span class="yellow money">0$</span><br/>
                        Price for 1 unit.: <span class="yellow productPrice">0$</span><br/>
                        Total: <span class="yellow sum">0$</span><br/>
                        Storage: <span class="yellow store">0/0 units.</span>


                        <br/><br />

                        <span>Enter quantity to purchase:</span>
                        <input type="text" placeholder="Product" class="products"/>
                        <br/><br/>
                        <center><button>Purchase</button></center>`,
            on: (values) => {
                modals["biz_products_buy"].off();
                setOnlyInt(".modal .products");

                var money = parseInt(clientStorage.money);
                var bizProductPrice = parseInt(values.productPrice);
                var bizProducts = parseInt(values.products);
                var bizMaxProducts = parseInt(values.maxProducts);

                $(".modal .money").text(`${money}$`);
                $(".modal .productPrice").text(`${bizProductPrice}$`);
                $(".modal .store").text(`${bizProducts} of ${bizMaxProducts} .`);

                var handler = () => {
                    var products = parseInt($(".modal .products").val().trim());
                    var sum = parseInt($(".modal .sum").text());


                    if (isNaN(products) || products <= 0) return lightTextFieldError(".modal .products", `Invalid item!`);

                    if (bizProducts + products > bizMaxProducts)
                        return lightTextFieldError(".modal .products", `Storage cannot hold more${bizMaxProducts} !`);
                    if (money < sum) return lightTextFieldError(".modal .products", `You do not have enough money!`);
                    if (!isFlood()) {
                        mp.eventCallRemote("biz.products.buy", products);
                        modalAPI.hide();
                    }
                };
                $(".modal .products").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                    else {
                        setTimeout(() => {
                            var products = parseInt($(".modal .products").val().trim()) || 0;

                            $(".modal .sum").text(`${products * bizProductPrice}$`);;
                        }, 50);
                    }
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .products");
                $(".modal .products").off("keydown");
                $(".modal button").off("click");
            },

        },
        "biz_products_sell": {
            header: "Product Magazine",
            location: "center",
            content: `You are going to write off the goods from the warehouse.<br/>
                        You have in stock: <span class="yellow money">0$</span><br/>
                        Price for 1 unit.: <span class="yellow productPrice">0$</span>
                        <span class="red productPriceSell">- 0%</span><br/>
                        Total: <span class="yellow sum">0$</span><br/>
                        Storage: <span class="yellow store">0/0 units.</span>


                        <br/><br />

                        <span>Enter the amount to write off:</span>
                        <input type="text" placeholder="Product" class="products"/>
                        <br/><br/>
                        <center><button>Write off</button></center>`,
            on: (values) => {
                modals["biz_products_sell"].off();
                setOnlyInt(".modal .products");

                var money = parseInt(clientStorage.money);
                var bizProductPriceSell = parseFloat(values.productPriceSell).toFixed(2);
                var bizProductPrice = parseInt(values.productPrice);
                var bizProducts = parseInt(values.products);
                var bizMaxProducts = parseInt(values.maxProducts);

                $(".modal .money").text(`${money}$`);
                $(".modal .productPrice").text(`${bizProductPrice}$`);
                $(".modal .productPriceSell").text(`- ${parseInt(100 - bizProductPriceSell * 100)}%`);
                $(".modal .store").text(`${bizProducts} of ${bizMaxProducts} .`);

                var handler = () => {
                    var products = parseInt($(".modal .products").val().trim());
                    var sum = parseInt($(".modal .sum").text());


                    if (isNaN(products) || products <= 0) return lightTextFieldError(".modal .products", `Invalid item!`);

                    if (products > bizProducts)
                        return lightTextFieldError(".modal .products", `Storage contains ${bizProducts} units!`);
                    if (!isFlood()) {
                        mp.eventCallRemote("biz.products.sell", products);
                        modalAPI.hide();
                    }
                };
                $(".modal .products").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                    else {
                        setTimeout(() => {
                            var products = parseInt($(".modal .products").val().trim()) || 0;
                            var sum = parseInt(products * bizProductPrice * bizProductPriceSell);

                            $(".modal .sum").text(`${sum}$`);;
                        }, 50);
                    }
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .products");
                $(".modal .products").off("keydown");
                $(".modal button").off("click");
            },

        },
        "biz_products_price": {
            header: "Product price",
            location: "center",
            content: `You are going to change the price of the goods.<br/>
                        Price for 1 unit.: <span class="yellow productPrice">0$</span>

                        <br/><br />

                        <span>Enter the price:</span>
                        <input type="text" placeholder="Price" class="newProductPrice"/>
                        <br/><br/>
                        <center><button>Change</button></center>`,
            on: (values) => {
                modals["biz_products_price"].off();
                setOnlyInt(".modal .newProductPrice");

                var bizProductPrice = parseInt(values.productPrice);

                $(".modal .productPrice").text(`${bizProductPrice}$`);

                var handler = () => {
                    var productPrice = parseInt($(".modal .newProductPrice").val().trim());

                    if (isNaN(productPrice) || productPrice <= 0) return lightTextFieldError(".modal .newProductPrice", `Incorrect value!`);

                    if (!isFlood()) {
                        mp.eventCallRemote("biz.products.price", productPrice);
                        modalAPI.hide();
                    }
                };
                $(".modal .newProductPrice").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .newProductPrice");
                $(".modal .newProductPrice").off("keydown");
                $(".modal button").off("click");
            },

        },
        "biz_sell_to_player": {
            header: "Selling bussiness",
            location: "center",
            content: `You are going Sell the business to another citizen..<br/>
                        Type: <span class="yellow type">-</span><br/>
                        Cashbox: <span class="yellow balance">0$</span><br/>
                        Staff: <span class="yellow staff">0 .</span><br/>
                        Storage: <span class="yellow store">0 of 0 .</span>

                        <br/><br />

                        <span>Enter your name покупателя:</span>
                        <input type="text" placeholder="Name Surname" class="buyerName"/>

                        <span>Enter amount:</span>
                        <input type="text" placeholder="Price" class="price"/>
                        <br/><br/>
                        <center><button>Sell</button></center>`,
            on: (values) => {
                modals["biz_sell_to_player"].off();
                setOnlyInt(".modal .price");

                $(".modal .type").text(`${values.type}`);
                $(".modal .balance").text(`${values.balance}$`);
                $(".modal .staff").text(`${values.staff} .`);
                $(".modal .store").text(`${values.products} of ${values.maxProducts} units.`);

                var handler = () => {
                    var price = parseInt($(".modal .price").val().trim());
                    if (isNaN(price) || price <= 0) return lightTextFieldError(".modal .price", `Invalid price!`);

                    var buyerName = $(".modal .buyerName").val().trim();
                    var reg = /^([A-Z][a-z]{1,19}) ([A-Z][a-z]{1,19})$/;
                    if (!reg.test(buyerName)) return lightTextFieldError(".modal .buyerName", "Name is incorrect!");

                    if (!isFlood()) {
                        mp.eventCallRemote("biz.sell", [buyerName, price]);
                    }
                };
                $(".modal .price").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .price");
                $(".modal .price").off("keydown");
                $(".modal button").off("click");
            }
        },
        "biz_sell_to_gov": {
            header: "Selling bussiness",
            location: "center",
            content: `You are going Sell the bussiness to state.<br/>
                        Type: <span class="yellow type">-</span><br/>
                        Cashbox: <span class="yellow balance">0$</span><br/>
                        Staff: <span class="yellow staff">0 .</span><br/>
                        Storage: <span class="yellow store">0 of 0 .</span><br/>

                        <br/>
                        Price: <span class="yellow price">0$</span>
                        <span class="red ratio">- 0%</span>
                        <br/>

                        <center><button>Sell</button></center>`,
            on: (values) => {
                modals["biz_sell_to_gov"].off();

                $(".modal .type").text(`${values.type}`);
                $(".modal .balance").text(`${values.balance}$`);
                $(".modal .staff").text(`${values.staff} .`);
                $(".modal .store").text(`${values.products} of ${values.maxProducts} units.`);
                $(".modal .price").text(`${values.price}$`);
                $(".modal .ratio").text(`- ${parseInt(100 - values.ratio * 100)}%`);

                var handler = () => {
                    if (!isFlood()) {
                        mp.eventCallRemote("biz.sellToGov");
                        modalAPI.hide();
                    }
                };
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
            }
        },
        "biz_buy": {
            header: "Buying business",
            location: "center",
            content: `You are going to Buy business.<br/>
                        Type: <span class="yellow type">-</span><br/>
                        Staff: <span class="yellow staff">0 .</span><br/>
                        Storage: <span class="yellow store">0 of 0 .</span><br/>

                        <br/>
                        Price: <span class="yellow price">0$</span>
                        <br/>

                        <center><button>Buy</button></center>`,
            on: (values) => {
                modals["biz_buy"].off();

                $(".modal .type").text(`${values.type}`);
                $(".modal .staff").text(`${values.staff} .`);
                $(".modal .store").text(`${values.products} of ${values.maxProducts} .`);
                $(".modal .price").text(`${values.price}$`);

                var handler = () => {
                    if (!isFlood()) {
                        mp.eventCallRemote("biz.buy");
                        modalAPI.hide();
                    }
                };
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
            }
        },
        "give_wanted": {
            header: "Wanted",
            location: "center",
            content: `Issue of search to the infringer.<br/>

                        Criminal: <span class="yellow playerName">UNTAMED Hero</span><br/>
                        Wanted: <span class="yellow wantedVal">5 .</span><br/>
                        <br/><br />

                        <span>Enter wanted level:</span>
                        <input type="text" placeholder="Wanted" class="wanted"/>
                        <span>Enter reason:</span>
                        <input type="text" placeholder="Reason" class="reason"/>
                        <br/><br/>
                        <center><button>Issue</button></center>`,
            on: (values) => {
                modals["give_wanted"].off();
                setOnlyInt(".modal .wanted");

                var playerId = parseInt(values.playerId);
                var playerName = values.playerName;
                var wantedVal = parseInt(values.wanted);

                $(".modal .playerName").text(`${playerName}`);
                $(".modal .wantedVal").text(`${wantedVal} зв.`);

                var handler = () => {
                    var wanted = parseInt($(".modal .wanted").val().trim());
                    var reason = $(".modal .reason").val().trim();
                    if (isNaN(wanted) || wanted <= 0) return lightTextFieldError(".modal .wanted", `Invalid wanted level!`);
                    if (!reason || reason.length == 0) return lightTextFieldError(".modal .reason", `Indicate the reason!`);
                    if (reason.length > 30) reason = reason.substr(0, 30) + "...";
                    if (!isFlood()) {
                        mp.eventCallRemote("giveWanted", [playerId, wanted, reason]);
                        modalAPI.hide();
                    }
                };
                $(".modal .wanted").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal .reason").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .wanted");
                $(".modal .wanted").off("keydown");
                $(".modal .reason").off("keydown");
                $(".modal button").off("click");
            },
        },
        "give_fine": {
            header: "Fine",
            location: "center",
            content: `Extract the fine to the offender.<br/>

                        Criminal: <span class="yellow playerName">Carter Slade</span><br/>
                        Wanted: <span class="yellow wantedVal">5 .</span><br/>
                        <br/><br />

                        <span>Enter amount fine:</span>
                        <input type="text" placeholder="Amount" class="sum"/>
                        <span>Enter reason:</span>
                        <input type="text" placeholder="Reason" class="reason"/>
                        <br/><br/>
                        <center><button>Write</button></center>`,
            on: (values) => {
                modals["give_fine"].off();
                setOnlyInt(".modal .sum");

                var playerId = parseInt(values.playerId);
                var playerName = values.playerName;
                var wantedVal = parseInt(values.wanted);

                $(".modal .playerName").text(`${playerName}`);
                $(".modal .wantedVal").text(`${wantedVal} зв.`);

                var handler = () => {
                    var sum = parseInt($(".modal .sum").val().trim());
                    var reason = $(".modal .reason").val().trim();
                    if (isNaN(sum) || sum <= 0 || sum > 5000) return lightTextFieldError(".modal .sum", `Invalid amount!`);
                    if (!reason || reason.length == 0) return lightTextFieldError(".modal .reason", `Indicate the reason!`);
                    if (reason.length > 30) reason = reason.substr(0, 30) + "...";
                    if (!isFlood()) {
                        mp.eventCallRemote("giveFine", [playerId, sum, reason]);
                        modalAPI.hide();
                    }
                };
                $(".modal .sum").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal .reason").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .sum");
                $(".modal .sum").off("keydown");
                $(".modal .reason").off("keydown");
                $(".modal button").off("click");
            },
        },
        "clear_fine": {
            header: "Clear fine",
            location: "center",
            content: `
                        Home fine: <span class="yellow id">No.1</span><br/>
                        Inspector: <span class="yellow cop">Token 00002</span><br/>
                        Reason: <span class="yellow reason">Prevents neighbors from sleeping.</span><br/>
                        Amount: <span class="red price">$10000.</span><br/>
                        Date: <span class="yellow date">21:17 06.03.2019</span><br/>
                        <br/><br />

                        <center><button>To pay</button></center>`,
            on: (values) => {
                modals["clear_fine"].off();

                var playerId = parseInt(values.playerId);
                var playerName = values.playerName;
                var wantedVal = parseInt(values.wanted);


                $(".modal .id").text(`No.${values.id}`);
                $(".modal .cop").text(`Token ${getPaddingNumber(values.cop)}`);
                $(".modal .reason").text(values.reason);
                $(".modal .price").text(`$${values.price}`);
                $(".modal .date").text(convertMillsToDate(values.date * 1000));

                var handler = () => {
                    var money = clientStorage.money;
                    if (money < values.price) return nError(`Required: $${values.price}`);
                    if (!isFlood()) {
                        mp.eventCallRemote("policeService.clearFine");
                        modalAPI.hide();
                    }
                };
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
            },
        },
        "invite_player_inhouse": {
            header: "Invitation",
            location: "center",
            content: `Invite a player to the house<br/><br />
                        <span>Enter the ID / Player Name:</span>
                        <input type="text" placeholder="ID / Name" class="player"/>
                        <br/><br/>
                        <center><button>Invite</button></center>`,
            on: (values) => {
                modals["invite_player_inhouse"].off();
                houseMenu.__vue__.exitMenu();

                var handler = () => {
                    var player = $(".modal .player").val().trim();
                    if (!player || !player.length) return lightTextFieldError(".modal .player", `There is no such player!`);
                    if (!isFlood()) {
                        mp.eventCallRemote("invitePlayerInHouse", [player]);
                        modalAPI.hide();
                    }
                };
                $(".modal .player").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {

                mp.eventCallRemote("houseMenuHandler");
                clearOnlyInt(".modal .wanted");
                $(".modal .player").off("keydown");
                $(".modal button").off("click");
            },
        },
        "sell_player_house": {
            header: "Selling a house",
            location: "center",
            content: `Who wants Sell the house?<br/><br />
                        <span>Enter the ID / Player Name:</span>
                        <input type="text" placeholder="ID / Name" class="player"/>
                        <br/>
                        <span>Enter the price for which you want Sell:</span>
                        <input type="text" placeholder="Price" class="price"/>
                        <br/><br/>
                        <center><button>Sell</button></center>`,
            on: (values) => {
                modals["sell_player_house"].off();
                setOnlyInt(".modal .price");
                houseMenu.__vue__.exitMenu();

                var handler = () => {
                    var player = $(".modal .player").val().trim();
                    if (!player.length) return lightTextFieldError(".modal .player", `Player not found!`);

                    var price = $(".modal .price").val().trim();
                    if (!price) return lightTextFieldError(".modal .price", `Set the correct price!`);

                    if (!isFlood()) {
                        mp.eventCallRemote("sellHousePlayer", [player, price]);
                        modalAPI.hide();
                    }
                };
                $(".modal .player").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal .price").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .price");
                $(".modal .player").off("keydown");
                $(".modal .price").off("keydown");
                $(".modal button").off("click");
            },
        },
        "sell_player_car": {
            header: "Sell Car",
            location: "center",
            content: `Who wants Sell a car?<br/><br />
                        <span>Enter the player ID / Name:</span>
                        <input type="text" placeholder="ID / Name" class="player"/>
                        <br/>
                        <span>Enter the price for which you want Sell:</span>
                        <input type="text" placeholder="Price" class="price"/>
                        <br/><br/>
                        <center><button>Sell</button></center>`,
            on: (values) => {
                modals["sell_player_car"].off();
                setOnlyInt(".modal .price");

                var handler = () => {
                    var player = $(".modal .player").val().trim();
                    if (!player.length) return lightTextFieldError(".modal .player", `Player not found!`);

                    var price = $(".modal .price").val().trim();
                    if (!price) return lightTextFieldError(".modal .price", `Set the correct price!`);

                    if (!isFlood()) {
                        mp.eventCallRemote("sellCarPlayer", [player, price, values.sqlId]);
                        modalAPI.hide();
                    }
                };
                $(".modal .player").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal .price").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .price");
                $(".modal .player").off("keydown");
                $(".modal .price").off("keydown");
                $(".modal button").off("click");
            },
        },
        "help_menu": {
            header: "Help",
            location: "right-middle",
            content: `<span class="omega text"></span>`,
            on: (values) => {
                $(".modal .header").text(`${values.head}`);
                $(".modal .text").text(`${values.text}`);
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.help.main.open', false);
            }
        },
        "bank_money_put": {
            header: "Balance recharge", // Вывод срunitsств
            location: "center",
            content: `Balance <a style="color: green;" class="balance_bank"></a><br/><br/>
                        <span>Enter amount:</span>
                        <input type="text" class="mbank_put"/>
                        <br/><br/>
                        <center><button>Top up</button></center>`,
            on: (values) => {
                setOnlyInt(".modal .mbank_put");
                var handler = () => {
                    var money = $(".modal .mbank_put").val().trim();
                    mp.trigger("put.bank.money", money);
                };
                $(".modal .balance_bank").text(`$${values.money}`);
                $(".modal .mbank_put").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
        "item_split": {
            header: "Split",
            location: "center",
            content: `You are going to divide item.<br/>
                        Item: <span class="yellow name">Cash</span><br/>
                        Amount: <span class="yellow count">1000$</span>
                        <span class="red newCount">- 100$</span><br/>
                        Residual: <span class="yellow diff">900$</span><br/>


                        <br/><br />

                        <span>Enter quantity to divide:</span>
                        <input type="text" placeholder="Amount" class="countVal"/>
                        <br/><br/>
                        <center><button>Split</button></center>`,
            on: (values) => {
                modals["item_split"].off();
                setOnlyInt(".modal .countVal");

                var item = inventoryAPI.getItem(values.itemSqlId);
                if (!item) {
                    modalAPI.hide();
                    return nError(`Item for separation not found!`);
                }
                $(`.modal .name`).text(clientStorage.inventoryItems[item.itemId - 1].name);
                var itemIds = [4, 37, 38, 39, 40, 55, 56, 57, 58];
                var index = itemIds.indexOf(item.itemId);
                if (index == -1) {
                    modalAPI.hide();
                    return nError(`Wrong type of item to separate!`);
                }
                var units = ["$", "units.", "units.", "pcs.", "pcs.", "pcs.", "pcs.", "p.", "p.", "p.", "p."];
                var u = units[index];

                if (item.params.ammo) {
                    var count = item.params.ammo;
                    var newCount = parseInt(item.params.ammo / 2);
                } else {
                    var count = item.params.count;
                    var newCount = parseInt(item.params.count / 2);
                }

                $(".modal .count").text(`${count} ${u}`);
                $(".modal .newCount").text(`- ${newCount} ${u}`);
                $(".modal .countVal").val(newCount);
                $(".modal .diff").text(count - newCount + ` ${u}`);

                var handler = () => {
                    var countVal = parseInt($(".modal .countVal").val().trim());

                    if (isNaN(countVal) || countVal <= 0) return lightTextFieldError(".modal .countVal", `Wrong number!`);

                    if (countVal >= count)
                        return lightTextFieldError(".modal .countVal", `No more ${count} !`);
                    if (!isFlood()) {
                        mp.eventCallRemote("item.split", [values.itemSqlId, countVal]);
                        modalAPI.hide();
                    }
                };
                $(".modal .countVal").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                    else {
                        setTimeout(() => {
                            var countVal = Math.clamp(parseInt($(".modal .countVal").val().trim()), 1, count - 1) || 1;
                            $(".modal .countVal").val(countVal);

                            $(".modal .newCount").text(`- ${countVal} ${u}`);
                            $(".modal .diff").text(`${count - countVal} ${u}`);
                        }, 50);
                    }
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                clearOnlyInt(".modal .countVal");
                $(".modal .countVal").off("keydown");
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
        "bank_money_take": {
            header: "Conclusion of Balance", // Вывод срunitsств
            location: "center",
            content: `Balance <a style="color: green;" class="balance_bank"></a><br/><br/>
                        <span>Enter amount:</span>
                        <input type="text" class="mbank_take"/>
                        <br/><br/>
                        <center><button>Withdraw</button></center>`,
            on: (values) => {
                setOnlyInt(".modal .mbank_take");
                var handler = () => {
                    var money = $(".modal .mbank_take").val().trim();
                    mp.trigger("take.bank.money", money);
                };
                $(".modal .balance_bank").text(`$${values.money}`);
                $(".modal .mbank_take").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
        "bank_money_transfer": {
            header: "Money Transfer", // Вывод срunitsств
            location: "center",
            content: `Balance <a style="color: green;" class="balance_bank"></a><br/><br/>
                      <span>Enter player's name:</span>
                      <input type="text" placeholder="Name Surname" class="mbank_transfer_name"/>
                      <br/>
                      <span>Enter amount to transfer:</span>
                      <input type="text" placeholder="Amount" class="mbank_transfer"/>
                      <br/><br/>
                      <center><button>Transfer</button></center>`,
            on: (values) => {
                setOnlyInt(".modal .mbank_transfer");
                var handler = () => {
                    var money = $(".modal .mbank_transfer").val().trim();
                    var name = $(".modal .mbank_transfer_name").val().trim();
                    mp.trigger("transfer.bank.money", name, money);
                };
                $(".modal .balance_bank").text(`$${values.money}`);
                $(".modal .mbank_transfer").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal .mbank_transfer_name").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
        "bank_money_house_give": {
            header: "Top up at home", // Пополнение срunitsств
            location: "center",
            content: `House <a class="number_bhouse"></a><br/>
                      Account balance: <a style="color: green;" class="balance_bank"></a><br/>
                      Account balance at home: <a style="color: green;" class="balance_bank_house"></a><br/><br/>
                      <span>Enter amount to top up:</span>
                      <input type="text" placeholder="Amount" class="mbank_hbank_add"/>
                      <br/><br/>
                      <center><button>Top up</button></center>`,
            on: (values) => {
              setOnlyInt(".modal .mbank_hbank_add");
              var handler = () => {
                  var money = $(".modal .mbank_hbank_add").val().trim();
                  mp.trigger("give.bank.money.house", money, values.house);
              };
              $(".modal .balance_bank").text(`$${values.money}`);
              $(".modal .number_bhouse").text(`${values.house}`);
              $(".modal .balance_bank_house").text(`${values.bhouse}`);
              // Оплата за час:<a style="color: green;" class="price_hour"> $40, $50, $60</a><br/><br/>
              // $(".modal .price_hour").text(`${values.hour}`);
              $(".modal .mbank_hbank_add").on("keydown", (e) => {
                  if (e.keyCode == 13) handler();
              });
              $(".modal button").on("click", () => {
                  handler();
              });
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
        "throw_from_vehicle": {
            header: "Throw out of transport",
            location: "center",
            content: `Passengers: <a style="color: yellow;" class="people_count"></a><br/><br/>
                        <span>Enter the player's ID:</span>
                        <input type="text" class="idthrow_input"/>
                        <br/><br/>
                        <center><button>Throw</button></center>`,
            on: (values) => {
                setOnlyInt(".modal .idthrow_input");
                var handler = () => {
                    var id = $(".modal .idthrow_input").val().trim();
                    mp.trigger("throw.fromvehicle.withkey", id);
                };
                $(".modal .people_count").text(`${values.count}`);
                $(".modal .idthrow_input").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
        "bank_money_house_take": {
            header: "Conclusion of the account of the house", // Вывод срunitsств
            location: "center",
            content: `House <a class="number_bhouse"></a><br/>
                      Account balance: <a style="color: green;" class="balance_bank"></a><br/>
                      Account balance дома: <a style="color: green;" class="balance_bank_house"></a><br/><br/>
                      <span>Enter amount:</span>
                      <input type="text" class="mbank_take_house"/>
                      <br/><br/>
                      <center><button>Withdraw</button></center>`,
            on: (values) => {
                setOnlyInt(".modal .mbank_take_house");
                var handler = () => {
                    var money = $(".modal .mbank_take_house").val().trim();
                    mp.trigger("take.bank.money.house", money, values.house);
                };
                $(".modal .balance_bank").text(`$${values.money}`);
                $(".modal .number_bhouse").text(`${values.house}`);
                $(".modal .balance_bank_house").text(`${values.bhouse}`);
                $(".modal .mbank_take_house").on("keydown", (e) => {
                    if (e.keyCode == 13) handler();
                });
                $(".modal button").on("click", () => {
                    handler();
                });
            },
            off: () => {
                $(".modal button").off("click");
                mp.trigger('update.bank.main.open', false);
            },
        },
    };
    window.modalAPI = {
        show: (name, values = null) => {
            var modal = modals[name];
            if (!modal) return;

            modal.name = name;
            window.currentModal = modal;
            $(".modal .header").text(modal.header);
            $(".modal .text").html(modal.content);
            modal.on(JSON.parse(values));

            switch (modal.location) {
                case 'left-top':
                    $('.modal').css('left', '1vh');
                    $('.modal').css('top', '1vh');
                    $('.modal').css('right', '');
                    $('.modal').css('bottom', '');
                    break;
                case 'left-middle':
                    $('.modal').css('left', '10vh');
                    $('.modal').css('top', '25vh');
                    $('.modal').css('right', '');
                    $('.modal').css('bottom', '');
                    break;
                case 'right-middle':
                    $('.modal').css('left', '');
                    $('.modal').css('top', '25vh');
                    $('.modal').css('right', '10vh');
                    $('.modal').css('bottom', '');
                    break;
                case 'top':
                    $('.modal').css('left', Math.max(0, (($(window).width() - $('.modal').outerWidth()) / 2) + $(window).scrollTop()) + 'px');
                    $('.modal').css('top', '10vh');
                    $('.modal').css('right', '');
                    $('.modal').css('bottom', '');
                    break;
                case 'center':
                    $('.modal').css('left', Math.max(0, (($(window).width() - $('.modal').outerWidth()) / 2) + $(window).scrollTop()) + 'px');
                    $('.modal').css('top', ($(window).height() / 2 - $(".modal").height() / 2) + "px");
                    $('.modal').css('right', '');
                    $('.modal').css('bottom', '');
                    break;
            }
            if (modal.noClose) $(".modal .close").hide();
            else $(".modal .close").show();

            $(".modal").slideDown("fast");

            var height = Math.abs(parseFloat($(".modal .header").height()) + parseFloat($(".modal .text").height()));
            var marginHeader = parseFloat($(".modal .header").css("margin-top")) * 2.5;
            $(".modal .body").height(height + marginHeader);

            $(".modal input[type='text']").eq(0).focus();
            setCursor(true);
            mp.trigger('setBlockControl', true);
        },
        hide: () => {
            setCursor(false);
            mp.trigger('setBlockControl', false);
            window.currentModal.off();
            window.currentModal = null;
            $(".modal").slideUp("fast");
        },
        active: () => {
            return $(".modal").css("display") != "none";
        },
    };
    // window.modalAPI.show("help_menu", '{ "head": "Работы", "text": "Тут много информации, лучше беги, а то оно тебя сожрет. C. Есенин"}');
});
