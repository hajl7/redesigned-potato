// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width =400;
canvas.height =700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage,enemyImage,gameOverImage;
let gameOver=false //true면 게임 끝, false면 안끝남
let score=0;
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

let bulletList =[];
function Bullet(){
    this.x =0;
    this.y =0;
    this.init=function(){
        this.x =spaceshipX+20;
        this.y =spaceshipY-20;
        this.alive=true; //true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update =function(){
        this.y -=7;
    };
     this.checkHit=function(){
        //총알.y <=적군.y &  총알.x >=적군.x & 총알.x <= 적군.x + 적군넓이에서 약간 작게
        for(let i=0; i< enemyList.length; i++){
            if(this.y <=enemyList[i].y && this.x >=enemyList[i].x && this.x <=enemyList[i].x+40){
                score++; //점수 획득
                this.alive =false;//죽은 총알
                enemyList.splice(i,1);
            }
        }
     }
}


function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min
  return randomNum
}

let enemyList =[]
function enemy(){
    this.x =0;
    this.y=0;
    this.init =function(){
        this.y= 0;
        this.x= generateRandomValue(0,canvas.width-48)
        enemyList.push(this);
    };
    this.update= function(){
        this.y +=2;//적군의 속도조절

        if(this.y >= canvas.height-48){
            gameOver =true;
            // console.log("gameOver");
        };
    };
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.png";

    spaceshipImage =new Image();
    spaceshipImage.src="images/spaceship1.png";

    bulletImage =new Image();
    bulletImage.src="images/bullet1.png";

    enemyImage =new Image();
    enemyImage.src="images/enemy2.png";

    gameOverImage =new Image();
    gameOverImage.src="images/gameOver.png";
}
let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        // console.log("무슨 키가 눌렸어?",event.keyCode)
        keysDown[event.keyCode] = true;
        // console.log("카운터객체에 들어간 값은?",keysDown);
    });
        document/addEventListener("keyup",function(event){
        delete keysDown[event.keyCode];
        // console.log("클릭 후",keysDown);

        if(event.keyCode == 32){
            createBullet();
        }
    });
}

function createBullet(){
  console.log("총알");
  let b =new Bullet();
  b.init();
  console.log("총알리스트",bulletList);
}

function createEnemy(){
    const interval = setInterval(function(){
        let e =new enemy();
        e.init();
    },1000)
}

function update(){
    //방향키에 따라 우주선 움직이게, 캔버스 넘어가지 않게
    if (39 in keysDown){
        spaceshipX +=5;
    };
    if (37 in keysDown){
        spaceshipX -=5;
    };
    if (38 in keysDown){
        spaceshipY -=5;
    };
    if (40 in keysDown){
        spaceshipY +=5;
    }
    if (spaceshipX <=0){
        spaceshipX=0;
    }
    if (spaceshipX >canvas.width-64){
        spaceshipX = canvas.width-64;
    }
    if (spaceshipY <=0){
        spaceshipY=0;
    }
    if (spaceshipY >canvas.height-64){
        spaceshipY = canvas.height-64;
    }

    //총알의  y좌표 업데이트하는 함수 호출
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
        }
    }

    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update()
    }
}

function render(){
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle="white";
    ctx.font ="20px Arial";
    
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
       }
    }
    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}


function main(){
    if(!gameOver){
    update();//좌표값을 업데이트하고
    render();//그려주고
    // console.log("animation calls main function")
    requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage,10,100,380,380);
    }
}

//웹싸이트 시작하자마자자
loadImage();//이미지 부르고
setupKeyboardListener();//키보드 하고
createEnemy();//적군부르고
main();//메인부르고