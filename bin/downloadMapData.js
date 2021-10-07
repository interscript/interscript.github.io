const AdmZip = require("adm-zip");
const request = require("request");
const fs = require("fs-extra");
const path = require("path");

const visJsonUrl = "https://github.com/interscript/interscript-ruby/releases/latest/download/vis_json.zip";
const metadataUrl = "https://github.com/interscript/interscript-ruby/releases/latest/download/metadata.json.zip";
const basePath = "./map";

async function downloadZip(inputUrl) {
    return new Promise((resolve, reject) => {
        request.get({ url: inputUrl, encoding: null }, (err, res, body) => {
            if (err) {
                reject(err);
                throw new Error(err);
            }

            const zip = new AdmZip(body);
            const zipEntries = zip.getEntries();
            const promises = zipEntries.map((entry) => {
                const body = zip.readAsText(entry, "utf8");
                const targetPath = path.join(basePath, entry.entryName);
                return fs.outputFile(path.normalize(targetPath), body, (err) => {
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

(async function () {
    console.log(`Downloading map data and extracting to ${basePath}...`);
    await downloadZip(visJsonUrl);
    await downloadZip(metadataUrl);
    console.log("Successfully Done");
})();
