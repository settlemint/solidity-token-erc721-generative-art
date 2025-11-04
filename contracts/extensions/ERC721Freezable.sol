// SPDX-License-Identifier: FSL-1.1-MIT
// SettleMint.com
pragma solidity ^0.8.27;

import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

abstract contract ERC721Freezable is ERC721Enumerable {
    event PermanentURI(string _value, uint256 indexed _id);

    bool private _isUriFrozen;

    modifier whenURINotFrozen() {
        require(!frozen(), "ERC721Freezable: URI is frozen");
        _;
    }

    modifier whenURIFrozen() {
        require(frozen(), "ERC721Freezable: URI is not frozen");
        _;
    }

    constructor() {
        _isUriFrozen = false;
    }

    function frozen() public view returns (bool) {
        return _isUriFrozen;
    }

    function _freeze() internal virtual whenURINotFrozen {
        _isUriFrozen = true;
    }

    function freezeToken(uint256 tokenId) public whenURIFrozen {
        emit PermanentURI(tokenURI(tokenId), tokenId);
    }

    function freezeAllTokens() public whenURIFrozen {
        uint256 totalSupply = totalSupply();
        for (uint256 tokenId = 1; tokenId <= totalSupply; tokenId++) {
            emit PermanentURI(tokenURI(tokenId), tokenId);
        }
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        virtual
        override(ERC721Enumerable)
        returns (address)
    {
        if (frozen()) {
            freezeToken(tokenId);
        }
        return super._update(to, tokenId, auth);
    }
}
