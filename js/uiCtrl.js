const brand = document.querySelector("#brand"),
  navbar = document.querySelector("nav"),
  song = document.querySelector("audio"),
  volumeIcon = document.querySelector("nav i"),
  volumeBar = document.querySelector("input[type=range]");

const uiCtrl = {
  toggleModal: function(bool) {
    const modal = document.querySelector(".modal"),
      app = document.querySelector(".app");

    //an arbitary parameter to differentiate between the outcomes
    if (bool) {
      modal.style.display = "flex";
      app.style.background = "black";
      app.style.opacity = "0.7";
      navbar.style.display = "none";
    } else {
      modal.style.display = "none";
      app.style.background = "none";
      app.style.opacity = "1";
      navbar.style.display = "inherit";
    }
  },

  modalHandler: function() {
    const modalGithub = document.querySelector("#github-btn"),
      modalCross = document.querySelector(".modal i"),
      returnButton = document.querySelector("#return-btn");

    this.toggleModal(true);

    modalCross.addEventListener("click", () => {
      uiCtrl.toggleModal();
    });

    returnButton.addEventListener("click", () => {
      uiCtrl.toggleModal();
    });

    modalGithub.addEventListener("click", () => {
      window.open("https://www.github.com/samjameshambridge", "_blank");
    });
  },

  navListeners: function() {
    let mouseOver = true;

    let navbarTimer = setTimeout(() => {
      // on opening the app, wait 4 seconds and then move the nav out of sight
      mouseOver = false;
      this.navMover(mouseOver);
    }, 4000);

    navbar.addEventListener("mouseenter", () => {
      mouseOver = true;
      this.navMover(mouseOver);
      clearTimeout(navbarTimer);
    });

    navbar.addEventListener("mouseleave", () => {
      mouseOver = false;
      navbarTimer = window.setTimeout(() => {
        this.navMover(mouseOver);
      }, 2000);
    });

    brand.addEventListener("click", () => {
      uiCtrl.modalHandler();
    });
  },

  navMover: function(mouseOver) {
    const navContainer = document.querySelector(".nav-container"),
      overlay = document.querySelector(".overlay");

    if (!mouseOver) {
      // this corresponds to the CSS media queries which change the navContainers width
      window.innerWidth < 768
        ? (navContainer.style.transform = "translateX(-33vw)")
        : (navContainer.style.transform = "translateX(-20vw)");
      overlay.style.opacity = "0";
    } else if (mouseOver) {
      overlay.style.opacity = "0.7";
      navContainer.style.transform = "translateX(0)";
    }
  },

  volCtrl: function() {
    song.volume = volumeBar.value / 100;

    this.volIconCheck(volumeBar.value);

    volumeIcon.addEventListener("click", () => {
      if (!parseInt(volumeBar.value)) {
        // volumeBar value is returned as a string, hence if the integer (volumeBar) is falsey
        volumeBar.value = 50;
        song.volume = volumeBar.value / 100;
        uiCtrl.volIconCheck(song.volume);
      } else {
        song.volume = volumeBar.value = 0;
        uiCtrl.volIconCheck(song.volume);
      }
    });

    volumeBar.addEventListener("mouseup", () => {
      song.volume = volumeBar.value / 100;
      this.volIconCheck(song.volume);
    });
  },

  volIconCheck: function(volume) {
    if (volume == 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 0.4) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  }
};

export default function initUi() {
  uiCtrl.navListeners();
  uiCtrl.volCtrl();
}
