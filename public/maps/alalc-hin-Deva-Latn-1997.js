var map = function(Interscript) {Interscript.define_map("alalc-hin-Deva-Latn-1997", function(Interscript, map) {
map.dependencies = [];
map.aliases.hin_cons_or_conscluster = "ा";
map.aliases_re.hin_cons_or_conscluster = "[ािीुूृॄॅेैॉोौ\ ्]";
map.stages.main = function(s) {
s = Interscript.gsub(s, "(क=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "k");
s = Interscript.gsub(s, "(क़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "q");
s = Interscript.gsub(s, "(ख=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "kh");
s = Interscript.gsub(s, "(ख़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "kh");
s = Interscript.gsub(s, "(ग=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "g");
s = Interscript.gsub(s, "(ग़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "gh");
s = Interscript.gsub(s, "(घ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "gh");
s = Interscript.gsub(s, "(ङ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṅ");
s = Interscript.gsub(s, "(च=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "c");
s = Interscript.gsub(s, "(छ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ch");
s = Interscript.gsub(s, "(ज=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "j");
s = Interscript.gsub(s, "(ज़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "j");
s = Interscript.gsub(s, "(झ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "jh");
s = Interscript.gsub(s, "(ञ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ñ");
s = Interscript.gsub(s, "(ट=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṭ");
s = Interscript.gsub(s, "(ट़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "t̤");
s = Interscript.gsub(s, "(ठ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṭh");
s = Interscript.gsub(s, "(ड=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ḍ");
s = Interscript.gsub(s, "(ड़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṛ");
s = Interscript.gsub(s, "(ड़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṛ");
s = Interscript.gsub(s, "(ढ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ḍh");
s = Interscript.gsub(s, "(ढ़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṛh");
s = Interscript.gsub(s, "(ण=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ṇ");
s = Interscript.gsub(s, "(त=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "t");
s = Interscript.gsub(s, "(थ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "th");
s = Interscript.gsub(s, "(द=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "d");
s = Interscript.gsub(s, "(ध=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "dh");
s = Interscript.gsub(s, "(न=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "n");
s = Interscript.gsub(s, "(प=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "p");
s = Interscript.gsub(s, "(फ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ph");
s = Interscript.gsub(s, "(फ़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ph");
s = Interscript.gsub(s, "(ब=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "b");
s = Interscript.gsub(s, "(भ=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "bh");
s = Interscript.gsub(s, "(म=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "m");
s = Interscript.gsub(s, "(य=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "y");
s = Interscript.gsub(s, "(र=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "r");
s = Interscript.gsub(s, "(ल=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "l");
s = Interscript.gsub(s, "(व=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "v");
s = Interscript.gsub(s, "(श=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "ś");
s = Interscript.gsub(s, "(ष=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "sh");
s = Interscript.gsub(s, "(स=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "s");
s = Interscript.gsub(s, "(स़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "s̤");
s = Interscript.gsub(s, "(ह=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "h");
s = Interscript.gsub(s, "(ह़=?)(?="+Interscript.get_alias_re("alalc-hin-Deva-Latn-1997", "hin_cons_or_conscluster")+")", "h");
s = Interscript.gsub(s, "ं(?=[कक़खख़गग़घङ])", "ṅ");
s = Interscript.gsub(s, "ं(?=[चछजज़झञ])", "ñ");
s = Interscript.gsub(s, "ं(?=[टट़ठडड़ढढ़ण])", "ṇ");
s = Interscript.gsub(s, "ं(?=[तथदधन])", "n");
s = Interscript.gsub(s, "(?<=)ँ(?="+Interscript.aliases.boundary+")", "m̐");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2622162116742721265);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_2622162116742721265 = {"2309":{"":"a","2376":{"":"ăi"}},"2310":{"":"ā"},"2311":{"":"i"},"2312":{"":"ī"},"2313":{"":"u"},"2314":{"":"ū"},"2315":{"":"ṛ"},"2400":{"":"ṝ"},"2316":{"":"ḷ"},"2419":{"":"ĕ"},"2319":{"":"e"},"2418":{"":"ê"},"2320":{"":"ai"},"2322":{"":"ŏ"},"2323":{"":"o"},"2321":{"":"ô"},"2324":{"":"ău"},"2325":{"":"ka"},"2392":{"":"qa"},"2326":{"":"kha"},"2393":{"":"kha"},"2327":{"":"ga"},"2394":{"":"gha"},"2328":{"":"gha"},"2329":{"":"ṅa"},"2330":{"":"ca"},"2331":{"":"cha"},"2332":{"":"ja"},"2395":{"":"ja"},"2333":{"":"jha"},"2334":{"":"ña"},"2335":{"":"ṭa","2364":{"":"t̤a"}},"2336":{"":"ṭha"},"2337":{"":"ḍa","2364":{"":"ṛa"}},"2396":{"":"ṛa"},"2338":{"":"ḍha"},"2397":{"":"ṛha"},"2339":{"":"ṇa"},"2340":{"":"ta"},"2341":{"":"tha"},"2342":{"":"da"},"2343":{"":"dha"},"2344":{"":"na"},"2346":{"":"pa"},"2347":{"":"pha"},"2398":{"":"pha"},"2348":{"":"ba"},"2349":{"":"bha"},"2350":{"":"ma"},"2351":{"":"ya"},"2352":{"":"ra"},"2354":{"":"la"},"2357":{"":"va"},"2358":{"":"śa"},"2359":{"":"sha"},"2360":{"":"sa","2364":{"":"s̤a"}},"2361":{"":"ha","2364":{"":"ha"}},"2306":{"":"ṃ"},"2307":{"32":{"":"ḥ"}},"2305":{"":"n̐"},"2365":{"":"’"},"2366":{"":"ā"},"2377":{"":"ô"},"2367":{"":"i"},"2368":{"":"ī"},"2369":{"":"u"},"2370":{"":"ū"},"2371":{"":"ṛ"},"2372":{"":"ṝ"},"2375":{"":"e"},"2378":{"":"ŏ"},"2380":{"":"ău"},"2376":{"":"ai"},"2379":{"":"o"},"2381":{"":""},"2364":{"":""},"2406":{"":"0"},"2407":{"":"1"},"2408":{"":"2"},"2409":{"":"3"},"2410":{"":"4"},"2411":{"":"5"},"2412":{"":"6"},"2413":{"":"7"},"2414":{"":"8"},"2415":{"":"9"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }