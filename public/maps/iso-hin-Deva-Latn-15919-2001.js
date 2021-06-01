var map = function(Interscript) {Interscript.define_map("iso-hin-Deva-Latn-15919-2001", function(Interscript, map) {
map.dependencies = ["iso-san-Deva-Latn-15919-2001"];
map.stages.main = function(s) {
s = Interscript.transliterate("iso-san-Deva-Latn-15919-2001", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }