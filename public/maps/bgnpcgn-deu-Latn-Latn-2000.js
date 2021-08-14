var map = function(Interscript) {Interscript.define_map("bgnpcgn-deu-Latn-Latn-2000", function(Interscript, map) {
map.dependencies = ["posix"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "β("+Interscript.get_alias_re("posix", "upper")+")", "SS"+"$1");
s = Interscript.gsub(s, "Ä("+Interscript.get_alias_re("posix", "upper")+")", "AE"+"$1");
s = Interscript.gsub(s, "Ö("+Interscript.get_alias_re("posix", "upper")+")", "OE"+"$1");
s = Interscript.gsub(s, "Ü("+Interscript.get_alias_re("posix", "upper")+")", "UE"+"$1");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2152348161560356095);
return s;
};
map.cache.PTREE_2152348161560356095 = {"196":{"":"Ae"},"214":{"":"Oe"},"220":{"":"Ue"},"228":{"":"ae"},"246":{"":"oe"},"252":{"":"ue"},"946":{"":"ss"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }