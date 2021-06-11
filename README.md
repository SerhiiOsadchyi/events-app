# Initial data

For view this app you need to install MetaMask (https://metamask.io/download.html).

The initial data you could edit in the events-api.js file (src / components / API / events-api.js).
ABI you could to edit in src/ABIs.

If you do not change the initial data, you could use this app only as a regular user without access to the basic functions of the application.

## Administrators rules 

The site visitor, after entering the administrator's address and password in the Metamask authorization panel, has access to:

1. Creation of a new event (Add new event button). 
After confirmation, a new event is created in the blockchain with the possibility of issuing tickets for the event. 
The number of tickets is limited to the specified number when creating an event. 
When all tickets have been sold, sell button will hide, an inscription will be displayed that all tickets have been sold.

2. Closing events (button Close event). 
After confirmation, the event will go into the “closed” state, existing tickets for this event will be unavailable, 
and the event will be removed from the list of events on the site.

If the event has an end time less than the current time, the ticket sales button will be disactive.


##  Regular user 

A regular site visitor after authorization by Metamask:

1. Can buy a ticket by clicking on the "Buy ticket to the event" button. 
The buy button becomes inactive after all tickets have been sold and after the end date of the event
2. The user can transfer his ticket to another address in the "My tickets" section (as a gift, without the sale option)
