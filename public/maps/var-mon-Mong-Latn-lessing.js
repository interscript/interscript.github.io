var map = function(Interscript) {Interscript.define_map("var-mon-Mong-Latn-lessing", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "ᠬ(?=[ᠡᠢᠥᠦ])", "k");
s = Interscript.gsub(s, "ᠭ(?=[ᠡᠢᠥᠦ])", "g");
s = Interscript.gsub(s, "ᠠᠶᠢ", "ai");
s = Interscript.gsub(s, "ᠡᠶᠢ", "ei");
s = Interscript.gsub(s, "ᠣᠶᠢ", "oi");
s = Interscript.gsub(s, "ᠤᠶᠢ", "ui");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_157852574903420550);
return s;
};
map.cache.PTREE_157852574903420550 = {"6176":{"":"a"},"6177":{"":"e"},"6178":{"":"i"},"6179":{"":"o"},"6180":{"":"u"},"6181":{"":"ø"},"6182":{"":"y"},"6184":{"":"n"},"6185":{"":"ng"},"6188":{"":"x"},"6189":{"":"γ"},"6186":{"":"b"},"6187":{"":"p"},"6201":{"":"f"},"6192":{"":"s"},"6193":{"":"š"},"6194":{"":"t"},"6195":{"":"d"},"6191":{"":"l"},"6190":{"":"m"},"6196":{"":"c"},"6197":{"":"z"},"6198":{"":"j"},"6202":{"":"k"},"6199":{"":"r"},"6200":{"":"v"},"6206":{"":"h"},"6145":{"":"..."},"6146":{"":","},"6147":{"":"."},"6148":{"":":"},"6158":{"":"-"},"8239":{"":"-"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }