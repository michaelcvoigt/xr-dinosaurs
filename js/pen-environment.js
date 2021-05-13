import * as THREE from './third-party/three.js/build/three.module.js';

export class PenEnvironment extends THREE.Group
{
  constructor(gltfLoader) {
    super();

    this._platform = new THREE.Group();
    this._platform.position.set(0, 0, 0);
    this.add(this._platform);

    this._navigationMeshes = [];

    this._loadedPromise = new Promise((resolve) =>
    {
      gltfLoader.setPath('media/models/environment/');
      gltfLoader.load('compressed-optimized.glb', (gltf) =>
      {
        // make the world static for performance
        //gltf.matrixAutoUpdate  = false;
        //gltf.scene.updateMatrixWorld();

        gltf.scene.traverse((child) =>
        {
          if (child.isMesh)
          {
            //child.position.set(0,0,0);
            //child.scale.set(0.1,0.1,0.1);

            child.receiveShadow = true;

            // Replace the MeshStandardMaterial for the pen with something cheaper
            // to render, because we don't have proper physical materials for this
            // model.
            /*
            let newMaterial = new THREE.MeshLambertMaterial({
              map: child.material.map,
              alphaMap: child.material.alphaMap,
              transparent: child.material.transparent,
              side: child.material.side,
            });
            newMaterial.shininess = 66;
            newMaterial.metalness = 0.88;
            child.material = newMaterial;
            */

          }
          /*
          if (child.name == 'Raised_Platform') {
            raisedPlatform = child;
            this._navigationMeshes.push(child);
          }
          if (child.name == 'Ground') {
            this._navigationMeshes.push(child);
          }
          */
        });

        gltf.scene.position.set(-5,-3.65,-3);
        this.add(gltf.scene);
        resolve(this);
      });
    });
  }

  get loaded() {
    return this._loadedPromise;
  }

  get navigationMeshes() {
    return this._navigationMeshes;
  }
}
