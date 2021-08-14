var map = function(Interscript) {Interscript.define_map("bgnpcgn-sme-Latn-Latn-1984", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_516320231077374489);
return s;
};
map.cache.PTREE_516320231077374489 = {"330":{"":"Ń"},"331":{"":"ń"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }