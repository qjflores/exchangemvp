pragma solidity ^0.4.2;

import "./zeppelin/MultisigWallet.sol";

contract Wallet is MultisigWallet {

  function Wallet(address[] _owners, uint _required, uint _daylimit)
    MultisigWallet(_owners, _required, _daylimit) payable { }

  function changeOwner(address _from, address _to) external {}

}
