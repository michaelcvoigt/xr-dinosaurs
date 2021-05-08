import * as THREE from '../third-party/three.js/build/three.module.js';

function CreateAnimationGroup(robot)
{

  var x = robot.position.x;
  var y = robot.position.y;
  var z = robot.position.z;

  robot.animationObjectGroup = new THREE.AnimationObjectGroup();

  //move
  robot.positionKF = new THREE.VectorKeyframeTrack
  (
    '.position',
    [0, 4, 8],
    [x, y, z, x+1, y, z, x, y, z],
  );

  robot.moveClip = new THREE.AnimationClip('move', -1, [
    robot.positionKF,
    //this.rotationKF,
  ]);

  robot._mixer = new THREE.AnimationMixer(robot);
  robot._currentAction = robot._mixer.clipAction(robot.moveClip);

  robot.animationObjectGroup.add(robot.moveClip);

  //bounce

  robot.bouncePositionKF = new THREE.VectorKeyframeTrack
  (
    '.position',
    [0, 0.25, 0.5],
    [x, y, z, x, y+0.35, z, x, y, z],
  );

  robot.bounceClip = new THREE.AnimationClip('bounce', -1, [
    robot.bouncePositionKF,
    //this.rotationKF,
  ]);

  robot._mixer = new THREE.AnimationMixer(robot);
  robot._currentAction = robot._mixer.clipAction(robot.bounceClip);

  robot.animationObjectGroup.add(robot.bounceClip);

  //Idle
  robot.idlePositionKF = new THREE.VectorKeyframeTrack
  (
    '.position',
    [0, 0.5, 1, 1.5],
    [x, y, z, x+0.01, y+0.01, z-0.01, x, y, z,x-0.01,y,z+0.1],
  );

  robot.idleClip = new THREE.AnimationClip('idle', -1, [
    robot.idlePositionKF,
    //this.rotationKF,
  ]);

  robot._mixer = new THREE.AnimationMixer(robot);
  robot._currentAction = robot._mixer.clipAction(robot.idleClip);
  robot.animationObjectGroup.add(robot.idleClip);
  robot._currentAction.play();

}

export { CreateAnimationGroup };
