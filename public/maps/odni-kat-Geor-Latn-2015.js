var map = function(Interscript) {Interscript.define_map("odni-kat-Geor-Latn-2015", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4573158703679754154);
return s;
};
map.cache.PTREE_4573158703679754154 = {"4304":{"":"a"},"4305":{"":"b"},"4306":{"":"g"},"4307":{"":"d"},"4308":{"":"e"},"4309":{"":"v"},"4310":{"":"z"},"4311":{"":"t"},"4312":{"":"i"},"4313":{"":"k"},"4314":{"":"l"},"4315":{"":"m"},"4316":{"":"n"},"4317":{"":"o"},"4318":{"":"p"},"4319":{"":"zh"},"4320":{"":"r"},"4321":{"":"s"},"4322":{"":"t"},"4323":{"":"u"},"4324":{"":"p"},"4325":{"":"k"},"4326":{"":"gh"},"4327":{"":"q"},"4328":{"":"sh"},"4329":{"":"ch"},"4330":{"":"ts"},"4331":{"":"dz"},"4332":{"":"ts"},"4333":{"":"ch"},"4334":{"":"kh"},"4335":{"":"j"},"4336":{"":"h"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }