var map = function(Interscript) {Interscript.define_map("mvd-rus-Cyrl-Latn-2010", function(Interscript, map) {
map.dependencies = ["mvd-rus-Cyrl-Latn-2008"];
map.stages.main = function(s) {
s = Interscript.transliterate("mvd-rus-Cyrl-Latn-2008", s, "translit");
s = Interscript.gsub(s, "́", "");
s = Interscript.functions.compose(s, {});
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }