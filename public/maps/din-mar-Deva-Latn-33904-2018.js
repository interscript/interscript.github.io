var map = function(Interscript) {Interscript.define_map("din-mar-Deva-Latn-33904-2018", function(Interscript, map) {
map.dependencies = ["din-san-Deva-Latn-33904-2018"];
map.stages.main = function(s) {
s = Interscript.transliterate("din-san-Deva-Latn-33904-2018", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_849687680773611503);
return s;
};
map.cache.PTREE_849687680773611503 = {"2418":{"":"ê"},"2321":{"":"ô"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }