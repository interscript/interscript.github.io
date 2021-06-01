var map = function(Interscript) {Interscript.define_map("alalc-srp-Cyrl-Latn-1997", function(Interscript, map) {
map.dependencies = ["posix"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_706256566427334936);
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Dz("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"DZ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Dz("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"DZ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Lj("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"LJ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Lj("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"LJ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Nj("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"NJ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Nj("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"NJ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+")Dž("+Interscript.get_alias_re("posix", "upper")+"?)", "$1"+"DŽ"+"$2");
s = Interscript.gsub(s, "("+Interscript.get_alias_re("posix", "upper")+"?)Dž("+Interscript.get_alias_re("posix", "upper")+")", "$1"+"DŽ"+"$2");
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_706256566427334936 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1027":{"":"Ǵ"},"1044":{"":"D"},"1026":{"":"Đ"},"1045":{"":"E"},"1046":{"":"Ž"},"1047":{"":"Z"},"1029":{"":"Dz"},"1048":{"":"I"},"1032":{"":"J"},"1050":{"":"K"},"1036":{"":"Ḱ"},"1051":{"":"L"},"1033":{"":"Lj"},"1052":{"":"M"},"1053":{"":"N"},"1034":{"":"Nj"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1035":{"":"Ć"},"1059":{"":"U"},"1060":{"":"F"},"1061":{"":"H"},"1062":{"":"C"},"1063":{"":"Č"},"1039":{"":"Dž"},"1064":{"":"Š"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1107":{"":"ǵ"},"1076":{"":"d"},"1106":{"":"đ"},"1077":{"":"e"},"1078":{"":"ž"},"1079":{"":"z"},"1109":{"":"dz"},"1080":{"":"i"},"1112":{"":"j"},"1082":{"":"k"},"1116":{"":"ḱ"},"1083":{"":"l"},"1113":{"":"lj"},"1084":{"":"m"},"1085":{"":"n"},"1114":{"":"nj"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1115":{"":"ć"},"1091":{"":"u"},"1092":{"":"f"},"1093":{"":"h"},"1094":{"":"c"},"1095":{"":"č"},"1119":{"":"dž"},"1096":{"":"š"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }