var map = function(Interscript) {Interscript.define_map("alalc-tam-Taml-Latn-1997", function(Interscript, map) {
map.dependencies = ["din-tam-Taml-Latn-33903-2016"];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1235688751180802253);
s = Interscript.transliterate("din-tam-Taml-Latn-33903-2016", s, "main");
return s;
};
map.cache.PTREE_1235688751180802253 = {"2947":{"":"ḵa"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }