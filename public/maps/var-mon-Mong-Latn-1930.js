var map = function(Interscript) {Interscript.define_map("var-mon-Mong-Latn-1930", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1323764331865284520);
return s;
};
map.cache.PTREE_1323764331865284520 = {"6176":{"":"a"},"6177":{"":"e"},"6178":{"":"i"},"6179":{"":"o"},"6180":{"":"u"},"6181":{"":"ө"},"6182":{"":"y"},"6184":{"":"n"},"6190":{"":"m"},"6191":{"":"l"},"6186":{"":"b"},"6187":{"":"p"},"6201":{"":"f"},"6203":{"":"k"},"6188":{"":"k"},"6189":{"":"g"},"6192":{"":"s"},"6193":{"":"ş"},"6194":{"":"t"},"6195":{"":"d"},"6196":{"":"ç"},"6197":{"":"ƶ"},"6198":{"":"j"},"6199":{"":"r"},"6206":{"":"h"},"6145":{"":"..."},"6146":{"":","},"6147":{"":"."},"6158":{"":"-"},"8239":{"":"-"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }