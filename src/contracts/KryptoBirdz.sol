// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./ERC721Connector.sol";

contract KryptoBird is ERC721Connector {
    string[] public kryptoBirdz;

    mapping(string => bool) kryptoBirdzExists;

    function mint(string memory _kryptoBird) public {
        require(
            !kryptoBirdzExists[_kryptoBird],
            "ERROR - krptoBird already exists"
        );

        // uint _id = kryptoBirdz.push(_kryptoBird);
        kryptoBirdz.push(_kryptoBird);
        uint256 _id = kryptoBirdz.length - 1;

        _mint(msg.sender, _id);

        kryptoBirdzExists[_kryptoBird] = true;
    }

    constructor() ERC721Connector("KryptoBird", "KBIRDZ") {}
}
