var map = function(Interscript) {Interscript.define_map("dos-nep-Deva-Latn-1997", function(Interscript, map) {
map.dependencies = ["bgnpcgn-nep-Deva-Latn-2011"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1659819718731030580);
s = Interscript.transliterate("bgnpcgn-nep-Deva-Latn-2011", s, "main");
return s;
};
map.cache.PTREE_1659819718731030580 = {"2307":{"":"h"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }