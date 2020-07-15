const app = new Vue({
    el: '#app',
    data: {
        // new
        taxi: [],	
        taxiPrincipalPage: 'A',
        taxiSecondPage: 'A',
        taxiSubSecondPage: true, // Для просмотра информации заказов.f
        taxiPage: true, // true - Большая панель | false - маленькая
        taxiMenuPage: {
            Menu1: true,
            Menu2: false,
            Menu3: false,
            Menu4: false,
        },
        taxiCSSstyle: {
            isActive: false,
            payFontStyle: 3,
        },
        taxiLogIn: {
            NameString: '',
            PasswordString: '',

            NameStringFinal: 'uHRP Project',
            PasswordStringFinal: 'something',
        },
        taxiStats: {
            Routes: 0,
            MoneyInt: 0,
            MoneyString: '0$',
            Rating: 0,
            Count: 0,
            Save1: 0,
            Save2: 0,
            Save3: 0,

            EndJob: false,
        },
        taxiOrder: {
            true: false, // false - заказов нет, true - выполняется заказ, 'ended' заказ идёт на завершение.
            Name: '',
            District: 'Unknown',
            Order: 0,
            Distance: 0,
            Price: 0,
            TimeOfRouteInt: 0,
            TimeOfRouteString: '00:00',

            Interval: undefined,
        },
    },
    methods: {
        greet() {
            app.taxiPrincipalPage = 'B';
            setTimeout(() => {
                const name = app.taxiLogIn.NameStringFinal;
                const login = app.taxiLogIn.NameString;
                let i = 0;
                const inter = setInterval(() => {
                    if (app.taxiLogIn.NameString.length === name.length) {
                        clearInterval(inter);
                        this.passwords();
                        return;
                    }
                    app.taxiLogIn.NameString += name.substr(i, login.length + 1);
                    i += 1;
                }, 150);
            }, 1000);
        },
        passwords() {
            const name = app.taxiLogIn.PasswordStringFinal;
            const login = app.taxiLogIn.PasswordString;
            let i = 0;
            const inter = setInterval(() => {
                if (app.taxiLogIn.PasswordString.length === name.length) {
                    clearInterval(inter);
                    this.clickButton();
                    return;
                }
                app.taxiLogIn.PasswordString += name.substr(i, login.length + 1);
                i += 1;
            }, 150);
        },
        clickButton() {
            app.taxiCSSstyle.isActive = true;
            setTimeout(() => {
                app.taxiCSSstyle.isActive = false;
            }, 350);
            setTimeout(() => {
                app.taxiPrincipalPage = 'C';
                this.stage3();
            }, 550);
        },
        stage3() {
            setTimeout(() => {
                app.taxiPrincipalPage = 'D';
                mp.trigger('events.callRemote', 'accept.taxi.day');
            }, 1500);
        },
        addData(name, password) {
            app.taxiLogIn.NameStringFinal = name;
            app.taxiLogIn.PasswordStringFinal = password;
        },
        setNameForPassword(name) {
          app.taxiLogIn.NameStringFinal = name;
        },
        addToTaxi(name, distance) {
            if (app.taxiStats.EndJob === true) return;
            const obj = app.taxi.find(o => o.Name === name);
            if (obj === undefined) {
                app.taxi.push({ Name: name, Distance: distance });
                app.taxiStats.Count = app.taxi.length;
            } else {
                const objIndex = app.taxi.findIndex((objs => objs.Name === name));
                app.taxi[objIndex].Distance = distance;
            }
        },
        removeFromTaxi(name, item, index) {
            app.taxi.splice(app.taxi.findIndex(item => item.Name === name), 1);
            app.taxiStats.Count = app.taxi.length;
        },
        select(user, item, index) {
            app.taxiStats.Save1 = user;
            app.taxiStats.Save2 = item;
            app.taxiStats.Save3 = index;
            mp.trigger('take.taxi.order', user);
        },
        setselect() {
            app.taxiOrder.true = true;
            app.taxiOrder.Name = app.taxiStats.Save1;
        },
        deleteselect() {
          app.taxiSecondPage = 'A';
          app.taxiMenuPage.Menu2 = false;
          app.taxiMenuPage.Menu1 = true;
          app.taxiPage = true;
          app.taxiOrder.true = false;

          app.taxiOrder.Name = '';
          app.taxiOrder.Distance = 0;
          app.taxiOrder.Price = 0;
          app.taxiOrder.TimeOfRouteInt = 0;
          app.taxiOrder.TimeOfRouteString = '';

          if (app.taxiOrder.Interval !== undefined) clearInterval(app.taxiOrder.Interval);
          delete app.taxiOrder.Interval;
        },
        setInfo(name, price, district) {
            app.taxiSecondPage = 'B';
            app.taxiMenuPage.Menu2 = true;
            app.taxiMenuPage.Menu1 = false;
            app.taxiMenuPage.Menu3 = false;
            app.taxiOrder.true = true; // if (app.taxiOrder.true !== true)
            app.taxiOrder.Name = name;
            app.taxiOrder.Price = price;
            app.taxiOrder.District = district;
            if (app.taxiOrder.Interval === undefined) {
              app.taxiOrder.Interval = setInterval(() => {
                  app.taxiOrder.TimeOfRouteInt += 1000;
                  app.taxiOrder.TimeOfRouteString = this.millisToMinutesAndSeconds(app.taxiOrder.TimeOfRouteInt);
              }, 1000);
            }
        },
        updateList() {
            mp.trigger('events.callRemote', 'update.taxi.orders');
        },
        startTime(price, districts) {
            app.taxiOrder.Interval = setInterval(() => {
                app.taxiOrder.TimeOfRouteInt += 1000;
                app.taxiOrder.TimeOfRouteString = this.millisToMinutesAndSeconds(app.taxiOrder.TimeOfRouteInt);
            }, 1000);
            app.taxiOrder.Price = price;
            app.taxiOrder.District = districts;
        },
        millisToMinutesAndSeconds(millis) {
            const minutes = Math.floor(millis / 60000);
            const seconds = ((millis % 60000) / 1000).toFixed(0);
            return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
        setDistance(distance) {
            app.taxiOrder.Distance = distance;
        },
        updateTaxiStats(order, money) {
            app.taxiStats.Routes = order;
            app.taxiStats.MoneyInt = money;
            app.taxiStats.MoneyString = `${app.taxiStats.MoneyInt}$`;
        },
        stop(cash) {
            clearInterval(app.taxiOrder.Interval);

            app.taxiOrder.true = 'ended';

            app.taxiStats.Routes += 1;
            app.taxiStats.MoneyInt += cash;
            app.taxiStats.MoneyString = `${app.taxiStats.MoneyInt}$`;
        },
        OK() {
            app.taxiOrder.true = false;

            app.taxiOrder.Name = '';
            app.taxiOrder.Distance = 0;
            app.taxiOrder.Price = 0;
            app.taxiOrder.TimeOfRouteInt = 0;
            app.taxiOrder.TimeOfRouteString = '';
        },
        EndJob() {
            if (app.taxiOrder.true === true) {
                mp.trigger('cant.finish.taxi.job');
                return;
            }
            // Чистка всего мусора тут должна быть, при подключении к основному браузеру
            app.taxiStats.EndJob = true;
            mp.trigger('events.callRemote', 'end.taxi.day');
        },
        deleteOrder(user, item, index) {
            app.taxi.splice(app.taxi.findIndex(item => item.Name === user), 1);
            app.taxiStats.Count = app.taxi.length;
            mp.trigger('add.taxi.filtration', user);
        },
        resetOrders() {
            mp.trigger('clear.taxi.filtration');
        },
        EndOrder() {
            app.taxiOrder.true = false;
            app.taxiOrder.Name = '';
            app.taxiOrder.Distance = 0;
            app.taxiOrder.Price = 0;
            app.taxiOrder.TimeOfRouteInt = 0;
            app.taxiOrder.TimeOfRouteString = '';

            if (app.taxiOrder.Interval !== undefined) clearInterval(app.taxiOrder.Interval);
            app.taxiOrder.Interval = null;
            mp.trigger('events.callRemote', 'cancels.taxi.order');
        },
    },
});
