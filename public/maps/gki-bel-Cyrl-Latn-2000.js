var map = function(Interscript) {Interscript.define_map("gki-bel-Cyrl-Latn-2000", function(Interscript, map) {
map.dependencies = ["var-Cyrl"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Е", "IE");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")е", "ie");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Ё", "IO");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")ё", "io");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Ю", "IU");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")ю", "iu");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")Я", "IA");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-Cyrl", "bel_consonant")+")я", "ia");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2075375117821008704);
s = Interscript.gsub(s, "Ь", "'");
s = Interscript.gsub(s, "ь", "'");
return s;
};
map.cache.PTREE_2075375117821008704 = {"39":{"":""},"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"H"},"1044":{"":"D"},"1045":{"":"Je"},"1025":{"":"Jo"},"1046":{"":"Ž"},"1047":{"":"Z"},"1030":{"":"I"},"1049":{"":"J"},"1050":{"":"K"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"85":{"48":{"52":{"48":{"69":{"":"Ŭ"}}}}},"1060":{"":"F"},"1061":{"":"Ch"},"1062":{"":"C"},"1063":{"":"Č"},"1064":{"":"Š"},"1067":{"":"Y"},"1069":{"":"E"},"1070":{"":"Ju"},"1071":{"":"Ja"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"h"},"1076":{"":"d"},"1077":{"":"je"},"1105":{"":"jo"},"1078":{"":"ž"},"1079":{"":"z"},"1110":{"":"i"},"1081":{"":"j"},"1082":{"":"k"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1118":{"":"ŭ"},"1092":{"":"f"},"1093":{"":"ch"},"1094":{"":"c"},"1095":{"":"č"},"1096":{"":"š"},"1099":{"":"y"},"1101":{"":"e"},"1102":{"":"ju"},"1103":{"":"ja"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }