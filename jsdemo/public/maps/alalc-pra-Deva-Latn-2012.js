var map = function(Interscript) {Interscript.define_map("alalc-pra-Deva-Latn-2012", function(Interscript, map) {
map.dependencies = ["alalc-san-Deva-Latn-2012"];
map.stages.main = function(s) {
s = Interscript.transliterate("alalc-san-Deva-Latn-2012", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }