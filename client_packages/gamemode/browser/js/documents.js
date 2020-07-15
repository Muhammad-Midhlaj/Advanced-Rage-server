$(document).ready(function() {

    window.documentsAPI = {
        showPassport: (enable, data) => {
            data = JSON.parse(data);
            enable = JSON.parse(enable);

            initPassport(data);

            $(`#documents`).children("div").hide("fast");
            $(`#documents .blocks_father`).children("div").hide("fast");
            if (enable) {
                $(`#documents #passport`).show("fast");
                $(`#documents #passport_button`).show("fast");
                $(`#documents`).show("fast");
                promptAPI.showByName("documents_help");

                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                documentsAPI.hide();
            }

            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setDocumentsActive", enable);
        },
        showLicenses: (enable, data) => {
            data = JSON.parse(data);
            enable = JSON.parse(enable);

            initLicenses(data);

            $(`#documents`).children("div").hide("fast");
            $(`#documents .blocks_father`).children("div").hide("fast");
            if (enable) {
                $(`#documents #licenses`).show("fast");
                $(`#documents #licenses_button`).show("fast");
                $(`#documents`).show("fast");
                promptAPI.showByName("documents_help");

                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                documentsAPI.hide();
            }

            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setDocumentsActive", enable);
        },
        showWeapon: (enable, data) => {
            data = JSON.parse(data);
            enable = JSON.parse(enable);

            initWeapon(data);

            $(`#documents`).children("div").hide("fast");
            $(`#documents .blocks_father`).children("div").hide("fast");
            if (enable) {
                $(`#documents #weapon`).show("fast");
                $(`#documents #weapon_button`).show("fast");
                $(`#documents`).show("fast");
                promptAPI.showByName("documents_help");

                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                documentsAPI.hide();
            }

            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setDocumentsActive", enable);
        },
        showWork: (enable, data) => {
            data = JSON.parse(data);
            enable = JSON.parse(enable);

            initWork(data);

            $(`#documents`).children("div").hide("fast");
            $(`#documents .blocks_father`).children("div").hide("fast");
            if (enable) {
                $(`#documents #work`).show("fast");
                $(`#documents #work_button`).show("fast");
                $(`#documents`).show("fast");
                promptAPI.showByName("documents_help");

                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                documentsAPI.hide();
            }

            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setDocumentsActive", enable);
        },
        showAll: (enable, data) => {
            //debug(`documentsAPI.showAll: ${data}`);
            data = JSON.parse(data);
            enable = JSON.parse(enable);

            initPassport(data);
            initLicenses(data);
            initWeapon(data);
            initWork(data);

            $(`#documents .blocks_father`).children("div").show("fast");
            if (enable) {
                inventoryAPI.show(false);
                $(`#documents #passport`).show("fast");
                $(`#documents`).show("fast");
                promptAPI.showByName("documents_help");

                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                documentsAPI.hide();
            }

            setCursor(enable);
            mp.trigger('setBlockControl', enable);
            mp.trigger("setDocumentsActive", enable);
        },
        showArmy: (enable, data) => {
            // debug(`showArmy: ${data}`)
            data = JSON.parse(data);

            if (enable) {
                inventoryAPI.show(false);
                $(`#documentArmy .name`).text(data.Name);
                $(`#documentArmy .date`).text("-");
                $(`#documentArmy .rank`).text(data.Rank);
                $(`#documentArmy .id`).text(getPaddingNumber(data.ID.toString(), 5));
                $(`#documentArmy`).show("fast");

                promptAPI.showByName("documents_help");
                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                $(`#documentArmy`).hide("fast");
            }
        },
        showFib: (enable, data) => {
            // debug(`showFib: ${data}`)
            data = JSON.parse(data);

            if (enable) {
                inventoryAPI.show(false);
                $(`#fbiPassport .name`).text(data.Name);
                $(`#fbiPassport .id`).text(getPaddingNumber(data.ID.toString(), 5));
                $(`#fbiPassport`).show("fast");

                promptAPI.showByName("documents_help");
                $(document).unbind("keydown", documentsAPI.eHandler);
                $(document).keydown(documentsAPI.eHandler);
            } else {
                $(`#documentArmy`).hide("fast");
            }
        },
        hide: () => {
            $(`#documents`).hide("fast");
            setCursor(false);
            mp.trigger('setBlockControl', false);
            mp.trigger("setDocumentsActive", false);
            $(document).unbind("keydown", documentsAPI.eHandler);
            promptAPI.hide();
        },
        active: () => {
            return $("#documents").css("display") != "none";
        },
        eHandler: (e) => {
            if (e.keyCode == 69) { // E
                if (interactionMenuAPI.active()) return;
                documentsAPI.hide();
                $(`#documentArmy`).hide("fast");
                $(`#fbiPassport`).hide("fast");
                $(document).unbind("keydown", documentsAPI.eHandler);
            }
        }

    };

    function initWork(data) {
        var table = $(`#documents #work .table`);
        table.find("td").text("");

        for (var i = 0; i < data.work.length; i++) {
            var row = data.work[i];
            var tr = table.find("tr").eq(i + 1);
            tr.children("td").eq(0).text(convertMillsToDate(row.date * 1000));
            tr.children("td").eq(1).text(row.faction);
            tr.children("td").eq(2).text(row.rank);
            tr.children("td").eq(3).text(convertMillsToDate(row.rankDate * 1000));
        }
    }

    function initWeapon(data) {
        var levels = $(`#documents #weapon .level`);
        levels.find(".block_skill").removeClass("active");

        for (var i = 0; i < data.weapon.length; i++) {
            var weaponSkill = Math.clamp(parseInt(data.weapon[i] / 10), 0, 10);
            var blocks = levels.eq(i).children(".block_skill");
            for (var j = 0; j < weaponSkill; j++) blocks.eq(j).addClass("active");
        }
    }

    function initLicenses(data) {
        var lists = $(`#documents #licenses .list div`);
        lists.removeClass("active");
        data.licenses.forEach((licType) => {
            lists.eq(licType - 1).addClass("active")
        });
    }

    function initPassport(data) {
        var relationship = (data.sex == 1) ? `Married to ${data.relationshipName}` : `Married to ${data.relationshipName}`;
        if (!data.relationshipName) relationship = (data.sex == 1) ? `Not married` : `Single`;
        data.sex = (data.sex == 1) ? "Male" : "Female";
        var age = convertMinutesToLevelRest(data.minutes).level;
        data.houses = (data.houses.length == 0) ? "There is none" : `${data.houses}`;

        $(`#documents #passport .fName`).text(data.name.split(" ")[0]);
        $(`#documents #passport .sName`).text(data.name.split(" ")[1]);
        $(`#documents #passport .sex`).text(data.sex);
        $(`#documents #passport .age`).text(age);
        $(`#documents #passport .law`).text(data.law);
        $(`#documents #passport .relationship`).text(relationship);
        $(`#documents #passport .house`).text(data.houses);
        $(`#documents #passport .id`).text(getCorrectId(data.id));
    }

    function getCorrectId(id, length = 8) {
        id += "";
        var result = id;

        for (var i = 0; i < length - id.length; i++)
            result = "0" + result;

        return result;
    }

    function initSelectorButtons() {
        $('.passport_button').on('click', function() {
            $('#licenses').css({
                'display': 'none'
            });
            $('#weapon').css({
                'display': 'none'
            });
            $('#work').css({
                'display': 'none'
            });

            $('#passport').css({
                'display': 'block'
            });
        });

        $('.licenses_button').on('click', function() {
            $('#passport').css({
                'display': 'none'
            });
            $('#weapon').css({
                'display': 'none'
            });
            $('#work').css({
                'display': 'none'
            });

            $('#licenses').css({
                'display': 'block'
            });
        });

        $('.weapon_button').on('click', function() {
            $('#passport').css({
                'display': 'none'
            });
            $('#licenses').css({
                'display': 'none'
            });
            $('#work').css({
                'display': 'none'
            });

            $('#weapon').css({
                'display': 'block'
            });
        });

        $('.work_button').on('click', function() {
            $('#passport').css({
                'display': 'none'
            });
            $('#licenses').css({
                'display': 'none'
            });
            $('#weapon').css({
                'display': 'none'
            });

            $('#work').css({
                'display': 'block'
            });
        });

        $('#licenses_text').on("click", function() {
            if ($('#licenses_text').text().trim() === "Expand page...") {
                $(licenses).css({
                    'background-image': 'url(./img/licenses/bg2.png)',
                    'width': '640px;',
                    'height': '491px'
                });
                /* $(licenses).animate({
                    'width': "640px;",
                    'height': "491px"
                }, 500, function() {
                    // Animation complete.
                }); */
                $('#licenses_text').text('Turn the page...');
                $('.fishing').css({
                    'display': 'block'
                });
            } else {
                $(licenses).css({
                    'background-image': 'url(./img/licenses/bg.png)',
                    'width': '640px;',
                    'height': '340px'
                });
                /* $(licenses).animate({
                    'width': "640px;",
                    'height': "340px"
                }, 500, function() {
                    // Animation complete.
                }); */
                $('#licenses_text').text('Expand page...');
                $('.fishing').css({
                    'display': 'none'
                });
            }
        });
    }
    initSelectorButtons();
});
