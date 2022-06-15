// SPDX-License-Identifier: ISC
pragma solidity >=0.4.22 < 0.9.0;

contract Migrations {

  address public owner = msg.sender;
  uint public last_completed_migration;

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
  
  modifier restricted() {
    require(
      msg.sender == owner
    );
    _;
  }
}
