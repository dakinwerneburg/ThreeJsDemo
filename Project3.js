/***********************************************************************
Author:  Dakin T Werneburg
Purpose:  This adds 6 3D objects using threejs
          to a scene, as well as multiple lighting
*************************************************************************/

//global variables
var scene, camera, renderer, playing, time, speed, bulb;
var  sphere, floor, flashLight, rectangle, cylinder, torus, pyramid, base;
var   ambient, spotLight, dirLight, redLight, greenLight, blueLight, lightBulb;

//window eventlistner
window.addEventListener("load", addListeners);

/**
 * checkbox eventlistner for light switch
 */
function addListeners(){
  var s = document.getElementsByName("switch");
  var i;
  for (i = 0; i < s.length; i++) {
      s[i].addEventListener('click', flipSwitch);
  }

  //textbox listner for color
  var c = document.getElementById('color');
  c.addEventListener('keypress', changeColor);
    

  //button listner for pause and resume animation
  var b = document.getElementById('button');
  b.addEventListener('click', function(){
    if(playing){
      playing = false;
    }else{
      playing = true;
    }
   
  })

  //slider listner for the x positon of spotlight
  var p = document.getElementById('position');
  p.addEventListener('input', function(){
   spotLight.position.x = this.value;
   
  })
}


/**
 * turns lights of ON/OFF based on checkbox 
 */
function flipSwitch(){
  var id = this.id;
  if(this.checked){
   switch(id){
     case 'red':{
       scene.add(redLight);
     }
     break;
     case 'blue':{
      scene.add(blueLight);
    }
    break;
    case 'green':{
      scene.add(greenLight);
    }
    break;
    case 'dirLight':{
      scene.add(dirLight);
    }
    break;
    case 'spotLight':{
      scene.add(spotLight);
    }
    break;
    case 'flashLight':{
      scene.add(lightBulb);
      bulb.material.color.setHex(0xffffff);
    } 
      break;   
   }
  }else{
    switch(id){
      case 'red':{
        scene.remove(redLight);
      }
      break;
      case 'blue':{
       scene.remove(blueLight);
      }
      break;
     case 'green':{
       scene.remove(greenLight);
      }
      break;
     case 'dirLight':{
       scene.remove(dirLight);
     }
     break;
     case 'spotLight':{
       scene.remove(spotLight);
     }
     break;
     case 'flashLight':{
       scene.remove(lightBulb);
       bulb.material.color.setHex(0x000000);
     }
     break;
    }
  }
}



/**
 * Changed flashlight color when hex value is typed
 * 
 * @param {*} e g 
 */
function changeColor(e){
  var key = e.keyCode || e.which;
  if(key==13){
    var regex = new RegExp("^0x[0-9a-fA-F]{6}$");
    if(regex.test(this.value)){
      var color = parseInt(this.value);
      lightBulb.color.setHex(color); 
      bulb.material.color.setHex(color); 
    }
  } 
}


/**
 * Inintializes the scene
 */
function init(){
  //scene
  scene = new THREE.Scene();

  //camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 40, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  document.querySelector('#threejs').appendChild( renderer.domElement );
  renderer.shadowMapEnabled = true;
  renderer.setClearColor( 0x293535 );

  //viewport adjustment
  window.addEventListener( 'resize', function (){
      var width = window.innerWidth;
      var height = window.innerHeight;
      renderer.setSize( width, height);
      camera.aspect = width/height;
      camera.updateProjectionMatrix();
  });

  //camera controls
  controls = new THREE.OrbitControls( camera, renderer.domElement);

  //variables used for animation
  playing = true;
  speed = 1;
  time = 0;
}

/**
 * Add flooring to the scene
 */
function drawFloor(){
  var geo = new THREE.PlaneGeometry(1000,1000,100,100);
  var mat2 = new THREE.MeshStandardMaterial({
    color: 0xdcdcdc,
    roughness: 0.9,
    metalness: .9
  });
  var floor = new THREE.Mesh(geo, mat2);
  floor.rotation.x = -90 * Math.PI /180;
  floor.position.y = -1;
  floor.receiveShadow = true;
  scene.add(floor);
}


/**
 * creates a flashlight 3d object and adds spotlight to bulb
 */
function drawFlashlight(){
  var mat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    emissive: 0x000000,
    metalness: 1
  } );

  //constructs base of flashlight
  var geo1 = new THREE.CylinderGeometry( 2, 2, 20, 30, 30 );
  var base = new THREE.Mesh( geo1, mat );

  //constructs head of flashlight
  var geo2 = new THREE.CylinderGeometry( 4, 2, 3.5, 30, 30 );
  var head = new THREE.Mesh( geo2, mat );
  head.position.y = 11;

  //constructs lightbulb and assigns lighting to it
  var geo3 = new THREE.SphereGeometry(2.5,20,20);
  bulb = new THREE.Mesh( geo3, new THREE.MeshBasicMaterial({color: 0xffffff}));
  bulb.position.y = 11;
  lightBulb = new THREE.SpotLight( 0xffffff, 10 );
  lightBulb.position.set( -28, 0, 0 );
  lightBulb.angle = 20 * Math.PI / 180;
  lightBulb.distance = 100;
  lightBulb.castShadow = true;
  scene.add( lightBulb);

  //combines elements of the flashlightlight for transformations
  flashlight = new THREE.Group();
  flashlight.add(base);
  flashlight.add(head);
  flashlight.add(bulb);
  flashlight.rotation.z = -90 * Math.PI / 180;
  flashlight.position.x = -30;
  flashlight.scale.set(0.5,0.5,0.5);
  flashlight.receiveShadow = true;
  scene.add( flashlight );
}



//creates a sphere 3d object
function drawSphere(){
  var geo = new THREE.SphereGeometry( 3, 20, 20 );
  var mat = new THREE.MeshStandardMaterial( {
    color: 0xbcc6cc,
    roughness: 0.2,
    metalness: 0.8
  } );
  sphere = new THREE.Mesh( geo, mat );
  sphere.position.x = 15;
  sphere.position.y = 2;
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add( sphere );
}




/**
 * creates a cylinder 3d Object
 */
function drawCylinder(){
  var geo = new THREE.CylinderGeometry( 9, 9, 20, 30, 30 );
  var mat = new THREE.MeshStandardMaterial( {
    color: 0xff0000,
    roughness: 0.3,
    metalness: 0.7
  } );
  cylinder = new THREE.Mesh( geo, mat );
  cylinder.position.x = -30;
  cylinder.position.y = 9;
  cylinder.position.z = -30;
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  scene.add( cylinder );
}


/**
 * creates a rectangle 3D object
 */
function drawRect(){
  var geo = new THREE.BoxGeometry(30,12,10)
  var mat = new THREE.MeshStandardMaterial( {
    color: 0x0000ff,
    roughness: 0.5,
    metalness: 0.5
  } );
  rectangle = new THREE.Mesh(geo, mat);
  rectangle.castShadow = true;
  rectangle.receiveShadow = true;
  rectangle.position.set(45,5,-30);
  rectangle.rotation.y = 45 * Math.PI / 180;
  scene.add(rectangle);
}



/**
 * creates a tourus 3d Object
 */
function drawTorus(){
  var geo = new THREE.TorusGeometry( 8, 2, 16, 100 );
  var mat = new THREE.MeshStandardMaterial( {
    color: 0xdcdcdc,
    roughness: 0.9,
    metalness: .9
  } );
  torus = new THREE.Mesh( geo, mat );
  torus.position.set(50,8,-22);
  torus.rotation.y = 40 * Math.PI / 180;
  torus.rotation.x = -40 * Math.PI / 180;
  torus.rotation.z = 30* Math.PI / 180;
  torus.castShadow = true;
  torus.receiveShadow = true;
  scene.add( torus );
}



/**
 * Creates a pyramid 3d Object
 */
function drawPyramid(){
  var geo = new THREE.Geometry();
  geo.vertices = [
    new THREE.Vector3( 0, 0, 0 ),
    new THREE.Vector3( 0, 1, 0 ),
    new THREE.Vector3( 1, 1, 0 ),
    new THREE.Vector3( 1, 0, 0 ),
    new THREE.Vector3( 0.5, 0.5, 1 )
  ];
  geo.faces = [
    new THREE.Face3( 0, 1, 2 ),
    new THREE.Face3( 0, 2, 3 ),
    new THREE.Face3( 1, 0, 4 ),
    new THREE.Face3( 2, 1, 4 ),
    new THREE.Face3( 3, 2, 4 ),
    new THREE.Face3( 0, 3, 4 )
    ];
  var mat = new THREE.MeshStandardMaterial( {
    color: 0xca8c46,
    emissive: 0,
    roughness: 0,
    metalness: 0
  } );
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  pyramid = new THREE.Mesh( geo, mat );
  pyramid.position.set(0,0,-100);
  pyramid.scale.set(50,50,50);
  pyramid.rotation.x = -90 * Math.PI / 180;
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  scene.add(pyramid);
}

/**
 * Adds all lighting to scene except for flashlight
 */
function addLights(){
  ambient = new THREE.AmbientLight(0xFFFFFF, 0.2);
  scene.add(ambient);

  //light in background behind pyramid
  spotLight = new THREE.SpotLight( 0xffffff, 2, 200 );
  spotLight.position.set(0,75,-250);
  spotLight.angle = 140* Math.PI / 180;
  spotLight.castShadow = true;
  spotLight.penumbra = .8;
  spotLight.target = pyramid;
  scene.add( spotLight);

  //Direction light pointed at cylinder
  dirLight = new THREE.DirectionalLight(0xffffff, 0.5, 75 );
  dirLight.position.set(-40, 20,30);
  dirLight.target = cylinder;
  scene.add( dirLight);


  //Red, Green, Blue Positional lights
  var point = new THREE.SphereGeometry( 0.5, 16, 8 );
  redLight = new THREE.PointLight( 0xff0040, 10, 40 );
  redLight.add( new THREE.Mesh( point, new THREE.MeshBasicMaterial( {color: 0xff0040})) );
  redLight.castShadow = true;
  redLight.position.set(-20,30,0);
  scene.add( redLight );

  blueLight = new THREE.PointLight( 0x0040ff, 10, 40 );
  blueLight.add( new THREE.Mesh( point, new THREE.MeshBasicMaterial( {color: 0x0040ff})) );
  blueLight.castShadow = true;
  blueLight.position.set(50,30,0);
  scene.add( blueLight );

  greenLight = new THREE.PointLight( 0x80ff80, 10, 40 );
  greenLight.add( new THREE.Mesh( point, new THREE.MeshBasicMaterial( {color: 0x80ff80})) );
  greenLight.castShadow = true;
  greenLight.position.set(0,30,-50);
  scene.add( greenLight );
}

/**
 * Updates the scene
 */
function update (){
  if(!playing) return;
  time = time + speed;
  var angle = time * 0.03;

  //moves back and foward
  sphere.position.z = 50 * Math.sin(angle);
  
  //circular motion of lights
  redLight.position.set(-50*Math.cos(angle),30,30*Math.sin(angle));
  blueLight.position.set(30*Math.cos(angle+5),30,70*Math.sin(angle+5));
  greenLight.position.set(30*Math.cos(angle+10),30,75*Math.sin(angle+10));
}


/**
 * Add animation to the scene
 */
function animate (){
  update();
  requestAnimationFrame (animate);
  renderer.render(scene, camera);
}


/**
 * Error handling
 */
try{

  init();
  
  drawFloor();
  drawFlashlight();
  drawSphere();
  drawCylinder();
  drawRect();
  drawTorus();
  drawPyramid();
  addLights();
  animate();
}catch(e){
  var error = "Sorry there was an error.\n";
  alert(error + e);
}
