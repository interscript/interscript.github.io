var map = function(Interscript) {Interscript.define_map("alalc-ben-Beng-Latn-1997", function(Interscript, map) {
map.dependencies = [];
map.aliases.ben_special = "া";
map.aliases_re.ben_special = "[ািীুূৃেৈোৌ্]";
map.stages.main = function(s) {
s = Interscript.gsub(s, "ক(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "k");
s = Interscript.gsub(s, "খ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "kh");
s = Interscript.gsub(s, "গ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "g");
s = Interscript.gsub(s, "ঘ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "gh");
s = Interscript.gsub(s, "ঙ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṅ");
s = Interscript.gsub(s, "চ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "c");
s = Interscript.gsub(s, "ছ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ch");
s = Interscript.gsub(s, "জ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "j");
s = Interscript.gsub(s, "ঝ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "jh");
s = Interscript.gsub(s, "ঞ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ñ");
s = Interscript.gsub(s, "ট(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṭ");
s = Interscript.gsub(s, "ঠ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṭh");
s = Interscript.gsub(s, "ড(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ḍ");
s = Interscript.gsub(s, "ড়(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṛ");
s = Interscript.gsub(s, "[ড়](?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṛ");
s = Interscript.gsub(s, "ঢ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ḍh");
s = Interscript.gsub(s, "ঢ়(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṛh");
s = Interscript.gsub(s, "ণ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṇ");
s = Interscript.gsub(s, "ত(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "t");
s = Interscript.gsub(s, "ৎ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ṯ");
s = Interscript.gsub(s, "থ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "th");
s = Interscript.gsub(s, "দ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "d");
s = Interscript.gsub(s, "ধ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "dh");
s = Interscript.gsub(s, "ন(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "n");
s = Interscript.gsub(s, "প(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "p");
s = Interscript.gsub(s, "ফ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ph");
s = Interscript.gsub(s, "ব(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "b");
s = Interscript.gsub(s, "ভ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "bh");
s = Interscript.gsub(s, "ম(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "m");
s = Interscript.gsub(s, "য(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "y");
s = Interscript.gsub(s, "য়(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ẏ");
s = Interscript.gsub(s, "য়(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ẏ");
s = Interscript.gsub(s, "র(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "r");
s = Interscript.gsub(s, "ল(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "l");
s = Interscript.gsub(s, "শ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "ś");
s = Interscript.gsub(s, "ষ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "sh");
s = Interscript.gsub(s, "স(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "s");
s = Interscript.gsub(s, "হ(?="+Interscript.get_alias_re("alalc-ben-Beng-Latn-1997", "ben_special")+")", "h");
s = Interscript.gsub(s, "ବ(?=ব)", "bba");
s = Interscript.gsub(s, "ঁ(?=[কখগঘঙচছজঝঞটঠডডঢঢণতৎথদধন])", "m̐");
s = Interscript.gsub(s, "ଁ(?="+Interscript.aliases.boundary+")", "m̐");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2062929950948864299);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_2062929950948864299 = {"2437":{"":"a"},"2438":{"":"ā"},"2439":{"":"i"},"2440":{"":"ī"},"2441":{"":"u"},"2442":{"":"ū"},"2447":{"":"e"},"2448":{"":"ai"},"2451":{"":"o"},"2452":{"":"au"},"2443":{"":"ṛ"},"2528":{"":"ṝ"},"2444":{"":"ḹ"},"2453":{"":"ka"},"2454":{"":"kha"},"2455":{"":"ga"},"2456":{"":"gha"},"2457":{"":"ṅa"},"2458":{"":"ca"},"2459":{"":"cha"},"2460":{"":"ja"},"2461":{"":"jha"},"2462":{"":"ña"},"2463":{"":"ṭa"},"2464":{"":"ṭha"},"2465":{"":"ḍa","2492":{"":"ṛa"}},"2524":{"":"ṛa"},"2466":{"":"ḍha","2492":{"":"ṛha"}},"2467":{"":"ṇa"},"2468":{"":"ta"},"2510":{"":"ṯa"},"2469":{"":"tha"},"2470":{"":"da"},"2471":{"":"dha"},"2472":{"":"na"},"2474":{"":"pa"},"2475":{"":"pha"},"2476":{"":"ba"},"2477":{"":"bha"},"2478":{"":"ma"},"2479":{"":"ya","2492":{"":"ẏa"}},"2527":{"":"ẏa"},"2480":{"":"ra"},"2482":{"":"la"},"2486":{"":"śa"},"2487":{"":"sha"},"2488":{"":"sa"},"2489":{"":"ha"},"2434":{"":"ṃ"},"2435":{"":"ḥ"},"2433":{"":"n̐"},"2365":{"":"’"},"2494":{"":"ā"},"2495":{"":"i"},"2496":{"":"ī"},"2497":{"":"u"},"2498":{"":"ū"},"2499":{"":"ṛ"},"2503":{"":"e"},"2504":{"":"ai"},"2507":{"":"o"},"2508":{"":"au"},"2509":{"":""},"2534":{"":"0"},"2535":{"":"1"},"2536":{"":"2"},"2537":{"":"3"},"2538":{"":"4"},"2539":{"":"5"},"2540":{"":"6"},"2541":{"":"7"},"2542":{"":"8"},"2543":{"":"9"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }