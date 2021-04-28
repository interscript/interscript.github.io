var map = function(Interscript) {Interscript.define_map("mvd-bel-Cyrl-Latn-2010", function(Interscript, map) {
map.dependencies = ["mvd-bel-Cyrl-Latn-2008"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<=[ЗзЛлНнСсЦц])ь", "$1");
s = Interscript.gsub(s, "(?<=[ЗзЛлНнСсЦц])ʹ", "$1");
s = Interscript.gsub(s, "(?<=[ЕеЁёЫыЮюЯя])Й"+Interscript.aliases.line_end+"", "");
s = Interscript.gsub(s, "(?<=[ЕеЁёЫыЮюЯя])й"+Interscript.aliases.line_end+"", "");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2816857265216317655);
s = Interscript.transliterate("mvd-bel-Cyrl-Latn-2008", s, "main");
return s;
};
map.cache.PTREE_2816857265216317655 = {"1043":{"":"H"},"1075":{"":"h"},"1068":{"":""},"1100":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }