var map = function(Interscript) {Interscript.define_map("iso-ell-Grek-Latn-843-1997-t2", function(Interscript, map) {
map.dependencies = ["elot-ell-Grek-Latn-743-1982-ts"];
map.stages.main = function(s) {
s = Interscript.transliterate("elot-ell-Grek-Latn-743-1982-ts", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_449952976550681280);
return s;
};
map.cache.PTREE_449952976550681280 = {"988":{"":"W"},"989":{"":"w"},"1010":{"":"s"},"1017":{"":"S"},"1011":{"":"j"},"895":{"":"j"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }