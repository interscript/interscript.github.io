var map = function(Interscript) {Interscript.define_map("bgnpcgn-div-Thaa-Latn-1988", function(Interscript, map) {
map.dependencies = ["mv-div-Thaa-Latn-1987"];
map.stages.main = function(s) {
s = Interscript.transliterate("mv-div-Thaa-Latn-1987", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2015499929350859869);
return s;
};
map.cache.PTREE_2015499929350859869 = {"1944":{"":"th’"},"1945":{"":"h’"},"1946":{"":"kh"},"1947":{"":"dh’"},"1948":{"":"x"},"1949":{"":"sh’"},"1950":{"":"s’"},"1951":{"":"l’"},"1952":{"":"t’"},"1953":{"":"z’"},"1954":{"":"’"},"1955":{"":"gh"},"1956":{"":"q"},"1957":{"":"w"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }