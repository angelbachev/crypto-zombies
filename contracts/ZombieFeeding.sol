// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ZombieFactory.sol";

abstract contract KittyInterface {
    function getKitty(uint256 _id) external virtual view returns (
        bool isGestating,
        bool isReady,
        uint256 cooldownIndex,
        uint256 nextActionAt,
        uint256 siringWithId,
        uint256 birthTime,
        uint256 matronId,
        uint256 sireId,
        uint256 generation,
        uint256 genes
    );
}

/**
* @title ZombieFeeding
* @author Angel Bachev
* @dev The ZombieFeeding contract allows user to feed his zombies with kitties.
*/
contract ZombieFeeding is ZombieFactory {

    KittyInterface private kittyContract;

    modifier onlyOwnerOf(uint _zombieId) {
        require(msg.sender == zombieToOwner[_zombieId], "Only owner");
        _;
    }

    function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
    }

    function getKittyContractAddress() external view returns (address) {
        return address(kittyContract);
    }

    function _triggerCoolDown(Zombie storage _zombie) internal {
        _zombie.readyTime = uint32(block.timestamp + coolDownTime);
    }

    function _isReady(Zombie storage _zombie) internal view returns (bool) {
        return (_zombie.readyTime <= block.timestamp);
    }

    function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public onlyOwnerOf(_zombieId) {
        Zombie storage myZombie = zombies[_zombieId];
        require(_isReady(myZombie), "Is not ready yet");
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        if (keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))) {
            newDna = newDna - newDna % 100 + 99;
        }
        _createZombie("NoName", newDna);
        _triggerCoolDown(myZombie);
    }

    function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        feedAndMultiply(_zombieId, kittyDna, "kitty");
    }

    function getKittyDna(uint _kittyId) public view returns (uint kittyDna) {
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
    }
}
