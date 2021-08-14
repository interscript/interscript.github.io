var map = function(Interscript) {Interscript.define_map("un-bul-Cyrl-Latn-1977", function(Interscript, map) {
map.dependencies = ["posix"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4296629014569720214);
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Št("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"ŠT"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Št("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"ŠT"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Yu("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"YU"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Yu("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"YU"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Ya("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"YA"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Ya("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"YA"+"$2");
return s;
};
map.cache.PTREE_4296629014569720214 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1044":{"":"D"},"1045":{"":"E"},"1046":{"":"Ž"},"1047":{"":"Z"},"1048":{"":"I"},"1049":{"":"J"},"1050":{"":"K"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"1060":{"":"F"},"1061":{"":"H"},"1062":{"":"C"},"1063":{"":"Č"},"1064":{"":"Š"},"1065":{"":"Št"},"1066":{"":"Ǎ"},"1068":{"":"J"},"1070":{"":"Yu"},"1071":{"":"Ya"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1076":{"":"d"},"1077":{"":"e"},"1078":{"":"ž"},"1079":{"":"z"},"1080":{"":"i"},"1081":{"":"j"},"1082":{"":"k"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1092":{"":"f"},"1093":{"":"h"},"1094":{"":"c"},"1095":{"":"č"},"1096":{"":"š"},"1097":{"":"št"},"1098":{"":"ǎ"},"1100":{"":"j"},"1102":{"":"yu"},"1103":{"":"ya"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }