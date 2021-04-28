var map = function(Interscript) {Interscript.define_map("un-nep-Deva-Latn-2013", function(Interscript, map) {
map.dependencies = ["un-nep-Deva-Latn-1972"];
map.stages.main = function(s) {
s = Interscript.transliterate("un-nep-Deva-Latn-1972", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }