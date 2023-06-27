var scripts = {
    Arab: { prio: 40, re: /[\u064B-\u0652]/u, decompose: true },
    Arab_UNDIACTR: { re: /\p{Script=Arab}/u },
    Armn: {},
    Beng: {},
    Cyrl: {},
    Deva: {},
    Ethi: {},
    Geok: {},
    Geor: {},
    Grek: {},
    Gujr: {},
    Guru: {},
    // Hang: {},
    Hani: {},
    Hans: { prio: 5 },
    Hebr: { prio: 40, re: /[\u0591-\u05C7]/u, decompose: true },
    Hebr_UNDIACTR: { re: /\p{Script=Hebr}/u },
    Hrkt: { re: /\p{Script=Hira}|\p{Script=Kana}/u, prio: 20 },
    Kana: {},
    Kore: { re: /\p{Script=Hang}/u, prio: 20 },
    Mlym: {},
    Mong: {},
    Orya: {},
    Sinh: {},
    Taml: {},
    Telu: {},
    Thaa: {},
    Thai: {},

    Latn: { prio: 0.3 }, // Try to detect other scripts first
};

for (var script in scripts) {
    if (!scripts.hasOwnProperty(script)) continue;
    try {
        if (scripts[script].re === undefined) scripts[script].re = new RegExp("\\p{Script=" + script + "}", "u");
    } catch (e) {
        delete scripts[script];
        // console.warn(script + " is not supported by this JS engine");
        continue;
    }
    if (scripts[script].prio === undefined) scripts[script].prio = 1;
}

function objMax(obj) {
    var maxkey = null;
    var maxval = -Infinity;
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (obj[key] > maxval) {
            maxval = obj[key];
            maxkey = key;
        }
    }
    return maxkey;
}

function detectCharacterScript(char) {
    for (var script in scripts) {
        if (!scripts.hasOwnProperty(script)) continue;

        var ch = scripts[script].decompose ? char.normalize("NFD") : char;

        if (char.match(scripts[script].re)) {
            return script;
        }
    }
}

function detectScript(str) {
    var results = {};
    var ary = Array.from(str); // String iterator iterates over codepoints (UTF-16)
    for (var i = 0; i < ary.length; i++) {
        var char = ary[i];
        var script = detectCharacterScript(char);
        if (script == null) continue;
        if (results[script] === undefined) results[script] = 0;
        results[script] += scripts[script].prio;
    }

    return objMax(results);
}

module.exports = {
    detectScript,
};
