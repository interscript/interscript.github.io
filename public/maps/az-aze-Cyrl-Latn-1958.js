var map = function(Interscript) {Interscript.define_map("az-aze-Cyrl-Latn-1958", function(Interscript, map) {
map.dependencies = ["az-aze-Cyrl-Latn-1939"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "Й", "J");
s = Interscript.gsub(s, "й", "j");
s = Interscript.transliterate("az-aze-Cyrl-Latn-1939", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4155417682682638599);
return s;
};
map.cache.PTREE_4155417682682638599 = {"1032":{"":"Y"},"1049":{"":"J"},"1062":{"":""},"1069":{"":""},"1070":{"":""},"1071":{"":""},"1112":{"":"y"},"1081":{"":"j"},"1094":{"":""},"1101":{"":""},"1102":{"":""},"1103":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }