// Copyright 2019 Brandon Jones
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
  PenEnvironment
} from './pen-environment.js';
import {
  XRButtonManager
} from './xr-button.js';
import {
  XRDinosaurLoader
} from './dinosaurs/xr-dinosaur-loader.js';
import {
  XRInputCursorManager
} from './xr-input-cursor.js';
import {
  XRInputRay
} from './xr-input-ray.js';
import {
  XRLocomotionManager
} from './xr-teleport.js';
import * as EMOJI from './xr-emoji.js';
import * as UI from './robots-ui.js';

import {
  XRLighting
} from './xr-lighting.js';
//import { XRStats } from './xr-stats.js';

// Third Party Imports
import * as THREE from './third-party/three.js/build/three.module.js';
import {
  DRACOLoader
} from './third-party/three.js/examples/jsm/loaders/DRACOLoader.js';
import {
  GLTFLoader
} from './third-party/three.js/examples/jsm/loaders/GLTFLoader.js';
import {
  OrbitControls
} from './third-party/three.js/examples/jsm/controls/OrbitControls.js';
import {
  XRControllerModelFactory
} from './third-party/three.js/examples/jsm/webxr/XRControllerModelFactory.js';
import {
  CanvasUI
} from './third-party/three.js/examples/jsm/CanvasUI.js'

// VR Button Layout
const ROW_LENGTH = 5;
const BUTTON_SPACING = 0.25;
const LEFT_BUTTON_X = (BUTTON_SPACING * (ROW_LENGTH - 1) * -0.5);

const HORN_BUTTON_POSITION = new THREE.Vector3(0.75, 0, 0);
const UP_BUTTON_POSITION = new THREE.Vector3(-0.75, 0, -BUTTON_SPACING * 0.5);
const DOWN_BUTTON_POSITION = new THREE.Vector3(-0.75, 0, BUTTON_SPACING * 0.5);

const IDEAL_RELATIVE_BUTTON_HEIGHT = -0.6;
const MIN_BUTTON_HEIGHT = 0.3;
const MAX_BUTTON_HEIGHT = 1.1;
const BUTTON_HEIGHT_DEADZONE = 0.15;
const CAPTION_TIMEOUT_PER_CHARACTER = 100;
const CAPTION_TIMEOUT_PER_CHARACTER_VR = 150;
const CAPTION_VR_LABEL_SIZE = 65;
const CAPTION_VR_LABEL_SCALE = 0.075;

let caption_timeout = null;
let preloadPromise, appRunning = false;
let stats, controls;
let camera, cameraGroup, scene, renderer;
let viewerProxy;
let gltfLoader;
let xrDinosaurLoader, xrDinosaur;
let cursorManager;
let environment;
let controllers = [];
let buttonManager, buttonGroup, targetButtonGroupHeight;
let xrSession, xrMode;
let xrControllerModelFactory;
let placementMode = false;
let dinosaurScale = 1;
let hitTestSource;
let xrLighting;
let stateCallback = null;
let caption = null;
let StoryIndex = 0;
let RobotStoriesArray = new Array("robot_0", "robot_1", "robot_2", "robot_3");
let mountedUIToHand = false;

let textureLoader = new THREE.TextureLoader();
let audioLoader = new THREE.AudioLoader();
let clock = new THREE.Clock();
let listener = new THREE.AudioListener();
let ambientSounds, hornSound, fileSound

let locomotionManager;

function initControllers() {
  if (controllers.length) {
    return;
  }

  // VR controller trackings
  let inputRay = new XRInputRay();
  inputRay.scale.z = 2;

  function buildController(index) {
    let targetRay = renderer.xr.getController(index);
    let grip = renderer.xr.getControllerGrip(index);
    let model = xrControllerModelFactory.createControllerModel(grip);

    const rayMesh = inputRay.clone();
    targetRay.add(rayMesh);
    targetRay.rayMesh = rayMesh;

    targetRay.addEventListener('connected', (event) => {
      console.log(`Controller connected: ${event.data.profiles}`);
      const xrInputSource = event.data;
      grip.visible = xrInputSource !== 'gaze';
      targetRay.visible = xrInputSource !== 'gaze';
      buttonManager.addController(targetRay);
    });

    targetRay.addEventListener('disconnected', (event) => {
      if (event.data) {
        console.log(`Controller disconnected: ${event.data.profiles}`);
      }
      grip.visible = false;
      targetRay.visible = false;
      buttonManager.removeController(targetRay);
    });

    grip.add(model);

    locomotionManager.watchController(targetRay);
    locomotionManager.add(targetRay);
    locomotionManager.add(grip);
    model.setEnvironmentMap(xrLighting.envMap);
    return {
      targetRay,
      grip,
      model
    };
  }

  controllers.push(buildController(0), buildController(1));
}

export function SetStateChangeCallback(callback) {
  stateCallback = callback;
}

function OnAppStateChange(state) {
  if (stateCallback) {
    stateCallback(state);
  }
}

function isValidDestination(dest) {
  // Does a really simple bounds check to ensure users can't teleport beyond the inner fence.
  return (dest.x > -25.5 && dest.x < 26 && dest.z > -35 && dest.z < 16.5);
}

function onStartSelectDestination(controller) {
  controller.rayMesh.visible = false;
}

function onEndSelectDestination(controller) {
  controller.rayMesh.visible = true;
}

export function AddObjectToScene(obj) {
  scene.add(obj);
}

let loadingDiv = document.getElementById('loadingDiv');

function LoadingDivVisible(show) {
  if(show){
    loadingDiv.style.display = 'block';
  }else{
    loadingDiv.style.display = 'none';
  }
}

export function PreloadDinosaurApp(debug = false) {

  LoadingDivVisible(true);

  if (preloadPromise) {
    return preloadPromise;
  }

  scene = new THREE.Scene();

  gltfLoader = new GLTFLoader();
  let dracoLoader = new DRACOLoader();
  dracoLoader.setWorkerLimit(1);
  dracoLoader.setDecoderPath('js/third-party/three.js/examples/js/libs/draco/gltf/');
  gltfLoader.setDRACOLoader(dracoLoader);

  xrDinosaurLoader = new XRDinosaurLoader(gltfLoader);

  xrControllerModelFactory = new XRControllerModelFactory(gltfLoader);

  environment = new PenEnvironment(gltfLoader);

  environment.loaded.then(() => {
    //renderer.compileTarget(scene, environment, () => {
    scene.add(environment);
    //});
  });

  buttonManager = new XRButtonManager();
  buttonGroup = new THREE.Group();

  cursorManager = new XRInputCursorManager();
  scene.add(cursorManager);
  cursorManager.addCollider(buttonGroup);

  locomotionManager = new XRLocomotionManager({
    targetTexture: textureLoader.load('media/textures/teleport-target.png'),
    validDestinationCallback: isValidDestination,
    startSelectDestinationCallback: onStartSelectDestination,
    endSelectDestinationCallback: onEndSelectDestination,
    navigationMeshes: environment.navigationMeshes
  });
  environment.add(locomotionManager);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
  camera.position.set(0, 0, 5.0);
  camera.add(listener);
  locomotionManager.add(camera);

  viewerProxy = new THREE.Object3D();
  camera.add(viewerProxy);

  // Try to create a WebGL 2 context if we can, otherwise fall back to WebGL.
  let canvas = document.createElement('canvas');
  let gl = null;
  for (let contextType of ['webgl2', 'webgl', 'experimental-webgl']) {
    gl = canvas.getContext(contextType, {
      antialias: true,
      xrCompatible: true
    });
    if (gl) break;
  }

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    context: gl
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.xr.enabled = true;
  renderer.shadowMap.enabled = true;

  animate();

  // This is useful when debugging, but can cause massive blocking operations
  // on the main thread so turn it off for "real" work.
  //renderer.debug.checkShaderErrors = debugEnabled;

  xrLighting = new XRLighting(renderer);
  scene.add(xrLighting);

  window.addEventListener('resize', onWindowResize, false);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, -4);
  controls.update();

  renderer.xr.addEventListener('sessionstart', async () => {
    initControllers();
    if (xrMode == 'immersive-ar') {
      // Stop rendering the environment in AR mode
      scene.background = null;
      environment.visible = false;
      buttonGroup.visible = false;

      // Lighting estimation experiement
      xrLighting.xrSession = xrSession;

      if ('requestHitTestSource' in xrSession) {
        placementMode = true;
        buttonManager.active = false;

        xrSession.addEventListener('select', () => {
          if (xrDinosaur) {
            placementMode = false;
            xrDinosaur.visible = true;
          }
        });

        let viewerSpace = await xrSession.requestReferenceSpace('viewer');
        hitTestSource = await xrSession.requestHitTestSource({
          space: viewerSpace
        });
      }
    } else {
      buttonManager.active = true;

      // Load and play ambient jungle sounds once the user enters VR.
      if (!ambientSounds) {
        ambientSounds = new THREE.Audio(listener);
        audioLoader.load('media/sounds/jungle-ambient.mp3', (buffer) => {
          ambientSounds.setBuffer(buffer);
          ambientSounds.setLoop(true);
          ambientSounds.setVolume(0.5);
          ambientSounds.play();
        });
      } else {
        ambientSounds.play();
      }
    }

    OnAppStateChange({
      xrSessionStarted: true
    });
  });

  renderer.xr.addEventListener('sessionend', () => {
    xrSession = null;
    xrMode = null;
    hitTestSource = null;
    placementMode = false;

    xrLighting.xrSession = null;

    if (xrDinosaur) {
      xrDinosaur.visible = true;
    }

    // Stop ambient jungle sounds once the user exits VR.
    if (ambientSounds) {
      ambientSounds.stop();
    }

    environment.visible = debugSettings.drawEnvironment;

    OnAppStateChange({
      xrSessionEnded: true
    });
  });


  xrLighting.addEventListener('envmapchange', () => {
    // When exiting AR mode we need to re-enable the environment rendering
    if (xrMode != 'immersive-ar' && debugSettings.drawSkybox) {
      scene.background = xrLighting.envMap;
    } else {
      scene.background = null;
    }

    if (xrDinosaur) {
      xrDinosaur.envMap = xrLighting.envMap;
    }

    for (let controller of controllers) {
      controller.model.setEnvironmentMap(xrLighting.envMap);
    }
  });


  preloadPromise = xrLighting.loadHDRSkybox('media/textures/equirectangular/misty_pines_2k.hdr');
  return preloadPromise;
}

function setCameraPosition(positionY) {

  //camera.position.set(0, 5.0, 5.0);
  var locationToMoveTo = new THREE.Vector3(0, positionY, 5.0);
  var duration = 1.5;

  TWEEN.removeAll();
  var tween = new TWEEN.Tween(camera.position)
    .to(locationToMoveTo, duration)
    .start()
    .end()
    requestAnimationFrame(animate);
}

export function RunDinosaurApp(container, options = {}) {
  if (!appRunning) {
    // Ensure the app content has been loaded (will early terminate if already
    // called).
    PreloadDinosaurApp();

    // Attach the main WebGL canvas and supporting UI to the page
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);

    // Start the render loop
    renderer.setAnimationLoop(render);

    renderer._xrDirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.88);
    scene.add(renderer._xrDirectionalLight);
    renderer.castShadow = true;
    renderer._xrDirectionalLight.position.set(5, 20, -10);

    const color = 0xFFFFFF;
    const skyColor = 0xB1E1FF; // light blue
    const groundColor = 0xB97A20; // brownish orange
    const intensity = 0.33;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    //if (options.xrSessionMode === 'immersive-VR') {
    UI.buildVRPanel();
    //}else{
    //UI.build2DPanel();
    //}
    appRunning = true;
  }

  // If the app was requested to start up immediately into a given XR session
  // mode, do so now.
  dinosaurScale = 1;

  if (options.xrSessionMode) {
    if (options.xrSessionMode === 'immersive-ar' && options.arScale) {
      dinosaurScale = options.arScale;
    }
    StartXRSession(options.xrSessionMode);
  }

  loadModel(RobotStoriesArray[StoryIndex]);

  //if (options.dinosaur) {
  //loadModel(options.dinosaur);
  //}
}

export function EndXRSession() {
  if (xrSession) {
    xrSession.end();
  }
}

function StartXRSession(mode) {
  if (xrSession && xrMode == mode) {
    return;
  }

  let referenceSpace = mode == 'immersive-ar' ? 'local' : 'local-floor';

  let sessionOptions = {
    requiredFeatures: [referenceSpace]
  };
  if (mode === 'immersive-ar') {
    sessionOptions.requiredFeatures.push('hit-test');
    /*sessionOptions.optionalFeatures = ['dom-overlay'],
    sessionOptions.domOverlay = { root: document.body };*/
  }

  navigator.xr.requestSession(mode, sessionOptions).then(async (session) => {
    xrSession = session;
    xrMode = mode;
    renderer.xr.setReferenceSpaceType(referenceSpace);
    renderer.xr.setSession(session);
  });

}

function makeNamePlate(size, name) {
  const borderSize = 10;

  let canvas = document.createElement('canvas');
  canvas.id = "nameplate";
  canvas.width = 768;
  canvas.height = 64;

  const context = document.createElement('canvas').getContext('2d');

  const font = `${size}px bold sans-serif`;

  context.font = font;

  // measure how long the name will be
  const textWidth = context.measureText(name).width;
  const doubleBorderSize = borderSize * 2;

  const width = (textWidth + doubleBorderSize);
  const height = (size + doubleBorderSize);

  context.canvas.width = width;
  context.canvas.height = height;

  // need to set font again after resizing canvas
  context.font = font;
  context.textBaseline = 'middle';
  context.textAlign = 'center';

  // Set rectangle and corner values
  var rectX = 0;
  var rectY = 0;
  var rectWidth = width;
  var rectHeight = height;
  var cornerRadius = 40;


  // Set faux rounded corners
  context.lineJoin = "round";
  context.lineWidth = cornerRadius;
  context.fillStyle = 'black';

  // Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
  context.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - cornerRadius, rectHeight - cornerRadius);
  context.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2), rectWidth - cornerRadius, rectHeight - cornerRadius);

  //context.fillRect(0, 0, width, height);
  // scale to fit but don't stretch
  const scaleFactor = Math.min(1, textWidth);
  context.translate(width / 2, height / 2);
  context.scale(1, 1);
  context.fillStyle = 'white';
  context.fillText(name, 0, 0);

  return context.canvas;
}

function PlayAnimation(name) {
  currentDinosaur._currentAction.stop();
  var clip = eval("currentDinosaur." + name + "Clip");
  currentDinosaur._currentAction = currentDinosaur._mixer.clipAction(clip);
  currentDinosaur._currentAction.loop = THREE.LoopOnce;
  currentDinosaur._currentAction.play();
}

function MoveTo(locationAndTime) {
  currentDinosaur._currentAction.stop();

  var array = locationAndTime.split(",");
  var locationToMoveTo = new THREE.Vector3(array[0], array[1], array[2]);
  var duration = array[4];

  TWEEN.removeAll();
  var tween = new TWEEN.Tween(currentDinosaur.position)
    .to(locationToMoveTo, duration)
    .onUpdate(function() {
      //console.log(currentDinosaur.position);
    })
    //.easing(TWEEN.Easing.Elastic.InOut)
    .start()
    .end()
    requestAnimationFrame(animate);
}

function CheckGreetingForMove(message) {
  var stringMessage = message;
  var string = stringMessage.substring(0, 6);

  if (string == "<Move>") {
    var moveTo = message.split('<Move>');
    MoveTo(moveTo[1]);
    return true;

  } else {
    return false;
  }
}

function CheckGreetingForAnimation(message) {
  var stringMessage = message;
  var string = stringMessage.substring(0, 11);

  if (string == "<Animation>") {
    var animationToPlay = message.split('<Animation>');
    PlayAnimation(animationToPlay[1]);
    return true;

  } else {
    return false;
  }
}

function CheckGreetingForSounds(message) {

  var stringMessage = message;
  var string = stringMessage.substring(0, 7);

  if (string == "<Sound>") {
    var soundToPlay = message.split('<Sound>');
    PlaySound(soundToPlay[1]);
    return true;

  } else {
    return false;
  }

}

function PlaySound(file) {
  //alert(file);
  fileSound = new THREE.Audio(listener);
  audioLoader.load('media/sounds/' + file, (buffer) => {
    fileSound = new THREE.Audio(listener);
    fileSound.setBuffer(buffer);
    fileSound.setVolume(1.0);
    fileSound.play();
  });

}

function showCaption(message) {

  clearTimeout(caption_timeout);

  var stringMessage = message;
  var string = stringMessage.substring(0, 8);

  var hasSound = CheckGreetingForSounds(message);
  var hasAnimation = CheckGreetingForAnimation(message);
  var hasMove = CheckGreetingForMove(message);

  if (hasSound || hasAnimation || hasMove) {} else {
    if (string != "<Silent>") {
      if ('speechSynthesis' in window) {
        // Speech Synthesis supported 🎉
        var msg = new SpeechSynthesisUtterance();
        msg.text = message;
        window.speechSynthesis.speak(msg);
      }
    } else {
      stringMessage = stringMessage.split('<Silent>')[1];
    }

    var canvas = makeNamePlate(CAPTION_VR_LABEL_SIZE, stringMessage);
    var texture = new THREE.CanvasTexture(canvas);
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    var labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    var label = new THREE.Sprite(labelMaterial);
    xrDinosaur.add(label);
    label.position.y = xrDinosaur.namePlateY;
    const textWidth = stringMessage.length * CAPTION_VR_LABEL_SCALE;

    label.scale.set(textWidth, 0.33, 1);
    caption = label;

  }

  if (hasSound || hasAnimation) {
    caption_timeout = setTimeout(DestroyCaption, 0);
  } else {
    caption_timeout = setTimeout(DestroyCaption, stringMessage.length * CAPTION_TIMEOUT_PER_CHARACTER_VR);
  }

}

function DestroyCaption() {
  clearTimeout(caption_timeout);
  if (caption) {
    caption.scale.set(0, 0, 0);
    scene.remove(caption);
  }

  currentDinosaurIndex++;

  if (currentDinosaurIndex < currentDinosaur.greeting.length) {
    showCaption(currentDinosaur.greeting[currentDinosaurIndex]);
  } else {
    GotoNextStory()
  }
}

function GotoNextStory() {
  clearTimeout(caption_timeout);
  currentDinosaurIndex = 0;
  StoryIndex++;

  if (StoryIndex >= RobotStoriesArray.length) {
    StoryIndex = 0;
  }

  loadModel(RobotStoriesArray[StoryIndex]);
}

function GotoPrevStory() {
  clearTimeout(caption_timeout);
  currentDinosaurIndex = 0;
  StoryIndex--;

  if (StoryIndex == 0) {
    StoryIndex = RobotStoriesArray.length;
  }

  loadModel(RobotStoriesArray[StoryIndex]);
}

var currentDinosaur = null;
var currentDinosaurIndex = 0;

function loadModel(key) {

  LoadingDivVisible(true);

  if (xrDinosaur) {
    scene.remove(xrDinosaur);
    xrDinosaur = null;
  }

  setCameraPosition(5);

  UI.SetInfoMessage("Intoducing, " + key);

  return xrDinosaurLoader.load(key).then((dinosaur) => {
    if (dinosaur != xrDinosaurLoader.currentDinosaur) {
      return;
    }

    if (xrDinosaur) {
      scene.remove(xrDinosaur);
      xrDinosaur = null;
    }

    xrDinosaur = dinosaur;
    //xrDinosaur.envMap = xrLighting.envMap;
    xrDinosaur.scale.setScalar(dinosaurScale, dinosaurScale, dinosaurScale);
    currentDinosaur = xrDinosaur;
    currentDinosaurIndex = 0;

    if (xrDinosaur.greeting.length > 0) {
      caption_timeout = setTimeout(showCaption, 1500, xrDinosaur.greeting[currentDinosaurIndex]);
    }

    // Ensure the dinosaur's shaders are ready to use before we add it to the
    // scene.
    //renderer.compileTarget(scene, xrDinosaur, () => {
    scene.add(xrDinosaur);
    //});

    controls.target.copy(xrDinosaur.center);
    controls.update();

    LoadingDivVisible(false);

    OnAppStateChange({
      dinosaur: key
    });
  }).catch((err) => {
    // This will usually happen if a new dino is selected before the
    // previous one finishes loading. Not a cause for concern.
    console.log(err);
  });
}

function scare() {

  UI.SetInfoMessage("Poked that robot!");

  if (!hornSound) {
    audioLoader.load('media/sounds/horn.mp3', (buffer) => {
      hornSound = new THREE.Audio(listener);
      hornSound.setBuffer(buffer);
      scare();
    });
  } else {
    hornSound.play();
    if (xrDinosaur) {
      xrDinosaur.scare();
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(time, xrFrame) {

  let delta = clock.getDelta();
  if (xrDinosaur) {
    if (placementMode && hitTestSource) {
      let pose = null;
      let hitTestResults = xrFrame.getHitTestResults(hitTestSource);
      if (hitTestResults.length > 0) {
        pose = hitTestResults[0].getPose(renderer.xr.getReferenceSpace());
      }

      if (pose) {
        xrDinosaur.visible = true;
        xrDinosaur.position.copy(pose.transform.position);
      } else {
        xrDinosaur.visible = false;
      }
    }
    xrDinosaur.update(delta);
  }

  if (UI.ui && renderer.xr.isPresenting) UI.ui.update();

  if (controllers[1] != undefined && mountedUIToHand == false) {
    mountedUIToHand = true;
    UI.ParentToHand(controllers[1].grip);

    //let leftHandPosition = viewerProxy.getWorldPosition(controllers[1].grip.position);
    //UI.UpdateUIPosition(viewerProxy);
  }

  if (xrMode != 'immersive-ar') {
    //environment.update(delta);

    // Update the button height to always stay within a reasonable range of the user's head
    if (renderer.xr.isPresenting && buttonGroup) {
      /*
      let worldPosition = new THREE.Vector3();
      viewerProxy.getWorldPosition(worldPosition);

      let idealPosition = Math.max(MIN_BUTTON_HEIGHT,
      Math.min(MAX_BUTTON_HEIGHT,
      (worldPosition.y - environment.platform.position.y) + IDEAL_RELATIVE_BUTTON_HEIGHT));
      if (Math.abs(idealPosition - buttonGroup.position.y) > BUTTON_HEIGHT_DEADZONE) {
      targetButtonGroupHeight = idealPosition;

      // Ease into the target position
      //buttonGroup.position.y += (targetButtonGroupHeight - buttonGroup.position.y) * 0.05;
      */
    }

    buttonManager.update(delta);

    locomotionManager.teleportGuide.options.groundHeight = environment.platformHeight;
  }

  if (controllers.length) {
    cursorManager.update([controllers[0].targetRay, controllers[1].targetRay]);
  }

  locomotionManager.update(renderer, camera);
  renderer.render(scene, camera);

}

// animate
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    render();
}

export {
  renderer,
  GotoNextStory,
  GotoPrevStory,
  scare,
  PlayAnimation,
  scene,
  camera,
  setCameraPosition,
};
