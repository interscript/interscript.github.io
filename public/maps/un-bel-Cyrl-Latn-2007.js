var map = function(Interscript) {Interscript.define_map("un-bel-Cyrl-Latn-2007", function(Interscript, map) {
map.dependencies = ["by-bel-Cyrl-Latn-2007"];
map.stages.main = function(s) {
s = Interscript.transliterate("by-bel-Cyrl-Latn-2007", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }