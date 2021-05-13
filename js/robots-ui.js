import * as EMOJI from './xr-emoji.js';
import * as APP from './dinosaur-app.js';

import * as THREE from './third-party/three.js/build/three.module.js';
import {
  GLTFLoader
} from './third-party/three.js/examples/jsm/loaders/GLTFLoader.js';
import {
  CanvasUI
} from './third-party/three.js/examples/jsm/CanvasUI.js'

let ui;
let backPane;

function build2DPanel() {
  //console.log("build2DPanel");
  //buildVRPanel();
  //var position = new THREE.Vector3(5, 2, -2);
  //UpdateUIPosition(position);
}

function buildVRPanel() {

  let renderer = APP.renderer;

  const config = {
    panelSize: {
      width: 0.5,
      height: 0.125
    },
    height: 180,
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
      backgroundColor: "#000000",
      fontColor: "#ffffff"
    },
    prev: {
      type: "button",
      position: {
        top: 64,
        left: 0
      },
      width: 64,
      fontColor: "#bb0",
      hover: "#0000ff",
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
      hover: "#0000ff",
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
      fontColor: "#000000",
      backgroundColor: "#bb0",
      hover: "#0000ff",
      onSelect: onContinue
    },
    shortButton: {
      type: "button",
      position: {
        top: 135,
        left: 10
      },
      width: 120,
      height: 52,
      fontColor: "#000000",
      backgroundColor: "#bb0",
      hover: "#0000ff",
      onSelect: onShort
    },
    mediumButton: {
      type: "button",
      position: {
        top: 135,
        left: 150
      },
      width: 170,
      height: 52,
      fontColor: "#000000",
      backgroundColor: "#bb0",
      hover: "#0000ff",
      onSelect: onMedium
    },
    tallButton: {
      type: "button",
      position: {
        top: 135,
        left: 340
      },
      width: 120,
      height: 52,
      fontColor: "#000000",
      backgroundColor: "#bb0",
      hover: "#0000ff",
      onSelect: onTall
    },
    renderer
  }

  const content = {
    info: "-----",
    prev: "<path>M 10 32 L 54 10 L 54 54 Z</path>",
    //stop: "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>",
    next: "<path>M 54 32 L 10 10 L 10 54 Z</path>",
    continue: "Poke",
    shortButton: "Short",
    mediumButton: "Average",
    tallButton: "Tall"
  }
  ui = new CanvasUI(content, config);
  ui.mesh.position.set(0, 0, 0);
  ui.mesh.scale.set(1, 1, 1);
  ui.setRotation(0, 45, 0);
  APP.AddObjectToScene(ui.mesh);

  BuildBackPane();
}

function BuildBackPane() {
  const paneConfig = {
    panelSize: {
      width: 0.55,
      height: 0.185,
    },
    height: 128,
    body: {
      backgroundColor: 'rgba(0.0, 0.0, 64, 1.0)'
    }
  }
  const paneContent = {}

  backPane = new CanvasUI(paneContent, paneConfig);
  backPane.mesh.position.set(0, -0.01, -0.025);
  backPane.mesh.scale.set(1, 1, 1);
  backPane.mesh.material.side = THREE.DoubleSide;

  loadTool(ui.mesh);

  /*
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x00214f
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.scale.set(0.55, 0.275, 0.01);
  cube.position.set(0.0, 0.0, -0.1);
  ui.mesh.add(cube);

  ui.mesh.add(backPane.mesh);
  */
}

function SetInfoMessage(message) {
  if (ui) {
    ui.updateElement("info", message);
  }
}

function ParentToHand(object) {
  if (ui) {
    UpdateUIPosition();
    object.add(ui.mesh);
  }
}

function UpdateUIPosition(position) {

    ui.mesh.position.x = ui.mesh.position.x - 0.125;
    ui.mesh.position.y = ui.mesh.position.y + 0.125;
    ui.mesh.position.z = ui.mesh.position.z;
    //ui.render();
}

function onShort() {
  APP.setCameraPosition(2.5);
}

function onMedium() {
  APP.setCameraPosition(5);
}

function onTall() {
  APP.setCameraPosition(8);
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

function loadTool(parent) {

  let _loadedPromise = new Promise((resolve) =>
  {
    let gltfLoader = new GLTFLoader();
    gltfLoader.setPath('media/models//');
    gltfLoader.load('ToolBox.glb', (gltf) =>
    {
      gltf.scene.updateMatrixWorld();
      gltf.scene.position.set(0,-0.1,-0.15);
      gltf.scene.rotation.set(0,3.14,0);
      gltf.scene.scale.set(0.001,0.001,0.001);
      parent.add(gltf.scene);
      //resolve(this);
    });
  });
}

export {
  buildVRPanel,
  build2DPanel,
  ui,
  SetInfoMessage,
  UpdateUIPosition,
  ParentToHand,
};
