/**
 * Created by amitkum on 18/7/15.
 */
function HTMLActuator(){
    this.events={};
    this.gameContainer=document.querySelector('.gameContainer');
    this.gameContainerInner=document.querySelector('.gameContainerInner');
    this.tileContainer=document.querySelector('.tileContainer');
    this.currentScoreContainer=document.querySelector('.currentScore');
    this.bestScoreContainer=document.querySelector('.bestScore');
    this.currentScoreUpdater=document.querySelector('.currentScoreUpdater');
}
HTMLActuator.prototype.fireTile= function (tile,parent) {
    var init={};
    init.x=tile.x;
    init.y=tile.y;
    var nextPosition=this.findNextPosition(init,tile.fireDirection,parent);
    if(nextPosition==null){
        //no one to catch so throwing tile
        this.eatUp(tile,parent);
    }else{
        var tilePresentThere=parent.grid.findTileByPosition(nextPosition);
        tile.nextValue=tile.value+tilePresentThere.value;
        this.removeTile(tilePresentThere.element_id,parent);
        this.moveTile(tile,nextPosition,parent);
    }
};
HTMLActuator.prototype.eatUp=function(tile,parent){
    this.removeTile(tile.element_id,parent);
    this.emit('fireComplete');
};
HTMLActuator.prototype.clearContainer= function () {
    this.tileContainer.textContent='';
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
        for(i=position.y-1;i>=-1;i--){
            toMerge=parent.grid.findTileByPosition({x:position.x,y:i});
            if(toMerge!=null){
                return {x:toMerge.x,y:toMerge.y};
            }
        }
        return null;
    }
};
HTMLActuator.prototype.addTile= function (tile,parent,newTile) {
    newTile= newTile== true;
    var wrapper=document.createElement('div');
    var inner=document.createElement('div');
    var clicker=document.createElement('div');

    inner.setAttribute('class','inner');
    inner.textContent=tile.value;
    wrapper.appendChild(inner);
    clicker.setAttribute('class','clicker')

    var position=tile.previousPosition||{x:tile.x,y:tile.y};
    var positionClass=this.positionClass(position);
    var classes=['tile','tile'+this.valueClass(tile.value),positionClass];
    if(newTile){
        classes.push('new');
    }
    this.applyClasses(wrapper,classes);

    var id=this.uniqueIdentity(parent);
    this.addIdentity(wrapper,id,true);
    tile.element_id=id;
    this.addIdentity(clicker,id);
    wrapper.appendChild(clicker);

    this.tileContainer.appendChild(wrapper);
    parent.grid.addTile(tile);

    parent.inputManager.bindButtonPress(".clicker[data-id='"+id+"']", parent.split.bind(parent));
};
HTMLActuator.prototype.positionClass= function (position) {
    return 'tile-position-'+position.x+'-'+position.y;
};
HTMLActuator.prototype.valueClass= function (value) {
  return parseInt(Math.floor(value/100)*100);
};
HTMLActuator.prototype.addIdentity= function (element,id,iswrapper) {

    if(iswrapper!=true){
        element.setAttribute('data-id',id.toString());
    }
    if(iswrapper){element.setAttribute('id','tile-'+id.toString())}
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
HTMLActuator.prototype.removeTile= function (tileId,parent) {
    parent.grid.removeTile(tileId);//removed from grid array here now we have to remove visible tile
    var tileWrapper=document.getElementById('tile-'+tileId);
    this.removeElement(tileWrapper);
};
HTMLActuator.prototype.removeElement= function (element) {
    window.requestAnimationFrame(function () {
        element.remove();
    })
};
HTMLActuator.prototype.moveTile= function (tile, nextPosition) {
    var tileElement=document.getElementById('tile-'+tile.element_id);
    this.updateClasses(tileElement,this.positionClass(nextPosition));
    tile.x=nextPosition.x;
    tile.y=nextPosition.y;
    tile.value=tile.nextValue;
    this.emit('fireComplete');
    this.applyValue(tile);
};
HTMLActuator.prototype.updateClasses= function (element, classToUpdate) {
    var self=this;
    var elementClassList=element.className.split(' ');
    elementClassList[2]=classToUpdate;
    window.requestAnimationFrame(function () {
        self.applyClasses(element,elementClassList);
    });
};
HTMLActuator.prototype.applyValue= function (tile) {
    var element=document.querySelector('#tile-'+tile.element_id+' > div.inner');
    element.textContent=tile.nextValue;
};

HTMLActuator.prototype.on= function (event,callback) {
    if(!this.events[event]){
        this.events[event]=[];
    }
    this.events[event].push(callback);
};
HTMLActuator.prototype.emit= function (event,data) {
    var callbacks=this.events[event];
    if(callbacks){
        callbacks.forEach(function (callback) {
            callback(data);
        })
    }
};
HTMLActuator.prototype.setCurrentScore= function (score,previousScore) {
    var self=this;
    this.currentScoreContainer.textContent=score;
    var updateScore=score-previousScore;
    if(updateScore>0&&updateScore%1===0){
        this.currentScoreUpdater.textContent='+'+updateScore;
        this.currentScoreUpdater.style.opacity=1;
        this.currentScoreUpdater.style.top='-20px';
        setTimeout(function () {
            self.currentScoreUpdater.setAttribute('style',' ');
        },300);
    }
};
HTMLActuator.prototype.setBestScore= function (score) {
    this.bestScoreContainer.textContent=score;
};