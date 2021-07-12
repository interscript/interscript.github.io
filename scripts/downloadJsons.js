const AdmZip = require('adm-zip');
const request = require('request');
const fs = require('fs');

const visJsonUrl = 'https://nightly.link/interscript/interscript/workflows/rake/master/vis_json.zip';
const metadataUrl = 'https://nightly.link/interscript/interscript/workflows/rake/master/metadata.zip';
const visJsonsPath = './public/vis_json';
const metadataJsonsPath = './public/metadata_json'

async function downloadZip(inputUrl, outputPath) {
    // read all files from docs
    return new Promise((resolve, reject) => {
        request.get({url: inputUrl, encoding: null}, (err, res, body) => {
            if (err) {
                reject(err);
                throw new Error(err);
            }

            const zip = new AdmZip(body);
            const zipEntries = zip.getEntries();
            const promises = [];
            zipEntries.map((entry) => {
                const body = zip.readAsText(entry, 'utf8');
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
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    })
}
createDirs([visJsonsPath, metadataJsonsPath])
downloadZip(visJsonUrl, visJsonsPath).then(() => {
    return downloadZip(metadataUrl, metadataJsonsPath);
}).then(() => {
    console.log('done');
});
