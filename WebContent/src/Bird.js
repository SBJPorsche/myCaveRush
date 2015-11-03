BasicGame.Bird = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'bird');
    this.animations.add('fly');
    this.animations.play('fly', 30, true);
    this.anchor.set(0.5)
    this.scale.set(1.5)

    this.physics = game.physics.arcade;
    this.physics.enable(this);
    // this.run()

    return this;
}

BasicGame.Bird.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Bird.prototype.constructor = BasicGame.Bird;

BasicGame.Bird.prototype.run = function () {
    this.body.gravity.y = -50;
}

BasicGame.Bird.prototype.initPos = function () {
    this.x = this.game.width
    this.y = this.game.height+80
}

BasicGame.Bird.prototype.killself = function () {
    this.kill();
}