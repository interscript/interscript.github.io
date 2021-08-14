var map = function(Interscript) {Interscript.define_map("un-srp-Cyrl-Latn-1997", function(Interscript, map) {
map.dependencies = ["alalc-srp-Cyrl-Latn-2013"];
map.stages.main = function(s) {
s = Interscript.transliterate("alalc-srp-Cyrl-Latn-2013", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }