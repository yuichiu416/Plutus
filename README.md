# Plutus

## Background
Plutus is an auction bidding web app where users are allowed to bid on luxurious
products they like, or sell products for other users to bid. 

## Functionaliy and MVP
In this web app, users will be able to:
* Make bid based on location (A google map will be used to show users where
  the bidding location is) or sell products for others to bid
* Inbox for enquiry where users can send or receive messages from other users
* A chatbot
* Image zoom in/out as well as capture on the bid product show page

## Technologies and Technical Challenges
The technologies used for this project are:
* GraphQL
* Mongoose
* Node
* Apollo
The primary technical challenges we have identified so far are:
* integrating google map into our app as well and to show the actual time before
  the bidding session ends for one product
* chatting feature and chatbot require the implementation of websocket

## Things we have accomplised over the weekend
1. We managed to pinpoint some of the packages, api, .etc that we will need for
   this project
2. Roger setup the basic user authentication and docker file for project deployment
3. Stan worked on the styling of the splash page and logo
4. Winnie prepared for the readme of this project.
5. The team has also started writing the backend skeleton of the project

## Group members and Tasks Distribution
Our team consists of three members:
* [Roger](https://github.com/yuichiu416)
* [Stan](https://github.com/stanbond)
* [Winnie](https://github.com/chinweenie)

## Usage
``npm install`` in the root directory AND in the client directory

``npm run dev`` 