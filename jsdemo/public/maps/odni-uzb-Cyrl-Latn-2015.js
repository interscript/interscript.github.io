var map = function(Interscript) {Interscript.define_map("odni-uzb-Cyrl-Latn-2015", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "("+Interscript.aliases.any_character+")\\1", "$1");
s = Interscript.gsub(s, "("+Interscript.aliases.any_character+")\\1", "$1");
s = Interscript.gsub(s, "("+Interscript.aliases.any_character+")\\1", "$1");
s = Interscript.gsub(s, "("+Interscript.aliases.any_character+")\\1", "$1");
s = Interscript.gsub(s, "("+Interscript.aliases.any_character+")\\1", "$1");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_53052874731807155);
return s;
};
map.cache.PTREE_53052874731807155 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1170":{"":"Gh"},"1044":{"":"D"},"1045":{"":"E"},"1025":{"":"Yo"},"1046":{"":"J"},"1047":{"":"Z"},"1048":{"":"I"},"1049":{"":"Y"},"1050":{"":"K"},"1178":{"":"Q"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"1038":{"":"O"},"1060":{"":"F"},"1061":{"":"Kh"},"1202":{"":"H"},"1062":{"":"Ts"},"1063":{"":"Ch"},"1064":{"":"Sh"},"1069":{"":"E"},"1070":{"":"Yu"},"1071":{"":"Ya"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1171":{"":"gh"},"1076":{"":"d"},"1077":{"":"e"},"1105":{"":"yo"},"1078":{"":"j"},"1079":{"":"z"},"1080":{"":"i"},"1081":{"":"y"},"1082":{"":"k"},"1179":{"":"q"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1118":{"":"o"},"1092":{"":"f"},"1099":{"":"y"},"1095":{"":"ch"},"1103":{"":"ia"},"1102":{"":"iu"},"1093":{"":"kh"},"1203":{"":"h"},"1096":{"":"sh"},"1101":{"":"e"},"1097":{"":"shch"},"1094":{"":"ts"},"1169":{"":"g"},"1131":{"":"u"},"1106":{"":"d"},"1109":{"":"dz"},"1112":{"":"j"},"1113":{"":"lj"},"1114":{"":"nj"},"1211":{"":"c"},"1119":{"":"dz"},"1108":{"":"ie"},"1111":{"":"i"},"1107":{"":"g"},"1066":{"":""},"1068":{"":""},"1098":{"":""},"1100":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }