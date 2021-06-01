var map = function(Interscript) {Interscript.define_map("un-rus-Cyrl-Latn-1987", function(Interscript, map) {
map.dependencies = ["gost-rus-Cyrl-Latn-16876-71-1983"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2323016563025756127);
s = Interscript.transliterate("gost-rus-Cyrl-Latn-16876-71-1983", s, "main");
return s;
};
map.cache.PTREE_2323016563025756127 = {"1066":{"":"”"},"1068":{"":"’"},"1098":{"":"”"},"1100":{"":"’"},"1070":{"":"Ju"},"1102":{"":"ju"},"1071":{"":"Ja"},"1103":{"":"ja"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }