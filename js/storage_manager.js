/**
 * Created by amitkum on 19/7/15.
 */
function StorageManager(){
    this.prefix='bubble';
    this.localStorage=window.localStorage;
}
StorageManager.prototype.set= function (what,value) {
    this.localStorage[what]=value;
};
StorageManager.prototype.get= function (what) {
    return this.localStorage[what];
};

StorageManager.prototype.bestScore= function (score) {
    var bestScoreString='bestScore';
    if(score!=null||score!=undefined){
        this.set(bestScoreString,score);
    }else{
        var bestScore= parseInt(this.get(bestScoreString));
        if(bestScore % 1 ===0){
            return bestScore;
        }
        return 0;
    }
};
StorageManager.prototype.currentScore=function(score){
    var currentScoreString='currentScore';
    if(score!=null||score!=undefined){
        this.set(currentScoreString,score);
    }else{
        var currentScore= parseInt(this.get(currentScoreString));
        if(currentScore% 1 ===0){
            return currentScore;
        }
        return 0;
    }
};