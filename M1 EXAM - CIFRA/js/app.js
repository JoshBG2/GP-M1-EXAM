var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 350 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var player,cursors,stars,platforms,scoreText,score=0,i;

var color = ['0xff0000','0xffa500','0xffff00','0x008000','0x0000ff','0x4b0082','0x800080'];



function preload () {

    this.load.image('bg', '../assets/images/bg.png');
    this.load.image('ground', '../assets/images/platform.png');
    this.load.image('star', '../assets/images/star.png');
    this.load.image('bomb', '../assets/images/bomb.png');
    this.load.spritesheet('dude', 
        '../assets/images/cube.png',
        { frameWidth: 50, frameHeight: 49 }
    );
    
}

function create () {

  //Background and Platforms

    this.add.image(400, 300, 'bg');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(50, 160, 'ground');
    platforms.create(750, 160, 'ground');
    platforms.create(400, 290, 'ground');
    platforms.create(50, 420, 'ground');
    platforms.create(750, 420, 'ground');

  //Player
  
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
  
    this.anims.create({
      key: 'left',
      frames: [ { key: 'dude', frame: 0 } ],
      frameRate: 1,
    });
  
    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 1 } ],
      frameRate: 20
    });
  
    this.anims.create({
      key: 'right',
      frames: [ { key: 'dude', frame: 2 } ],
      frameRate: 1,
    });

  //Stars
  
    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    this.physics.add.collider(stars, platforms);
  
    this.physics.add.overlap(player, stars, collectStar, null, this);


  //Game Mechanics

    function collectStar (player, star) {
      star.disableBody(true, true);
      score += 1;
      scoreText.setText('Stars Collected: ' + score);

      //Spawn new Star
      if (stars.countActive(true) < 12) {
        stars.create(Phaser.Math.RND.between(0, 800), Phaser.Math.RND.between(0, 500), 'star');
      }

      //Change Color
      player.setTint(color[0]);
      color.shift();
      if(color.length===0) {
        color.push('0xff0000','0xffa500','0xffff00','0x008000','0x0000ff','0x4b0082','0x800080');
      }
      
      //Character Scale and Bomb Physics
      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      if(score % 5 == 0){
        player.scale += 0.1;

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }    

  //Bombs

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    function hitBomb (player, bomb) {
        this.physics.pause();
        player.setTint('0x000000');
        player.anims.play('turn');
        gameOver = true;

        if(gameOver = true) {
            return alert("GAME OVER")
        }
    }

  //Scoreboard Setting

    scoreText = this.add.text(16, 16, 'Stars Collected: 0', { fontSize: '24px', fill: '#ffffff' });  

  //Keybinds

    cursors = this.input.keyboard.createCursorKeys();

}

function update () {

  //Setting up Keybinds

    if (cursors.left.isDown) {
      player.setVelocityX(-230);
      player.anims.play('left', true);
    }

    else if (cursors.right.isDown) {
      player.setVelocityX(230);
      player.anims.play('right', true);
    }

    else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }
  
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }

}
