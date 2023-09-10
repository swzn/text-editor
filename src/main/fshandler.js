const fs = require('fs')
const path = require('path')
const MAX_DEPTH = 2;

module.exports.recurse = recurse



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