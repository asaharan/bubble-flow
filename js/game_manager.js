/**
 * Created by amitkum on 18/7/15.
 */
const directions={up:1, right:2, down:3, left:4};
function GameManager(size,InputManager,Actuator,StorageManager){
    this.size=size;
    this.inputManager=new InputManager;
    this.storageManager=new StorageManager;
    this.actuator=new Actuator;
    this.grid=new Grid;
    this.startNumber=4;
    this.identity=0;
    this.fixTile=null;
    this.inTheWay=0;
    this.gameOver=false;
    this.inputManager.on('restart',this.restart.bind(this));
    this.actuator.on('fireComplete',this.fireComplete.bind(this));
    this.setup();
}

GameManager.prototype.setup=function(){
    this.gameOver=false;
    this.actuator.clearContainer();
    this.grid.clearContainer();
    for(var i=0;i<this.size;i++){
        for(var j=0;j<this.size;j++){
            var tile=new Tile({x:j,y:i},this.startNumber);
            this.actuator.addTile(tile,this,true);
        }
    }
    this.setFixedTile();
    this.updateScore(true);
};
GameManager.prototype.setFixedTile= function () {
    this.fixTile=this.grid.findTileByPosition(this.getRandomPosition());
    var stylesheetId='AsAdnHajAhdAHAStylesheet';
    var doesStyleSheetExist=document.getElementById(stylesheetId);
    if(doesStyleSheetExist!=null||doesStyleSheetExist!=undefined){
        doesStyleSheetExist.parentNode.removeChild(doesStyleSheetExist);
    }
    var stylesheet=document.createElement('style');
    stylesheet.textContent='.tile.tile-position-' + this.fixTile.x+'-'+this.fixTile.y+'{ box-shadow:'+'0 0 30px 10px rgba(243, 215, 116, 0.96), inset 0 0 0 1px rgba(213, 123, 123, 1);}';
    stylesheet.setAttribute('id',stylesheetId);
    document.querySelector('body').appendChild(stylesheet);
};
GameManager.prototype.getRandomPosition= function () {
    var random={};
    random.x=Math.floor(Math.random()*this.size);
    random.y=Math.floor(Math.random()*this.size);
    return random;
};
GameManager.prototype.restart= function () {
    this.setup();
};
GameManager.prototype.split= function (event) {
    if(this.gameOver){
        return;
    }
    var self=this;
    var id=parseInt(event.target.dataset.id);
    var tile=this.grid.findTileById(id);
    if(tile.isFixed(self)||self.inTheWay>0){
        return;
    }
    var splitElements=this.grid.getSplitElements(tile);
    self.inTheWay=splitElements.length;
    if(splitElements){
        splitElements.forEach(function(element){
            self.actuator.removeTile(id,self);
            self.actuator.addTile(element,self);
            window.requestAnimationFrame(function () {
                self.actuator.fireTile(element,self);
            });
        });
    }
};
GameManager.prototype.fireComplete=function(){//whwn fired tiles reaches its position this will be called
    this.inTheWay--;
    if(this.inTheWay==0){
        this.updateScore();
        this.gameOver=this.grid.isGameOver(this);
    }
};
GameManager.prototype.updateScore= function (isStartOfGame) {
    var currentScore=this.grid.currentScore(this);
    var previousScore=this.storageManager.currentScore();
    if(previousScore!=currentScore){
        this.actuator.setCurrentScore(currentScore,previousScore);
        this.storageManager.currentScore(currentScore);
    }
    if(isStartOfGame){
        this.actuator.setBestScore(this.storageManager.bestScore());
        this.actuator.setCurrentScore(currentScore,currentScore);
        return;
    }
    var bestScore=this.storageManager.bestScore();
    if(bestScore<currentScore){
        this.storageManager.bestScore(currentScore);
        this.actuator.setBestScore(currentScore);
    }
};