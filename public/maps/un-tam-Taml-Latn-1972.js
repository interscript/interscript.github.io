var map = function(Interscript) {Interscript.define_map("un-tam-Taml-Latn-1972", function(Interscript, map) {
map.dependencies = [];
map.aliases.taml_chars_1 = "ா";
map.aliases_re.taml_chars_1 = "[ாிீுூெேைொோௌ◌்]";
map.stages.main = function(s) {
s = Interscript.gsub(s, "க(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "k");
s = Interscript.gsub(s, "ங(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ṅ");
s = Interscript.gsub(s, "ச(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ch");
s = Interscript.gsub(s, "ஞ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ñ");
s = Interscript.gsub(s, "ட(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ṭ");
s = Interscript.gsub(s, "ண(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ṇ");
s = Interscript.gsub(s, "த(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "t");
s = Interscript.gsub(s, "ந(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "n");
s = Interscript.gsub(s, "ப(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "p");
s = Interscript.gsub(s, "ம(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "m");
s = Interscript.gsub(s, "ய(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "y");
s = Interscript.gsub(s, "ர(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "r");
s = Interscript.gsub(s, "ல(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "l");
s = Interscript.gsub(s, "வ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "v");
s = Interscript.gsub(s, "ழ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "l̮");
s = Interscript.gsub(s, "ள(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ḷ");
s = Interscript.gsub(s, "ற(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ṟ");
s = Interscript.gsub(s, "ன(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ṉ");
s = Interscript.gsub(s, "ஜ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "j");
s = Interscript.gsub(s, "ஶ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "sh");
s = Interscript.gsub(s, "ஷ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "ṣh");
s = Interscript.gsub(s, "ஸ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "s");
s = Interscript.gsub(s, "ஹ(?="+Interscript.get_alias_re("un-tam-Taml-Latn-1972", "taml_chars_1")+")", "h");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_384218306374289837);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_384218306374289837 = {"2949":{"":"a"},"2950":{"":"ā"},"3006":{"":"ā"},"2951":{"":"i"},"3007":{"":"i"},"2952":{"":"ī"},"3008":{"":"ī"},"2953":{"":"u"},"3009":{"":"u"},"2954":{"":"ū"},"3010":{"":"ū"},"3014":{"":"ĕ"},"2958":{"":"ĕ"},"3015":{"":"e"},"2959":{"":"e"},"2960":{"":"ai"},"3016":{"":"ai"},"2962":{"":"ŏ"},"3018":{"":"ŏ"},"3019":{"":"o"},"2963":{"":"o"},"2964":{"":"au"},"3020":{"":"au"},"2947":{"":"ḥ"},"3021":{"":""},"2965":{"":"ka","3021":{"2999":{"":"kṣha"}}},"2969":{"":"ṅa"},"2970":{"":"cha"},"2974":{"":"ña"},"2975":{"":"ṭa"},"2979":{"":"ṇa"},"2980":{"":"ta"},"2984":{"":"na"},"2986":{"":"pa"},"2990":{"":"ma"},"2991":{"":"ya"},"2992":{"":"ra"},"2994":{"":"la"},"2997":{"":"va"},"2996":{"":"l̮a"},"2995":{"":"ḷa"},"2993":{"":"ṟa","3021":{"2993":{"":"ṟṟa"}}},"2985":{"":"ṉa","3021":{"2993":{"":"ṉṟa"}}},"2972":{"":"ja"},"2998":{"":"sha"},"2999":{"":"ṣha"},"3000":{"":"sa"},"3001":{"":"ha"},"3047":{"":"1"},"3048":{"":"2"},"3049":{"":"3"},"3050":{"":"4"},"3051":{"":"5"},"3052":{"":"6"},"3053":{"":"7"},"3054":{"":"8"},"3055":{"":"9"},"3046":{"":"0"},"3056":{"":"10"},"3057":{"":"100"},"3058":{"":"1000"},"8205":{"":""},"8204":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }