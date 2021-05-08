import * as EMOJI from './xr-emoji.js';
import * as APP from './dinosaur-app.js';

import * as THREE from './third-party/three.js/build/three.module.js';
import {
  CanvasUI
} from './third-party/three.js/examples/jsm/CanvasUI.js'

let ui;

function build2DPanel() {

}

function buildVRPanel() {

  let renderer = APP.renderer;

  const config = {
    panelSize: {
      width: 2,
      height: 0.5
    },
    height: 128,
    body: {
      borderColor: "#ff0000",
      borderRadius: 6,
    },
    info: {
      type: "text",
      position: {
        left: 6,
        top: 6
      },
      width: 500,
      height: 58,
      backgroundColor: "#aaa",
      fontColor: "#000"
    },
    prev: {
      type: "button",
      position: {
        top: 64,
        left: 0
      },
      width: 64,
      fontColor: "#bb0",
      hover: "#ff0",
      onSelect: onPrev,
    },
    next: {
      type: "button",
      position: {
        top: 64,
        left: 128
      },
      width: 64,
      fontColor: "#bb0",
      hover: "#ff0",
      onSelect: onNext
    },
    continue: {
      type: "button",
      position: {
        top: 70,
        right: 10
      },
      width: 200,
      height: 52,
      fontColor: "#fff",
      backgroundColor: "#1bf",
      hover: "#3df",
      onSelect: onContinue
    },
    renderer
  }

  const content = {
    info: "",
    prev: "<path>M 10 32 L 54 10 L 54 54 Z</path>",
    //stop: "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>",
    next: "<path>M 54 32 L 10 10 L 10 54 Z</path>",
    continue: "Poke"
  }
  ui = new CanvasUI(content, config);
  ui.mesh.position.set(3, 2, -2);
  ui.mesh.scale.set(1, 1, 1);

  APP.AddObjectToScene(ui.mesh);

  BuildBackPane();
}

function BuildBackPane() {
  const paneConfig = {
    panelSize: {
      width: 2.5,
      height: 0.75
    },
    height: 128,
    body: {
      backgroundColor: 'rgba(0.3, 0.3, 0.6, 1.0)'
    }
  }
  const paneContent = {}

  let backPane = new CanvasUI(paneContent, paneConfig);
  backPane.mesh.position.set(3, 2, -2.1);
  backPane.mesh.scale.set(1, 1, 1);

  backPane.mesh.material.side = THREE.DoubleSide;

  APP.AddObjectToScene(backPane.mesh);
}

function SetInfoMessage(message) {
  if (ui) {
    ui.updateElement("info", message);
  }
}

function onContinue() {
  APP.scare();
}

function onPrev() {
  APP.GotoPrevStory();
}

function onNext() {
  APP.GotoNextStory();
}

export {
  buildVRPanel,
  build2DPanel,
  ui,
  SetInfoMessage
};
