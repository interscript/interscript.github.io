var map = function(Interscript) {Interscript.define_map("odni-prs-Arab-Latn-2015", function(Interscript, map) {
map.dependencies = ["odni-fas-Arab-Latn-2015"];
map.stages.main = function(s) {
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_2842455064374495338);
s = Interscript.transliterate("odni-fas-Arab-Latn-2015", s, "main");
return s;
};
map.cache.PRE_2842455064374495338 = ["(?<_0>اي"+Interscript.aliases.boundary+")|(?<_1>ای"+Interscript.aliases.boundary+")|(?<_2>قّ)|(?<_3>وّ)|(?<_4>يي)|(?<_5>یی)|(?<_6>ُو)|(?<_7>ة)|(?<_8>ئ)|(?<_9>ؤ)|(?<_10>ء)|(?<_11>ع)|(?<_12>ق)|(?<_13>و)", ["i","i","qq","ww","i","i","u","ah","","","","","q","w"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }