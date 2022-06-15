// SPDX-License-Identifier: ISC

pragma solidity >=0.4.22 < 0.9.0;

uint constant TOTAL_TICKETS = 8;

contract Tickets {
    address public owner = msg.sender;

    Ticket[TOTAL_TICKETS] public tickets;

    struct Ticket {

        uint256 price; // Variavel do tipo inteiro de 256 bit
        address owner; // Variavel do tipo add que vai conter o endereço do contrato. 
    }

    // Setando o preço único de todos os ingressos 
    constructor() {
        for (uint i = 0; i < TOTAL_TICKETS; i++) {
            tickets[i].price = 1e17;  // 0.1 ETH
            tickets[i].owner = address(0x0);
        }
    }

    function buyTicket(uint _index) external payable {
        // Se tiver mais tickets do que foi determinado, erro: Index out of bounds
        require(_index < TOTAL_TICKETS && _index >= 0, "Index out of bounds");
        // Se for tentado comprar um ingresso único duas vezes, erro: Ticket already bought
        require(tickets[_index].owner == address(0x0), "Ticket already bought");
        // Se não possuir ETH suficiente na carteira, erro: Not enough ETH
        require(msg.value >= tickets[_index].price, "Not enough ETH");

        tickets[_index].owner = msg.sender;
    }
}