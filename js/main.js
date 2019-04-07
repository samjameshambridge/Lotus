import initPlayer from './playCtrl.js';
import initUi from './uiCtrl.js';

(function () {
  document.addEventListener('DOMContentLoaded', initApp);

  function initApp() {
    initUi();
    initPlayer();
  }
})()