SortCards.Game = function(game) {};

SortCards.Game.prototype = {
	create: function() {
		this.game.add.tileSprite(0, 0, 1280, 800, 'background');

		this.stage.backgroundColor = "#aaa";
		this.storageCtrl = new StorageCtrl();
		this.storageCtrl.generateNewUserId();
		this.progressBar = new ProgressBar(this, Config.TEMPLATES);
		this.buckets = Bucket.createBuckets(this, Config.BUCKETS);

		this.cards = [];

		for (var i = 0; i < 18; ++i){
			this.cards.push(new Card(this, i));
		}

		this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.startNextTemplate, this);

		this.resetCardsAndBuckets();
	},

	update: function() {
		this.cards.forEach(function(card){ card.update() });
	},

	startNextTemplate: function(){
		this.storageCtrl.saveTemplateResult(0, this.buckets);

		this.resetCardsAndBuckets();
		
		var isLast = this.progressBar.next(this);

		if (isLast) {
			this.game.state.start('End');
		}
	},

	startPreviousTemplate: function(){
		this.resetCardsAndBuckets();
		this.progressBar.back(this);
	},
	
	resetCardsAndBuckets: function() {
		this.clearBuckets();
		this.resetCards();
	},

	destroyCards: function(){
		for (var i = 0; i < this.cards.length; ++i){
			this.cards[i].sprite.destroy();
		}
	},

	resetCards: function() {
		for (var i = 0; i < this.cards.length; ++i){
			this.cards[i].resetCardPositionAndScale();
			this.cards[i].showCard();
		}
	},

	clearBuckets: function(){
		for (var i = 0; i < this.buckets.length; ++i){
			this.buckets[i].clear();
		}
	},

	getBucketByPosition : function(pos) {
		for (var i = 0; i < this.buckets.length; ++i){
			if (this.buckets[i].isInside(pos)) {
				return i;
			}
		}

		return -1;
	},

	addToBucket: function(bucketIndex, card){
		this.buckets[bucketIndex].add(card);
	},

	removeFromBucket: function(bucketIndex, card){
		this.buckets[bucketIndex].remove(card);
	},

	dispatchBucketScaleUp: function(bucketIndex){
		this.buckets[bucketIndex].scaleUp();
	},

	dispatchBucketScaleDown: function(){
		for(var i = 0; i< this.buckets.length; i++) {
			this.buckets[i].scaleDown();
		}
	}
};

SortCards.SCREEN_SIZE = 1280;