BasicGame.Fence = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'fence');
    this.anchor.set(0.5)

    this.physics = game.physics.arcade;
    this.physics.enable(this);
    // this.body.collideWorldBounds = true;
    this.scale.x = 4
    this.run()

    return this;
}

BasicGame.Fence.prototype = Object.create(Phaser.Sprite.prototype);
BasicGame.Fence.prototype.constructor = BasicGame.Fence;

BasicGame.Fence.prototype.run = function () {
    this.body.gravity.y = -50;
}

BasicGame.Fence.prototype.initPos = function () {
    this.x = this.game.width/2
    this.y = this.game.height+80
}

BasicGame.Fence.prototype.killself = function () {
    this.kill();
}