var map = function(Interscript) {Interscript.define_map("odni-rus-Cyrl-Latn-2015", function(Interscript, map) {
map.dependencies = ["bgnpcgn-rus-Cyrl-Latn-1947"];
map.stages.main = function(s) {
s = Interscript.transliterate("bgnpcgn-rus-Cyrl-Latn-1947", s, "main");
s = Interscript.gsub(s, "’", Interscript.aliases.none);
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }