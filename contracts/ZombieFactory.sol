// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Ownable.sol";

/**
* @title ZombieFactory
* @author Angel Bachev
* @dev The ZombieFactory contract allows user to create random zombie.
*/
contract ZombieFactory is Ownable {
    event NewZombie(uint zombieId, string name, uint dna);

    uint private dnaDigits = 16;
    uint internal dnaModulus = 10 ** dnaDigits;
    uint internal coolDownTime = 1 days;

    struct Zombie {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Zombie[] public zombies;

    mapping(uint => address) public zombieToOwner;
    mapping(address => uint) ownerZombieCount;

    function _createZombie(string memory _name, uint _dna) internal {
        zombies.push(
            Zombie({
                name: _name,
                dna: _dna,
                level: 1,
                readyTime: uint32(block.timestamp + coolDownTime),
                winCount: 0,
                lossCount: 0
            })
        );
        uint id = zombies.length - 1;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender]++;
        emit NewZombie(id, _name, _dna);
    }

    function _generateRandomDna(string memory _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomZombie(string memory _name) public {
        require(ownerZombieCount[msg.sender] == 0, "Only 1 random zombie is allowed");
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;
        _createZombie(_name, randDna);
    }
}
