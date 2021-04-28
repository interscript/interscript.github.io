var map = function(Interscript) {Interscript.define_map("var-kor-Kore-Latn-mr-1939", function(Interscript, map) {
map.dependencies = ["var-kor-Kore-Hang-2013","var-kor-Hang-Latn-mr-1939"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-kor-Kore-Hang-2013", s, "main");
s = Interscript.transliterate("var-kor-Hang-Latn-mr-1939", s, "main");
s = Interscript.functions.compose(s, {});
s = Interscript.functions.title_case(s, {});
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }