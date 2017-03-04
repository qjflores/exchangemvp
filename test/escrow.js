var Escrow = artifacts.require("./Escrow.sol");
var Wallet = artifacts.require("./zeppelin/Wallet.sol");

contract("Escrow", function(accounts){
  var escrow;
  var buyer = accounts[1];
  var seller = accounts[2];
  var wallet;
  var amount;
  var fee;

  var states = ["Open", "InEscrow"];

  it('escrow-init', async function() {
    var owners = [accounts[0]];
    wallet = await Wallet.new(owners, 1, 10);
    amount = web3.toWei(5, 'ether');
    console.log("amount before fee: " + amount);
    fee = ((amount * 100) / 10) / 100;
    console.log("fee: " + fee);
    escrow = await Escrow.new(buyer, seller, wallet.address, amount, fee);
    if(!escrow.address)
      throw new Error("no contract address");
  });

  it('should change state when receiving the correct order amount', async function() {
    let stateBefore = await escrow.state();
    stateBefore = states[stateBefore];
    assert.equal(stateBefore, "Open");
    console.log("stateBefore: " + stateBefore);
    let balanceBefore = web3.eth.getBalance(escrow.address);
    console.log("amount: " + amount);
    await escrow.pay({from: seller, value: Number(amount)+fee});
    let balanceAfter = web3.eth.getBalance(escrow.address);
    let stateAfter = await escrow.state();
    stateAfter = states[stateAfter];
    assert.equal(stateAfter, "InEscrow");
    console.log("stateAfter: " + stateAfter);
    console.log("Balance Before: " + balanceBefore);
    console.log("Balance After: " + balanceAfter);
    assert.isAbove(balanceAfter.toNumber(), balanceBefore.toNumber());
  });

  it('should payout the right amount to the buyer and wallet', async function() {
    let buyerBalanceBefore = web3.eth.getBalance(buyer);
    let walletBalanceBefore = web3.eth.getBalance(wallet.address);
    console.log("buyerBalanceBefore: " + buyerBalanceBefore);
    console.log("walletBalanceBefore: " + walletBalanceBefore);
    await escrow.payoutToBuyer({from: seller});
    let buyerBalanceAfter = web3.eth.getBalance(buyer);
    let walletBalanceAfter = web3.eth.getBalance(wallet.address);
    console.log("buyerBalanceAfter: " + buyerBalanceAfter);
    console.log("walletBalanceAfter: " + walletBalanceAfter);

    assert.equal(buyerBalanceBefore.toNumber() + Number(amount), buyerBalanceAfter.toNumber());

  });




})
