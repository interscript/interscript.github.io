var map = function(Interscript) {Interscript.define_map("bgnpcgn-kor-Kore-Latn-rok-2011", function(Interscript, map) {
map.dependencies = ["var-kor-Kore-Hang-2013","moct-kor-Hang-Latn-2000"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-kor-Kore-Hang-2013", s, "main");
s = Interscript.transliterate("moct-kor-Hang-Latn-2000", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }