const assert = require("assert");
const { displayData, Authenticate, getDetails, howmanyTickets, getallTicks, get_pagewise, HandleError } = require('../src/functions/index')

console.log('Performing the Unit Testing');
describe('Get Tickets API Test', async () => {
    it('Get the ticket details', async () => {
        const response = await getDetails(5);
        assert.equal(response.data.data.ticket.id, 5, 'Test passed!')
    })
})

describe('Check the number of tickets', async () => {
    it('Get the ticket count', async () => {
        const response = await howmanyTickets();
        assert.equal(response.data.data.count.value, 191, 'Test passed')
    })
})

describe('API test to check if all tickets are acquired', async () => {
    /**
     * Test getallTicks
     */
    it('Getting ticket details', async () => {
        const response = await getallTicks();
        assert.equal(response.data.data.tickets[0].id, 1, 'Test passed!')
    })
})
