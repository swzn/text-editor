class IpcChannel {

    static GetWorkingDirectory = new IpcChannel("get-working-directory")
    static SendWorkingDirectory = new IpcChannel("send-working-directory")

    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }
}

module.exports.IpcChannel = IpcChannel;
