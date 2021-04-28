var map = function(Interscript) {Interscript.define_map("elot-ell-Grek-Latn-743-2001-tl", function(Interscript, map) {
map.dependencies = ["iso-ell-Grek-Latn-843-1997-t1"];
map.stages.main = function(s) {
s = Interscript.transliterate("iso-ell-Grek-Latn-843-1997-t1", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }