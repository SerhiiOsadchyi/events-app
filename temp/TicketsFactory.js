const TicketsFactory = artifacts.require("TicketsFactory");

contract("TicketsFactory test", async accounts => {
    let ticketsFactory = null;
    const owner = accounts[0];
    const buyer = accounts[1];
    const price = 1000;
    const ticketsTotal = 5;
    const eventId = 0;
    const eventName = "event 1";
    const ticketSymbol = "T";
    let isTicketsAvailable = true;
    const balanceOwnerStart =  web3.eth.getBalance(owner);

    before(async () => {
        ticketsFactory = await TicketsFactory.deployed(
          owner, eventId, eventName, price, ticketsTotal
        );
    });

    it("Should transfer wei to owner and mint a new token by buyer", async () => {
      await ticketsFactory.methods.sellTicket().send({from: buyer , value: price});
      const balanceOwnerNew =  web3.eth.getBalance(owner);
      const balanceChange = balanceOwnerNew - balanceOwnerStart;
      assert.equal(balanceChange, price, "Transfer error");
      assert.equal(ticket, tickets[0], "Tickets could not mint");
    });

    it("Owner of the ticket should be change", async () => {
        await ticketsFactory.changeTicketOwner(owner, buyer, 0).send({from: owner});
        const tickets = ticketsFactory.methods.ticketsList().call();
        assert.equal(tickets[0].ticketOwner, buyer,  "Tickets owner could not be change");
      });

  });