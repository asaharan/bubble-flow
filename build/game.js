function Tile(position,value){
    this.x=position.x;
    this.y=position.y;
    this.value=value;
    this.previousPosition=null;
    this.firedFrom=null;
    
}
Tile.prototype.savePosition=function(){
    this.previousPosition={x:this.x,y:this.y};
}
Tile.prototype.updatePosition= function (position) {
    this.x=position.x;
    this.y=position.y;
}
Tile.prototype.serialize = function () {
    return {
        position: {
            x: this.x,
            y: this.y
        },
        value: this.value
    };
};;function HTMLActuator(){
    this.gameContainer=document.querySelector('.gameContainer');
    this.gameContainerInner=document.querySelector('.gameContainerInner');
    this.tileContainer=document.querySelector('.tileContainer');
}
HTMLActuator.prototype.fireTile= function (tile) {

}