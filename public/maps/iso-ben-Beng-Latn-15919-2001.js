var map = function(Interscript) {Interscript.define_map("iso-ben-Beng-Latn-15919-2001", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1628215705585193736);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_1628215705585193736 = {"2437":{"":"a"},"2438":{"":"ā"},"2439":{"":"i"},"2440":{"":"ī"},"2441":{"":"u"},"2442":{"":"ū"},"2443":{"":"ṛ"},"2528":{"":"ṝ"},"2444":{"":"ḻ"},"2529":{"":"ḹ"},"2447":{"":"e"},"2448":{"":"ai"},"2451":{"":"o"},"2452":{"":"au"},"2494":{"":"ā"},"2495":{"":"i"},"2496":{"":"ī"},"2497":{"":"u"},"2498":{"":"ū"},"2499":{"":"ṛ"},"2500":{"":"ṝ"},"2530":{"":"ḻ"},"2531":{"":"ḹ"},"2503":{"":"e"},"2504":{"":"ai"},"2507":{"":"o"},"2508":{"":"au"},"2434":{"":"ṁ"},"2433":{"":"m̐"},"2435":{"":"ḥ"},"2453":{"":"ka"},"2454":{"":"kha"},"2455":{"":"ga"},"2456":{"":"gha"},"2457":{"":"ṅa"},"2458":{"":"ca"},"2459":{"":"cha"},"2460":{"":"ja"},"2461":{"":"jha"},"2462":{"":"ña"},"2463":{"":"ṭa"},"2464":{"":"ṭha"},"2465":{"":"ḍa"},"2466":{"":"ḍha"},"2467":{"":"ṇa"},"2468":{"":"ta"},"2469":{"":"tha"},"2470":{"":"da"},"2471":{"":"dha"},"2472":{"":"na"},"2474":{"":"pa"},"2475":{"":"pha"},"2476":{"":"ba","2433":{"":"m̐va"}},"2477":{"":"bha"},"2478":{"":"ma"},"2479":{"":"ya","2433":{"":"m̐ya"}},"2480":{"":"ra","2433":{"":"m̐ra"}},"2482":{"":"la","2433":{"":"m̐la"}},"2486":{"":"śa"},"2487":{"":"ṣa"},"2488":{"":"sa"},"2489":{"":"ha"},"2524":{"":"ṙa"},"2525":{"":"ṙha"},"2527":{"":"ẏa"},"2510":{"":"t"},"2509":{"":""},"2535":{"":"1"},"2536":{"":"2"},"2537":{"":"3"},"2538":{"":"4"},"2539":{"":"5"},"2540":{"":"6"},"2541":{"":"7"},"2542":{"":"8"},"2543":{"":"9"},"2534":{"":"0"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }