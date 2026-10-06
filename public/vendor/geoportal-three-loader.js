import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.186.1/three.module.min.js";

window.__geoportalThree = THREE;
window.dispatchEvent(new Event("geoportal-three-ready"));
