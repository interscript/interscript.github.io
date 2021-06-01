var map = function(Interscript) {Interscript.define_map("un-mon-Mong-Latn-general-2013", function(Interscript, map) {
map.dependencies = ["sasm-mon-Mong-Latn-general-1978"];
map.stages.main = function(s) {
s = Interscript.transliterate("sasm-mon-Mong-Latn-general-1978", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }