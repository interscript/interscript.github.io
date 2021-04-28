var map = function(Interscript) {Interscript.define_map("odni-ara-Arab-Latn-2004", function(Interscript, map) {
map.dependencies = ["odni-ara-Arab-Latn-2015"];
map.stages.main = function(s) {
s = Interscript.transliterate("odni-ara-Arab-Latn-2015", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }