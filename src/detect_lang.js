import { franc, francAll } from "franc-all";

/** ISO 639-3 Macrolanguage Mappings
 ** https://iso639-3.sil.org/code_tables/macrolanguage_mappings/data
 * `franc` package depends on iso-639-3, while interscript use iso-639-2
 * New language codes of iso 639-3 never work for our codebase.
 * eg: 'cmn' (Mandarin Chinese) => 'zho'
 * This table provides the complete set of mappings from macrolanguages to the individual languages that comprise them.
 * Note: many new languages doesn't correspond to macrolanguages.
 *       144 languages supported by `franc`  (eg: `acu`, `agr`, `ajg`, `bci` ...)
 ***/
const macroMapping = require("./iso-639-3-macrolanguage-mappings.json");

const supportedLanguages = [
    "amh",
    "ara",
    "arm",
    "asm",
    "aze",
    "bak",
    "bal",
    "bel",
    "ben",
    "bul",
    "che",
    "deu",
    "dev",
    "div",
    "ell",
    "fao",
    "fas",
    "gez",
    "grc",
    "guj",
    "heb",
    "hin",
    "inc",
    "isl",
    "jpn",
    "kan",
    "kat",
    "kaz",
    "kir",
    "kor",
    "kur",
    "mal",
    "mar",
    "mkd",
    "mlm",
    "mon",
    "nep",
    "ori",
    "pan",
    "per",
    "pli",
    "pnj",
    "pra",
    "prs",
    "pus",
    "ron",
    "rue",
    "rus",
    "san",
    "sin",
    "sme",
    "srp",
    "tam",
    "tat",
    "tel",
    "tgk",
    "tha",
    "tir",
    "tml",
    "tuk",
    "uig",
    "ukr",
    "urd",
    "uzb",
    "yue",
    "zho",
];

export function detectLanguage(str, langList) {
    let only = langList;

    // improvement for chinese
    if (only.includes("zho")) {
        only = only.map((i) => i.replace("zho", "cmn"));
    }

    const result = franc(str, { minLength: 3, only });
    if (result === "und") return undefined;

    if (supportedLanguages.includes(result)) return result;

    if (!!macroMapping[result]) return macroMapping[result];

    return undefined;
}

export function detectAllLanguage(str, only) {
    return francAll(str, { minLength: 2, only });
}
