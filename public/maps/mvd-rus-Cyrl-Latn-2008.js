var map = function(Interscript) {Interscript.define_map("mvd-rus-Cyrl-Latn-2008", function(Interscript, map) {
map.dependencies = [];
map.stages.translit = function(s) {
s = Interscript.gsub(s, "(?<=[ЗзЛлНнСсЦц])ь", "́");
s = Interscript.gsub(s, "(?<=[ЗзЛлНнСсЦц])ʹ", "́");
s = Interscript.gsub(s, "[’Ъъ]Ю", "Ju");
s = Interscript.gsub(s, "[’Ъъ]ю", "ju");
s = Interscript.gsub(s, "[’Ъъ]Я", "Ja");
s = Interscript.gsub(s, "[’Ъъ]я", "ja");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2099985645984487261);
return s;
};
map.stages.main = function(s) {
s = Interscript.transliterate("mvd-rus-Cyrl-Latn-2008", s, "translit");
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_2099985645984487261 = {"8217":{"":"j"},"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1044":{"":"D"},"1045":{"":"E"},"1025":{"":"E"},"1046":{"":"Zh"},"1047":{"":"Z"},"1030":{"":"I"},"1049":{"":"J"},"1050":{"":"K"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"92":{"85":{"48":{"52":{"48":{"69":{"":"W"}}}}}},"1060":{"":"F"},"1061":{"":"Kh"},"1062":{"":"Ts"},"1063":{"":"Ch"},"1064":{"":"Sh"},"1065":{"":"Shch"},"1066":{"":"J"},"1067":{"":"Y"},"1068":{"":""},"1069":{"":"E"},"1070":{"":"Iu"},"1071":{"":"Ia"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1076":{"":"d"},"1077":{"":"e"},"1105":{"":"e"},"1078":{"":"zh"},"1079":{"":"z"},"1110":{"":"i"},"1081":{"":"j"},"1082":{"":"k"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1118":{"":"w"},"1092":{"":"f"},"1093":{"":"kh"},"1094":{"":"ts"},"1095":{"":"ch"},"1096":{"":"sh"},"1097":{"":"shch"},"1098":{"":"j"},"1099":{"":"y"},"1100":{"":""},"1101":{"":"e"},"1102":{"":"iu"},"1103":{"":"ia"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }