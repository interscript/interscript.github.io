var map = function(Interscript) {Interscript.define_map("var-pra-Deva-Latn-iast-1912", function(Interscript, map) {
map.dependencies = ["var-san-Deva-Latn-iast-1912"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-san-Deva-Latn-iast-1912", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }