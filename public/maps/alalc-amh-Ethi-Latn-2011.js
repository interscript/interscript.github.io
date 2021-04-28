var map = function(Interscript) {Interscript.define_map("alalc-amh-Ethi-Latn-2011", function(Interscript, map) {
map.dependencies = ["alalc-amh-Ethi-Latn-1997"];
map.stages.main = function(s) {
s = Interscript.transliterate("alalc-amh-Ethi-Latn-1997", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }