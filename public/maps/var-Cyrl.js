var map = function(Interscript) {Interscript.define_map("var-Cyrl", function(Interscript, map) {
map.dependencies = [];
map.aliases.bel_consonant = "Б";
map.aliases_re.bel_consonant = "[БбВвГгДдЖжЗзЙйКкЛлМмНнПпРрСсТтФфХхЦцЧчШш]";
map.aliases.cyrl_upper = "A";
map.aliases_re.cyrl_upper = "[AБBГДЕЁЖЗИЙКЛМНОПРСТУЎФХЦЧШЩЪЫЬЭЮЯІ]";
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }