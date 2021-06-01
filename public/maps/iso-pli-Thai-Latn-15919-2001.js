var map = function(Interscript) {Interscript.define_map("iso-pli-Thai-Latn-15919-2001", function(Interscript, map) {
map.dependencies = ["iso-tha-Thai-Latn-11940-1998"];
map.stages.main = function(s) {
s = Interscript.transliterate("iso-tha-Thai-Latn-11940-1998", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }