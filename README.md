# mail-order-listener

this app connects to gmail account using IMAP protocol and listen for emails from specific sender. when email is received from this address, the listener triggers a service that gets a access token, after that, checks if there are any pending orders, and catch the orderId to finally call another endpoint to assign this order to the employee

to start this application, create an .env file and write in terminal `npm install; node index.js`

created by kholostyak17
