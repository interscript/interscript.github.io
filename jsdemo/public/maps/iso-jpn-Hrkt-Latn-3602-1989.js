var map = function(Interscript) {Interscript.define_map("iso-jpn-Hrkt-Latn-3602-1989", function(Interscript, map) {
map.dependencies = ["mext-jpn-Hrkt-Latn-1954"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "([っッ])•", "$1");
s = Interscript.transliterate("mext-jpn-Hrkt-Latn-1954", s, "main");
s = Interscript.gsub(s, "•", "");
s = Interscript.gsub(s, "'", "’");
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }