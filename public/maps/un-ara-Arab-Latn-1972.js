var map = function(Interscript) {Interscript.define_map("un-ara-Arab-Latn-1972", function(Interscript, map) {
map.dependencies = ["un-ara-Arab-Latn-2017"];
map.stages.main = function(s) {
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_895061124398552348);
s = Interscript.transliterate("un-ara-Arab-Latn-2017", s, "main");
s = Interscript.gsub(s, "\ Aş\ Ş", " aş Ş");
s = Interscript.gsub(s, "\ Aḑ\ Ḑ", " aḑ Ḑ");
s = Interscript.gsub(s, "\ Aţ\ Ţ", " aţ Ţ");
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PRE_895061124398552348 = ["(?<_0>"+Interscript.aliases.boundary+"الص)|(?<_1>"+Interscript.aliases.boundary+"الض)|(?<_2>"+Interscript.aliases.boundary+"الط)|(?<_3>حّ)|(?<_4>صّ)|(?<_5>ضّ)|(?<_6>طّ)|(?<_7>ظّ)|(?<_8>ح)|(?<_9>ﺣ)|(?<_10>ﺤ)|(?<_11>ﺢ)|(?<_12>ص)|(?<_13>ﺻ)|(?<_14>ﺼ)|(?<_15>ﺺ)|(?<_16>ض)|(?<_17>ﺿ)|(?<_18>ﻀ)|(?<_19>ﺾ)|(?<_20>ط)|(?<_21>ﻃ)|(?<_22>ﻄ)|(?<_23>ﻂ)|(?<_24>ظ)|(?<_25>ﻇ)|(?<_26>ﻈ)|(?<_27>ﻆ)", ["aş ş","aḑ ḑ","aţ ţ","ḩḩ","şş","ḑḑ","ţţ","z̧z̧","ḩ","ḩ","ḩ","ḩ","ş","ş","ş","ş","ḑ","ḑ","ḑ","ḑ","ţ","ţ","ţ","ţ","z̧","z̧","z̧","z̧"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }