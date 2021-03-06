BasicGame.Player = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'players',GlobalPlayerFrame);

    this.anchor.set(0.5)

    this.physics = game.physics.arcade;
    this.physics.enable(this);

    this.rocket = this.game.make.sprite(0,0,'players',GlobalEqpFrame)
    this.rocket.anchor.set(0.5)
    this.addChild(this.rocket);

    var smoke = this.game.make.sprite(-70, -130, 'smoke');
    smoke.anchor.set(0.5)
    smoke.scale.set(2)
    smoke.animations.add('smoke');
    smoke.animations.play('smoke', 30, true);  
    this.rocket.addChild(smoke);

    var smoke1 = this.game.make.sprite(60, -120, 'smoke');
    smoke1.anchor.set(0.5)
    smoke1.scale.set(2)
    smoke1.animations.add('smoke1');
    smoke1.animations.play('smoke1', 30, true);  
    this.rocket.addChild(smoke1);    

    var player = this.game.make.sprite(0,0,'players',GlobalPlayerFrame)
    player.anchor.set(0.5)
    this.addChild(player);
    // this.body.gravity.y = 40

    // this.body.bounce.y = 0;
    this.body.collideWorldBounds = true;
    this.body.allowGravity = false;
    this.body.immovable = true;

    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.add(this.speedup, this);    

    return this;

}

BasicGame.Player.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Player.prototype.constructor = BasicGame.Player;

BasicGame.Player.prototype.speedup = function () {
    // this.body.velocity.y = -90;
}