var map = function(Interscript) {Interscript.define_map("bgnpcgn-kor-Hang-Latn-rok-2011", function(Interscript, map) {
map.dependencies = ["moct-kor-Hang-Latn-2000"];
map.stages.main = function(s) {
s = Interscript.transliterate("moct-kor-Hang-Latn-2000", s, "main");
s = Interscript.functions.title_case(s, {});
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }