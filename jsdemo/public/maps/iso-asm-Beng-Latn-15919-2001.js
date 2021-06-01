var map = function(Interscript) {Interscript.define_map("iso-asm-Beng-Latn-15919-2001", function(Interscript, map) {
map.dependencies = ["iso-ben-Beng-Latn-15919-2001"];
map.stages.main = function(s) {
s = Interscript.transliterate("iso-ben-Beng-Latn-15919-2001", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3387882370950635196);
return s;
};
map.cache.PTREE_3387882370950635196 = {"2544":{"":"va"},"2545":{"":"ra"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }