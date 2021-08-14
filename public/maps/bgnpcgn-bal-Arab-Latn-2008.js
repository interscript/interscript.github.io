var map = function(Interscript) {Interscript.define_map("bgnpcgn-bal-Arab-Latn-2008", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_355755553174395701);
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")(?<!"+Interscript.aliases.boundary+"[‘’'])[a-￿]", function(a){return a.toUpperCase();});
return s;
};
map.cache.PRE_355755553174395701 = ["(?<_0>بھ)|(?<_1>پھ)|(?<_2>تھ)|(?<_3>ٹھ)|(?<_4>جھ)|(?<_5>چھ)|(?<_6>حھ)|(?<_7>ڈھ)|(?<_8>رھ)|(?<_9>کھ)|(?<_10>گھ)|(?<_11>لا)|(?<_12>کا)|(?<_13>گا)|(?<_14>کل)|(?<_15>گل)|(?<_16>ِى)|(?<_17>"+Interscript.aliases.boundary+"ا)|(?<_18>ُو)|(?<_19>َے)|(?<_20>َو)|(?<_21>بّ)|(?<_22>پّ)|(?<_23>تّ)|(?<_24>ٹّ)|(?<_25>ټّ)|(?<_26>ثّ)|(?<_27>ٿّ)|(?<_28>جّ)|(?<_29>چّ)|(?<_30>حّ)|(?<_31>خّ)|(?<_32>دّ)|(?<_33>ڈّ)|(?<_34>ډّ)|(?<_35>ذّ)|(?<_36>رّ)|(?<_37>ڑّ)|(?<_38>ړّ)|(?<_39>زّ)|(?<_40>ژّ)|(?<_41>سّ)|(?<_42>شّ)|(?<_43>صّ)|(?<_44>ضّ)|(?<_45>طّ)|(?<_46>ظّ)|(?<_47>عّ)|(?<_48>غّ)|(?<_49>فّ)|(?<_50>قّ)|(?<_51>كّ)|(?<_52>کّ)|(?<_53>گّ)|(?<_54>لّ)|(?<_55>مّ)|(?<_56>نّ)|(?<_57>ںّ)|(?<_58>وّ)|(?<_59>هّ)|(?<_60>ہّ)|(?<_61>ھّ)|(?<_62>ءّ)|(?<_63>ئّ)|(?<_64>ىّ)|(?<_65>ءَ)|(?<_66>ءِ)|(?<_67>ب)|(?<_68>پ)|(?<_69>ت)|(?<_70>ٹ)|(?<_71>ټ)|(?<_72>ث)|(?<_73>ٿ)|(?<_74>ج)|(?<_75>چ)|(?<_76>ح)|(?<_77>خ)|(?<_78>د)|(?<_79>ڈ)|(?<_80>ډ)|(?<_81>ذ)|(?<_82>ر)|(?<_83>ڑ)|(?<_84>ړ)|(?<_85>ز)|(?<_86>ژ)|(?<_87>س)|(?<_88>ش)|(?<_89>ص)|(?<_90>ض)|(?<_91>ط)|(?<_92>ظ)|(?<_93>ع)|(?<_94>غ)|(?<_95>ف)|(?<_96>ق)|(?<_97>ك)|(?<_98>ک)|(?<_99>گ)|(?<_100>ل)|(?<_101>م)|(?<_102>ن)|(?<_103>ں)|(?<_104>و)|(?<_105>و)|(?<_106>ه)|(?<_107>ہ)|(?<_108>ھ)|(?<_109>ء)|(?<_110>ئ)|(?<_111>ى)|(?<_112>ي)|(?<_113>ِ)|(?<_114>ے)|(?<_115>ا)|(?<_116>آ)|(?<_117>َ)|(?<_118>ُ)|(?<_119>ْ)|(?<_120>ٰ)|(?<_121>۰)|(?<_122>۱)|(?<_123>۲)|(?<_124>۳)|(?<_125>۴)|(?<_126>۵)|(?<_127>۶)|(?<_128>۷)|(?<_129>۸)|(?<_130>۹)", ["bh","ph","th’","ṭh","jh","chh","dh’","ḍh","ṛh","kh’","gh’","lā","kā","gā","kl","gl","ī","","ū","ay","aw","bb","pp","tt","ṭṭ","ṭṭ","t͟ht͟h","t͟ht͟h","jj","chch","ḩḩ","khkh","dd","ḍḍ","ḍḍ","d͟hd͟h","rr","ṛṛ","ṛṛ","zz","zhzh","ss","shsh","şş","ẕẕ","ţţ","z̧z̧","‘‘","ghgh","ff","qq","kk","kk","gg","ll","mm","nn","ññ","ww","hh","hh","hh","’’","’’","yy","-ā","-ay","b","p","t","ṭ","ṭ","t͟h","t͟h","j","ch","ḩ","kh","d","ḍ","ḍ","d͟h","r","ṛ","ṛ","z","zh","s","sh","ş","ẕ","ţ","z̧","‘","gh","f","q","k","k","g","l","m","n","ñ","o","w","h","h","h","’","’","y","y","i","e","ā","ā","a","u","","á","0","1","2","3","4","5","6","7","8","9"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }