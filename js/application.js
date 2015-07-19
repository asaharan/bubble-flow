/**
 * Created by amitkum on 18/7/15.
 */
var size=4;
var game;
window.requestAnimationFrame(function () {
    game=new GameManager(size,InputManager,HTMLActuator,StorageManager);
});