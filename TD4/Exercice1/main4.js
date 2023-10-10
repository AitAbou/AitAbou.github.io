import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Variables
let scene, camera, renderer, sphere;

// Initialisation de la scène
scene = new THREE.Scene();

// Création de la caméra
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

// Création de la lumière
const light = new THREE.PointLight(0xffffff);
light.position.set(2, 2, 2);
scene.add(light);

// Création de la sphère
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('ors.jpg');
const sphereMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Création du renderer

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
const loader = new GLTFLoader();

// Animation
const animate = () => {
  requestAnimationFrame(animate);

  // Faites tourner la sphère
    //sphere.rotation.x += 0.001;
    //sphere.rotation.y += 0.001;
    //sphere.rotation.z += 0.001
  renderer.render(scene, camera);
};

animate();

getUserLocation((lat, lon) => {
    const radius = 1; // Rayon de la sphère
    const position = _convertLatLonToVec3 (lat, lon);

    // Créer un marqueur rouge (une sphère)
    const markerGeometry = new THREE.SphereGeometry(0.01, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(position.x, position.y, position.z);
    scene.add(marker);

    // Position de la caméra
    camera.position.set(0, 0, 3);

    // Point de vue de la caméra
    camera.lookAt(0, 0, 0);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  });

function _convertLatLonToVec3 (lat, lon){
    lat = lat * Math.PI / 180.0;
    lon = -lon * Math.PI / 180.0;
    return new THREE.Vector3(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon));
}

// Créez une fonction pour récupérer la position de l'utilisateur
function getUserLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        callback(lat, lon);
      });
    } else {
      console.log("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  }

  function addMarker(lat, lon) {
    const radius = 0.05; // Rayon de la sphère
    const position = _convertLatLonToVec3 (lat, lon);
    // Créer un marqueur rouge (une sphère)
    const markerGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(position.x, position.y, position.z);
    scene.add(marker);
    return marker;
  }

  // Fonction pour charger un modèle 3D (soldat)
  function loadModel() {
    const loader = new THREE.GLTFLoader();
    loader.load('path/vers/votre/modele.glb', (gltf) => {
      model = gltf.scene;
      scene.add(model);
      model.position.copy(userMarker.position);
    });
  }


  // Fonction pour récupérer les positions des pays et afficher des drapeaux
  function getCountryMarkers() {
    fetch('https://restcountries.com/v3.1/name/deutschland')
      .then((response) => response.json())
      .then((data) => {
        const lat = data[0].latlng[0];
        const lon = data[0].latlng[1];
        const flagUrl = data[0].flags.png;
        addMarker(lat, lon, 0x00ff00);
        loadCountryFlag(lat, lon, flagUrl);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données du pays :', error);
      });
  }

  // Fonction pour charger et ajouter le drapeau d'un pays
  function loadCountryFlag(lat, lon, flagUrl) {
    new THREE.TextureLoader().load(flagUrl, (texture) => {
      const flagGeometry = new THREE.PlaneGeometry(0.1, 0.1);
      const flagMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const flag = new THREE.Mesh(flagGeometry, flagMaterial);
      const position = _convertLatLonToVec3(lat, lon);
      flag.position.set(position.x, position.y, position.z + 0.1);
      scene.add(flag);
    });

  // Fonction pour charger et ajouter le drapeau d'un pays
  function loadCountryFlag(lat, lon, flagUrl) {
    if (flagTextureCache[flagUrl]) {
      const flagGeometry = new THREE.PlaneGeometry(0.1, 0.1);
      const flagMaterial = new THREE.MeshBasicMaterial({ map: flagTextureCache[flagUrl] });
      const flag = new THREE.Mesh(flagGeometry, flagMaterial);
      const position = _convertLatLonToVec3(lat, lon);
      flag.position.set(position.x, position.y, position.z + 0.1);
      scene.add(flag);
    } else {
      // Chargement de la texture du drapeau
      new THREE.TextureLoader().load(flagUrl, (texture) => {
        flagTextureCache[flagUrl] = texture;
        const flagGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        const flagMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        const position = latLonToCartesian(lat, lon, 1);
        flag.position.set(position.x, position.y, position.z + 0.1);
        scene.add(flag);
      });
    }
  }
}
getUserLocation();
getCountryMarkers();
loadCountryFlag();
  