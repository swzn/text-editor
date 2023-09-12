class IpcChannel {

    static GetWorkingDirectory = new IpcChannel("get-working-directory")
    static SendWorkingDirectory = new IpcChannel("send-working-directory")
    static GetFile = new IpcChannel("get-file")
    static SendFile = new IpcChannel("send-file")


    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

module.exports.IpcChannel = IpcChannel;
