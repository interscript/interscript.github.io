var map = function(Interscript) {Interscript.define_map("un-ukr-Cyrl-Latn-1998", function(Interscript, map) {
map.dependencies = ["gost-rus-Cyrl-Latn-16876-71-1983"];
map.stages.main = function(s) {
s = Interscript.transliterate("gost-rus-Cyrl-Latn-16876-71-1983", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2575461728288550342);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_2575461728288550342 = {"1025":{"":""},"1028":{"":"Ê"},"1030":{"":"Ì"},"1031":{"":"Ì"},"1067":{"":""},"1069":{"":""},"1105":{"":""},"1108":{"":"ê"},"1110":{"":"ı̀"},"1111":{"":"ı̀"},"1099":{"":""},"1101":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }