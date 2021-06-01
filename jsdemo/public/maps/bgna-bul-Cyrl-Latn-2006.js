var map = function(Interscript) {Interscript.define_map("bgna-bul-Cyrl-Latn-2006", function(Interscript, map) {
map.dependencies = ["apcbg-bul-Cyrl-Latn-1995"];
map.stages.main = function(s) {
s = Interscript.transliterate("apcbg-bul-Cyrl-Latn-1995", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }