import { XRDinosaur } from './xr-dinosaur.js';
import * as THREE from '../third-party/three.js/build/three.module.js';
import * as ANIMATIONS from './all-animations.js';
import * as EMOJI from '../xr-emoji.js';

export class Robot_0 extends XRDinosaur
{
  constructor() {
    super();

    this.path = 'media/models/ankylosaurus/';
    this.buttonAtlasOffset = [0, 0];
    this.height = 1.8;
    this.position.set(0, 0, -5);
    this.scale.set(0.01,0.01,0.01);
    this.greeting = new Array
    (
      GetGreeting() + "I'm Mimi the robot."
      ,"I can count."
      ,"<Animation>bounce"
      ,"1   "
      ,"<Animation>bounce"
      ,"2   "
      ,"<Animation>bounce"
      ,"3   "
      ,"<Animation>bounce"
      ,"4   "
      ,"The End"
    );
    this.namePlateY = 2.3;
    ANIMATIONS.CreateAnimationGroup(this);
  }
}

export class Robot_1 extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/brachiosaurus/';
    this.buttonAtlasOffset = [0.25, 0];

    this.shadowSize = 2.5;
    this.height = 2;
    this.position.set(0, -0.1, -3.0);
    this.rotation.y = Math.PI * -0.2;

    this.greeting = new Array
    (
      EMOJI.burgerEmoji,
      "Are my favorite snacks!",
      "Do you have one for me?",
      "<Sound>RobotFart.mp3",
      "The End"
    );

    this.namePlateY = 2.1;
    ANIMATIONS.CreateAnimationGroup(this);
  }
}

export class Robot_2 extends XRDinosaur {
  constructor() {
    super();

    this.path = 'media/models/dilophosaurus/';
    this.buttonAtlasOffset = [0.0, 0.75];
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
      ANIMATIONS.CreateAnimationGroup(this);
    }
  }

  export class Robot_3 extends XRDinosaur {
    constructor() {
      super();

      this.path = 'media/models/pachycephalosaurus/';
      this.buttonAtlasOffset = [0.5, 0];
      this.height = 3;
      this.position.set(0, 0, -5);

      this.greeting = new Array(
        "I'm a dinosaur.",
        "I like to ",
        "<Silent>"+EMOJI.poopEmoji+ "           ",
        "<Sound>RobotFart.mp3",
        "The End");

        this.namePlateY = 3.5;
        ANIMATIONS.CreateAnimationGroup(this);

      }
    }

    export let AllDinosaurs =
    {
      robot_0: new Robot_0(),
      robot_1: new Robot_1(),
      robot_2: new Robot_2(),
      robot_3: new Robot_3(),
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
        greetingString = "Good Evening! ";
      }
      if (hr == 23) {
        greetingString = "It's almost midnight...Aren't you sleepy yet? ";
      }
      if (hr==0) {
        greetingString = "It's midnight... do you ever sleep? ";
      }


      return greetingString;

    }
