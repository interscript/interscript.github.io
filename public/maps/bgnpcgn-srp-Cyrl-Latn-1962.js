var map = function(Interscript) {Interscript.define_map("bgnpcgn-srp-Cyrl-Latn-1962", function(Interscript, map) {
map.dependencies = ["bgnpcgn-srp-Cyrl-Latn-2005"];
map.stages.main = function(s) {
s = Interscript.transliterate("bgnpcgn-srp-Cyrl-Latn-2005", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }