var map = function(Interscript) {Interscript.define_map("bgnpcgn-div-Thaa-Latn-1972", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "އ(?!=[ަާިީުޫެޭޮޯް])", "’");
s = Interscript.gsub(s, "ނ(?=[ބދޑގ])", "ň");
s = Interscript.gsub(s, "ސ(?=[ހ])", "s·");
s = Interscript.gsub(s, "ނ(?=[ޔ])", "n·");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_1632010406430839837);
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PTREE_1632010406430839837 = {"1958":{"":"a"},"1959":{"":"ā"},"1964":{"":"e"},"1965":{"":"ē"},"1960":{"":"i"},"1961":{"":"ī"},"1962":{"":"u"},"1963":{"":"ū"},"1966":{"":"o"},"1967":{"":"ō"},"1968":{"":""},"1920":{"":"h"},"1921":{"":"sh"},"1922":{"":"n"},"1923":{"":"r"},"1924":{"":"b"},"1925":{"":"l̦"},"1926":{"":"k"},"1927":{"":""},"1928":{"":"v"},"1929":{"":"m"},"1930":{"":"f"},"1931":{"":"d"},"1932":{"":"t"},"1933":{"":"l"},"1934":{"":"g"},"1935":{"":"ny"},"1936":{"":"s"},"1949":{"":"sh"},"1937":{"":"d̦"},"1938":{"":"z"},"1939":{"":"ț"},"1940":{"":"y"},"1941":{"":"p"},"1942":{"":"j"},"1943":{"":"ch"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }