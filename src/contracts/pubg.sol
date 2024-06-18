// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Tournament {
    address public owner;
    address public tokenAddress; // USDT (BEP20) token address
    uint256 public entryFee;
    uint256 public totalParticipants;
    uint256 public maxParticipants;

    mapping(address => bool) public participants;
    address[] public participantList;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(address _tokenAddress, uint256 _entryFee, uint256 _maxParticipants) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        entryFee = _entryFee * (10**18);
        maxParticipants = _maxParticipants;
        totalParticipants = 0;
    }

    function deposit() external {
        require(totalParticipants < maxParticipants, "Maximum number of participants reached");
        require(!participants[msg.sender], "You have already participated");

        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), entryFee), "Transfer failed");

        participants[msg.sender] = true;
        participantList.push(msg.sender);
        totalParticipants += 1;

        emit Deposit(msg.sender, entryFee);
    }

    function setEntryFee(uint256 _entryFee) external onlyOwner {
        entryFee = _entryFee;
    }

    function withdraw() external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner, balance), "Withdrawal failed");

        emit Withdrawal(balance);
    }

    function getParticipants() external view returns (address[] memory) {
        return participantList;
    }
}
