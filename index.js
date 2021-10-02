document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div')
  let isGameOver = false
  let speed = 3
  let platformCount = 5
  let platforms = []
  let score = 0
  let doodlerLeftSpace = 10
  let doodlerRightSpace = 10

  let screener = window.innerWidth
  let higher = window.innerHeight

  let startPoint = higher/5
  let doodlerBottomSpace = startPoint
  const gravity = 0.9
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId
  let btn = document.createElement("button");
  btn.innerHTML = "Reiniciar";
  btn.onclick = function () {
    if (confirm("Are you sure, want to restart?")) {
      location.reload();
    }
  };



  class Platform {
    constructor(newPlatBottom) {
      this.left = Math.random() * (screener - 500)
      this.bottom = newPlatBottom
      this.visual = document.createElement('div')

      const visual = this.visual
      visual.classList.add('platform')
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      visual.style.right = this.left + 'px'
      grid.appendChild(visual)
    }
  }


  function createPlatforms() {
    for(let i =0; i < platformCount; i++) {
      let platGap = higher / platformCount
      let newPlatBottom = 400 + i * platGap
      let newPlatform = new Platform (newPlatBottom)
      platforms.push(newPlatform)
      console.log(platforms)
    }
  }
//MOVE PLATFORMS DOWNWARDS SO LITTLE
  function movePlatforms() {
    if (doodlerBottomSpace > (higher/3)) {
        platforms.forEach(platform => {
          platform.bottom -= 4
          let visual = platform.visual
          visual.style.bottom = platform.bottom + 'px'

          if(platform.bottom < 10) {
            let firstPlatform = platforms[0].visual
            firstPlatform.classList.remove('platform')
            platforms.shift()
            console.log(platforms)
            score++
            var newPlatform = new Platform(higher)
            platforms.push(newPlatform)
          }
      }) 
    }
    
  }

  function createDoodler() {
    grid.appendChild(doodler)
    doodler.classList.add('doodler')
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px'
    doodler.style.bottom = doodlerBottomSpace + 'px'
    doodlerRightSpace = platforms[0].right
    doodler.style.right =  doodlerRightSpace + 'px'
  }

function fall() {
  isJumping = false
    clearInterval(upTimerId)
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5
      doodler.style.bottom = doodlerBottomSpace + 'px'
      if (doodlerBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach(platform => {
        if (
          (doodlerBottomSpace >= platform.bottom) &&
          (doodlerBottomSpace <= (platform.bottom + 200)) &&
          ((doodlerLeftSpace + 300) >= platform.left) && 
          (doodlerLeftSpace <= (platform.left + 500)) &&
          !isJumping
          ) {
            console.log('tick')
            startPoint = doodlerBottomSpace
            jump()
            console.log('start', startPoint)
            isJumping = true
          }
      })

    },5)
}
//QUE SALTE MENOS
  function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      console.log(startPoint)
      console.log('1', doodlerBottomSpace)
      doodlerBottomSpace += higher/4
      doodler.style.bottom = doodlerBottomSpace + 'px'
      console.log('2',doodlerBottomSpace)
      console.log('s',startPoint)
      if (doodlerBottomSpace > (startPoint + (higher/3))) {
        fall()
        isJumping = false
      }
    },30)
  }

  function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(function () {
        if (doodlerLeftSpace > 0) {
          console.log('going left')
          doodlerLeftSpace -= 10
           doodler.style.left = doodlerLeftSpace + 'px'
        } else moveRight()
    },20)
  }

  function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function () {
      //changed to 313 to fit doodle image
      if (doodlerLeftSpace < (screener-100)) {
        console.log('going right')
        doodlerLeftSpace += 10
        doodler.style.left = doodlerLeftSpace + 'px'
      } else moveLeft()
    },20)
  }
  
  function moveStraight() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  //assign functions to keyCodes
  function control(e) {
    doodler.style.bottom = doodlerBottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      moveStraight()
    }
  }
  
  function gameOver() {
    isGameOver = true
    while (grid.firstChild) {
      console.log('remove')
      grid.removeChild(grid.firstChild)
      refreshPage()
    }
    document.body.appendChild(btn);
    grid.innerHTML = score
    grid.appendChild(btn)
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

//30 miliseconds checks
  function start() {
    if (!isGameOver) {
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms,30)
      jump(startPoint)
      document.addEventListener('keyup', control)
    } 
  }
  start()
})




//THE CHANGES R PLAIN PBVIOS,30