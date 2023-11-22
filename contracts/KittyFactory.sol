// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
* @title KittyFactory
* @author Angel Bachev
* @dev The KittyFactory contract is used to add crypto kitties to local and test networks which can later be used for zombie feeding.
*/
contract KittyFactory {
    uint256[] public kittiesIds;
    mapping(uint => uint) public genesOfKitties;

    // Save genes for a given kitty to blockchain
    function createKitty(uint _id, uint _genes) public {
        // Create new kitty
        if (genesOfKitties[_id] == 0) {
            genesOfKitties[_id] = _genes;
            kittiesIds.push(_id);
        }

        // Update kitty genes
        if (genesOfKitties[_id] != _genes) {
            genesOfKitties[_id] = _genes;
        }
    }

    // Save genes for given kitties to blockchain
    function createManyKitties(uint[] memory _ids, uint[] memory _genes) external {
        require(_ids.length == _genes.length, "The number of ids should be equal to the number of genes");

        for (uint i = 0; i < _ids.length; i++) {
            createKitty(_ids[i], _genes[i]);
        }
    }

    // Get all kitties id saved to the blockchain
    function getKittiesIds() external view returns (uint[] memory) {
        return kittiesIds;
    }

    // Get a info for single kitty
    function getKitty(uint256 _id) external view returns (
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
    ) {
        uint kittyGenes = genesOfKitties[_id];

        return (
            false,
            false,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            kittyGenes
        );
    }
}
