var map = function(Interscript) {Interscript.define_map("bgn-jpn-Hrkt-Latn-1962", function(Interscript, map) {
map.dependencies = ["var-jpn-Hrkt-Latn-hepburn-1954"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "[んン](?=[ばびぶべぼまみむめもぱぴぷぺぽバビブベボマミムメモパピプペポ])", "m");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3119097425334281355);
s = Interscript.transliterate("var-jpn-Hrkt-Latn-hepburn-1954", s, "main");
return s;
};
map.cache.PTREE_3119097425334281355 = {"12369":{"":"ke"},"12465":{"":"ke"},"12534":{"":"ga"},"12399":{"":"ha"},"12402":{"":"hi"},"12405":{"":"fu"},"12408":{"":"he"},"12411":{"":"ho"},"12495":{"":"ha"},"12498":{"":"hi"},"12501":{"":"fu"},"12504":{"":"he"},"12507":{"":"ho"},"12432":{"":"i"},"12433":{"":"e"},"12528":{"":"i"},"12529":{"":"e"},"12367":{"12431":{"":"ka","12358":{"":"kō"}}},"12368":{"12431":{"":"ga","12358":{"":"gō"}}},"12463":{"12527":{"":"ka","12454":{"":"kō"}}},"12464":{"12527":{"":"ga","12454":{"":"gō"}}}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }