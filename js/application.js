/**
 * Created by amitkum on 18/7/15.
 */
var game=null;
window.requestAnimationFrame(function () {
    game=new GameManager(4,InputManager,1,1);
});