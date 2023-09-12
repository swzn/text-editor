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
        frame: false,
        show: false
    })


    const wd =  workingDirectoryPrompt()

    tree = wd ? fshandler.recurse(wd[0], 0) : {}

    win.on('ready-to-show', () => {
        win.maximize()
        win.show()
    })

    win.webContents.toggleDevTools()

    ipcMain.on(IpcChannel.GetWorkingDirectory.toString(), (
        (e,args) => {
            e.returnValue = tree
        }
    ))

    ipcMain.handle(IpcChannel.GetFile.toString(), (
        async (e, args) => {
            const result = await fshandler.getFileFromPath(args[0])
            return result
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