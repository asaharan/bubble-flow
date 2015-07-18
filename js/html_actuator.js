/**
 * Created by amitkum on 18/7/15.
 */
function HTMLActuator(){
    this.gameContainer=document.querySelector('.gameContainer');
    this.gameContainerInner=document.querySelector('.gameContainerInner');
    this.tileContainer=document.querySelector('.tileContainer');
}
HTMLActuator.prototype.fireTile= function (tile,parent) {
    console.log('fired',tile);
    var init={};
    init.x=tile.x;
    init.y=tile.y;
    var nextPosition=this.findNextPosition(init,tile.fireDirection,parent);
    console.log(nextPosition);
};
HTMLActuator.prototype.findNextPosition= function (position, dir,parent) {
    var toMerge=null;
    var i=0;
    if(directions.right==dir){
        for(i=position.x+1;i<parent.size;i++){
            toMerge=parent.grid.findTileByPosition({x:i,y:position.y});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
    if(directions.down==dir){
        for(i=position.y+1;i<parent.size;i++){
            toMerge=parent.grid.findTileByPosition({x:position.x,y:i});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
    if(directions.left==dir){
        for(i=position.x-1;i>-1;i--){
            toMerge=parent.grid.findTileByPosition({x:i,y:position.y});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
    if(directions.up==dir){
        for(i=position.y;i>=-1;i--){
            toMerge=parent.grid.findTileByPosition({x:position.x,y:i});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
};
HTMLActuator.prototype.addTile= function (tile,parent) {
    var self=this;
    var wrapper=document.createElement('div');
    var inner=document.createElement('div');
    var clicker=document.createElement('div');

    inner.setAttribute('class','inner');
    inner.textContent=tile.value;
    wrapper.appendChild(inner);
    clicker.setAttribute('class','clicker')

    var position=tile.previousPosition||{x:tile.x,y:tile.y};
    var positionClass=this.positionClass(position);
    var classes=['tile','tile'+this.valueClass(tile.value),positionClass,'new'];
    this.applyClasses(wrapper,classes);

    var id=this.uniqueIdentity(parent);
    this.addIdentity(wrapper,id);
    this.addIdentity(clicker,id);

    wrapper.appendChild(clicker);

    this.tileContainer.appendChild(wrapper);
    parent.grid.addTile(tile,id);

    parent.inputManager.bindButtonPress(".clicker[data-id='"+id+"']", parent.split.bind(parent));
};
HTMLActuator.prototype.positionClass= function (position) {
    return 'tile-position-'+position.x+'-'+position.y;
};
HTMLActuator.prototype.valueClass= function (value) {
  return parseInt(Math.floor(value/100)*100);
};
HTMLActuator.prototype.addIdentity= function (element,id) {
    element.setAttribute('data-id',id.toString());
};
HTMLActuator.prototype.applyClasses=function(element,classes){
    element.setAttribute('class',classes.join(' '));
};
HTMLActuator.prototype.uniqueIdentity= function (parent) {
    parent.identity++;
    return parent.identity;
};
HTMLActuator.prototype.mergeTiles=function(firstTile,secondTile){

};
HTMLActuator.prototype.removeTile= function (tileId) {
    var self=this;
    var tileWrapper=document.querySelector(".tile[data-id='"+tileId+"']");
    console.log('tile id is '+tileId+' tileWrapper is ',tileWrapper,this.tileContainer);
    tileWrapper.remove();
    setTimeout(function () {tileWrapper.remove();},200);
};