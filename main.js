const {app, BrowserWindow, Menu, dialog} = require('electron');

const fshandler = require('./src/main/fshandler')

let win;

let menu = Menu.buildFromTemplate(
    [
        {
            role: 'editMenu',
        },
        {
            label: 'Dev',
            submenu: 
            [
                {
                    role: 'toggleDevTools'
                }
            ]
        }
    ]
)

function createWindow() {

    

    win = new BrowserWindow({
        backgroundColor: '#EEE',
        show: false
    })


    const wd = dialog.showOpenDialogSync(win, {
        title: 'Choose working directory',
        properties: [
            "openDirectory", "createDirectory"
        ]
    })

    tree = fshandler.recurse(wd[0], 0)

    win.on('ready-to-show', () => {
        win.maximize()
        win.show()
    })

    win.webContents.toggleDevTools()

    Menu.setApplicationMenu(menu);

    win.loadFile('./dist/text-editor/index.html')

    console.log(win.webContents)

    win.on('closed', () => {
        win = null
    })


}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})