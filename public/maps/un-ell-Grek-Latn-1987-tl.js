var map = function(Interscript) {Interscript.define_map("un-ell-Grek-Latn-1987-tl", function(Interscript, map) {
map.dependencies = ["elot-ell-Grek-Latn-743-1982-tl"];
map.stages.main = function(s) {
s = Interscript.transliterate("elot-ell-Grek-Latn-743-1982-tl", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }