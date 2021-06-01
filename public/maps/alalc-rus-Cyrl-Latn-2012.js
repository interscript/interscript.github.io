var map = function(Interscript) {Interscript.define_map("alalc-rus-Cyrl-Latn-2012", function(Interscript, map) {
map.dependencies = ["alalc-rus-Cyrl-Latn-1997"];
map.stages.main = function(s) {
s = Interscript.transliterate("alalc-rus-Cyrl-Latn-1997", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3005327513095874522);
return s;
};
map.cache.PTREE_3005327513095874522 = {"1030":{"":"Ī"},"1110":{"":"ī"},"1122":{"":"I͡E"},"1123":{"":"i͡e"},"1138":{"":"Ḟ"},"1139":{"":"ḟ"},"1140":{"":"Ẏ"},"1141":{"":"ẏ"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }