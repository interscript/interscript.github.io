var map = function(Interscript) {Interscript.define_map("alalc-hin-Deva-Latn-2011", function(Interscript, map) {
map.dependencies = ["alalc-hin-Deva-Latn-1997"];
map.stages.main = function(s) {
s = Interscript.transliterate("alalc-hin-Deva-Latn-1997", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }