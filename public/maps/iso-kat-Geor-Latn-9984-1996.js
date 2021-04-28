var map = function(Interscript) {Interscript.define_map("iso-kat-Geor-Latn-9984-1996", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4156730314551226462);
return s;
};
map.cache.PTREE_4156730314551226462 = {"4304":{"":"a"},"4305":{"":"b"},"4306":{"":"g"},"4307":{"":"d"},"4308":{"":"e"},"4309":{"":"v"},"4310":{"":"z"},"4337":{"":"ē"},"4311":{"":"t̕"},"4312":{"":"i"},"4313":{"":"k"},"4314":{"":"l"},"4315":{"":"m"},"4316":{"":"n"},"4338":{"":"y"},"4317":{"":"o"},"4318":{"":"p"},"4319":{"":"ž"},"4320":{"":"r"},"4321":{"":"s"},"4322":{"":"t"},"4339":{"":"w"},"4323":{"":"u"},"4324":{"":"p̕"},"4325":{"":"k̕"},"4326":{"":"ḡ"},"4327":{"":"q"},"4328":{"":"š"},"4329":{"":"č̕"},"4330":{"":"c̕"},"4331":{"":"j"},"4332":{"":"c"},"4333":{"":"č"},"4334":{"":"x"},"4340":{"":"ẖ"},"4335":{"":"ǰ"},"4336":{"":"h"},"4341":{"":"ō"},"4342":{"":"f"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }