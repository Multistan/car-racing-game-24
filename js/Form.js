class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.button = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  setElementsPosition() {
    this.titleImg.position(120, 50);
    this.input.position(width / 2 - 110, height / 2 - 80);
    this.button.position(width / 2 - 90, height / 2 - 20);
    this.greeting.position(width / 2 - 300, height / 2 - 100);
  }

  setElementsStyle() {
    this.titleImg.class("gameTitle")
    this.input.class("customInput")
    this.button.class("customButton")
    this.greeting.class("greeting")
  }



  handleMousePressed() {
    this.button.mousePressed(() => {
      this.input.hide()
      this.button.hide()
      var greetingMesg = `Hello ${this.input.value()}
     <br/> wait for another player to join....`
      this.greeting.html(greetingMesg)

      playerCount += 1;
      player.name = this.input.value()
      player.index = playerCount
      player.addPlayer()
      player.updateCount(playerCount)
      player.getDistance()
      


    })
  }

  display() {
    this.setElementsPosition()
    this.handleMousePressed()
    this.setElementsStyle()
  }

  hide() {
    this.input.hide()
    this.button.hide()
    this.greeting.hide()
  }

}
