BasicGame.Bullets = function (game, quantity) {

    Phaser.Group.call(this, game);

    this.physics = game.physics.arcade;

    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;

    this.createMultiple(quantity, 'no');

    this.setAll('anchor.x', 0.5);
    this.setAll('anchor.y', 0.5);

    //  beam
    this.fireRate = 10;
    this.bulletTime = 0;
    this.bulletSpeed = 1500;
    this.bulletLifeSpan = 1000;

    return this;
}

BasicGame.Bullets.prototype = Object.create(Phaser.Group.prototype);
BasicGame.Bullets.prototype.constructor = BasicGame.Bullets;

BasicGame.Bullets.prototype.update = function () {
    this.forEachExists(function(item){           
        if (item.y < 0) {
            item.kill();
            this.remove(item)
        };
    }, this);     
}

BasicGame.Bullets.prototype.fire = function (player) {
    if (this.game.time.now >= this.bulletTime)
    {
        var bullet = this.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.body.x + 16, player.body.y + 16);

            bullet.lifespan = this.bulletLifeSpan;
            bullet.rotation = player.rotation;
            this.physics.velocityFromRotation(player.rotation, this.bulletSpeed, bullet.body.velocity);
            this.bulletTime = this.game.time.now + this.fireRate;

            return true;
        }
    }

    return false;
}
