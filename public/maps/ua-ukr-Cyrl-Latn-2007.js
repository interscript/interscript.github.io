var map = function(Interscript) {Interscript.define_map("ua-ukr-Cyrl-Latn-2007", function(Interscript, map) {
map.dependencies = ["ua-ukr-Cyrl-Latn-1996"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "'", "");
s = Interscript.gsub(s, "’", "");
s = Interscript.gsub(s, "(?<=[З])Г", "GH");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Є", "YE");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Ї", "I");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Ю", "YU");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Я", "YA");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2984464532841212144);
s = Interscript.transliterate("ua-ukr-Cyrl-Latn-1996", s, "main");
return s;
};
map.cache.PTREE_2984464532841212144 = {"1043":{"":"G"},"1168":{"":"G"},"1028":{"":"IE"},"1046":{"":"ZH"},"1061":{"":"KH"},"1062":{"":"TS"},"1063":{"":"CH"},"1064":{"":"SH"},"1065":{"":"SHCH"},"1070":{"":"IU"},"1071":{"":"IA"},"1068":{"":""},"1075":{"":"g"},"1169":{"":"g"},"1097":{"":"shch"},"1102":{"":"iu"},"1103":{"":"ia"},"1100":{"":""},"39":{"":""},"8217":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }