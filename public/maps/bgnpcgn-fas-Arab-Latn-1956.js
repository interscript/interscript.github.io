var map = function(Interscript) {Interscript.define_map("bgnpcgn-fas-Arab-Latn-1956", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_2557575446462748982);
return s;
};
map.cache.PTREE_2557575446462748982 = {"1575":{"":"a"},"1576":{"":"b"},"1662":{"":"p"},"1578":{"":"t"},"1579":{"":"s"},"1580":{"":"j"},"1581":{"":"h"},"1670":{"":"ch"},"1582":{"":"kh"},"1583":{"":"d"},"1584":{"":"z"},"1585":{"":"r"},"1586":{"":"z"},"1587":{"":"s"},"1588":{"":"sh"},"1589":{"":"s"},"1590":{"":"z"},"1591":{"":"t"},"1592":{"":"z"},"1593":{"":"‘"},"1594":{"":"gh"},"1601":{"":"f"},"1602":{"":"q"},"1603":{"":"k"},"1604":{"":"l"},"1605":{"":"m"},"1606":{"":"n"},"1607":{"":"h"},"1608":{"":"v"},"1609":{"":"y"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }