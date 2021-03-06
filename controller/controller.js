/*
 * Creation & Computation - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 * 
 * remote controller that sends a variable to all the listening devices
 */

// server variables

var dataServer;
var pubKey = 'pub-c-3a5429eb-d270-4869-bd02-55fe6fe7afa1';
var subKey = 'sub-c-16e11ea6-1363-11e9-a898-9ef472141036';

var quadrant1 = 0;
var quadrant2 = 0;
var quadrant3 = 0;
var quadrant4 = 0;


var colourQuadrant1;
var colourQuadrant2;
var colourQuadrant3;
var colourQuadrant4;

var choice;

//name used to sort your messages. used like a radio station. can be called anything
var channelName = "theVote";

function setup() 
{
  getAudioContext().resume();
  createCanvas(windowWidth,windowHeight);
  background(255);
  
  
  colourQuadrant1 = color("#bfee10");
  colourQuadrant2 = color("#9f13df");
  colourQuadrant3 = color("#f09d00");
  colourQuadrant4 = color("#06b9ee");

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});

}

function draw() 
{
background(255);
noStroke();

//draw the box for quad1
fill(colourQuadrant1);
rect(0, 0, width/2, height/2);

//draw the box for quad2
fill(colourQuadrant2);
rect(width, 0, -width/2, height/2);

//draw the box for quad3
fill(colourQuadrant3);
rect(0, height, width/2, -height/2);

//draw the box for quad4
fill(colourQuadrant4);
rect(width, height, -width/2, -height/2);

//draw the text
fill(255);
textSize(40);
textAlign(CENTER, CENTER);

//draw quad1 and count
text("1",width*0.25,(height/2)-200);
text(quadrant1,width*0.25,(height/2)+60);
//draw quad2 and count
text("2",width*0.75,(height/2)-200);
// text(quadrant2,width*0.75,(height/2)+60);
//draw quad3 and count
text("3",width*0.25,(height/2)+200);
// text(quadrant3,width*0.25,(height/2)+60);
//draw quad4 and count
text("4",width*0.75,(height/2)+200);
// text(quadrant4,width*0.75,(height/2)+60);

}


///uses built in mouseClicked function to send the data to the pubnub server
function sendTheMessage() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        vote: choice       //get the value from the text box and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
      if(inMessage.message.vote == "yes")
      {
        quadrant1+=1;
      }
      if(inMessage.message.vote == "no")
      {
        noCount+=1;
      }
  }
}

function mousePressed()
{
  if(mouseX<=width/2 && mouseY >= height/2){
    choice = "yes";
  }

  // else
  // {
  //   choice = "no";
  // }

sendTheMessage();

}


function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}