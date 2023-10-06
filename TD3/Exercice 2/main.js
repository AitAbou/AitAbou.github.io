import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

// Créez une lumière directionnelle
const directionalLight = new THREE.DirectionalLight(0xF5DEB3, 1);

// Positionnez la lumière
directionalLight.position.set(1, 1, 1);

// Ajoutez la lumière à la scène
scene.add(directionalLight);

material.shininess = 300;  // Ajustez la valeur selon vos préférences
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.05;

	renderer.render( scene, camera );
}

animate();