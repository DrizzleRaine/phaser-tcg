window.onload = function() {

    var username = getCookie("username");

    var game = new Phaser.Game(1500, 960, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    game.state.add('Game',Game);
    game.state.add('Title',Title);
    game.state.add('Builder',Builder);

    if (username != "") {
        Client.askReturnPlayer(username);
    } else {
        Client.askNewPlayer();
    }

    var ls = Client;
    ls.game = game;
    ls.cardsys = new CardSystem();
    ls.obj = {};

    function preload () {
        game.load.json('card_data','assets/cards.json');
    }

    function create () {
        CardIndex = game.cache.getJSON('card_data');
        for(i in CardIndex) {
            var c = CardIndex[i];
            c.type = CardType[c.type];
            if(c.type === CardType.MEMBER || c.type === CardType.ROLE) {
                c.color = CardColor[c.color];
            }
        }
        game.stage.disableVisibilityChange = true;
        game.state.start('Title',true,false,game);
    }

    function update(){}
};