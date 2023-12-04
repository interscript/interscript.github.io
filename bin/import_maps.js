//rm ./public/maps/*.js
//rm ./public/maps/*.json
const fs = require("fs");
const path = require("path");

const mapDir = "./public/maps";

fs.readdirSync(mapDir).forEach((f) => {
    if ([".js", ".json"].includes(path.extname(f).toLowerCase())) {
        fs.unlinkSync(path.join(mapDir, f));
    }
});

console.log("Initialized map data");

//cp ./node_modules/interscript/src/maps/* ./public/maps
const node_module_interscript = "./node_modules/interscript/src/maps";

fs.readdirSync(node_module_interscript).forEach((f) => {
    fs.copyFileSync(path.join(node_module_interscript, f), path.join(mapDir, f));
});

console.log("imported the latest map data from interscript npm package");
