// Scene
const scene = new THREE.Scene()

// Camera (AR controlled)
const camera = new THREE.Camera()
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x000000, 0)
document.body.appendChild(renderer.domElement)

// AR Toolkit Source (Camera)
const arSource = new THREEx.ArToolkitSource({
  sourceType: 'webcam'
})

arSource.init(() => {
  onResize()
})

window.addEventListener('resize', onResize)

function onResize() {
  arSource.onResize()
  arSource.copySizeTo(renderer.domElement)
}

// AR Toolkit Context
const arContext = new THREEx.ArToolkitContext({
  cameraParametersUrl:
    'https://cdn.jsdelivr.net/npm/ar.js@3.4.5/data/data/camera_para.dat',
  detectionMode: 'mono'
})

arContext.init(() => {
  camera.projectionMatrix.copy(arContext.getProjectionMatrix())
})

// Marker
const markerRoot = new THREE.Group()
scene.add(markerRoot)

new THREEx.ArMarkerControls(arContext, markerRoot, {
  type: 'pattern',
  patternUrl:
    'https://cdn.jsdelivr.net/npm/ar.js@3.4.5/data/data/patt.hiro'
})

// Light (fancy part)
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1, 2, 1)
scene.add(light)

const ambient = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambient)

// Cute cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 0x66ccff,
  roughness: 0.3,
  metalness: 0.2
})

const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5
markerRoot.add(cube)

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  if (arSource.ready) {
    arContext.update(arSource.domElement)
  }

  cube.rotation.y += 0.02
  cube.position.y = 0.5 + Math.sin(Date.now() * 0.005) * 0.1

  renderer.render(scene, camera)
}

animate()
