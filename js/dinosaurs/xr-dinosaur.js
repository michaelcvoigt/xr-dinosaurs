import * as APP from '../dinosaur-app.js';

import * as THREE from '../third-party/three.js/build/three.module.js';

const DEFAULT_POSITION = [0, 0, -3];
const DEFAULT_ORIENTATION = Math.PI * 0.2;
const DEFAULT_HEIGHT = 3;
const DEFAULT_ANIMATION_SEQUENCE = ['Idle'];


export class XRDinosaur extends THREE.Object3D {
  constructor() {
    super();

    this._scared = false;
    this._center = new THREE.Vector3();
    this._mixer = new THREE.AnimationMixer(this);
    this._actions = {};
    this._currentAction = null;
    this._envMap = null;

    // Classes that extend XRDinosaur should override these values
    this.path = '';
    this.file = 'compressed.glb';
    this.animationSequence = DEFAULT_ANIMATION_SEQUENCE;
    this.buttonAtlasOffset = [0, 0];

    this.height = DEFAULT_HEIGHT;
    this.position.fromArray(DEFAULT_POSITION);
    this.rotation.y = DEFAULT_ORIENTATION;
    this.greeting = "";

    this.castShadow = true;
    this.receiveShadow = true;

  }


  set animations(animations)
  {

    //const mixer = new AnimationMixer(this);
    //const action = mixer.clipAction(moveBlinkClip);

    /*
    // Process animations into clips
    for (let i = 0; i < animations.length; ++i) {
      let animation = animations[i];
      let action = this._mixer.clipAction(animation);
      this._actions[animation.name] = action;

      if (animation.name == 'Die' || animation.name == 'Get_Up')
      {
        action.loop = THREE.LoopOnce;
      }
    }


    if(animations.length >0)
    {
    // Set up the animation sequence
    let animationIndex = 0;
    let animationSequence = this.animationSequence;

alert(animationSequence[0]);

    this._currentAction = this._actions[animationSequence[0]];
    this._currentAction.play();

    let nextAnimation = (e) =>
    {
      if (e.action == this._actions.Die) {
        this._mixer.stopAllAction();
        this._scared = false;
        this._currentAction = this._actions.Get_Up;
        this._currentAction.play();
      } else if (!this._scared) {
        this._mixer.stopAllAction();
        animationIndex = ++animationIndex % animationSequence.length;
        this._currentAction = this._actions[animationSequence[animationIndex]];
        this._currentAction.play();
      }
    }
    this._mixer.addEventListener('loop', nextAnimation);
    this._mixer.addEventListener('finished', nextAnimation);

    }
    */
  }

  set envMap(value)
  {
    this._envMap = value;
    this.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = value;
        child.material.needsUpdate = true;
      }
    });
  }

  scare() {
    if (this._scared) { return; }

    this._scared = true;

    APP.PlayAnimation("bounce");

  }

  update(delta) {
    if (this._mixer) {
      this._mixer.update(delta);
    }
  }

  get center() {
    let bbox = new THREE.Box3().setFromObject(this);
    bbox.getCenter(this._center);
    return this._center;
  }
}
