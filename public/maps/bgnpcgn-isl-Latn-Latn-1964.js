var map = function(Interscript) {Interscript.define_map("bgnpcgn-isl-Latn-Latn-1964", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_599545756225280032);
s = Interscript.gsub(s, "(?<=[A-Z])(?:Th|Dh)", function(a){return a.toUpperCase();});
s = Interscript.gsub(s, "(?:Th|Dh)(?=[A-Z])", function(a){return a.toUpperCase();});
return s;
};
map.cache.PTREE_599545756225280032 = {"208":{"":"Dh"},"240":{"":"dh"},"222":{"":"Th"},"254":{"":"th"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }