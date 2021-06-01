var map = function(Interscript) {Interscript.define_map("var-mar-Deva-Latn-hunterian-1872", function(Interscript, map) {
map.dependencies = ["var-hin-Deva-Latn-hunterian-1872"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-hin-Deva-Latn-hunterian-1872", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }