pragma solidity ^0.4.2;

import "./zeppelin/lifecycle/Killable.sol";
import "./zeppelin/SafeMath.sol";

contract Escrow is Killable, SafeMath {
  address private buyer;
  address private seller; //TODO handle multiple sellers

  //amout is in wei
  uint private amount;

  /*uint private multiplier = 100;
  uint private feePercent = 10; //10%*/

  address multiSig;

  //TODO add a struct to store some other things about a buyer
  //TODO add a struct to store some other things about a owner

  enum State { Open, InEscrow }

  State public state;
  uint private fee;

  function Escrow(address _buyer, address _seller, address _multiSig, uint _amount, uint _fee) {
    owner = msg.sender;
    multiSig = _multiSig;
    buyer = _buyer;
    seller = _seller;
    amount = _amount;
    state = State.Open;
    fee = _fee;
  }


  event InEscrow(uint block);

  function () payable {
    pay();
  }

  function pay() payable stateIs(State.Open) {
    if(msg.value != (amount+fee))
      throw;
    //possible book keeping?
    state = State.InEscrow;
    InEscrow(block.number);
  }

  function payoutToBuyer() stateIs(State.InEscrow) {
    if(msg.sender != seller && msg.sender != owner)
      throw;

    if(!buyer.send(amount))
      throw;

    selfdestruct(multiSig);
  }

  function refundToSeller() stateIs(State.InEscrow) {
    if(msg.sender != owner)
      throw;

    selfdestruct(seller);
  }

  modifier stateIs(State _state) {
    if(state != _state)
      throw;
    _;
  }

}
