const axios = require('axios');

const DomainName = 'zccatharva';
const api = `https://${DomainName}.zendesk.com/api/v2/`;
const USERNAME = 'abiwalka@stevens.edu';
const PASSWORD = 'Zendesk10!';

/**
 * Error messages
 * @param {string} func 
 * @param {*} error 
 */
function HandleError(func, error) {
  switch (func) {
    case 'howmanyTickets':
    case 'getallTicks': {
      if (error.response.status === 404) {
        console.log('Error code returned by the API request:', error.response.status)
        console.log('There are no tickets available');
      }
      if (error.response.status === 500) {
        console.log('Error code returned by the API request:', error.response.status)
        console.log('There is some error with the server internally.');
      }
      break;
    }
    case 'getDetails': {
      if (error.response.status === 404) {
        console.log('Error code returned by the API request:', error.response.status)
        console.log('Incorrect ID provided, please check the ID given.');
      }
      if (error.response.status === 500) {
        console.log('Error code returned by the API request:', error.response.status)
        console.log('There is some error with the server internally.');
      }
      break;
    }
    default: {
      console.log('Unknown Error');
    }
      break;
  }
}

/**
 * Here we are using this to provide the data obtained as an output on the Command Line Interface
 * @param {array} data - provide an array of json as input 
 */
function displayData(data) {
  const display = data.map(item => {
    const { id, subject, status, type, created_at } = item;
    return {
      id,
      subject,
      status,
      type,
      created_at
    }
  })
  console.table(display)
}

/**
 * Encode the USERNAME and PASSWORD
 * @returns string
 */
function Authenticate() {
  const input_field_1 = `${USERNAME}:${PASSWORD}`;
  const input_field_2 = Buffer.from(input_field_1, 'utf-8');
  const encoded_input = input_field_2.toString('base64');
  return encoded_input;
}

/**
 * Fetch details for all tickets
 * @returns JSON
 */
async function getallTicks() {
  try {
    const tickets = await axios({
      method: 'get',
      headers: {
        'Authorization': 'Basic ' + Authenticate()
      },
      url: api + 'tickets.json'
    })
    return { data: tickets }
  } catch (error) {
    console.log('error', error);
    HandleError('getallTicks', error)
    return { error }
  }
}

/**
* Get the total number of tickets
* @returns JSON
*/
async function howmanyTickets() {
  try {
    const tickets = await axios({
      method: 'get',
      headers: {
        'Authorization': 'Basic ' + Authenticate()
      },
      url: api + 'tickets/count.json'
    })
    return { data: tickets };

  } catch (error) {
    HandleError('howmanyTickets', error)
    return { error }
  }
}

/**
 * Fetch ticket details for provided ticketID
 * @param {int} ticketId 
 * @returns JSON
 */
async function getDetails(ticketId) {
  try {
    const ticket = await axios({
      method: 'get',
      headers: {
        'Authorization': 'Basic ' + Authenticate()
      },
      url: api + `tickets/${ticketId}.json`
    })
    return { data: ticket };
  } catch (error) {
    HandleError('getDetails', error);
    return { error }
  }
}

/**
 * Fetch ticket details using pagination
 * @param {string} url 
 * @returns JSON
 */
async function get_pagewise(url) {
  try {
    var ret;
    const tickets = await axios({
      method: 'get',
      headers: {
        'Authorization': 'Basic ' + Authenticate()
      },
      url: url
    })
    return { data: tickets };

  } catch (error) {
    HandleError(get_pagewise, error);
    return { error }
  }
}

module.exports = { displayData, Authenticate, getDetails, howmanyTickets, getallTicks, get_pagewise, HandleError };
