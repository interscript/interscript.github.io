var map = function(Interscript) {Interscript.define_map("ua-ukr-Cyrl-Latn-2010", function(Interscript, map) {
map.dependencies = ["ua-ukr-Cyrl-Latn-1996"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "'", "");
s = Interscript.gsub(s, "’", "");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1929900576777993817);
s = Interscript.transliterate("ua-ukr-Cyrl-Latn-1996", s, "main");
return s;
};
map.cache.PTREE_1929900576777993817 = {"1168":{"":"G"},"1169":{"":"g"},"1065":{"":"Shch"},"1097":{"":"shch"},"1100":{"":""},"1068":{"":""},"39":{"":""},"8217":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }