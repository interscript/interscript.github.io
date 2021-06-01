var map = function(Interscript) {Interscript.define_map("alalc-sin-Sinh-Latn-2011", function(Interscript, map) {
map.dependencies = ["alalc-sin-Sinh-Latn-1997"];
map.stages.main = function(s) {
s = Interscript.transliterate("alalc-sin-Sinh-Latn-1997", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }