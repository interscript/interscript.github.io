var map = function(Interscript) {Interscript.define_map("un-mar-Deva-Latn-2016", function(Interscript, map) {
map.dependencies = ["un-hin-Deva-Latn-2016"];
map.stages.main = function(s) {
s = Interscript.transliterate("un-hin-Deva-Latn-2016", s, "main");
s = Interscript.gsub(s, "(?<=)U+0939(?="+Interscript.aliases.boundary+")", "h");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3986034939241571223);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_3986034939241571223 = {"2355":{"":"ḷa"},"2317":{"":"ă"},"2353":{"":"r"},"2309":{"2367":{"":"i"},"2368":{"":"ī"},"2369":{"":"u"},"2370":{"":"ū"},"2375":{"":"e"},"2376":{"":"ai"}},"2418":{"":"ê"},"2321":{"":"ô"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }