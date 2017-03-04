pragma solidity ^0.4.2;

contract Escrow {
  address public scholar;
  address public donar; //TODO handle multiple donars
  address public arbiter; //TODO handle multiple arbiters

  //TODO add a struct to store some other things about a scholar
  //TODO add a struct to store some other things about a donar

  function Escrow(address _scholar, address _arbiter) payable {
    donar = msg.sender;
    scholar = _scholar;
    arbiter = _arbiter;
  }

  function payoutToBuyer() payable {
    if(msg.sender == donar || msg.sender == arbiter) {
      if (!scholar.send(this.balance))
        throw;
    }
  }

  function refundToSeller() payable {
    if(msg.sender == scholar || msg.sender == arbiter) {
      if (!donar.send(this.balance))
        throw;
    }
  }
}
