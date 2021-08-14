var map = function(Interscript) {Interscript.define_map("din-tam-Taml-Latn-33903-2016", function(Interscript, map) {
map.dependencies = [];
map.aliases.taml_chars_1 = "ா";
map.aliases_re.taml_chars_1 = "[ாிீுூெேைொோௌोौ]";
map.stages.main = function(s) {
s = Interscript.gsub(s, "க(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "k");
s = Interscript.gsub(s, "ங(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ṅ");
s = Interscript.gsub(s, "ச(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "c");
s = Interscript.gsub(s, "ஞ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ñ");
s = Interscript.gsub(s, "ட(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ṭ");
s = Interscript.gsub(s, "ண(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ṇ");
s = Interscript.gsub(s, "த(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "t");
s = Interscript.gsub(s, "ந(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "n");
s = Interscript.gsub(s, "ப(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "p");
s = Interscript.gsub(s, "ம(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "m");
s = Interscript.gsub(s, "ய(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "y");
s = Interscript.gsub(s, "ர(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "r");
s = Interscript.gsub(s, "ல(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "l");
s = Interscript.gsub(s, "ள(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ḷ");
s = Interscript.gsub(s, "ழ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ḻ");
s = Interscript.gsub(s, "வ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "v");
s = Interscript.gsub(s, "ற(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ṟ");
s = Interscript.gsub(s, "ன(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ṉ");
s = Interscript.gsub(s, "ஜ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "j");
s = Interscript.gsub(s, "ஶ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ś");
s = Interscript.gsub(s, "ஷ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "ṣ");
s = Interscript.gsub(s, "ஸ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "s");
s = Interscript.gsub(s, "ஹ(?="+Interscript.get_alias_re("din-tam-Taml-Latn-33903-2016", "taml_chars_1")+")", "h");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4000342468192217949);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_4000342468192217949 = {"2949":{"":"a"},"2950":{"":"ā"},"3006":{"":"ā"},"2951":{"":"i"},"3007":{"":"i"},"2952":{"":"ī"},"3008":{"":"ī"},"2953":{"":"u"},"3009":{"":"u"},"2954":{"":"ū"},"3010":{"":"ū"},"3014":{"":"e"},"2958":{"":"e"},"3015":{"":"ē"},"2959":{"":"ē"},"2960":{"":"ai"},"3016":{"":"ai"},"2962":{"":"o"},"3018":{"":"o"},"3019":{"":"ō"},"2963":{"":"ō"},"2964":{"":"au"},"3020":{"":"au"},"2965":{"3021":{"":"k"},"":"ka"},"2969":{"3021":{"":"ṅ"},"":"ṅa"},"2970":{"3021":{"":"c"},"":"ca"},"2974":{"3021":{"":"ñ"},"":"ña"},"2975":{"3021":{"":"ṭ"},"":"ṭa"},"2979":{"3021":{"":"ṇ"},"":"ṇa"},"2980":{"3021":{"":"t"},"":"ta"},"2984":{"3021":{"":"n"},"":"na"},"2986":{"3021":{"":"p"},"":"pa"},"2990":{"3021":{"":"m"},"":"ma"},"2991":{"3021":{"":"y"},"":"ya"},"2992":{"3021":{"":"r"},"":"ra"},"2994":{"3021":{"":"l"},"":"la"},"2995":{"3021":{"":"ḷ"},"":"ḷa"},"2996":{"3021":{"":"ḻ"},"":"ḻa"},"2997":{"3021":{"":"v"},"":"va"},"2993":{"3021":{"":"ṟ"},"":"ṟa"},"2985":{"3021":{"":"ṉ"},"":"ṉa"},"2972":{"3021":{"":"j"},"":"ja"},"2998":{"3021":{"":"ś"},"":"śa"},"2999":{"3021":{"":"ṣ"},"":"ṣa"},"3000":{"3021":{"":"s"},"":"sa"},"3001":{"3021":{"":"h"},"":"ha"},"2947":{"":"ḵ"},"3047":{"":"1"},"3048":{"":"2"},"3049":{"":"3"},"3050":{"":"4"},"3051":{"":"5"},"3052":{"":"6"},"3053":{"":"7"},"3054":{"":"8"},"3055":{"":"9"},"3046":{"":"0"},"3056":{"":"10"},"3057":{"":"100"},"3058":{"":"1000"},"8205":{"":""},"8204":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }