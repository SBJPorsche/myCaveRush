BasicGame.Player = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'player');

    this.anchor.set(0.5)

    this.physics = game.physics.arcade;
    this.physics.enable(this);

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