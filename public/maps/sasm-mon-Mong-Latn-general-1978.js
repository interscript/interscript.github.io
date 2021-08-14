var map = function(Interscript) {Interscript.define_map("sasm-mon-Mong-Latn-general-1978", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4059161539531496746);
return s;
};
map.cache.PTREE_4059161539531496746 = {"6176":{"":"a"},"6186":{"":"b"},"6204":{"":"c"},"6195":{"":"d"},"6177":{"":"e"},"6201":{"":"f"},"6189":{"":"g"},"6188":{"":"h"},"6206":{"":"h"},"6178":{"":"i"},"6197":{"":"j"},"6202":{"":"k"},"6191":{"":"l"},"6190":{"":"m"},"6184":{"":"n"},"6181":{"":"o"},"6187":{"":"p"},"6196":{"":"q"},"6199":{"":"r"},"6192":{"":"s"},"6194":{"":"t"},"6182":{"":"u"},"6200":{"":"w"},"6193":{"":"x"},"6198":{"":"y"},"6205":{"":"z"},"6179":{"":"o"},"6180":{"":"u"},"6183":{"":"e"},"6185":{"":"ng"},"6158":{"":"-"},"8239":{"":"-"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }