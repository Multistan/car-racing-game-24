class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", (data) => {
      gameState = data.val();
      console.log(gameState);
    });
  }

  updateState(state) {
    database.ref("/").update({
      gameState: state,
    });
  }

  start() {
    form = new Form();
    form.display();

    player = new Player();
    playerCount = player.getCount();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    //  creating Groups
    fuels = new Group();
    powerCoins = new Group();

    // Adding fuel sprite in the game
    this.addSprites(fuels, 30, fuelImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 40, powerCoinImage, 0.09);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      x = random(width / 2 + 150, width / 2 - 150);
      y = random(-height * 4.5, height - 400);

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Restart Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leaderBoardTitle.html("leaderBoard");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width/3 - 60, 60);

    this.leader1.class("leadersText");
    this.leader1.position(width/3 - 50, 30);

    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 50,10);
  }


  play() {
    this.handleElements();
    Player.getPlayersInfo();
    this.handleResetButton();
    player.getCarAtEnd();

    if (allPlayers !== undefined) {
      // image(imagename,x,y,w,h)
      image(track, 0, -height * 5, width, height * 6);
      // for loop to get indi player index
      this.showleaderBoard()
      var index = 0;
      for (var i in allPlayers) {
        //  console.log(i)
        // by using datbase getting x and y direction of allplayer(i)
        var x = allPlayers[i].positionX;
        var y = height - allPlayers[i].positionY;

        // index increase
        index = index + 1;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          textSize(30);
          fill("black");
          textAlign(CENTER);
          text(player.name, x, y + 70);

         camera.position.x=cars[index-1].position.x     
         camera.position.y=cars[index-1].position.y   

            this.handleFuel(index);
          this.handlePowerCoins(index);
        }
      }
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }

      if (keyIsDown(DOWN_ARROW)) {
        player.positionY -= 10;
        player.update();
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 2 - 320) {
        player.positionX -= 10;
        player.update();
      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 320) {
        player.positionX += 10;
        player.update();
      }

        const finishLine= height*6-100
        if(player.positiony>finishLine){
          gameState=2
          player.rank+=1
          Player.updateCarsAtEnd(player.rank)
          player.update()
          this.showRank()
              
             
    
        }

      drawSprites();
    }
  }


  showRank(){ 
   swal({
   title: `Awesome!${"\n"} Ranks${"\n"}${player.rank}`,
   text: "You reached the finish line",
   icon: "success", 
   imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
   imageSize:"100x100",
   confimButtonText:"Ok",
  }); 
}


  handleFuel(index) {
    // Adding fuel
    cars[index - 1].overlap(fuels, function (collector, collected) {
      player.score += 20;
      player.update();    
        //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function (collector, collected) {
      player.score += 20;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        carsAtEnd:0,
        players: {},
      });
      window.location.reload();
    });
  }



showleaderBoard(){
  var leader1,leader2
  var players=Object.values(allPlayers)
  // console.log(players)
//[0]=leader1 [1]=leader2

if(players[0].rank === 0 && players[1].rank === 0 || players[0].rank ===1){
  leader1=
  players[0].rank+ "&emsp;"+
  players[0].name+ "&emps;"+
  players[0].score;


  leader2=
  players[1].rank+ "&emsp;"+
  players[1].name+ "&emps;"+
  players[1].score;
}

//second player's rank is one
if(players[1].rank === 1){
  leader1=
  players[1].rank+ "&emsp;"+
  players[1].name+ "&emps;"+
  players[1].score;


  leader2=
  players[0].rank+ "&emsp;"+
  players[0].name+ "&emps;"+
  players[0].score;
}

this.leader1.html(leader1)
this.leader2.html(leader2)

}

}
