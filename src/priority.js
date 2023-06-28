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

function test() {
    console.log(getTargetScriptByWeight(["Hang", "Latn"]));
    console.log(getTargetScriptByWeight(["Hang", "Cyrl"]));
}

test();

module.exports = {
    getTargetScriptByWeight,
};
