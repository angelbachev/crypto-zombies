// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ZombieAttack.sol";
import "./ERC721.sol";

/**
* @title ZombieOwnership
* @author Angel Bachev
* @dev The ZombieOwnership contract allows user transfer his zombie to another user.
*/
contract ZombieOwnership is ZombieAttack, ERC721 {

    mapping (uint => address) private zombieApprovals;

    function balanceOf(address _owner) external view override returns (uint256) {
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view override returns (address) {
        return zombieToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerZombieCount[_to]++;
        ownerZombieCount[msg.sender]--;
        zombieToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external override payable {
        require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external override payable onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

}
