"use strict";

let lu;
let gameLocation;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');


document.onkeydown = function (ev) {
  if ((ev.keyCode == 65 && !lu.moveingState.moving) || (ev.keyCode == 37 && !lu.moveingState.moving)) {
    lu.movePeopleLeft(gameLocation);
  }
  if ((ev.keyCode == 68 && !lu.moveingState.moving) || (ev.keyCode == 39 && !lu.moveingState.moving))  { 
    lu.movePeopleRight(gameLocation);
  }

  if (ev.keyCode == 32) {
    lu.checkObjects(gameLocation);
  }
}

function initialization() {

    
    lu = new People("lu", "photos_game/lu.svg", true, "photos_game/lu-invert.svg"); 
    gameLocation = new Location();
    gameLocation.setLoc(1);
    lu.positionX = 200; 
    lu.positionY = 300;
    requestAnimationFrame(drawCanvas);
    console.info('Game started')
}

function drawCanvas() {
  lu.drawPeople();
}




let bg = document.querySelector('.bg');

class Location {
    constructor () {
        this.width = null;
        this.height = null;
        this.numberOfLocation = null;
        this.path = './photos_game/locations/location_';
    }

    setLoc(i) {
        let wrapper = document.querySelector('.wrapper')
        wrapper.style.opacity = 1;
            setTimeout(() => {
                this.numberOfLocation = i;
                bg.src = `${this.path + i}.svg`
                bg.onload = () => {
                    this.width = bg.width;
                    this.height = bg.height;
                    setTimeout(() => {
                        wrapper.style.opacity = 0;
                    }, 400);
                }
            }, 400);

        console.log('locaded')
    }
    screenRight(speed) {
        bg.style.left = bg.offsetLeft - speed + 'px'; 
    }
    screenLeft(speed) {
        bg.style.left = bg.offsetLeft + speed + 'px'; 
    }
    setPosition(x) {
        bg.style.left =`${x}px`;
    }
    get maxLeft() {
        return 0;
    }
    get maxRight() {
        if (this.numberOfLocation != 3) {
            return (this.width - 1000)*-1;
        } else return this.width * -1;
    }
    get bgPosition() {
        return bg.offsetLeft
    }

}
class People {
  constructor(name, imgSrc, isChild, imgSrcInv) { 
      this.name = name; 
      this.imgSrc = imgSrc; 
      this.imgSrcInv = imgSrcInv; 
      this.speed = 10;
      this.lastAction;
      this.fixedPosition = false;
      this.moveingState = {
        moving: false, 
        state: 0, 
        allStates: 8 
      }
      if (isChild) { 
          this.width = 150;
          this.height = 300;
      } else {
          this.width = 150;
          this.height =300;
      }
  }

  get positionX() {
      return this.x
  }

  set positionX(x) {
      this.x = x
  }

  get positionY() {
      return this.y
  }

  set positionY(y) {
      this.y = y
  }
  get plpWidth() {
    return this.img.width / this.moveingState.allStates;
  }

  drawPeople () {
      let img = new Image(); 
      this.img = img; 
      img.src = this.imgSrc; 
      let width = this.width; 
      let height = this.height; 
      let x = this.positionX;
      let y = this.positionY; 
      img.onload = () => { 
          ctx.drawImage(img, 0, 0, img.width / this.moveingState.allStates, img.height, x, y, width, height); 
      }
      let img2 = new Image();
      this.imgInv = img2;
      img2.src = this.imgSrcInv; 
  }


  movePeopleLeft(location) {
      this.moveingState.moving = true
      clearRect(this);
      let screenWidth = getHalfWidth(this);

      if (this.positionX >= screenWidth - 5 && this.positionX <= screenWidth + 5) {
        this.fixedPosition = true
      }

      if (!this.fixedPosition) {
        if (this.positionX > 10) this.positionX = this.positionX - this.speed;
      }
      if (this.fixedPosition) {
        if (location.bgPosition <= location.maxLeft) location.screenLeft(this.speed);
        else {
          this.fixedPosition = false;
          this.positionX = this.positionX - this.speed;
        }
      }
      this.moveingState.state == this.moveingState.allStates - 1 ? this.moveingState.state = 0 : this.moveingState.state++;

      ctx.drawImage(this.imgInv, this.moveingState.state * this.plpWidth, 0, this.plpWidth, this.img.height, this.positionX, this.positionY, this.width, this.height)

      setTimeout(() => {
        this.moveingState.moving = false
        this.resetState(true)
        this.lastAction = 'moveLeft'
      }, 100)
  }

  movePeopleRight(location) {
    this.moveingState.moving = true
    clearRect(this) 
    let screenWidth = getHalfWidth(this);
    console.log(location.maxRight)
    if (this.positionX >= screenWidth - 20 && this.positionX <= screenWidth + 20) { 
      this.fixedPosition = true
    }

    if (!this.fixedPosition) {
      if (this.positionX < -location.maxRight - screenWidth)
      this.positionX = this.positionX + this.speed;
    }
    if (this.fixedPosition) {
      if (location.bgPosition >= location.maxRight) location.screenRight(this.speed);
      else {
        this.fixedPosition = false;
        this.positionX = this.positionX + this.speed;
      }
    }

    this.moveingState.state == this.moveingState.allStates - 1 ? this.moveingState.state = 0 : this.moveingState.state++;
   
    ctx.drawImage(this.img, this.moveingState.state * this.plpWidth, 0, this.plpWidth, this.img.height, this.positionX, this.positionY, this.width, this.height)

    setTimeout(() => {
      this.moveingState.moving = false
      this.resetState()
      this.lastAction = 'moveRight'
    }, 100)
  }
  resetState(invert) {
    setTimeout(() => {
      if ((this.lastAction == 'moveRight' && !invert && !this.moveingState.moving) || (this.lastAction == 'moveLeft' && invert && !this.moveingState.moving)) {
        setTimeout(() => {
          if (!this.moveingState.moving) {
            this.moveingState.state = 0;
            let localImageWidth = this.img.width / this.moveingState.allStates;
            let img = this.img;
            clearRect(this);
            if (invert) {
              this.moveingState.state = 7;
              img = this.imgInv
            }

            ctx.drawImage(img, this.moveingState.state * localImageWidth, 0, localImageWidth, this.img.height, this.positionX, this.positionY, this.width, this.height)
          }
        }, 200)
      }
    }, 2000)
  }
  checkObjects(location) {
    let plpX = this.positionX + -location.bgPosition;

    switch (location.numberOfLocation) {
      case 1: {
        if (plpX > 2100 && plpX < 2350) {
          location.setLoc(2);
          setTimeout(()=>{
            ctx.clearRect(0,0, 1000,700);
            this.positionX = 60;
            this.width = 110;
            this.height = 220;
            this.positionY = 390;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = false;
          }, 400)
        }
        break;
      } case 2: {
        if (plpX > 20 && plpX < 140) {
          location.setLoc(1);
          setTimeout(()=>{
            ctx.clearRect(0,0, 1000,700);
            this.positionX = 450;
            this.width = 150;
            this.height = 300;
            this.positionY = 300;
            this.resetState();
            location.setPosition(-1900);
            this.fixedPosition = false;
          },400);
        } else if (plpX > 640 && plpX < 810) {
          location.setLoc(3);
          setTimeout(()=>{
            ctx.clearRect(0,0, 1000,700);
            this.positionX = 800;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = false;
          }, 400)
        } else if (plpX > 2200 && plpX < 2370) {
          location.setLoc(5);
          setTimeout(()=> {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 300;

            this.resetState();
            location.setPosition(-1430);
            this.fixedPosition = false;
          }, 400)
        } 
        else if (plpX > 2750 && plpX < 2900) {
          location.setLoc(4);
          setTimeout(()=> {
            ctx.clearRect(0,0, 1000,700);
            this.positionX = 20;
            this.positionY = 300;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = false;
          }, 400)
        } 
        break;
      } case 3: { // Спальня
        if (plpX > 730 && plpX < 930) {
          ctx.clearRect(0,0, 1000,700);

          this.resetState();
          location.setLoc(2);
          location.setPosition(0);
          this.fixedPosition = false;
        }
        break;
      } case 4: { // Кухня
        if (plpX > 40 && plpX < 210) {
          location.setLoc(2);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 390;
            this.positionX = 550;
            this.resetState();
            location.setPosition(-2300);
            this.fixedPosition = true;
          }, 400)
        } 
        break;
      } case 5: {
        if (plpX > 2105 && plpX < 2300) { // В квартиру
          location.setLoc(2);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 390;
            this.positionX = 400;
            this.resetState();
            location.setPosition(-1800);
            this.fixedPosition = true;
          }, 400)
        } else if (plpX > 1165 && plpX < 1430) { // В лифт
          location.setLoc(6);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 390;
            this.positionX = 400;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = true;
          }, 400)
        } else if (plpX > 10 && plpX < 235) { // На улицу
          location.setLoc(8);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 260;
            this.height = 180;
            this.width = 90;
            this.positionX = 180;
            this.resetState();
            generateObjects();
            location.setPosition(0);
            this.fixedPosition = false;
          }, 400)
        } 
        break;
      } case 8: {
        if (plpX > 65 && plpX < 185) { // В квартиру
          location.setLoc(5);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.width = 110;
            this.height = 220;
            this.positionY = 320;
            this.positionX = 400;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = false;
          }, 400)
        } else if (plpX > 1165 && plpX < 1430) { // В лифт
          location.setLoc(6);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 390;
            this.positionX = 400;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = true;
          }, 400)
        } else if (plpX > 10 && plpX < 235) { // В лифт
          location.setLoc(8);
          setTimeout(() => {
            ctx.clearRect(0,0, 1000,700);
            this.positionY = 260;
            this.height = 180;
            this.width = 90;
            this.positionX = 180;
            this.resetState();
            location.setPosition(0);
            this.fixedPosition = false;
          }, 400)
        } 
        break;
      }

    }
    console.log(location.numberOfLocation)
    console.log(plpX)
  }
}


function clearRect(plp) {
  ctx.clearRect(plp.positionX -1, plp.positionY -1, plp.width + 2, plp.height + 2)
}



function getHalfWidth(plp) {
  let plpWidth = plp.img.width / plp.moveingState.allStates
  return (canvas.width - plpWidth) / 2
}
function generateObjects() {
let svet = document.createElement('img');
svet.src = '../imgs/grb.png';
}

initialization();