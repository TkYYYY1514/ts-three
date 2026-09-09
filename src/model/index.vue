<!-- src/model/index.vue -->
<template>
  <div ref="containerRef" class="model-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ===== 1. DOM 引用 =====
const containerRef = ref<HTMLDivElement>();

// ===== 2. Three.js 核心变量 =====
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let model: THREE.Group;

// ===== 3. 初始化场景 =====
const initScene = () => {
  // 场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  // 相机 (透视相机: 视野, 宽高比, 近裁面, 远裁面)
  const container = containerRef.value!;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100000);
  camera.position.set(100, 80, 100);
  camera.lookAt(0, 0, 0);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

   // 1. 创建纹理加载器
     const textureLoader = new THREE.TextureLoader();
    

        // 动态拼接 BASE_URL
    const groundTexture = textureLoader.load(
        `${import.meta.env.BASE_URL}images/grass.png`
    );
     
     // 3. 配置纹理
     groundTexture.wrapS = THREE.RepeatWrapping;
     groundTexture.wrapT = THREE.RepeatWrapping;
     groundTexture.repeat.set(10, 10); // 重复次数
     groundTexture.anisotropy = 8;
     
     // 4. 创建地面材质
     const groundMaterial = new THREE.MeshStandardMaterial({
         map: groundTexture,
         roughness: 0.8,
         metalness: 0.2,
         side: THREE.DoubleSide,
     });
     
     // 5. 创建地面
     const groundGeometry = new THREE.CircleGeometry(500, 16);
     const ground = new THREE.Mesh(groundGeometry, groundMaterial);
     ground.rotation.x = -Math.PI / 2;
     ground.position.y = -1.5;
     ground.name = 'ground';
     ground.receiveShadow = true;  //开启阴影
     scene.add(ground);

     

  // 轨道控制器 (允许用户旋转/缩放)
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.update();

  // 环境光 + 方向光 (让模型有立体感)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // 辅助: 网格地面 (方便观察位置)
  const gridHelper = new THREE.GridHelper(1500, 200);
  scene.add(gridHelper);
};

// ===== 4. 加载模型 =====
const loadModel = () => {
  const loader = new GLTFLoader();
  // 模型路径: 放在 public/ 下
  const modelPath = '/gltf/Building/Building.gltf';

  loader.load(
    modelPath,
    (gltf) => {
      model = gltf.scene;
      // 调整模型位置/大小 (根据实际需要)
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      scene.add(model);
      console.log('✅ 模型加载成功:', model);
    },
    (progress) => {
      // 加载进度
      console.log(`加载中: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
    },
    (error) => {
      console.error('❌ 模型加载失败:', error);
    }
  );
};

// ===== 5. 动画循环 =====
const animate = () => {
  requestAnimationFrame(animate);
  controls.update(); // 更新控制器
  renderer.render(scene, camera);
};

// ===== 6. 窗口自适应 =====
const onResize = () => {
  const container = containerRef.value!;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

// ===== 7. 生命周期 =====
onMounted(() => {
  initScene();
  loadModel();
  animate();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  renderer?.dispose();
});
</script>

<style scoped>
.model-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>