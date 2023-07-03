const target_script_weights = {
    Latn: 0.9,
    Cyrl: 0.7,
    Hang: 0.1,
};

function getTargetScriptByWeight(targetScripts) {
    if (!targetScripts || targetScripts.length === 0) return;

    let ret = targetScripts[0];
    for (i = 1; i < targetScripts.length; i++) {
        if (target_script_weights[ret] < target_script_weights[targetScripts[i]]) {
            ret = targetScripts[i];
        }
    }
    return ret;
}

function getYearOfSystem(system) {
    if (!!system) {
        const id = system.id;
        if (id.search(/\b(18|19|20)\d{2}\b/) >= 0) {
            return Number(id.match(/\b(18|19|20)\d{2}\b/)[0]);
        }
    }
    return undefined;
}

function sortSystemsByCreationDate(systems) {
    return systems.map((s) => ({ system: s, year: getYearOfSystem(s) })).sort((a, b) => b.year - a.year);
}

function getLatestSystem(systems) {
    if (!systems || !systems.length) return;
    return sortSystemsByCreationDate(systems)[0].system;
}

function test() {
    console.log(getTargetScriptByWeight(["Hang", "Latn"]));
    console.log(getTargetScriptByWeight(["Hang", "Cyrl"]));
}

test();

module.exports = {
    getTargetScriptByWeight,
    getLatestSystem,
};
