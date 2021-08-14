var map = function(Interscript) {Interscript.define_map("bgnpcgn-pus-Arab-Latn-1968", function(Interscript, map) {
map.dependencies = ["bgnpcgn-prs-Arab-Latn-2007"];
map.stages.main = function(s) {
s = Interscript.transliterate("bgnpcgn-prs-Arab-Latn-2007", s, "main");
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_1626710383239459734);
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")(?<!"+Interscript.aliases.boundary+"[‘’'\-])[a-￿]", function(a){return a.toUpperCase();});
s = Interscript.gsub(s, "\ Ut\ T", " ut T");
s = Interscript.gsub(s, "\ Us̄\ S̄", " us̄ S̄");
s = Interscript.gsub(s, "\ Ud\ D", " ud D");
s = Interscript.gsub(s, "\ Uz̄\ Z̄", " uz̄ Z̄");
s = Interscript.gsub(s, "\ Ur\ R", " ur R");
s = Interscript.gsub(s, "\ Uz\ Z", " uz Z");
s = Interscript.gsub(s, "\ Us\ S", " us S");
s = Interscript.gsub(s, "\ As\ S", " us S");
s = Interscript.gsub(s, "\ Ush\ Sh", " ush Sh");
s = Interscript.gsub(s, "\ Uş\ Ş", " uş Ş");
s = Interscript.gsub(s, "\ Uẕ\ Ẕ", " uẕ Ẕ");
s = Interscript.gsub(s, "\ Uţ\ Ţ", " uţ Ţ");
s = Interscript.gsub(s, "\ Uz̧\ Z̧", " uz̧ Z̧");
s = Interscript.gsub(s, "\ Ul\ L", " ul L");
s = Interscript.gsub(s, "\ Un\ n", " un N");
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PRE_1626710383239459734 = ["(?<_0>"+Interscript.aliases.space+"اللَّه)|(?<_1>"+Interscript.aliases.space+"شَهر)|(?<_2>"+Interscript.aliases.space+"زادة)|(?<_3>"+Interscript.aliases.boundary+"التّ?)|(?<_4>"+Interscript.aliases.boundary+"الثّ?)|(?<_5>"+Interscript.aliases.boundary+"الدّ?)|(?<_6>"+Interscript.aliases.boundary+"الذّ?)|(?<_7>"+Interscript.aliases.boundary+"الرّ?)|(?<_8>"+Interscript.aliases.boundary+"الزّ?)|(?<_9>"+Interscript.aliases.boundary+"السّ?)|(?<_10>"+Interscript.aliases.boundary+"الشّ?)|(?<_11>"+Interscript.aliases.boundary+"الصّ?)|(?<_12>"+Interscript.aliases.boundary+"الضّ?)|(?<_13>"+Interscript.aliases.boundary+"الطّ?)|(?<_14>"+Interscript.aliases.boundary+"الظّ?)|(?<_15>"+Interscript.aliases.boundary+"اللّ?)|(?<_16>"+Interscript.aliases.boundary+"النّ?)|(?<_17>"+Interscript.aliases.space+"خوا)|(?<_18>"+Interscript.aliases.space+"زَي)|(?<_19>ِ"+Interscript.aliases.boundary+")|(?<_20>ِ)|(?<_21>ُ)|(?<_22>ْ)|(?<_23>ٙ)|(?<_24>ئ)", ["ullāh","shahr","zādah","ut t","us̄ s̄","ud d","uz̄ z̄","ur r","uz z","us s","ush sh","uş ş","uẕ ẕ","uţ ţ","uz̧ z̧","ul l","un n","khwā","zay","-e","i","u","","ê","êy"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }