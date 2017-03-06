pragma solidity ^0.4.4;

import "./Escrow.sol";
import "./zeppelin/ownership/Ownable.sol";

contract EscrowFactory is Ownable {

  uint private feePercent;
  uint constant INIT_FEE_PERCENT = 10;
  address wallet;

  function EscrowFactory(address _wallet) {
    feePercent = INIT_FEE_PERCENT;
    wallet = _wallet;
  }

  event EscrowCreated(uint blocks, address escrowAddress);

  function createEscrow(address _buyer, address _seller, uint _amount) onlyOwner external returns (address) {
    uint fee = ((_amount * 100) / feePercent) / 100;
    Escrow escrow = new Escrow(_buyer, _seller, wallet, _amount, fee);

    EscrowCreated(block.number, escrow);

    escrow.transferOwnership(owner);

    return escrow;
  }

  function changeFeePercent(uint _feePercent) onlyOwner {
     if(_feePercent > 100)
      throw;
     feePercent = _feePercent;
  }

  function changeWalletAddress(address _wallet) onlyOwner {
    wallet = _wallet;
  }



}
