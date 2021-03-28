var mousePos = new THREE.Vector2()
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const plane_size = new THREE.Vector2(16, 9)
const camera = new THREE.OrthographicCamera( plane_size.x / - 2, plane_size.x / 2, plane_size.y / 2, plane_size.y / - 2, 1, 1000 );
camera.position.z = 5

const renderer = new THREE.WebGLRenderer();
// const renderer = new THREE.CSS3DRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.domElement.id = "bg_element"
document.body.appendChild( renderer.domElement );


// css
var object = new THREE.CSS3DObject(document.getElementById("3dcontent"));



var composer = new THREE.EffectComposer(renderer);
var renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

var vertShader = document.getElementById('vertexShader').textContent;
var fragShader = document.getElementById('fragmentShader').textContent;
var counter = 0.0;
var transitionTime = 0.0;
var myEffect = {
    uniforms: {
        "tDiffuse": { value: null },
        "amount": { value: counter },
        "transitionTime": { value: transitionTime }
    },
    vertexShader: vertShader,
    fragmentShader: fragShader
}

var customPass = new THREE.ShaderPass(myEffect);
customPass.renderToScreen = true;
composer.addPass(customPass);


function createTexture(){
    const texture = new THREE.TextureLoader().load( "screenshot.png" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.repeat.set( 1, 1 );
    return texture
}

function createPlane(){
    const geometry = new THREE.PlaneGeometry( plane_size.x, plane_size.y, 32 );
    const texture = createTexture()
    const material = new THREE.MeshBasicMaterial( {map: texture, color: 0xffffff, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
    return plane
}

function createText(text, font){
    
    const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const texture = createTexture()
    const material = new THREE.MeshBasicMaterial( {color: 0x2d2d2d, side: THREE.DoubleSide} );
    const text_body = new THREE.Mesh( geometry, material );
    
    text_body.scale.set(0.006, 0.006, 0.006)
    scene.add( text_body );

    var bbox = new THREE.Box3().setFromObject(text_body);
    text_body.position.x -= (bbox.max.x-bbox.min.x)/2
    text_body.position.y -= (bbox.max.y-bbox.min.y)/2
    text_body.position.z -= (bbox.max.z-bbox.min.z)/2

    return text_body
}

var text = null

const loader = new THREE.TTFLoader()
const fontLoader = new THREE.FontLoader()
var font = loader.load('Arvo-Bold.ttf', fnt=>{
    var font = fontLoader.parse(fnt)
    // text = createText("Ashen Hermit", font)
    // text.position.z = 1
})

var body = createPlane()
body.position.z = -5

function update(){
    //camera.position.y += ((-(mousePos.y - window.innerHeight/2)/1000) - camera.position.y)/10
    //camera.position.x += (((mousePos.x - window.innerWidth/2)/1000) - camera.position.x)/10
    //camera.lookAt(new THREE.Vector3(0,0,0))


}

function animate() {
    update()

    var timer = Date.now() * 0.0002;
    counter += 0.01;
    if(transitionTime < 5.0) transitionTime += 0.01;
    customPass.uniforms["amount"].value = counter;
    customPass.uniforms["transitionTime"].value = transitionTime;

    requestAnimationFrame( animate );
    composer.render();
}
animate();


window.addEventListener('mousemove', (e)=>{
    mousePos.x = e.pageX
    mousePos.y = e.pageY
})

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

function activate(data){
    data.special_options = parse_options(data.special_options)
    console.log(data)

    // var music = new Audio("https://t4.bcbits.com/stream/08e7ccadcb161406e822277d75962bd3/mp3-128/1562667084?p=0&ts=1617018796&t=8d6e915a8e9a0a8aaa4e428a14eb922870446e6d&token=1617018796_9abafc1141d317eaa3299f7f5b04be0cdff97e0c")
    // music.play()
    if(data.scene_name!=""){
        scenes[data.scene_name].start(data.special_options)
    }
}

function deactivate(){
    document.body.innerHTML = "DEACTIVATED"
}