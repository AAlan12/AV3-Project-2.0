import Web3 from 'web3';
import configuration from '../build/contracts/Tickets.json';
import 'bootstrap/dist/css/bootstrap.css';

// Importando as imagens
import hongKong from './images/HongKong.jpeg';
import bangkok from './images/Bangkok.jpeg';
import londres from './images/Londres.jpeg';
import singapura from './images/Singapura.jpeg';
import macau from './images/Macau.jpeg';
import paris from './images/Paris2.jpeg';
import dubai from './images/Dubai.jpeg';
import newYork from './images/New-York.jpeg';

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
const TOTAL_TICKETS = 8;
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

const images = [ hongKong, bangkok, londres, singapura, macau, paris, dubai, newYork];
const details = [
  '<strong>País: <strong/>China <br/> <strong>Cidade: <strong/>Hong Kong <br/> <strong>Guia: <strong/>Lee Shin <br/>',
  '<strong>País: <strong/>Tailândia <br/> <strong>Cidade: <strong/>Bangkok <br/> <strong>Guia: <strong/>Xin Zhao <br/>',
  '<strong>País: <strong/>Inglaterra <br/> <strong>Cidade: <strong/>Londres <br/> <strong>Guia: <strong/>Artoria Pendragon <br/>',
  '<strong>País: <strong/>Malásia <br/> <strong>Cidade: <strong/>Singapura <br/> <strong>Guia: <strong/>Akali Lanling <br/>',
  '<strong>País: <strong/>China <br/> <strong>Cidade: <strong/>Macau <br/> <strong>Guia: <strong/>Lee Shin <br/>',
  '<strong>País: <strong/>França <br/> <strong>Cidade: <strong/>Paris <br/> <strong>Guia: <strong/>Jeanne dArc <br/>',
  '<strong>País: <strong/>Emirados Árabes Unidos <br/> <strong>Cidade: <strong/>Dubai <br/> <strong>Guia: <strong/>Mo Salah <br>',
  '<strong>País: <strong/>Estados Unidos <br/> <strong>Cidade: <strong/>New York <br/> <strong>Guia: <strong/>Mary Anning <br/>'  
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
              <button class="btn btn-primary">Comprar Pacote</button>
            </div>
        </div>
        `
      );

      if (Buttickets > 0) {
        containerTicketsEl.innerHTML = `<h1>Pessoas em que nossos pacotes atenderam: ${Buttickets}</h1>`
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