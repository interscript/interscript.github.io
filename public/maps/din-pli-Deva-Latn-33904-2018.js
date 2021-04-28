var map = function(Interscript) {Interscript.define_map("din-pli-Deva-Latn-33904-2018", function(Interscript, map) {
map.dependencies = ["din-san-Deva-Latn-33904-2018"];
map.stages.main = function(s) {
s = Interscript.transliterate("din-san-Deva-Latn-33904-2018", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }