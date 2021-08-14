var map = function(Interscript) {Interscript.define_map("din-nep-Deva-Latn-33904-2018", function(Interscript, map) {
map.dependencies = ["din-san-Deva-Latn-33904-2018"];
map.stages.main = function(s) {
s = Interscript.transliterate("din-san-Deva-Latn-33904-2018", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3038317056035012042);
return s;
};
map.cache.PTREE_3038317056035012042 = {"2418":{"":"ê"},"2321":{"":"ô"},"2325":{"2364":{"":"ḵa","2381":{"":"ḵ"}}},"2326":{"2364":{"":"ḵha","2381":{"":"ḵh"}}},"2327":{"2364":{"":"g̲a","2381":{"":"g̲"}}},"2332":{"2364":{"":"j̲a","2381":{"":"j̲"}}},"2337":{"2364":{"":"ṙa","2381":{"":"ṙ"}}},"2338":{"2364":{"":"ṙha","2381":{"":"ṙh"}}},"2347":{"2364":{"":"p̲ha","2381":{"":"p̲h"}}},"2360":{"2364":{"":"s̲a","2381":{"":"s̲"}}},"2361":{"2364":{"":"h̲a","2381":{"":"h̲"}}},"2357":{"2364":{"":"v̲a"}}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }