var map = function(Interscript) {Interscript.define_map("odni-prs-Arab-Latn-2004", function(Interscript, map) {
map.dependencies = ["odni-fas-Arab-Latn-2004"];
map.stages.main = function(s) {
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_3894428598764425476);
s = Interscript.transliterate("odni-fas-Arab-Latn-2004", s, "main");
return s;
};
map.cache.PRE_3894428598764425476 = ["(?<_0>اي"+Interscript.aliases.boundary+")|(?<_1>ای"+Interscript.aliases.boundary+")|(?<_2>قّ)|(?<_3>وّ)|(?<_4>يي)|(?<_5>یی)|(?<_6>ُو)|(?<_7>ئ)|(?<_8>ؤ)|(?<_9>ء)|(?<_10>ع)|(?<_11>ق)|(?<_12>و)", ["i","i","qq","ww","i","i","u","","","","","q","w"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }