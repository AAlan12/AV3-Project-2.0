import Web3 from 'web3';
import configuration from '../build/contracts/Tickets.json';
import 'bootstrap/dist/css/bootstrap.css';

// Importando as imagens
import beatles from './images/beatles.jpg';
import ledzeppelin from './images/ledzeppelin.jpg';
import mj from './images/mj.jpeg';
import nirvana from './images/nirvana.jpg';

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

// Conexão com o contrato
const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(
  Web3.givenProvider || 'http://127.0.0.1:8545'
);

const contract = new web3.eth.Contract(
  CONTRACT_ABI,
  CONTRACT_ADDRESS
);

const accountEl = document.getElementById('account');
const ticketsEl = document.getElementById('tickets');
const containerTicketsEl = document.getElementById('Buttickets');

let account;
let  Buttickets = 0;
const TOTAL_TICKETS = 4;
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

const images = [ beatles, ledzeppelin, mj, nirvana];
const details = [
  'Beatles <br/> Há exatos 48 anos, os Beatles faziam seu último concerto, no Candlestick Park, em São Francisco.', 
  'Led Zeppelin <br/> Show de 1975', 
  'Michael Jackson <br/> A lembrança de um show que não aconteceu.','Nirvana <br/> Show de 1994'
];

const buyTicket = async (ticket) => {
  await contract.methods
    .buyTicket(ticket.id)
    .send({ from: account, value: ticket.price });
    Buttickets+=1;
  await refreshTickets();
};

// Layout da aplicação.
const refreshTickets = async () => {
  ticketsEl.innerHTML = '';
  
  for (var i = 0; i < TOTAL_TICKETS; i++) {
    const ticket = await contract.methods.tickets(i).call();
    ticket.id = i;
    
    if (ticket.owner === EMPTY_ADDRESS) {
      const ticketEl = createElementFromString(

        `<div class="ticket card" style="width: 18rem;">
          <img src="${images[i]}" class="image card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${details[i]}</h5>
              <p class="card-text">${
                ticket.price / 1e17  // 0.1 ETH
              } Eth</p>
              <button class="btn btn-primary">Buy Ticket</button>
            </div>
        </div>
        `
      );

      if (Buttickets > 0) {
        containerTicketsEl.innerHTML = `<h1>Total de tickets vendidos até agora: ${Buttickets}</h1>`
      }

      ticketEl.onclick = buyTicket.bind(null, ticket);
      ticketsEl.appendChild(ticketEl);
    }
  }
};

const main = async () => {
  const accounts = await web3.eth.requestAccounts();
  account = accounts[0];
  accountEl.innerText = account;
  await refreshTickets();
};

main();