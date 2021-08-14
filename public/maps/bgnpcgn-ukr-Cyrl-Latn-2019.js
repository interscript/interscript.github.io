var map = function(Interscript) {Interscript.define_map("bgnpcgn-ukr-Cyrl-Latn-2019", function(Interscript, map) {
map.dependencies = ["un-ukr-Cyrl-Latn-2012"];
map.stages.main = function(s) {
s = Interscript.transliterate("un-ukr-Cyrl-Latn-2012", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2309228644331759196);
return s;
};
map.cache.PTREE_2309228644331759196 = {"39":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }