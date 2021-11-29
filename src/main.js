const fs = require('fs');
const userPrompt = require('prompt-sync')({ sigint: true });
const { displayData, getDetails, howmanyTickets, getallTicks, get_pagewise } = require('./functions/index')

async function start() {
  let action;
  var rep = true;
  console.log('\n');
  console.log('\x1b[1m\x1b[4m\x1b[36m%s\x1b[0m', 'This is the Zendesk API tickets viewer for Zendesk Coding Challenge 2021 by Atharva Biwalkar:');
  console.log('\n');
  while (rep) {
    if (!action) {
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', 'Select your choice: \n\n')
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '1. Get tickets\n\n')
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '2. Get pagewise results\n\n')
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '3. Get details for ticket\n\n')
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '4. Ticket Count\n\n')
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '5. Exit\n\n')
      action = userPrompt('Input:');
    }
    switch (action) {
      case 'Get the tickets':
      case '1': {
        const { error, data } = await getallTicks();
        if (error) {
          action = '';
          break;
        }
        const opt = '1';
        switch (opt) {
          case '1': {
            displayData(data.data.tickets)
            break;
          }
          default: {
            throw new Error('Unidentified action error: ' + action);
          }
        }
        action = '';
        break;
      }

      case 'Get the pagewise resultls':
      case '2': {
        cont = true
        var url = `https://zccatharva.zendesk.com/api/v2/` + 'tickets.json?page[size]=25'
        while (cont) {
          cont = false
          const { error, data } = await get_pagewise(url);
          displayData(data.data.tickets)
          if (data.data.meta.has_more) {
            console.log('Proceed to the next page ? \n 1. Y \n 2. N\n')
            const opt = userPrompt('Input:');
            switch (opt) {
              case '1':
              case 'Y':
              case 'y': {
                cont = true;
                url = data.data.links.next;
                break;
              }
              case '2':
              case 'N':
              case 'n': {
                break;
              }
              default: {
                console.log('The entered choice is not correct, redirecting to the Main Menu');
              }
            }
          }
        }
        action = '';
        break;
      }

      case 'Get Details for the ticket':
      case '3': {
        const ticketId = userPrompt('Enter the ticket ID/number: ');
        const { error, data } = await getDetails(ticketId);
        if (error) {
          break;
        }
        console.log('The ticket details are:\n');
        displayData([data.data.ticket]);
        action = '';
        break;
      }
      
      case 'TicketCount':
      case '4': {
        const { error, data } = await howmanyTickets();
        if (error) {
          action = '';
          break;
        }
        console.log('Amount of total tickets:', data.data.count.value);
        action = '';
        break;
      }
      
      
      case 'Exit':
      case '5': {
        rep = false;
        break;
      }

      default: {
        throw new Error('Unidentified action error: ' + action);
      }
    }
  }
  console.log('\n');
  console.log('\x1b[1m\x1b[4m\x1b[36m%s\x1b[0m', 'Thank you for using the application, Bye!');
  console.log('\n');
}

start()
