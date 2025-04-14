// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WaterBillManager {
    address public admin;

    struct User {
        string name;
        uint256 waterUsage; // in liters
        uint256 amountDue;  // in wei (assuming 1 liter = x wei)
        bool exists;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed user, string name);
    event UsageUpdated(address indexed user, uint256 usage);
    event BillPaid(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyUser() {
        require(users[msg.sender].exists, "You are not a registered user");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerUser(address _user, string memory _name) public onlyAdmin {
        require(!users[_user].exists, "User already registered");
        users[_user] = User({
            name: _name,
            waterUsage: 0,
            amountDue: 0,
            exists: true
        });
        emit UserRegistered(_user, _name);
    }

    function updateUsage(address _user, uint256 _litersUsed, uint256 ratePerLiter) public onlyAdmin {
        require(users[_user].exists, "User not registered");
        users[_user].waterUsage += _litersUsed;
        users[_user].amountDue += _litersUsed * ratePerLiter;
        emit UsageUpdated(_user, users[_user].waterUsage);
    }

    function viewBill() public view onlyUser returns (uint256 usage, uint256 due) {
        User memory user = users[msg.sender];
        return (user.waterUsage, user.amountDue);
    }

    function payBill() public payable onlyUser {
        require(msg.value == users[msg.sender].amountDue, "Incorrect payment amount");
        users[msg.sender].amountDue = 0;
        users[msg.sender].waterUsage = 0;
        emit BillPaid(msg.sender, msg.value);
    }

    function withdrawFunds() public onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }

    function getContractBalance() public view onlyAdmin returns (uint256) {
        return address(this).balance;
    }
}
