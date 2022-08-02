

let dataServer;
let pubKey = "pub-c-840d707b-c9d2-48cc-8a65-be8b0c15980e";
let subKey = "sub-c-a293a8f4-d0e7-4d23-ab1e-0c888b4d421f";
let secretKey = "sec-c-MGQ5NThkNWQtZmUyMy00NDk1LWE4NjAtNTYzNTI2ZjEwMjE1";

let channelName = "history";
let imgOne;
let you;

//input variables for the form to PubNub
var sendText;
var sendButton;

let history;

function preload() {
imgOne= loadImage("IMG_2609.PNG");
//imgOne.style.left= "200px";
  // logic to create a random UUID
    you = random(0,1000000); 
    console.log(you);
    you = int(you);
    console.log(you);
    you = you.toString();
  
}


function setup() {
    createCanvas(windowWidth, windowHeight);

    dataServer = new PubNub({
      subscribeKey: subKey,
      publishKey: pubKey,
      uuid: you,
      secretKey: secretKey,
      heartbeatInterval: 0,
    });

     // listen for messages coming through the subcription feed on this specific channel. 

    dataServer.subscribe({ channels: [channelName] });
    dataServer.addListener({ message: readIncoming });
   
  
    textAlign(CENTER);
  
    //create the text fields for the message to be sent
    sendText = createInput();
    sendText.position((windowWidth/2) - 100, windowHeight *0.75);
  
    sendButton = createButton("SEND");
    sendButton.position(sendText.x + sendText.width, windowHeight * 0.75);
    sendButton.mousePressed(sendTheMessage);

    fetchMessages();

}
  
function draw() {
// background(0); 
image(imgOne, sendText.x - 450, sendText.y -305, imgOne.width/6, imgOne.height/6)

}


function fetchMessages() {
console.log("fetching");

  dataServer.fetchMessages(
    {
        channels: [channelName],
        end: '15343325004275466',
        count: 100
    },
    (status, response) => {
    // console.log(response.channels.history);
      drawMessages(response.channels.history);
    }
  );
   
}

function drawMessages(messageHistory) {

  console.log("in draw messages");

  console.log(messageHistory);
  background(0);

  textSize(random(5, 100));
  noStroke();
  fill(255,255,255);
  for (let i = 0; i < messageHistory.length; i++) {
    
      console.log(messageHistory[i]);
      textY= 50 * (i+1) + 20;
      text(messageHistory[i].message.messageText, windowWidth/2, 20 * (i+1) + 20);
    if (textY > 400) {

    }
    

    
  }
}



  // PubNub logic below
function sendTheMessage() {
  // Send Data to the server to draw it in all other canvases
  dataServer.publish({
    channel: channelName,
    message: {
      messageText: sendText.value()
    },
  });

  sendText.value("");

}

function readIncoming(inMessage) {
  console.log(inMessage);
  fetchMessages();

}