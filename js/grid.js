/**
 * Created by amitkum on 18/7/15.
 */
function Grid(){
    this.grid=[];
}
Grid.prototype.addTile= function (tile,elementId) {
    this.grid.push({tile:tile,id:elementId});
    //console.log(this.grid);
};
Grid.prototype.findTileById= function (elementId) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        if(tilet.id==elementId){
            tile=tilet.tile;
        }
    });
    return tile;
};
Grid.prototype.findTileByPosition= function (position) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        tilet=tilet.tile;
        if(tilet.x==position.x&&tilet.y==position.y){
            tile=tilet;
        }
    });
    if(tile==null) console.log('nothing find');
    return tile;
};
Grid.prototype.getSplitElements=function(tile){
    //var splitValue=parseInt(Math.floor(tile.value/2));
    //console.log(this.directions(tile));
    return this.directions(tile);
};
Grid.prototype.directions= function (tile) {
    var corner=this.isCorner(tile);//corner has directions in which tiles has to be fired
    if(corner){
        return this.makeChildTiles(tile,corner);
    }
    return false;
};
Grid.prototype.makeChildTiles= function (tile,directions) {
    var tiles=[];
    var initPosition={x:tile.x,y:tile.y};
    var childValue=this.splitValue(tile.value,2);
    directions.forEach(function (direction) {
        var tile=new Tile(initPosition,childValue);
        tile.firedFrom=initPosition;
        tile.fireDirection=direction;
        tiles.push(tile);
    });
    return tiles;
};
Grid.prototype.splitValue= function (initialValue, parts) {
    return parseInt(Math.floor(initialValue/parts));
};
Grid.prototype.isCorner= function (tile) {
    if(tile.x==0&&tile.y==0){
        return [directions.right,directions.down];
    }
    if(tile.x==3&&tile.y==0){
        return [directions.left,directions.down];
    }
    if(tile.x==0&&tile.y==3){
        return [directions.right,directions.up];
    }
    if(tile.x==3&&tile.y==3){
        return [directions.left,directions.up];
    }
    return false;
};