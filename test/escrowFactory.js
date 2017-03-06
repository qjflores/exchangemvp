var Escrow = artifacts.require("./Escrow.sol");
var EscrowFactory = artifacts.require("./EscrowFactory.sol");
var Wallet = artifacts.require("./zeppelin/Wallet.sol");

contract("EscrowFactory", function(accounts) {
  var escrowFactory;
  var escrow;
  var buyer = accounts[1];
  var seller = accounts[2];
  var wallet;
  var amount;
  var fee;

  var states = ["Open", "InEscrow"];

  it('factory-init', async function() {
    let owners = [accounts[0]];
    wallet = await Wallet.new(owners, 1, 10);

    escrowFactory = await EscrowFactory.new(wallet.address);
    if(!escrowFactory.address)
      throw new Error("no contract address");
  });

  it('should create escrow contract', async function() {
    amount = web3.toWei(5, 'ether');
    await escrowFactory.createEscrow(buyer, seller, amount);
    var escrowAddress;
    var escrowCreatedEvent = escrowFactory.EscrowCreated({},{fromBlock: 0, toBlock: 'latest'});
    escrowCreatedEvent.watch(async function(error, result) {
      if(error) {
        console.log(error);
      }
      escrowAddress = result.args.escrowAddress;
      escrow = await Escrow.at(escrowAddress);
      if(!escrow.address)
        throw new Error("no contract address");
      let escrowOwner = await escrow.owner();
      assert.equal(escrowOwner, accounts[0]);
      escrowCreatedEvent.stopWatching();
    });
  });

});
