kaboom({
  scale: 1.3,
  background: [10, 150, 200],
});
loadSpriteAtlas("https://kaboomjs.com/sprites/dungeon.png", "atlas.json");
loadBean()
loadSound("click", "click_001.ogg")
loadSound("cs","handleCoins.ogg")
loadSound("locked","doorClose_1.ogg")
loadSound("opened", "doorOpen_1.ogg")
loadSound("walk2", "footstep00.ogg")
loadSound("walk", "footstep01.ogg")
loadSound("back", "jingles_NES01.ogg")
loadSound("completed", "mission_completed.ogg")
loadSound("failed", "mission_failed.ogg")
const levelConfig = {
  width: 16,
  height: 16,
  pos: vec2(32, 32),
  w: () => ["wall", "barrier",sprite("wall"), area(), solid()],
  b: () => ["barrier",sprite("wall"), area(), opacity(0)],
  p: () => ["health+",sprite("health+"), area(), origin("top"), solid()], 
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
      scale: 0.2,
    }),
    //solid(),
    origin("center"),
    {
      xVel: 60,
    },
  ],
  r: () => [
    "enemy",
    sprite("redFlyer", {
      anim: "run",
    }),
    area({
      scale: 1.5,
    }),
    //solid(),
    origin("bot"),
    {
      xVel: 30,
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
   P: () => [
    "player",
    sprite("hero", {
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
};
//array
scene("game", () => {
  const levels = [
  [ 
    "       $ c           ",
    " w     ww        ",
    " w     $    b    o  b",
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
  [
    "       $            ",
    " w           w",
    " w           w",
    " wwwww wwwwwww",
    "w            w",
    "w            w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w r          w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w  r         w",
    "w            w",
    "w      r     w",
    "w            w",
    "w         r  w",
    "w c   b R   b      D",
    "wwwwwwwwwwwwwwwwwww",
  ],
[
"  b                                                    b",
 " D b R     o   r     R     o     p r       o   r R b mcww", 
 " wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", 
],  
];
let levelNum = 0;
  play("back")
  let hp = 2;
  let canHurt = true;
  let hasKey = false
  let score = 0
  const level = addLevel(levels[levelNum], levelConfig, score);

  const scoreLabel = add([
  text("score:0"),
  scale(0.25),
  pos(0,0),
  z(1),
  fixed()
    ]) 
  const reset = add([
  text("reset Level"),
  "reset",
  scale(0.25),
  pos(50,450),
  z(1),
  fixed(),
  area()
    ]) 
  onClick("reset", () => {
    play("click")
    go("game");
  })

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
    area({ scale: 0.5 }),
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
  onUpdate(() => {
camPos(player.pos.x,player.pos.y)
}) 
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
    //play("walk")
  });
  onKeyDown(["left","a"], () => {
    player.move(-player.speed, 0);
    player.flipX(true);
    //play("walk2")
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
  player.onCollide("health+", (p) => {
      hp += 90
    hpLabel.text = "hp: " + hp;
    destroy(p)
    })
  player.onCollide("enemy", () => {
    //addKaboom(player.pos)
    if (canHurt == true) {
      hp--;
      hpLabel.text = "hp: " + hp;
      canHurt = false;
    }
    wait(1, () => {
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
    play("cs")
    score = score + 1
    scoreLabel.text = "score: "+ score
    localStorage.setItem("score",score)
  });
  player.onCollide("door", () => {
    if (hasKey == false) {
      play("locked")
    }
    if (hasKey == true) {
      play("opened")
     if (levelNum == levels.length - 1) {
        go("win");
    } else 
    {
        levelNum++
   localStorage.setItem("level",levelNum)
        go("game")
    scoreLabel.text = "score: " + localStorage.getItem("score",score)
    } 
    }
      
  })
}); //CLOSE game
scene("lose", () => {
  play("failed")
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
  play("completed")
  add([text("You Win"), pos(width() / 2, height() / 2), origin("center")]);
  add([
    text("play again"),
    "playButton",
    pos(width() / 2, height() / 2 + 75),
    origin("center"),
    area(),
  ])
  onClick("playButton", () => {
    play("click")
    levelNum = 0;
    go("game", levelNum);
  })
})
go("menu");
