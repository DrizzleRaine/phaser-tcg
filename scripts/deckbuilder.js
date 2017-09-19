Builder = {};

Builder.Client = Client;
Builder.game = null;

Builder.init = function(game){
    this.game = game;
    this.game.stage.disableVisibilityChange = true;
};

Builder.preload = function() {
    this.game.load.image('newcard', 'assets/new_card.png');
    this.game.load.image('back', 'assets/builderback.png');
    this.game.load.image('buttons2', 'assets/buttons2.png');
    this.game.load.spritesheet('cards', 'assets/cards.png',412,562);
    this.game.load.spritesheet('harrows', 'assets/harrows.png',32,32);
};

Builder.create = function() {
    var game = this.game;
    page = 0;
    pageMax = 0;

    var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'back');
    logo.anchor.setTo(0.5, 0.5);

    Builder.menu = game.add.group(game.world, "menu", false, false, false);
    Builder.cards = game.add.group(game.world, "cards", false, false, false);
    obj = [];

    var deck = Client.cardsys.player.deck;
    if(deck.card.length >= 40) {
        pageMax = 3;
    } else {
        pageMax = Math.floor((deck.card.length+(1)) / 10);
    }
    {
        var o = {
            x: 55,
            y: 105,
        }
        for(i = 0; i < 10; i++) {
            var c = {
                index: i,
                obj:game.add.image(
                    o.x + (206 * (i % 5)),
                    o.y + (281 * Math.floor(i / 5)),
                    'cards'
                ),
                update: function() {
                    var deck = Client.cardsys.player.deck;
                    if(page * 10 + this.index < deck.card.length) {
                        this.obj.visible = true;
                        this.obj.frame = deck.card[(page * 10) + this.index].index - 1;
                    } else {
                        this.obj.visible = false;
                    }
                }
            }
            c.obj.width /= 2;
            c.obj.height /= 2;
            c.obj.frame = deck.card[i].index - 1;
            Builder.cards.add(c.obj);
            obj.push(c);
        }
        var nc = {
            origin: {
                x: o.x,
                y: o.y
            },
            obj: game.add.button(
                o.x + (206 * (0 % 5)),
                o.y + (281 * Math.floor(0 / 5)),
                'newcard',
                function() {},
                this
            ),
            update: function() {
                var deck = Client.cardsys.player.deck;
                if(page === pageMax && deck.card.length % 10 !== 0) {
                    this.obj.inputEnabled = true;
                    this.obj.visible = true;
                    var i = deck.card.length % 10;
                    this.obj.x = this.origin.x + (206 * (i % 5));
                    this.obj.y = this.origin.y + (281 * Math.floor(i / 5));
                } else {
                    this.obj.inputEnabled = false;
                    this.obj.visible = false;
                }
            }
        };
        nc.obj.width /= 2;
        nc.obj.height /= 2;
        obj.push(nc);
    }

    var backpage = {
        obj:game.add.button(
            395,695,
            'harrows',
            function() { page--; },
            this
        ),
        update:function(){
            if(page > 0) {
                this.obj.inputEnabled = true;
                this.obj.frame = 0;
            } else {
                this.obj.inputEnabled = false;
                this.obj.frame = 1;
            }
        }
    }
    obj.push(backpage);

    pagecntr = game.add.text(430, 695, "1/1", {
        font: "32px Impact",
        fill: "#ffff44",
        align: "left"
    });

    var nextpage = {
        obj:game.add.button(
            495,695,
            'harrows',
            function() { page++; },
            this
        ),
        update:function(){
            if(page < pageMax) {
                this.obj.inputEnabled = true;
                this.obj.frame = 2;
            } else {
                this.obj.inputEnabled = false;
                this.obj.frame = 3;
            }
        }
    }
    obj.push(nextpage);

    var backbutton = game.add.button(
        43,874,
        'buttons2',
        function() { this.game.state.start('Title',true,false,game); },
        this
    );
};

Builder.update = function() {
    for(i in obj) {
        obj[i].update();
    }
    pagecntr.setText((page+1) + ' / ' + (pageMax+1));
}

Builder.addCard = function(index) {
    pageMax = Math.floor((deck.card.length+1) / 10);
}