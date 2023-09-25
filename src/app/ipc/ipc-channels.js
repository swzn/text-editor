class IpcChannel {

    static GetWorkingDirectory = new IpcChannel("get-working-directory")
    static GetTempDirectory = new IpcChannel("get-temp-directory")
    static GetRoamingDirectory = new IpcChannel("get-roaming-directory")
    static SendWorkingDirectory = new IpcChannel("send-working-directory")

    static GetFile = new IpcChannel("get-file")
    static SendFile = new IpcChannel("send-file")
    static SaveFile = new IpcChannel("save-file")
    static SaveFilePrompt = new IpcChannel("save-file-prompt")

    static Unmaximize = new IpcChannel("Unmaximize-app")
    static Minimize = new IpcChannel("minimize-app")
    static Maximize = new IpcChannel("maximize-app")
    static Quit = new IpcChannel("quit-app")

    static UnmaximizedEvent = new IpcChannel("unmaximized-event")
    static MaximizedEvent = new IpcChannel("maximized-event")



    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

module.exports.IpcChannel = IpcChannel;
