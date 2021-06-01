var map = function(Interscript) {Interscript.define_map("bgnpcgn-fao-Latn-Latn-1968", function(Interscript, map) {
map.dependencies = ["bgnpcgn-fao-Latn-Latn-1964"];
map.stages.main = function(s) {
s = Interscript.transliterate("bgnpcgn-fao-Latn-Latn-1964", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }