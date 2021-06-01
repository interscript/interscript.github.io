var map = function(Interscript) {Interscript.define_map("un-ukr-Cyrl-Latn-2012", function(Interscript, map) {
map.dependencies = ["ua-ukr-Cyrl-Latn-2010"];
map.stages.main = function(s) {
s = Interscript.transliterate("ua-ukr-Cyrl-Latn-2010", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }