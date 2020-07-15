module.exports = {
    "atmMenu.addMoney": (player, money) => {
        try
        {
           BankInfo.functions.putBalanceMoney(player, money);
        }
        catch (err) {
            console.log(err);
            return;
        }
    },
    
    "atmMenu.withdrawMoney": (player, money) => {
        try
        {
           BankInfo.functions.takeBalanceMoney(player, money);
        }
        catch (err) {
            console.log(err);
            return;
        }
    }
};