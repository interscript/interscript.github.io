var map = function(Interscript) {Interscript.define_map("iso-ara-Arab-Latn-233-1984", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_899559293049203222);
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")(?<!"+Interscript.aliases.boundary+"[‘’'])[a-￿]", function(a){return a.toUpperCase();});
s = Interscript.gsub(s, "\ At\ T", " at T");
s = Interscript.gsub(s, "\ Aṯ\ Ṯ", " aṯ Ṯ");
s = Interscript.gsub(s, "\ Ad\ D", " ad D");
s = Interscript.gsub(s, "\ Aḏ\ Ḏ", " aḏ Ḏ");
s = Interscript.gsub(s, "\ Ar\ R", " ar R");
s = Interscript.gsub(s, "\ Az\ Z", " az Z");
s = Interscript.gsub(s, "\ As\ S", " as S");
s = Interscript.gsub(s, "\ Aš\ Š", " aš Š");
s = Interscript.gsub(s, "\ Aṣ\ Ṣ", " aṣ Ṣ");
s = Interscript.gsub(s, "\ Aḍ\ Ḍ", " aḍ Ḍ");
s = Interscript.gsub(s, "\ Aṭ\ Ṭ", " aṭ Ṭ");
s = Interscript.gsub(s, "\ Aẓ\ Ẓ", " aẓ Ẓ");
s = Interscript.gsub(s, "\ Al\ L", " al L");
s = Interscript.gsub(s, "\ An\ N", " an N");
s = Interscript.gsub(s, "\ Al\ ", " al ");
return s;
};
map.cache.PRE_899559293049203222 = ["(?<_0>"+Interscript.aliases.boundary+"التّ?)|(?<_1>"+Interscript.aliases.boundary+"الثّ?)|(?<_2>"+Interscript.aliases.boundary+"الدّ?)|(?<_3>"+Interscript.aliases.boundary+"الذّ?)|(?<_4>"+Interscript.aliases.boundary+"الرّ?)|(?<_5>"+Interscript.aliases.boundary+"الزّ?)|(?<_6>"+Interscript.aliases.boundary+"السّ?)|(?<_7>"+Interscript.aliases.boundary+"الشّ?)|(?<_8>"+Interscript.aliases.boundary+"الصّ?)|(?<_9>"+Interscript.aliases.boundary+"الضّ?)|(?<_10>"+Interscript.aliases.boundary+"الطّ?)|(?<_11>"+Interscript.aliases.boundary+"الظّ?)|(?<_12>"+Interscript.aliases.boundary+"اللّ?)|(?<_13>"+Interscript.aliases.boundary+"النّ?)|(?<_14>ِيَّ)|(?<_15>عُو)|(?<_16>ِي(?=[َُ]))|(?<_17>َوْ)|(?<_18>َيْ)|(?<_19>"+Interscript.aliases.boundary+"ال)|(?<_20>َ(?=ة))|(?<_21>عَ)|(?<_22>عِ)|(?<_23>عُ)|(?<_24>ِي)|(?<_25>َا)|(?<_26>َى)|(?<_27>ُو)|(?<_28>بّ)|(?<_29>تّ)|(?<_30>ثّ)|(?<_31>جّ)|(?<_32>حّ)|(?<_33>خّ)|(?<_34>دّ)|(?<_35>ذّ)|(?<_36>رّ)|(?<_37>زّ)|(?<_38>سّ)|(?<_39>شّ)|(?<_40>صّ)|(?<_41>ضّ)|(?<_42>طّ)|(?<_43>ظّ)|(?<_44>غّ)|(?<_45>فّ)|(?<_46>قّ)|(?<_47>كّ)|(?<_48>لّ)|(?<_49>مّ)|(?<_50>نّ)|(?<_51>هّ)|(?<_52>وّ)|(?<_53>يّ)|(?<_54>َ)|(?<_55>ِ)|(?<_56>ُ)|(?<_57>ْ)|(?<_58>ة)|(?<_59>آ)|(?<_60>ا)|(?<_61>ى)|(?<_62>ئ)|(?<_63>ء)|(?<_64>أ)|(?<_65>ب)|(?<_66>ﺑ)|(?<_67>ﺒ)|(?<_68>ﺐ)|(?<_69>ت)|(?<_70>ﺗ)|(?<_71>ﺘ)|(?<_72>ﺖ)|(?<_73>ث)|(?<_74>ﺛ)|(?<_75>ﺜ)|(?<_76>ﺚ)|(?<_77>ج)|(?<_78>ﺟ)|(?<_79>ﺠ)|(?<_80>ﺞ)|(?<_81>ح)|(?<_82>ﺣ)|(?<_83>ﺤ)|(?<_84>ﺢ)|(?<_85>خ)|(?<_86>ﺧ)|(?<_87>ﺨ)|(?<_88>ﺦ)|(?<_89>د)|(?<_90>ﺪ)|(?<_91>ذ)|(?<_92>ﺬ)|(?<_93>ر)|(?<_94>ﺮ)|(?<_95>ز)|(?<_96>ﺰ)|(?<_97>س)|(?<_98>ﺳ)|(?<_99>ﺴ)|(?<_100>ﺲ)|(?<_101>ش)|(?<_102>ﺷ)|(?<_103>ﺸ)|(?<_104>ﺶ)|(?<_105>ص)|(?<_106>ﺻ)|(?<_107>ﺼ)|(?<_108>ﺺ)|(?<_109>ض)|(?<_110>ﺿ)|(?<_111>ﻀ)|(?<_112>ﺾ)|(?<_113>ط)|(?<_114>ﻃ)|(?<_115>ﻄ)|(?<_116>ﻂ)|(?<_117>ظ)|(?<_118>ﻇ)|(?<_119>ﻈ)|(?<_120>ﻆ)|(?<_121>ع)|(?<_122>ﻋ)|(?<_123>ﻌ)|(?<_124>ﻊ)|(?<_125>غ)|(?<_126>ﻏ)|(?<_127>ﻐ)|(?<_128>ﻎ)|(?<_129>ف)|(?<_130>ﻓ)|(?<_131>ﻔ)|(?<_132>ﻒ)|(?<_133>ق)|(?<_134>ﻗ)|(?<_135>ﻘ)|(?<_136>ﻖ)|(?<_137>ك)|(?<_138>ﻛ)|(?<_139>ﻜ)|(?<_140>ﻚ)|(?<_141>ل)|(?<_142>ﻟ)|(?<_143>ﻠ)|(?<_144>ﻞ)|(?<_145>م)|(?<_146>ﻣ)|(?<_147>ﻤ)|(?<_148>ﻢ)|(?<_149>ن)|(?<_150>ﻧ)|(?<_151>ﻨ)|(?<_152>ﻦ)|(?<_153>ه)|(?<_154>ﻫ)|(?<_155>ﻬ)|(?<_156>ﻪ)|(?<_157>و)|(?<_158>ﻮ)|(?<_159>ي)|(?<_160>ﻳ)|(?<_161>ﻴ)|(?<_162>ﻱ)", ["at t","aṯ ṯ","ad d","aḏ ḏ","ar r","az z","as s","aš š","aṣ ṣ","aḍ ḍ","aṭ ṭ","aẓ ẓ","al l","an n","iy","‘ū","iy","aw","ay","al ","","‘a","‘i","‘ū","iy","a’","aỳ","uw","bb","tt","ṯṯ","ǧǧ","ḥḥ","ẖẖ","dd","ḏḏ","rr","zz","ss","šš","ṣṣ","ḍḍ","ṭṭ","ẓẓ","ġġ","ff","qq","kk","ll","mm","nn","hh","ww","yy","a","i","u","","aẗ","’â","â","ỳ","'","’","a","b","b","b","b","t","t","t","t","ṯ","ṯ","ṯ","ṯ","ǧ","ǧ","ǧ","ǧ","ḥ","ḥ","ḥ","ḥ","ẖ","ẖ","ẖ","ẖ","d","d","ḏ","ḏ","r","r","z","z","s","s","s","s","š","š","š","š","ṣ","ṣ","ṣ","ṣ","ḍ","ḍ","ḍ","ḍ","ṭ","ṭ","ṭ","ṭ","ẓ","ẓ","ẓ","ẓ","‘","‘","‘","‘","ġ","ġ","ġ","ġ","f","f","f","f","q","q","q","q","k","k","k","k","l","l","l","l","m","m","m","m","n","n","n","n","h","h","h","h","w","w","y","y","y","y"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }