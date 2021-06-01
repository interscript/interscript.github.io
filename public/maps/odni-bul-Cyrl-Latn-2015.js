var map = function(Interscript) {Interscript.define_map("odni-bul-Cyrl-Latn-2015", function(Interscript, map) {
map.dependencies = ["bgnpcgn-bul-Cyrl-Latn-2013"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "Ь", "Y");
s = Interscript.gsub(s, "Ъ", "A");
s = Interscript.gsub(s, "ь", "y");
s = Interscript.gsub(s, "ъ", "a");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_662330474413061227);
s = Interscript.transliterate("bgnpcgn-bul-Cyrl-Latn-2013", s, "main");
return s;
};
map.cache.PTREE_662330474413061227 = {"1096":{"":"sh","1096":{"":"sh","1096":{"":"sh","1096":{"":"sh","1096":{"":"sh","1096":{"":"sh"}}}}}},"1095":{"":"ch","1095":{"":"ch","1095":{"":"ch","1095":{"":"ch","1095":{"":"ch","1095":{"":"ch"}}}}}}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }