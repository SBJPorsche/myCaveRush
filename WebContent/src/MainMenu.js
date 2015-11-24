
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

    var http_request = false;
    function createXMLHttpRequest()
    {        
        http_request = false;
        //开始初始化XMLHTTPRequest对象
        if(window.XMLHttpRequest)//如果是window.XMLHttpRequest对象
        {
            //Mozilla,netscape 浏览器
            http_request = new XMLHttpRequest();    
            if (http_request.overrideMimeType) {//设置MiME类别
            //有些版本的浏览器在处理服务器返回的未包含XML mime-type头部信息的内容时会报错，因此，要确保返回的内容包含text/xml信息。
            http_request.overrideMimeType("text/xml");
        }
        }
        else if(window.ActiveXObject)//如果是window.ActiveXObject
        {
            //IE浏览器
            try
            {
                http_request = new ActiveXObject("Msxml2.XMLHTTP");//IE较新版本
            }
            catch (e)
            {
                try
                {
                    http_request = new ActiveXObiect("Microsoft.XMLHTTP"); //ie旧版本
                }
                catch (e){}
            }
        }
        if(!http_request)
        {
            //异常，创建对象实例失败
            window.alert("不能创建XMLHttpRequest对象实例。");
            return false;
        }
    }

BasicGame.MainMenu.prototype = {

	create: function () {
		createXMLHttpRequest()

		this.music = this.add.audio('titleMusic');
		this.music.play();
	    GlobalPlayerFrame = localData.get('playerId') || 'player1.png'
	    GlobalEqpFrame = localData.get('eqpId') || 'rocket.png'

		this.add.sprite(this.world.centerX,this.world.centerY, 'preloaderBackground').anchor.set(0.5,0.5);
		
		this.chooseRole = this.add.button(this.game.width-100,100, 'head',this.chooseRoleFunc, this, 2, 1, 0).anchor.set(0.5,0.5);
		var role = this.game.add.sprite(this.game.width-100,100,'players',GlobalPlayerFrame)
		role.anchor.set(0.5)

		this.chooseEqp = this.add.button(100,100, 'head',this.chooseEqpFunc, this, 2, 1, 0).anchor.set(0.5,0.5);
		var role = this.game.add.sprite(100,100,'players',GlobalEqpFrame)
		role.anchor.set(0.5)	

		this.playButton = this.add.button(this.world.centerX,this.world.centerY, 'start',this.startGame, this, 2, 1, 0).anchor.set(0.5,0.5);
	},

	update: function () {
		//	Do some nice funky main menu effect here
	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();
		//	And start the actual game
		this.state.start('Game');
	},
	
	chooseRoleFunc: function () {
		this.state.start('ChoosePlayer');
	},

	chooseEqpFunc: function () {
		this.state.start('ChooseEqp');
	}	
};
