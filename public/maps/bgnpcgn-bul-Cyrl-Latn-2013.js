var map = function(Interscript) {Interscript.define_map("bgnpcgn-bul-Cyrl-Latn-2013", function(Interscript, map) {
map.dependencies = ["bgnpcgn-bul-Cyrl-Latn-1952"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "България", "Bulgaria");
s = Interscript.gsub(s, "(?<=И)Я(?="+Interscript.aliases.boundary+")", "A");
s = Interscript.gsub(s, "(?<=и)я(?="+Interscript.aliases.boundary+")", "a");
s = Interscript.transliterate("bgnpcgn-bul-Cyrl-Latn-1952", s, "main");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }