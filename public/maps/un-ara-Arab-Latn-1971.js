var map = function(Interscript) {Interscript.define_map("un-ara-Arab-Latn-1971", function(Interscript, map) {
map.dependencies = ["un-ara-Arab-Latn-2017"];
map.stages.main = function(s) {
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_4056309902707626443);
s = Interscript.transliterate("un-ara-Arab-Latn-2017", s, "main");
s = Interscript.gsub(s, "\ At͟h\ T͟h", " at͟h T͟h");
s = Interscript.gsub(s, "\ Ad͟h\ D͟h", " ad͟h D͟h");
s = Interscript.gsub(s, "\ As͟h\ S͟h", " as͟h S͟h");
s = Interscript.gsub(s, "\ Az͟h\ Z͟h", " az͟h Z͟h");
return s;
};
map.cache.PRE_4056309902707626443 = ["(?<_0>"+Interscript.aliases.boundary+"الث)|(?<_1>"+Interscript.aliases.boundary+"الذ)|(?<_2>"+Interscript.aliases.boundary+"الش)|(?<_3>"+Interscript.aliases.boundary+"الظ)|(?<_4>خّ)|(?<_5>ذّ)|(?<_6>شّ)|(?<_7>ظّ)|(?<_8>غّ)|(?<_9>ث)|(?<_10>ﺛ)|(?<_11>ﺜ)|(?<_12>ﺚ)|(?<_13>خ)|(?<_14>ﺧ)|(?<_15>ﺨ)|(?<_16>ﺦ)|(?<_17>غ)|(?<_18>ﻏ)|(?<_19>ﻐ)|(?<_20>ﻎ)|(?<_21>ذ)|(?<_22>ﺬ)|(?<_23>ش)|(?<_24>ﺷ)|(?<_25>ﺸ)|(?<_26>ﺶ)|(?<_27>ظ)|(?<_28>ﻇ)|(?<_29>ﻈ)|(?<_30>ﻆ)", ["at͟h t͟h","ad͟h d͟h","as͟h s͟h","az͟h z͟h","k͟hk͟h","d͟hd͟h","s͟h","z͟hz͟h","g͟hg͟h","t͟h","t͟h","t͟h","t͟h","k͟h","k͟h","k͟h","k͟h","g͟h","g͟h","g͟h","g͟h","d͟h","d͟h","s͟h","s͟h","s͟h","s͟h","z͟h","z͟h","z͟h","z͟h"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }