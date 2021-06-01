var map = function(Interscript) {Interscript.define_map("bgnpcgn-uzb-Cyrl-Latn-2000", function(Interscript, map) {
map.dependencies = ["bgnpcgn-uzb-Cyrl-Latn-1979"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЙйЬь])Е", "Ye");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЙйЬь])е", "ye");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2414490483934449116);
s = Interscript.transliterate("bgnpcgn-uzb-Cyrl-Latn-1979", s, "main");
return s;
};
map.cache.PTREE_2414490483934449116 = {"1042":{"":"V"},"1170":{"":"G‘"},"1046":{"":"J"},"1038":{"":"O‘"},"1061":{"":"X"},"1066":{"":"’"},"1068":{"":"’"},"1074":{"":"w"},"1171":{"":"g‘"},"1078":{"":"j"},"1118":{"":"o‘"},"1093":{"":"x"},"1098":{"":"’"},"1100":{"":"’"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }