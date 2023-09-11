const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');

const fshandler = require('./src/main/fshandler');
const { IpcChannel } = require('./src/app/ipc/ipc-channels');

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


function workingDirectoryPrompt() {
    let path = dialog.showOpenDialogSync(win, {
        title: 'Choose working directory',
        properties: [
            "openDirectory", "createDirectory"
        ]
    })

    return path;
}

function createWindow() {

    

    win = new BrowserWindow({
        backgroundColor: '#EEE',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false
    })


    const wd =  workingDirectoryPrompt()

    tree = wd ? fshandler.recurse(wd[0], 0) : {}

    win.on('ready-to-show', () => {
        win.maximize()
        win.show()
    })

    win.webContents.toggleDevTools()

    Menu.setApplicationMenu(menu);

    ipcMain.on(IpcChannel.GetWorkingDirectory, (
        (e,args) => {
            e.returnValue = tree
        }
    ))

    win.loadFile('./dist/text-editor/index.html')

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