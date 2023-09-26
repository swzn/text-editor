const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const MAX_DEPTH = 10;

module.exports = {
    recurse,
    getFileFromPath,
    saveFile,
    getTempDirectory
}

function saveFile(path, contents) {
    const directories = path.split('\\')
    const parent = directories.slice(0, directories.length - 1).join("\\")
    console.log(parent)
    console.log(path)
    if(!fs.existsSync(parent)) {
        fs.mkdirSync(parent, {recursive: true})
    }
    fsPromises.writeFile(path, contents).catch( (err) => {
        console.log(err)
    })
}

async function getFileFromPath(path) {
    try {
        const data = fsPromises.readFile(path, {encoding : 'utf8'})
        return data
    }
    catch (err) {
        console.log(err)
    }
}

async function getTempDirectory(temp) {
    const appTemp = path.join(temp, "text-editor")
    if(!fs.existsSync(appTemp)) {
        fs.mkdirSync(appTemp)
    }
    return appTemp
}

function recurse(root, depth) {
    let tree = {
        path: root,
        children: [],
        type: 'directory',
    }
    tree.preloaded = depth < MAX_DEPTH;
    if(depth >= MAX_DEPTH) return tree;
    files = fs.readdirSync(root,
        { 
            withFileTypes: true
        })
    files.forEach( dirent => {
        if(dirent === undefined || dirent === null) return;
        new_path = path.join(root,dirent.name)
        if(dirent.isDirectory()) {
            tree.children.push(this.recurse(new_path, depth+1))
        }
        else if (dirent.isFile()) {
            tree.children.push(
                {
                    path: new_path,
                    type: 'file'
                }
            )
        }
    })
    return tree;
}