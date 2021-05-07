// Copyright 2020 Brandon Jones
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

import { XRDinosaur } from './xr-dinosaur.js';
import * as THREE from '../third-party/three.js/build/three.module.js';

export class Robot_0 extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/ankylosaurus/';
    this.buttonAtlasOffset = [0, 0];

    this.shadowNodeNames = [
      'Ankylosaurus_L_Toe0_031',
      'Ankylosaurus_R_Toe0_036',
      'Ankylosaurus_L_Hand_09',
      'Ankylosaurus_R_Hand_014',
      'Ankylosaurus_Tail03_040',
      'Ankylosaurus_Jaw_018'
    ];
    this.shadowSize = 2.5;
    this.height = 1.8;
    this.position.set(0, 0, -5);
    this.scale.set(0.01,0.01,0.01);
    this.greeting = new Array(GetGreeting() + "I'm Mimi the robot."
    ,"I can count."
    ,"1   "
    ,"2   "
    ,"3   "
    ,"4   "
    ,"The End"
  );
    this.namePlateY = 2.3;
    this.positionKF = new THREE.VectorKeyframeTrack(
      '.position',
      [0, 4, 8],
      [-0.5, 0, -5, 1.25, 0.1, -3, -0.5, 0, -5],
    );

/*    this.rotationKF = new THREE.QuaternionKeyframeTrack(
      '.quaternion',
      [0,1,2],
      [0,0,0,40,0,0,0,0,0],
    );
*/
    this.moveBlinkClip = new THREE.AnimationClip('move', -1, [
      this.positionKF,
      //this.rotationKF,
    ]);

    this._mixer = new THREE.AnimationMixer(this);
    this._currentAction = this._mixer.clipAction(this.moveBlinkClip);
    this._currentAction.play();


  }
}

export class Robot_1 extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/brachiosaurus/';
    this.buttonAtlasOffset = [0.25, 0];

    this.shadowNodeNames = [
      'Brachiosaurus_L_Toe01_032',
      'Brachiosaurus_R_Toe01_037',
      'Brachiosaurus_L_Finger0_010',
      'Brachiosaurus_R_Finger0_015'
    ];
    this.shadowSize = 2.5;
    this.height = 2;
    this.position.set(0, -0.1, -3.0);
    this.rotation.y = Math.PI * -0.2;
    var emoji = String.fromCodePoint(0x1F354)+ "     ";
    this.greeting = new Array(
      emoji,
      "Are my favorite snacks!",
      "Do you have one for me?",
      "The End");

      this.namePlateY = 2.1;

  }
}

export class Robot_2 extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/dilophosaurus/';
    this.buttonAtlasOffset = [0.0, 0.75];

    this.shadowNodeNames = [
      'Dilophosaurus_L_Toe0_037',
      'Dilophosaurus_R_Toe0_041',
      'Dilophosaurus_L_Finger0_028',
      // This critter always tends to hold his hands together, so doubling
      // up on the finger shadows makes it look too dark. As such we'll only
      // do one.
      //'Dilophosaurus_R_Finger0_033',
      'Dilophosaurus_Tail03_044',
      'Dilophosaurus_Tongue02_014'
    ];
    this.shadowSize = 1.5;

    this.height = 0.01;
    this.position.set(0, 0, -4);
    this.rotation.y = Math.PI * -0.2;
    this.greeting = new Array(
      GetGreeting(),
      "I like to tell stories. Here goes!",
      "Jack and Jill",
      "Went up the hill",
      "To fetch a bail of water",
      "Jack feel down",
      "And broke his back",
      "The End");

    this.namePlateY = 2;

    this.positionKF = new THREE.VectorKeyframeTrack(
      '.position',
      [0, 4, 8],
      [-0.5, 0, -5, 1.25, 0.1, -3, -0.5, 0, -5],
    );

/*    this.rotationKF = new THREE.QuaternionKeyframeTrack(
      '.quaternion',
      [0,1,2],
      [0,0,0,40,0,0,0,0,0],
    );
*/
    this.moveBlinkClip = new THREE.AnimationClip('move', -1, [
      this.positionKF,
      //this.rotationKF,
    ]);

    this._mixer = new THREE.AnimationMixer(this);
    this._currentAction = this._mixer.clipAction(this.moveBlinkClip);
    this._currentAction.play();

  }
}

export class Robot_3 extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/pachycephalosaurus/';
    this.buttonAtlasOffset = [0.5, 0];

    this.shadowNodeNames = [
      'Pachycephalosaurus_L_Toe01_030',
      'Pachycephalosaurus_R_Toe01_035'
    ];
    this.shadowSize = 2.0;
    this.animationSequence = ['Idle', 'Idle_2', 'Idle_3'];
    this.height = 3;
    this.position.set(0, 0, -5);
    var emoji = String.fromCodePoint(0x1F4A9)+ "     ";
    this.greeting = new Array(
      "I'm a dinosaur.",
      "I like to ",
      emoji+ "         ",
      "<sound>RobotFart.mp3    ",
      "The End");

      this.namePlateY = 3.5;

  }
}

export class Parasaurolophus extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/parasaurolophus/';
    this.buttonAtlasOffset = [0.75, 0];

    this.shadowNodeNames = [
      'Parasaurolophus_L_Toe01_032',
      'Parasaurolophus_R_Toe01_037'
    ];
    this.shadowSize = 2.0;
    this.animationSequence = ['Idle', 'Idle_2', 'Idle_3'];

    this.height = 4;
    this.position.set(1, 0, -5);
  }
}

export class Utahraptor extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/velociraptor/';
    this.buttonAtlasOffset = [0.75, 0.25];

    this.shadowNodeNames = [
      'Raptor_L_Toe01_044',
      'Raptor_R_Toe01_049',
      'Raptor_Tail03_052',
    ];
    this.shadowSize = 1.5;

    this.animationSequence = ['Idle', 'Scratch', 'Idle', 'Shake'];

    this.height = 2.0;
    this.position.set(-0.5, 0, -4);
  }
}

export class Spinosaurus extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/spinosaurus/';
    this.buttonAtlasOffset = [0.25, 0.75];

    this.shadowNodeNames = [
      'Spinosaurus_L_Toe0_035',
      'Spinosaurus_R_Toe0_039',
      'Spinosaurus_L_Hand_023',
      'Spinosaurus_R_Hand_029',
      'Spinosaurus_Tail04_043',
      'Spinosaurus_Tongue02_010'
    ];
    this.shadowSize = 2.5;

    this.animationSequence = ['Idle', 'Look_Side', 'Idle', 'Look_Back'];

    this.height = 5.5;
    this.position.set(-25, -0.2, -43.3);
    //this.rotation.y = Math.PI * -0.2;
  }
}


export class Stegosaurus extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/stegosaurus/';
    this.buttonAtlasOffset = [0, 0.25];

    this.shadowNodeNames = [
      'Stegosaurus_L_Toe01_030',
      'Stegosaurus_R_Toe01_035',
      'Stegosaurus_L_Hand_019',
      'Stegosaurus_R_Hand_024',
      'Stegosaurus_Tail03_038',
      'Stegosaurus_Jaw_08'
    ];
    this.shadowSize = 2.5;

    this.animationSequence = ['Idle', 'Idle_2', 'Idle_3'];

    this.height = 4.3;
    this.position.set(1, 0, -5);
  }
}

export class Triceratops extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/triceratops/';
    this.buttonAtlasOffset = [0.25, 0.25];

    this.shadowNodeNames = [
      'Triceratops_L_Toe0_038',
      'Triceratops_R_Toe0_042',
      'Triceratops_L_Hand_023',
      'Triceratops_R_Hand_028',
      'Triceratops_Tail03_032',
      'Triceratops_Jaw_06'
    ];
    this.shadowSize = 2.0;

    this.animationSequence = ['Idle', 'Look_Back', 'Idle', 'Look_Side'];

    this.height = 2.8;
    this.position.set(0.5, 0, -3.5);
  }
}

export class Tyrannosaurus extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/tyrannosaurus/';
    this.buttonAtlasOffset = [0.5, 0.25];

    this.shadowNodeNames = [
      'TRex_L_Toe01_038',
      'TRex_R_Toe01_044',
      'TRex_Tail03_048'
    ];
    this.shadowSize = 4.0;

    this.animationSequence = ['Idle', 'Look_Back', 'Idle', 'Look_Side', 'Idle', 'Stomp'];

    this.height = 5;
    this.position.set(0, 0, -7);
  }
}


export let AllDinosaurs =
{
  robot_0: new Robot_0(),
  robot_1: new Robot_1(),
  robot_2: new Robot_2(),
  robot_3: new Robot_3(),
  parasaurolophus: new Parasaurolophus(),
  raptor: new Utahraptor(),
  spinosaurus: new Spinosaurus(),
  stegosaurus: new Stegosaurus(),
  triceratops: new Triceratops(),
  trex: new Tyrannosaurus(),

};

function GetGreeting()
{

  var day = new Date();
  var hr = day.getHours();

  var greetingString = "";

  if (hr == 1) {
    greetingString = "Good morning! 1AM and still your going! ";
  }
  if (hr == 2) {
    greetingString = "Hey, it is past 2AM! The bars must be closed! ";
  }
  if (hr == 3) {
    greetingString = "Hey, it is after 3AM! Are you a vampire or what? ";
  }
  if (hr == 4) {
    greetingString = "4AM? You must roam all night huh! ";
  }
  if (hr == 5) {
    greetingString = "Whoa! It's almost daylight and your still going! ";
  }
  if (hr == 6) {
    greetingString = "Hey, isn't it too early to be using your computer. ";
  }
  if ((hr == 6) || (hr == 7) || (hr == 8) || (hr == 9) || (hr == 10)) {
    greetingString = "Good Morning! ";
  }
  if (hr == 11) {
    greetingString = "11AM... Is it time for lunch yet? ";
  }
  if (hr == 12) {
    greetingString = "NOON! Great, it must be time for lunch! ";
  }
  if (hr == 14) {
    greetingString = "It's 2PM. Have you eaten lunch yet? ";
  }
  if ((hr == 15) || (hr == 16) || (hr == 13)) {
    greetingString = "Good Afternoon! ";
  }
  if ((hr == 17) || (hr == 18) || (hr == 19) || (hr == 20) || (hr == 21) || (hr == 22)) {
    greetingString = "Good Evening! Welcome to prime time on the web! ";
  }
  if (hr == 23) {
    greetingString = "It's almost midnight...Aren't you sleepy yet? ";
  }
  if (hr==0) {
    greetingString = "It's midnight... do you ever sleep? ";
  }


  return greetingString;

}
