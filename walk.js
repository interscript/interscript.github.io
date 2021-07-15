const Walk = require("@root/walk");
const path = require("path");

async function getListOfFileWithTypeInDir(dirPath, fileType) {
    let files = [];
    await Walk.walk(dirPath, async (err, pathname, dirent) => {
        if (err) {
            console.warn("fs stat error for %s: %s", pathname, err.message);
            return;
        }

        if (dirent.isFile() && path.extname(dirent.name) === fileType) {
            const basename = path.basename(dirent.name, fileType);
            files.push({
                name: basename,
                path: pathname,
                title: basename.replace(/_/g, " "),
            });
        }
    });
    return files;
}

module.exports = {
    getListOfFileWithTypeInDir,
};
