var map = function(Interscript) {Interscript.define_map("bgnpcgn-kat-Geor-Latn-2009", function(Interscript, map) {
map.dependencies = ["ggg-kat-Geor-Latn-2002"];
map.stages.main = function(s) {
s = Interscript.transliterate("ggg-kat-Geor-Latn-2002", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }