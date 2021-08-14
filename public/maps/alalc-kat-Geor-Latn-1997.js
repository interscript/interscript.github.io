var map = function(Interscript) {Interscript.define_map("alalc-kat-Geor-Latn-1997", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2303204256834855523);
return s;
};
map.cache.PTREE_2303204256834855523 = {"4304":{"":"a"},"4305":{"":"b"},"4306":{"":"g"},"4307":{"":"d"},"4308":{"":"e"},"4309":{"":"v"},"4310":{"":"z"},"4337":{"":"ē"},"4311":{"":"tʻ"},"4312":{"":"i"},"4313":{"":"k"},"4314":{"":"l"},"4315":{"":"m"},"4316":{"":"n"},"4338":{"":"y"},"4317":{"":"o"},"4318":{"":"p"},"4319":{"":"ž"},"4320":{"":"r"},"4321":{"":"s"},"4322":{"":"t"},"4339":{"":"w"},"4323":{"":"u"},"4324":{"":"pʻ"},"4325":{"":"kʻ"},"4326":{"":"ġ"},"4327":{"":"q"},"4328":{"":"š"},"4329":{"":"čʻ"},"4330":{"":"cʻ"},"4331":{"":"ż"},"4332":{"":"c"},"4333":{"":"č"},"4334":{"":"x"},"4340":{"":"x̣"},"4335":{"":"j"},"4336":{"":"h"},"4341":{"":"ō"},"4342":{"":"f"},"4343":{"":"ĕ"},"4344":{"":"ʻ"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }