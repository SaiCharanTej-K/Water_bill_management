// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WaterBill {
    struct Bill {
        uint amount;
        bool paid;
    }

    mapping(address => Bill) public bills;

    function generateBill(uint _amount) public {
        require(_amount > 0, "Amount must be greater than 0");
        bills[msg.sender] = Bill(_amount, false);
    }

    function payBill() public payable {
        Bill storage bill = bills[msg.sender];
        require(bill.amount > 0, "No bill found");
        require(!bill.paid, "Bill already paid");
        require(msg.value >= bill.amount, "Insufficient amount to pay the bill");

        bill.paid = true;
    }

    function getMyBill() public view returns (uint amount, bool paid) {
        Bill memory bill = bills[msg.sender];
        return (bill.amount, bill.paid);
    }
}
