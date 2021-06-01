var map = function(Interscript) {Interscript.define_map("bgn-kor-Kore-Latn-1943", function(Interscript, map) {
map.dependencies = ["var-kor-Kore-Hang-2013","bgn-kor-Hang-Latn-1943"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-kor-Kore-Hang-2013", s, "main");
s = Interscript.transliterate("bgn-kor-Hang-Latn-1943", s, "main");
s = Interscript.functions.compose(s, {});
s = Interscript.functions.title_case(s, {});
return s;
};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }