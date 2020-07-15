const JobBus = {
  bus_route: []
};
module.exports = {
    Init: () => {
        DB.Handle.query("SELECT * FROM bus_route", (e, result) => {
           for (let i = 0; i < result.length; i++) JobBus.bus_route.push({ id: result[i].id, name: result[i].name, salary: result[i].money });
           console.log("Busy routes: " + JobBus.bus_route.length);
        });
    }
}
