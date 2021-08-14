var map = function(Interscript) {Interscript.define_map("bgnpcgn-ron-cyrl-latn-2002", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "Г(?=[ЕеИиЙйЮю])", "Gh");
s = Interscript.gsub(s, "г(?=[ЕеИиЙйЮю])", "gh");
s = Interscript.gsub(s, "Ӂ(?=[ЕеИиЙйЮю])", "Gh");
s = Interscript.gsub(s, "Ӂ(?=[ЕеИиЙйЮю])", "gh");
s = Interscript.gsub(s, "К(?=[ЕеИиЙйЮю])", "Ch");
s = Interscript.gsub(s, "к(?=[ЕеИиЙйЮю])", "ch");
s = Interscript.gsub(s, "Ч(?=[ЕеИиЙйЮю])", "C");
s = Interscript.gsub(s, "ч(?=[ЕеИиЙйЮю])", "c");
s = Interscript.gsub(s, "Ӂ(?=[Аа])", "Ge");
s = Interscript.gsub(s, "Ӂ(?=[Аа])", "ge");
s = Interscript.gsub(s, "Ч(?=[А])", "CE");
s = Interscript.gsub(s, "Ч(?=[а])", "Ce");
s = Interscript.gsub(s, "ч(?=[Аа])", "ce");
s = Interscript.gsub(s, "Ь(?="+Interscript.aliases.boundary+")", "I");
s = Interscript.gsub(s, "ь(?="+Interscript.aliases.boundary+")", "i");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4107565903862520012);
return s;
};
map.cache.PTREE_4107565903862520012 = {"1040":{"":"A"},"1041":{"":"B"},"1042":{"":"V"},"1043":{"":"G"},"1044":{"":"D"},"1045":{"":"E"},"1046":{"":"ZH"},"1217":{"":"GI"},"1047":{"":"Z"},"1048":{"":"I"},"1049":{"":"I"},"1050":{"":"C"},"1051":{"":"L"},"1052":{"":"M"},"1053":{"":"N"},"1054":{"":"O"},"1055":{"":"P"},"1056":{"":"R"},"1057":{"":"S"},"1058":{"":"T"},"1059":{"":"U"},"1060":{"":"F"},"1061":{"":"H"},"1062":{"":"Ţ"},"1063":{"":"CI"},"1064":{"":"Ş"},"1067":{"":"Î"},"1068":{"":"’"},"1069":{"":"Ă"},"1070":{"":"IU"},"1071":{"":"EA"},"1072":{"":"a"},"1073":{"":"b"},"1074":{"":"v"},"1075":{"":"g"},"1076":{"":"d"},"1077":{"":"e"},"1078":{"":"zh"},"1218":{"":"gi"},"1079":{"":"z"},"1080":{"":"i"},"1081":{"":"i"},"1082":{"":"c"},"1083":{"":"l"},"1084":{"":"m"},"1085":{"":"n"},"1086":{"":"o"},"1087":{"":"p"},"1088":{"":"r"},"1089":{"":"s"},"1090":{"":"t"},"1091":{"":"u"},"1092":{"":"f"},"1093":{"":"h"},"1094":{"":"ţ"},"1095":{"":"ci"},"1096":{"":"ş"},"1099":{"":"î"},"1100":{"":"’"},"1101":{"":"ă"},"1102":{"":"iu"},"1103":{"":"ea"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }