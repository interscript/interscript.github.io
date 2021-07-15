const AdmZip = require("adm-zip");
const request = require("request");
const fs = require("fs");

const visJsonUrl = "https://github.com/interscript/interscript/releases/latest/download/vis_json.zip";
const metadataUrl = "https://github.com/interscript/interscript/releases/latest/download/metadata.json.zip";
const visJsonsPath = "./public/";
const metadataJsonsPath = "./";

async function downloadZip(inputUrl, outputPath) {
    // read all files from docs
    return new Promise((resolve, reject) => {
        request.get({ url: inputUrl, encoding: null }, (err, res, body) => {
            if (err) {
                reject(err);
                throw new Error(err);
            }

            const zip = new AdmZip(body);
            const zipEntries = zip.getEntries();
            const promises = [];
            zipEntries.map((entry) => {
                const body = zip.readAsText(entry, "utf8");
                return fs.writeFile(outputPath + `/${entry.entryName}`, body, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });

            return Promise.all(promises);
        });
    });
}
const createDirs = (paths) => {
    paths.forEach((path) => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    });
};
createDirs([visJsonsPath, metadataJsonsPath]);
downloadZip(visJsonUrl, visJsonsPath)
    .then(() => {
        return downloadZip(metadataUrl, metadataJsonsPath);
    })
    .then(() => {
        console.log("done");
    });
