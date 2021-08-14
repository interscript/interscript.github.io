var map = function(Interscript) {Interscript.define_map("gki-bel-Cyrl-Latn-1992", function(Interscript, map) {
map.dependencies = ["gost-rus-Cyrl-Latn-16876-71-1983"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2201615903152672020);
s = Interscript.transliterate("gost-rus-Cyrl-Latn-16876-71-1983", s, "main");
return s;
};
map.cache.PTREE_2201615903152672020 = {"1030":{"":"I"},"1110":{"":"i"},"1043":{"":"G"},"1075":{"":"g"},"1038":{"":"Ŭ"},"1118":{"":"ŭ"},"1070":{"":"Ju"},"1102":{"":"ju"},"1071":{"":"Ja"},"1103":{"":"ja"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }