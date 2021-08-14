var map = function(Interscript) {Interscript.define_map("odni-kir-Cyrl-Latn-2015", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "([Ёё])[Ёё]", "$1");
s = Interscript.gsub(s, "([Ңң])[Ңң]", "$1");
s = Interscript.gsub(s, "([Хх])[Хх]", "$1");
s = Interscript.gsub(s, "([Цц])[Цц]", "$1");
s = Interscript.gsub(s, "([Чч])[Чч]", "$1");
s = Interscript.gsub(s, "([Шш])[Шш]", "$1");
s = Interscript.gsub(s, "([Щщ])[Щщ]", "$1");
s = Interscript.gsub(s, "([Юю])[Юю]", "$1");
s = Interscript.gsub(s, "([Яя])[Яя]", "$1");
s = Interscript.gsub(s, "[ъь]", Interscript.aliases.none);
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4471296185590880911);
return s;
};
map.cache.PTREE_4471296185590880911 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1044":{"":"D"},"1045":{"":"E"},"1025":{"":"Yo"},"1046":{"":"J"},"1047":{"":"Z"},"1048":{"":"I"},"1049":{"":"Y"},"1050":{"":"K"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1186":{"":"Ng"},"1054":{"":"O"},"1256":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"1198":{"":"U"},"1060":{"":"F"},"1061":{"":"Kh"},"1062":{"":"Ts"},"1063":{"":"Ch"},"1064":{"":"Sh"},"1065":{"":"Shch"},"1067":{"":"Y"},"1069":{"":"E"},"1070":{"":"Yu"},"1071":{"":"Ya"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1076":{"":"d"},"1077":{"":"e"},"1105":{"":"yo"},"1078":{"":"j"},"1079":{"":"z"},"1080":{"":"i"},"1081":{"":"y"},"1082":{"":"k"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1187":{"":"ng"},"1086":{"":"o"},"1257":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1199":{"":"u"},"1092":{"":"f"},"1093":{"":"kh"},"1094":{"":"ts"},"1095":{"":"ch"},"1096":{"":"sh"},"1097":{"":"shch"},"1099":{"":"y"},"1101":{"":"e"},"1102":{"":"yu"},"1103":{"":"ya"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }