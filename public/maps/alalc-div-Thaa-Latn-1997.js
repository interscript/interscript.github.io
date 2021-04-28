var map = function(Interscript) {Interscript.define_map("alalc-div-Thaa-Latn-1997", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<=)ށް(?="+Interscript.aliases.boundary+")", "ḫ");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")ން", "n");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")ނ", "ṁ");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"(އ=?)(?=[ަާިީުޫެޭޮޯ])", "");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ހ)", "h");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ށ)", "ś");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ނ)", "n");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ރ)", "r");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ބ)", "b");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޅ)", "ḷ");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ކ)", "k");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ވ)", "v");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=މ)", "m");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ފ)", "f");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ދ)", "d");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ތ)", "t");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ލ)", "l");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ގ)", "g");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޏ)", "ñ");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ސ)", "s");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޑ)", "ḍ");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޖ)", "j");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޗ)", "c");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޒ)", "z");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޓ)", "ṭ");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޕ)", "p");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?=ޔ)", "y");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އް(?="+Interscript.aliases.boundary+")", "h");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")އ(?=[ަާިީުޫެޭޮޯ])", "ʼ");
s = Interscript.gsub(s, "ތްތ", "t̤t");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_54129589928754254);
return s;
};
map.cache.PTREE_54129589928754254 = {"1958":{"":"a"},"1959":{"":"ā"},"1960":{"":"i"},"1961":{"":"ī"},"1962":{"":"u"},"1963":{"":"ū"},"1964":{"":"e"},"1965":{"":"ē"},"1966":{"":"o"},"1967":{"":"ō"},"1968":{"":""},"1920":{"":"h"},"1921":{"":"ś"},"1922":{"":"n"},"1923":{"":"r"},"1924":{"":"b"},"1925":{"":"ḷ"},"1926":{"":"k"},"1927":{"":""},"1928":{"":"v"},"1929":{"":"m"},"1930":{"":"f"},"1931":{"":"d"},"1932":{"":"t"},"1933":{"":"l"},"1934":{"":"g"},"1935":{"":"ñ"},"1936":{"":"s"},"1937":{"":"ḍ"},"1942":{"":"j"},"1943":{"":"c"},"1938":{"":"z"},"1939":{"":"ṭ"},"1941":{"":"p"},"1940":{"":"y"},"1944":{"":"th"},"1945":{"":"ḥ"},"1946":{"":"kh"},"1947":{"":"dh"},"1949":{"":"sh"},"1950":{"":"ṣ"},"1951":{"":"ḏ"},"1952":{"":"t̤"},"1953":{"":"ẓ"},"1954":{"":"ʻ"},"1955":{"":"gh"},"1956":{"":"q"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }