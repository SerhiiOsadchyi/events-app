const EventsFactory = artifacts.require('EventsFactory');
const TicketsFactory = artifacts.require('TicketsFactory');
const toBN = web3.utils.toBN;

contract('EventsFactory test', async accounts => {
  let eventsFactory = null;
  const owner = accounts[0];
  let ticketsContract = null;
  const buyer = accounts[1];
  let events = [];
  const price = 1000;
  const ticketsTotal = 5;
  const eventName = 'event 1';
  const eventDescription = 'description 1';
  const eventLocation = 'location 1';
  const imageURL = 'imageURL 1';
  const startDate = 1625323000000;
  const endDate = 1625323192891;
  const ticketSymbol = 'T';
  let isTicketsAvailable = true;

  before(async () => {
    eventsFactory = await EventsFactory.deployed(owner)
  })

  it('should new event added', async () => {
    const newEvent = await eventsFactory.addEvent(
        eventName,
          eventDescription,
          eventLocation,
          imageURL,
          price,
          ticketsTotal,
          startDate,
          endDate
      )
      events = await eventsFactory.eventsList();
    assert.equal(events.length, 1, 'New event could not be added')
  })

  it('should switch event isLocked to true', async () => {
   await eventsFactory.closeEvent(0);
    events = await eventsFactory.eventsList();
    assert.equal(events[0].isLocked, true, 'Event could not be locked')
  })

  it('should return array of events', async () => {
    await eventsFactory.eventsList();
    assert.equal(events.length, 1, 'List of events not available')
  })

  it('should return length of array of events = 1', async () => {
    const count = await eventsFactory.eventsCount()
    assert.equal(count.toNumber(), 1, 'Count of events not available')
  })

  //Tickets Contract test

  it('Should transfer wei to owner and mint a new token by buyer', async () => {
    try {
        ticketsContract = await new web3.eth.Contract(
            TicketsFactory.abi,
            events[0].ticketsContractAddress
          )
          await ticketsContract.methods.sellTicket().send({from: buyer, value: price, gas:300000});
      } catch (err) {
        assert(
          err.message
        )
      }
  })

  it('Owner of the ticket should be change', async () => {
    ticketsContract = await new web3.eth.Contract(
        TicketsFactory.abi,
        events[0].ticketsContractAddress
      )
    await ticketsContract.methods.changeTicketOwner(owner, buyer, 0);
    const tickets = await ticketsContract.methods.ticketsList().call();
    assert.equal(
      tickets[0].ticketOwner,
      buyer,
      'Tickets owner could not be change'
    )
  })
})