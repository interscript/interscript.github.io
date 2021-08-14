var map = function(Interscript) {Interscript.define_map("odni-che-Cyrl-Latn-2015", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+"’)"+Interscript.aliases.boundary+"Е", "Ye");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+"’)"+Interscript.aliases.boundary+"е", "ye");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.not_word+")1(?="+Interscript.aliases.not_word+")", "ӏ");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.not_word+")1", "ӏ");
s = Interscript.gsub(s, "1(?="+Interscript.aliases.not_word+")", "ӏ");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2271540441178642862);
return s;
};
map.cache.PTREE_2271540441178642862 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G","1216":{"":"Gh"}},"1044":{"":"D"},"1045":{"":"E"},"1046":{"":"J"},"1047":{"":"Z"},"1048":{"":"I","1067":{"":"I"}},"1067":{"":"Е"},"1050":{"":"K","1216":{"":"K"},"1093":{"":"Q"},"1098":{"":"Q"}},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P","1216":{"":"Ph"}},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T","1216":{"":"T"}},"1059":{"":"U"},"1060":{"":"F"},"1061":{"":"Kh","1100":{"":"H"},"1216":{"":"H"}},"1208":{"":"Ts","1216":{"":"Ts"}},"1063":{"":"Ch","1216":{"":"Ch"}},"1064":{"":"Sh"},"1066":{"":"'"},"1069":{"":"E"},"1070":{"":"Yu"},"1071":{"":"Ya"},"1216":{"":"'"},"1068":{"":""},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g","1231":{"":"gh"}},"1076":{"":"d"},"1077":{"":"e"},"1078":{"":"j"},"1079":{"":"z"},"1080":{"":"i","1081":{"":"i"}},"1081":{"":"y"},"1082":{"":"k","1231":{"":"k"},"1093":{"":"q"},"1098":{"":"q"}},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t","1231":{"":"t"}},"1091":{"":"u"},"1092":{"":"f"},"1093":{"":"kh","1100":{"":"h"},"1231":{"":"h"}},"1209":{"":"ts","1231":{"":"ts"}},"1095":{"":"ch","1231":{"":"ch"}},"1096":{"":"sh"},"1098":{"":"'"},"1099":{"":"e"},"1101":{"":"e"},"1102":{"":"yu"},"1103":{"":"ya"},"1231":{"":"'"},"1100":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }