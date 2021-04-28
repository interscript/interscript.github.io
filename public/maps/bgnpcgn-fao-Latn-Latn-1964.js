var map = function(Interscript) {Interscript.define_map("bgnpcgn-fao-Latn-Latn-1964", function(Interscript, map) {
map.dependencies = ["bgnpcgn-isl-Latn-Latn-1964"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2058861402019489657);
s = Interscript.transliterate("bgnpcgn-isl-Latn-Latn-1964", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1847031894688660198);
return s;
};
map.cache.PTREE_2058861402019489657 = {"222":{"":"<XXX>"},"254":{"":"<xxx>"}};
map.cache.PTREE_1847031894688660198 = {"60":{"88":{"88":{"88":{"62":{"":"Þ"}}}},"120":{"120":{"120":{"62":{"":"þ"}}}}}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }