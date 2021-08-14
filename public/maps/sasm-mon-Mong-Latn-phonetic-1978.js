var map = function(Interscript) {Interscript.define_map("sasm-mon-Mong-Latn-phonetic-1978", function(Interscript, map) {
map.dependencies = ["sasm-mon-Mong-Latn-general-1978"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1138265669077557001);
s = Interscript.transliterate("sasm-mon-Mong-Latn-general-1978", s, "main");
return s;
};
map.cache.PTREE_1138265669077557001 = {"6179":{"":"ô"},"6180":{"":"û"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }