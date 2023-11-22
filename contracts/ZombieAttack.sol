// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ZombieHelper.sol";

/**
* @title ZombieAttack
* @author Angel Bachev
* @dev The ZombieAttack contract allows user to attack enemy zombie.
*/
contract ZombieAttack is ZombieHelper {
    uint private randNonce = 0;
    uint private attackVictoryProbability = 70;

    function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus;
    }

    function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
        Zombie storage myZombie = zombies[_zombieId];
        Zombie storage enemyZombie = zombies[_targetId];
        uint rand = randMod(100);
        if (rand <= attackVictoryProbability) {
            myZombie.winCount++;
            myZombie.level++;
            enemyZombie.lossCount++;
            feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
        } else {
            myZombie.lossCount++;
            enemyZombie.winCount++;
            _triggerCoolDown(myZombie);
        }
    }
}
