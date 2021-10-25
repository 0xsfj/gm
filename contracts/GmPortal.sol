// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GmPortal {
    uint256 totalGms;
    uint256 private seed;

    // Event
    event NewGm(address indexed from, uint256 timestamp, string message);

    // Custom Datatype
    struct Gm {
        address gmer;
        string message;
        uint256 timestamp;
    }

    // Store the gms
    Gm[] gms;

    mapping(address => uint256) public lastGm;

    constructor() payable {
        console.log("Deploying GM Portal");
    }

    function gm(string memory _message) public {
        // Check if it has been 15 minutes since the last gm was sent
        require(
            // lastGm[msg.sender] + 15 minutes < block.timestamp,
            lastGm[msg.sender] + 30 seconds < block.timestamp,
            "Must wait 30 Seconds before minting another GM"
        );

        lastGm[msg.sender] = block.timestamp;

        totalGms += 1;
        console.log("%s has said gm", msg.sender);

        // Store the GMs in the array
        gms.push(Gm(msg.sender, _message, block.timestamp));

        // Random Number Generator between 0 and 100

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) %
            100;
        console.log("Random number generated: %s", randomNumber);

        // Set the random number as the seed for the next gm

        seed = randomNumber;

        if (randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.001 ether;

            require(
                prizeAmount <= address(this).balance,
                "Prize amount is greater than the balance of the contract."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}(
                "Sent Prize!!!"
            );
            require(success, "Failed to withdraw money from contract");
        }

        // Emit the new gm
        emit NewGm(msg.sender, block.timestamp, _message);
    }

    function getAllGms() public view returns (Gm[] memory) {
        return gms;
    }

    function getTotalGms() public view returns (uint256) {
        console.log("We have said GM %d times", totalGms);

        return totalGms;
    }
}
