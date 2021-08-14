var map = function(Interscript) {Interscript.define_map("stategeocadastre-ukr-Cyrl-Latn-1993", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"Є", "Ye");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"є", "ye");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"Й", "Y");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"Й", "y");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"Ю", "Yu");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"ю", "yu");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"Я", "Ya");
s = Interscript.gsub(s, "(?<!’)"+Interscript.aliases.boundary+"я", "ya");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"’"+Interscript.aliases.boundary+"", "");
s = Interscript.gsub(s, "ЬО", "IO");
s = Interscript.gsub(s, "ьо", "io");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2342943086686555638);
return s;
};
map.cache.PTREE_2342943086686555638 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"H"},"1168":{"":"G"},"1044":{"":"D"},"1045":{"":"E"},"1028":{"":"Ie"},"1046":{"":"Zh"},"1047":{"":"Z"},"1048":{"":"Y"},"1030":{"":"I"},"1031":{"":"Ï"},"1049":{"":"I"},"1050":{"":"K"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"1060":{"":"F"},"1061":{"":"Kh"},"1062":{"":"Ts"},"1063":{"":"Ch"},"1064":{"":"Sh"},"1065":{"":"Shch"},"1068":{"":"’"},"1070":{"":"Iu"},"1071":{"":"Ia"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"h"},"1169":{"":"g"},"1076":{"":"d"},"1077":{"":"e"},"1108":{"":"ie"},"1078":{"":"zh"},"1079":{"":"z"},"1080":{"":"y"},"1110":{"":"i"},"1111":{"":"i"},"1081":{"":"i"},"1082":{"":"k"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1092":{"":"f"},"1093":{"":"kh"},"1094":{"":"ts"},"1095":{"":"ch"},"1096":{"":"sh"},"1097":{"":"shch"},"1102":{"":"iu"},"1103":{"":"ia"},"1100":{"":"’"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }