var map = function(Interscript) {Interscript.define_map("var-gez-Ethi-Latn-eae-2003", function(Interscript, map) {
map.dependencies = ["var-amh-Ethi-Latn-eae-2003"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-amh-Ethi-Latn-eae-2003", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }