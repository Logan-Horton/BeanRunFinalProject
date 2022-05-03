kaboom({
  scale: 1,
  background: [10, 150, 200],
});
loadSpriteAtlas("https://kaboomjs.com/sprites/dungeon.png", "atlas.json");
loadBean()
const levelConfig = {
  width: 16,
  height: 16,
  pos: vec2(32, 32),
  w: () => ["wall", sprite("wall"), area(), solid()],
  b: () => ["barrier", sprite("wall"), area(), opacity(0)],
  o: () => [
    "enemy",
    sprite("ogre", {
      anim: "run",
    }),
    area({
      scale: 0.5,
    }),
    //solid(),
    origin("center"),
    {
      xVel: 30,
    },
  ],
  R: () => [
    "enemy",
    sprite("redGuy", {
      anim: "run",
    }),
    area({
      scale: 0.5,
    }),
    //solid(),
    origin("center"),
    {
      xVel: 60,
    },
  ],
  D: () => [
    "door",
    sprite("closed_door"),
    area({
      scale: 0.6,
    }),
    solid(),
    origin("center"),
  ],
  c: () => 
  ["chest",
   sprite("chest"),
   area(), 
   solid(),
   origin("top")],
$: () => 
["coin",
 sprite("coin", { 
    anim: "spin",
    }),
 area(),
 solid(),
 
],
   B: () => [
    "player",
    sprite("hero", {
    }),
    area({
      scale: 0,
    }),
    //solid(),
    origin("center"),
    {
      xVel: 30,
    },
  ],
};

//array
const levels = [
  [
    "       $ c           ",
    " w     ww        ",
    " w   $    b    o    b",
    " wwwww wwwwwwwwwwwwwwwD",
  ],
  [" w     wwc        ", " w       b    oo   b", " wwwww    wwwwwwwwwwwwwwwD"],
  [
    " w     wwc        ",
    " w        b $ $R $ R b",
    " wwwww    wwwwwwwwwwwwwww",

    "                               D",
    "                              wwwww",
  ],
];

let levelNum = 0;
scene("game", () => {
  let hp = 2;
  let canHurt = true;
  let hasKey = false
  const level = addLevel(levels[levelNum], levelConfig);

  const scoreLabel = add([
  text("score:0"),
  scale(0.25),
  pos(0,0),
  z(1)
    ]) 
  let score = 0
  let totalscore = score + score
  console.log(totalscore)
  const hpLabel = add([
    text("HP: " + hp, {
      size: 16,
    }),
    pos(16, 16),
    fixed(),
  ]);

  const player = add([
    sprite("hero"),
    pos(level.getPos(3, 0)),
    area({ scale: 1 }),
    solid(),
    origin("bot"),
    body(),
    {
      speed: 150,
      jumpforce: 400,
    },
  ]);
  player.play("idle");
if (player.y >= 500) {
  go("lose")
}
  onUpdate("enemy", (e) => {
    e.move(e.xVel, 0);
  });
  onCollide("enemy", "barrier", (e, b) => {
    e.xVel = -e.xVel;
    if (e.xVel < 0) {
      e.flipX(true);
    } else {
      e.flipX(false);
    }
  });

  onKeyDown(["right","d"], () => {
    player.move(player.speed, 0);
    player.flipX(false);
  });
  onKeyDown(["left","a"], () => {
    player.move(-player.speed, 0);
    player.flipX(true);
  });

  onKeyPress(["right","a" ,"left","d"], () => {
    player.play("run");
  });

  onKeyRelease(["right", "left"], () => {
    player.play("idle");
  });
  onKeyPress(["up", "space","w"], () => {
    if (player.isGrounded() == true) {
      player.jump(player.jumpforce);
    }
  });
  player.onCollide("enemy", () => {
    //addKaboom(player.pos)
    if (canHurt == true) {
      hp--;
      hpLabel.text = "hp: " + hp;
      canHurt = false;
    }
    wait(3, () => {
      canHurt = true;
    });
    if (hp == 0) {
      destroy(player);
      wait(1, () => {
        go("lose");
      });
    }
  });

  player.onCollide("chest", (c) => {
    c.play("open")
    hasKey = true
  });
  player.onCollide("coin", (c) => {
    destroy(c)
    score = score + 1
    scoreLabel.text = "score: "+ score
    localStorage.setItem("coin",score)
  });
  player.onCollide("door", () => {
    if (hasKey == true) {
     if (levelNum == levels.length - 1) {
        go("win");
    } else 
    {
        levelNum++
   localStorage.setItem("level",levelNum)
        go("game")
    scoreLabel.text = "score: " + localStorage.getItem("coin",score)
    } 
    }
      
  })
}); //CLOSE game
scene("lose", () => {
  add([text("You lose"), pos(width() / 2, height() * 0.2), origin("center")]);
  add([
    text("RETRY"),
    "retryButton",
    pos(width() / 2, height() / 2 + 75),
    origin("center"),
    area(),
  ]);
  onClick("retryButton", () => {
    go("game");
  });
});
scene("menu", () => {
  add([text("Dragon World"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("play"),
    "playButton",
    pos(width() / 2, height() / 2 + 75),
    origin("center"),
    area(),
  ]);
  onClick("playButton", () => {
    go("game")
    });
    onClick("continue", () => {
  levelNum = localStorage.getItem("level")
    go("game")
    })
  add([
    text("Continue?"),
    "continue",
    pos(width() / 2, height() / 2 + 150),
    origin("center"),
    area(),
  ]);
});
scene("win", () => {
  add([text("You Win"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("play again"),
    "playButton",
    pos(width() / 2, height() / 2 + 75),
    origin("center"),
    area(),
  ])
  onClick("playButton", () => {
    levelNum = 0;
    go("game", levelNum);
  })
})
go("menu");
