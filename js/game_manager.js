/**
 * Created by amitkum on 18/7/15.
 */
const directions={up:1, right:2, down:3, left:4};
function GameManager(size,InputManager,Actuator,StorageManager){
    this.size=size;
    this.inputManager=new InputManager;
    this.storagemanager=StorageManager;
    this.actuator=new HTMLActuator;
    this.grid=new Grid;
    this.startNumber=512;
    this.identity=0;
    this.inputManager.on('restart',this.restart.bind(this));
    this.setup();
}

GameManager.prototype.setup=function(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(i==0&&j>0&&j!=3){
                continue;
            }
            var tile=new Tile({x:j,y:i},this.startNumber);
            this.actuator.addTile(tile,this);
        }
    }
};
GameManager.prototype.restart= function () {

};
GameManager.prototype.split= function (event) {
    var self=this;
    var id=parseInt(event.target.dataset.id);
    var tile=this.grid.findTileById(id);
    var splitElements=this.grid.getSplitElements(tile);
    if(splitElements){
        splitElements.forEach(function(element){
            self.actuator.removeTile(id,self);
            self.actuator.addTile(element,self);
            self.actuator.fireTile(element,self);
        });
    }

    //var newTile=new Tile({x:id,y:1},256);
    //this.actuator.addTile(newTile,this);
};
