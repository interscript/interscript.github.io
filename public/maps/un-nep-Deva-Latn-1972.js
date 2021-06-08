var map = function(Interscript) {Interscript.define_map("un-nep-Deva-Latn-1972", function(Interscript, map) {
map.dependencies = [];
map.aliases.deva_characters_1 = "ा";
map.aliases_re.deva_characters_1 = "[ािीुूृॄॅेैॉोौ\ ्]";
map.stages.main = function(s) {
s = Interscript.gsub(s, "क=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "k");
s = Interscript.gsub(s, "क(?="+Interscript.aliases.boundary+")", "k");
s = Interscript.gsub(s, "ख=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "kh");
s = Interscript.gsub(s, "ख(?="+Interscript.aliases.boundary+")", "kh");
s = Interscript.gsub(s, "ग=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "g");
s = Interscript.gsub(s, "ग(?="+Interscript.aliases.boundary+")", "g");
s = Interscript.gsub(s, "घ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "gh");
s = Interscript.gsub(s, "घ(?="+Interscript.aliases.boundary+")", "gh");
s = Interscript.gsub(s, "ङ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṅ");
s = Interscript.gsub(s, "ङ(?="+Interscript.aliases.boundary+")", "ṅ");
s = Interscript.gsub(s, "च=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ch");
s = Interscript.gsub(s, "च(?="+Interscript.aliases.boundary+")", "ch");
s = Interscript.gsub(s, "छ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "chh");
s = Interscript.gsub(s, "छ(?="+Interscript.aliases.boundary+")", "chh");
s = Interscript.gsub(s, "ज=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "j");
s = Interscript.gsub(s, "ज(?="+Interscript.aliases.boundary+")", "j");
s = Interscript.gsub(s, "झ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "jh");
s = Interscript.gsub(s, "झ(?="+Interscript.aliases.boundary+")", "jh");
s = Interscript.gsub(s, "ञ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ñ");
s = Interscript.gsub(s, "ञ(?="+Interscript.aliases.boundary+")", "ñ");
s = Interscript.gsub(s, "ट=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṭ");
s = Interscript.gsub(s, "ट(?="+Interscript.aliases.boundary+")", "ṭ");
s = Interscript.gsub(s, "ठ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṭh");
s = Interscript.gsub(s, "ठ(?="+Interscript.aliases.boundary+")", "ṭh");
s = Interscript.gsub(s, "ड=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ḍ");
s = Interscript.gsub(s, "ड(?="+Interscript.aliases.boundary+")", "ḍ");
s = Interscript.gsub(s, "ढ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ḍh");
s = Interscript.gsub(s, "ढ(?="+Interscript.aliases.boundary+")", "ḍh");
s = Interscript.gsub(s, "ण=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṇ");
s = Interscript.gsub(s, "ण(?="+Interscript.aliases.boundary+")", "ṇ");
s = Interscript.gsub(s, "त=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "t");
s = Interscript.gsub(s, "त(?="+Interscript.aliases.boundary+")", "t");
s = Interscript.gsub(s, "थ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "th");
s = Interscript.gsub(s, "थ(?="+Interscript.aliases.boundary+")", "th");
s = Interscript.gsub(s, "द=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "d");
s = Interscript.gsub(s, "द(?="+Interscript.aliases.boundary+")", "d");
s = Interscript.gsub(s, "ध=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "dh");
s = Interscript.gsub(s, "ध(?="+Interscript.aliases.boundary+")", "dh");
s = Interscript.gsub(s, "न=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "n");
s = Interscript.gsub(s, "न(?="+Interscript.aliases.boundary+")", "n");
s = Interscript.gsub(s, "प=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "p");
s = Interscript.gsub(s, "प(?="+Interscript.aliases.boundary+")", "p");
s = Interscript.gsub(s, "फ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ph");
s = Interscript.gsub(s, "फ(?="+Interscript.aliases.boundary+")", "ph");
s = Interscript.gsub(s, "ब=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "b");
s = Interscript.gsub(s, "ब(?="+Interscript.aliases.boundary+")", "b");
s = Interscript.gsub(s, "भ=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "bh");
s = Interscript.gsub(s, "भ(?="+Interscript.aliases.boundary+")", "bh");
s = Interscript.gsub(s, "म=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "m");
s = Interscript.gsub(s, "म(?="+Interscript.aliases.boundary+")", "m");
s = Interscript.gsub(s, "य=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "y");
s = Interscript.gsub(s, "य(?="+Interscript.aliases.boundary+")", "y");
s = Interscript.gsub(s, "र=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "r");
s = Interscript.gsub(s, "र(?="+Interscript.aliases.boundary+")", "r");
s = Interscript.gsub(s, "ल=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "l");
s = Interscript.gsub(s, "ल(?="+Interscript.aliases.boundary+")", "l");
s = Interscript.gsub(s, "व=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "v");
s = Interscript.gsub(s, "व(?="+Interscript.aliases.boundary+")", "v");
s = Interscript.gsub(s, "श=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "sh");
s = Interscript.gsub(s, "श(?="+Interscript.aliases.boundary+")", "sh");
s = Interscript.gsub(s, "ष=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṣh");
s = Interscript.gsub(s, "ष(?="+Interscript.aliases.boundary+")", "ṣh");
s = Interscript.gsub(s, "स=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "s");
s = Interscript.gsub(s, "स(?="+Interscript.aliases.boundary+")", "s");
s = Interscript.gsub(s, "क़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "q");
s = Interscript.gsub(s, "क़(?="+Interscript.aliases.boundary+")", "q");
s = Interscript.gsub(s, "ख़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ḳh");
s = Interscript.gsub(s, "ख़(?="+Interscript.aliases.boundary+")", "ḳh");
s = Interscript.gsub(s, "ग़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "g");
s = Interscript.gsub(s, "ग़(?="+Interscript.aliases.boundary+")", "g");
s = Interscript.gsub(s, "ज़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "z");
s = Interscript.gsub(s, "ज़(?="+Interscript.aliases.boundary+")", "z");
s = Interscript.gsub(s, "ड़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṙ");
s = Interscript.gsub(s, "ड़(?="+Interscript.aliases.boundary+")", "ṙ");
s = Interscript.gsub(s, "ढ़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "ṙh");
s = Interscript.gsub(s, "ढ़(?="+Interscript.aliases.boundary+")", "ṙh");
s = Interscript.gsub(s, "फ़=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "f");
s = Interscript.gsub(s, "फ़(?="+Interscript.aliases.boundary+")", "f");
s = Interscript.gsub(s, "ह=?(?="+Interscript.get_alias_re("un-nep-Deva-Latn-1972", "deva_characters_1")+")", "h");
s = Interscript.gsub(s, "ह(?="+Interscript.aliases.boundary+")", "h");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3358589576159591348);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_3358589576159591348 = {"2309":{"":"a"},"2310":{"":"ā"},"2311":{"":"i"},"2312":{"":"ī"},"2313":{"":"u"},"2314":{"":"ū"},"2315":{"":"ṛ"},"2400":{"":"ṝ"},"2316":{"":"l̤"},"2319":{"":"e"},"2320":{"":"ai"},"2323":{"":"o"},"2324":{"":"au"},"2366":{"":"ā"},"2367":{"":"i"},"2368":{"":"ī"},"2369":{"":"u"},"2370":{"":"ū"},"2371":{"":"ṛ"},"2375":{"":"e"},"2376":{"":"ai"},"2379":{"":"o"},"2380":{"":"au"},"2325":{"":"ka"},"2326":{"":"kha"},"2327":{"":"ga"},"2328":{"":"gha"},"2329":{"":"ṅa"},"2330":{"":"cha"},"2331":{"":"chha"},"2332":{"":"ja"},"2333":{"":"jha"},"2334":{"":"ña"},"2335":{"":"ṭa"},"2336":{"":"ṭha"},"2337":{"":"ḍa"},"2338":{"":"ḍha"},"2339":{"":"ṇa"},"2340":{"":"ta"},"2341":{"":"tha"},"2342":{"":"da"},"2343":{"":"dha"},"2344":{"":"na"},"2346":{"":"pa"},"2347":{"":"pha"},"2348":{"":"ba"},"2349":{"":"bha"},"2350":{"":"ma"},"2351":{"":"ya"},"2352":{"":"ra"},"2354":{"":"la"},"2357":{"":"va"},"2358":{"":"sha"},"2359":{"":"ṣha"},"2360":{"":"sa"},"2392":{"":"qa"},"2393":{"":"ḳha"},"2394":{"":"ga"},"2395":{"":"za"},"2396":{"":"ṙa"},"2397":{"":"ṙha"},"2398":{"":"fa"},"2361":{"":"ha"},"2306":{"":"ṁ"},"2305":{"":"m̐"},"2381":{"":""}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }