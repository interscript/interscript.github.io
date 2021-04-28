var map = function(Interscript) {Interscript.define_map("odni-mkd-Cyrl-Latn-2005", function(Interscript, map) {
map.dependencies = ["odni-mkd-Cyrl-Latn-2015"];
map.stages.main = function(s) {
s = Interscript.transliterate("odni-mkd-Cyrl-Latn-2015", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }