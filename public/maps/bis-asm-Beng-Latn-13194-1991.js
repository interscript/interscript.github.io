var map = function(Interscript) {Interscript.define_map("bis-asm-Beng-Latn-13194-1991", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "ং(?=[কখগঘঙ])", "ṅ");
s = Interscript.gsub(s, "ং(?=[চছজঝঞ])", "ñ");
s = Interscript.gsub(s, "ং(?=[টঠডড়ঢঢ়ণ])", "ṇ");
s = Interscript.gsub(s, "ং(?=[তৎথদধন])", "n");
s = Interscript.gsub(s, "ং(?=[পফবভম])", "m");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1645594822293764664);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_1645594822293764664 = {"2437":{"":"a"},"2438":{"":"ā"},"2439":{"":"i"},"2440":{"":"ī"},"2441":{"":"u"},"2442":{"":"ū"},"2528":{"":"ṛ"},"2444":{"":"ḻ"},"2447":{"":"ē"},"2448":{"":"ai"},"2451":{"":"ŏ"},"2452":{"":"au"},"2453":{"":"k"},"2454":{"":"kh"},"2455":{"":"g"},"2456":{"":"gh"},"2457":{"":"ṅ"},"2458":{"":"c"},"2459":{"":"ch"},"2460":{"":"j"},"2461":{"":"jh"},"2462":{"":"ñ"},"2463":{"":"ṭ"},"2464":{"":"ṭh"},"2465":{"":"ḍ"},"2524":{"":"d̂"},"2466":{"":"ḍh"},"2525":{"":"d̂h"},"2467":{"":"ṇ"},"2468":{"":"t"},"2510":{"":"t"},"2469":{"":"th"},"2470":{"":"d"},"2471":{"":"dh"},"2472":{"":"n"},"2474":{"":"p"},"2475":{"":"ph"},"2476":{"":"b"},"2477":{"":"bh"},"2478":{"":"m"},"2479":{"":"y","2492":{"":"ẏ"}},"2527":{"":"ẏ"},"2544":{"":"r"},"2482":{"":"l"},"2545":{"":"v"},"2486":{"":"ś"},"2487":{"":"ṣ"},"2488":{"":"s"},"2489":{"":"h"},"2433":{"":"m"},"2435":{"32":{"":"ḥ"}},"2434":{"":"ṃ"},"2494":{"":"ā"},"2495":{"":"i"},"2496":{"":"ī"},"2497":{"":"u"},"2498":{"":"ū"},"2499":{"":"ṛ"},"2503":{"":"ē"},"2504":{"":"ai"},"2507":{"":"ŏ"},"2508":{"":"au"},"2509":{"":""},"2381":{"":""},"2364":{"":""},"2404":{"":"."},"8205":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }