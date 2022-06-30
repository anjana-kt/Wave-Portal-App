// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal{

    uint256 totalWaves=0;
    uint256 private _seed;
    mapping(address=>uint256) lastWaved;

    struct Wave{
        address waver;
        uint256 timestamp;
        string message;
    }

    // All arrays requires an event
    event NewWave(address indexed from, uint256 timestamp, string message);

    Wave[] waves;

    constructor() payable{
        console.log("Waving hii from wave portal...");
        _seed = (block.timestamp + block.difficulty)%100;
    }

    function wave(string memory message) public{

        require(lastWaved[msg.sender]+ 5 minutes < block.timestamp, "Wait for a 5 mins");

        console.log("%s waved you %s",msg.sender,message);
        waves.push(Wave(msg.sender,block.timestamp,message));
        emit NewWave(msg.sender, block.timestamp, message);

        // Prize for a random winner
        _seed = (block.timestamp + block.difficulty +_seed)%100;
        if(_seed <= 40)
        {
            console.log("Someone won a prize!!!");
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount<= address(this).balance,"Your balance doesn't have required money :(");
            (bool success,)=(msg.sender).call{value:prizeAmount}("Won the prize!");
            require(success,"Failed to withdraw money!!");
        }

        totalWaves+=1;
    }

    function getTotalWaves() public view returns (uint256){
        console.log("Total waves : %d",totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory){
        console.log("Returned all the wave set received..");
        return waves;
    }
}