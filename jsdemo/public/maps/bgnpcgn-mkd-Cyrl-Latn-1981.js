var map = function(Interscript) {Interscript.define_map("bgnpcgn-mkd-Cyrl-Latn-1981", function(Interscript, map) {
map.dependencies = ["var-Cyrl"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "Ѓ(?=еЕиИ)", "G");
s = Interscript.gsub(s, "ѓ(?=еЕиИ)", "g");
s = Interscript.gsub(s, "Ќ(?=еЕиИ)", "K");
s = Interscript.gsub(s, "ќ(?=еЕиИ)", "k");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4089679115530904313);
s = Interscript.gsub(s, "(?<=[A-Z])(?:Dz|Lj|Nj|Dž)", function(a){return a.toUpperCase();});
s = Interscript.gsub(s, "(?:Dz|Lj|Nj|Dž)(?=[A-Z])", function(a){return a.toUpperCase();});
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_4089679115530904313 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1044":{"":"D"},"1027":{"":"Đ"},"1045":{"":"E"},"1046":{"":"Ž"},"1047":{"":"Z"},"1029":{"":"Dz"},"1048":{"":"I"},"1032":{"":"J"},"1050":{"":"K"},"1051":{"":"L"},"1033":{"":"Lj"},"1052":{"":"M"},"1053":{"":"N"},"1034":{"":"Nj"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1036":{"":"Ć"},"1059":{"":"U"},"1060":{"":"F"},"1061":{"":"H"},"1062":{"":"C"},"1063":{"":"Č"},"1039":{"":"Dž"},"1064":{"":"Š"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1076":{"":"d"},"1107":{"":"đ"},"1077":{"":"e"},"1078":{"":"ž"},"1079":{"":"z"},"1109":{"":"dz"},"1080":{"":"i"},"1112":{"":"j"},"1082":{"":"k"},"1083":{"":"l"},"1113":{"":"lj"},"1084":{"":"m"},"1085":{"":"n"},"1114":{"":"nj"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1116":{"":"ć"},"1091":{"":"u"},"1092":{"":"f"},"1093":{"":"h"},"1094":{"":"c"},"1095":{"":"č"},"1119":{"":"dž"},"1096":{"":"š"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }