const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')
const MAX_DEPTH = 10;

module.exports.recurse = recurse
module.exports.getFileFromPath = getFileFromPath
module.exports.saveFile = saveFile

function saveFile(path, contents) {
    fs.writeFileSync(path, contents)
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