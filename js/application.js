/**
 * Created by amitkum on 18/7/15.
 */
window.requestAnimationFrame(function () {
    console.log('Page loaded');
    new GameManager(4,InputManager,1,1);
});