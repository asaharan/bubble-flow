/**
 * Created by amitkum on 18/7/15.
 */
function Tile(position,value){
    this.x=position.x;
    this.y=position.y;
    this.value=value;
    this.firedFrom=null;
    this.fireDirection=null;
    this.element_id=null;
    this.previousValue=null;
    this.nextValue=value;
}
Tile.prototype.savePosition=function(){
    this.previousPosition={x:this.x,y:this.y};
};
Tile.prototype.updatePosition= function (position) {
    this.x = position.x;
    this.y = position.y;
};
Tile.prototype.serialize = function () {
    return {
        position: {
            x: this.x,
            y: this.y
        },
        value: this.value
    };
};
Tile.prototype.fireIt = function (direction) {

};
Tile.prototype.isFixed= function (parent) {
    if(parent.fixTile.x==this.x&&parent.fixTile.y==this.y){
        return true;
    }
    return false;
};