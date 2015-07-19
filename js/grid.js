/**
 * Created by amitkum on 18/7/15.
 */
function Grid(){
    this.grid=[];
}
Grid.prototype.clearContainer= function () {
    this.grid=[];
};
Grid.prototype.addTile= function (tile) {
    this.grid.push(tile);
};
Grid.prototype.removeTile= function (id) {
    var newGrid=[];
    this.grid.forEach(function (tile) {
        if(tile.element_id!=id){
            newGrid.push(tile);
        }
    });
    this.grid=[];
    this.grid=newGrid.slice();
};
Grid.prototype.findTileById= function (elementId) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        if(tilet.element_id==elementId){
            tile=tilet;
        }
    });
    return tile;
};
Grid.prototype.findTileByPosition= function (position) {
    var tile=null;
    this.grid.forEach(function (tilet) {
        if(tilet.x==position.x&&tilet.y==position.y){
            tile=tilet;
        }
    });
    return tile;
};
Grid.prototype.getSplitElements=function(tile){
    return this.directions(tile);
};
Grid.prototype.directions= function (tile) {
    var corner=this.isCorner(tile);//corner has directions in which tiles has to be fired
    if(corner){
        return this.makeChildTiles(tile,corner);
    }
    var center=this.isCenter(tile);
    if(center){
        return this.makeChildTiles(tile,center);
    }
    var edge=this.isEdge(tile);
    if(edge){
        return this.makeChildTiles(tile,edge);
    }
    return false;
};
Grid.prototype.makeChildTiles= function (tile,directions) {//tiles to be fired
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
    if(tile.x==size-1&&tile.y==0){
        return [directions.left,directions.down];
    }
    if(tile.x==0&&tile.y==size-1){
        return [directions.right,directions.up];
    }
    if(tile.x==size-1&&tile.y==size-1){
        return [directions.left,directions.up];
    }
    return false;
};
Grid.prototype.isCenter=function(tile){
    if(tile.x>0&&tile.x<size-1&&tile.y>0&&tile.y<size-1){
        return [directions.up,directions.right,directions.down,directions.left];
    }
    return false;
};
Grid.prototype.isEdge= function (tile) {
    if(tile.x==0&&(tile.y>0&&tile.y<size-1)){//left edge
        return [directions.up,directions.right,directions.down];
    }
    if(tile.x==size-1&&(tile.y>0&&tile.y<size-1)){//right edge
        return [directions.up,directions.down,directions.left];
    }
    if(tile.y==0&&(tile.x>0&&tile.x<size-1)){//top edge
        return [directions.right,directions.down,directions.left];
    }
    if(tile.y==size-1&&(tile.x>0&&tile.x<size-1)){//bottom edge
        return [directions.up, directions.right, directions.left];
    }
};
Grid.prototype.currentScore= function (parent) {
    var currentScore=0;
    this.grid.forEach(function (tile) {
        if(tile.isFixed(parent)){
            currentScore=tile.value;
        }
    });
    return currentScore;
};
Grid.prototype.isGameOver= function (parent) {
    var fixTile=parent.fixTile;
    console.log(fixTile);
    var i,count=0;
    for(i=0;i<size;i++){
        if(this.findTileByPosition({x:i,y:fixTile.y})!=null){
            count++;
        }
        if(this.findTileByPosition({x:fixTile.x,y:i})!=null){
            count++;
        }
        if(count>2){
            return false;
        }
    }
    return true;

};