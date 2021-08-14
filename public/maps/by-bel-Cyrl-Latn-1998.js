var map = function(Interscript) {Interscript.define_map("by-bel-Cyrl-Latn-1998", function(Interscript, map) {
map.dependencies = ["gost-rus-Cyrl-Latn-16876-71-1983","var-Cyrl"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Е", "IE");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")е", "ie");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Ё", "IO");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")ё", "io");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Ю", "IU");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")ю", "iu");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Я", "IA");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")я", "ia");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2611607026410213877);
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_784868854130705036);
s = Interscript.transliterate("gost-rus-Cyrl-Latn-16876-71-1983", s, "main");
return s;
};
map.cache.PTREE_2611607026410213877 = {"1047":{"1068":{"":"Ź"}},"1079":{"1100":{"":"ź"}},"1051":{"1068":{"":"Ĺ"}},"1083":{"1100":{"":"ĺ"}},"1057":{"1068":{"":"Ś"}},"1089":{"1100":{"":"ś"}},"1062":{"1068":{"":"Ć"}},"1094":{"1100":{"":"ć"}},"1053":{"1068":{"":"Ń"}},"1085":{"1100":{"":"ń"}}};
map.cache.PTREE_784868854130705036 = {"1030":{"":"I"},"1043":{"":"H"},"1045":{"":"Je"},"1025":{"":"Jo"},"1038":{"":"Ŭ"},"1061":{"":"Ch"},"1068":{"":""},"1069":{"":"E"},"1070":{"":"Ju"},"1071":{"":"Ja"},"1075":{"":"h"},"1110":{"":"i"},"1077":{"":"je"},"1105":{"":"jo"},"1118":{"":"ŭ"},"1093":{"":"ch"},"1100":{"":""},"1101":{"":"e"},"1102":{"":"ju"},"1103":{"":"ja"},"39":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }