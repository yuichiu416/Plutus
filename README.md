# Plutus

Plutus is an auction bidding web app where users are allowed to bid on luxurious
products they like, or sell products for other users to bid.


## Technologies 
The technologies used for this project are:
* MongoDB
* Express
* React
* Node.js
* Apollo / GraphQL
* Websocket
* Cloudinary DB
* Google Map API
  
## Features
* An "interactive" welcome page ![welcome](./images/welcome.gif)
* Make a bid on an item and the latest price will be announced to all users in real-time. ![bidding](./images/bidding.gif)
* A google map that shows users where the bidding location is ![map](./images/map.gif)
* A user profile that shows the items they are selling or allows message inquiry 
* Inbox for enquiry where users can send or receive messages from other users ![profile](./images/profile.gif)
* A chatbot that can help you search items or change the language ![chatbot](./images/chatbot.gif)
* A search form that the user can search for items ![search](./images/search.gif)
* Responsive design ![responsive](./images/responsive.gif)

## Code snippet example
The algorithm to display the countdown
```javascript
   countDown(){
        const { t } = this.props;

        var distance = this.endTime - new Date().getTime();
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="timer"
        const timer = document.getElementById("timer");
        if(!timer)
            return;
        timer.innerHTML = t("label.auctionIsDueIn") + days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";

        if (distance < 0) {
            timer.innerHTML = t("label.auctionEnded");
            this.props.client.mutate({
                mutation: TOGGLE_SOLD,
                variables: { id: this.props.match.params.id }
            });
        }
    }
```

## Group members
Our team consists of three members:
* [Roger](https://github.com/yuichiu416)
* [Stan](https://github.com/stanbond)
* [Winnie](https://github.com/chinweenie)
