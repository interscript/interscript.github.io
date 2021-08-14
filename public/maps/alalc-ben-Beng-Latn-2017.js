var map = function(Interscript) {Interscript.define_map("alalc-ben-Beng-Latn-2017", function(Interscript, map) {
map.dependencies = ["un-ben-Beng-Latn-2016"];
map.stages.main = function(s) {
s = Interscript.transliterate("un-ben-Beng-Latn-2016", s, "main");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_4187530905393990121);
return s;
};
map.cache.PTREE_4187530905393990121 = {"2437":{"":"a"},"2528":{"":"ṝ"},"2438":{"":"ā"},"2444":{"":"ḹ"},"2439":{"":"I"},"2447":{"":"e"},"2440":{"":"ī"},"2448":{"":"ai"},"2441":{"":"u"},"2451":{"":"o"},"2442":{"":"ū"},"2452":{"":"au"},"2443":{"":"ṛ"},"2453":{"":"ka"},"2454":{"":"kha"},"2455":{"":"ga"},"2456":{"":"gha"},"2457":{"":"ṅa"},"2458":{"":"ca"},"2459":{"":"cha"},"2460":{"":"ja"},"2461":{"":"jha"},"2462":{"":"ña"},"2463":{"":"ṭa"},"2464":{"":"ṭha"},"2465":{"":"ḍa","2492":{"":"ṛa"}},"2466":{"":"ḍha","2492":{"":"ṛha"}},"2467":{"":"ṇa"},"2468":{"":"ta"},"2510":{"":"t"},"2469":{"":"tha"},"2470":{"":"da"},"2471":{"":"dha"},"2472":{"":"na"},"2474":{"":"pa"},"2475":{"":"pha"},"2476":{"":"ba"},"2477":{"":"bha"},"2478":{"":"ma"},"2479":{"":"ya","2492":{"":"ẏa"}},"2480":{"":"ra"},"2482":{"":"la"},"2486":{"":"śa"},"2487":{"":"sha"},"2488":{"":"sa"},"2489":{"":"ha"},"32":{"2434":{"":"ṃ"},"2435":{"":"ḥ"}},"2433":{"":"n̐"},"2365":{"":"’"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }