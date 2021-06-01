var map = function(Interscript) {Interscript.define_map("mvd-bel-Cyrl-Latn-2008", function(Interscript, map) {
map.dependencies = [];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(’Е)", "Je");
s = Interscript.gsub(s, "(’е)", "je");
s = Interscript.gsub(s, "(’Ё)", "Jo");
s = Interscript.gsub(s, "(’ё)", "jo");
s = Interscript.gsub(s, "(’Ю)", "Ju");
s = Interscript.gsub(s, "(’ю)", "ju");
s = Interscript.gsub(s, "(’Я)", "Ja");
s = Interscript.gsub(s, "(’я)", "ja");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])Е", "Je");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])е", "je");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])Ё", "Jo");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])ё", "jo");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])Ю", "Ju");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])ю", "ju");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])Я", "Ja");
s = Interscript.gsub(s, "(?<=[АаЕеЁёИиОоУуЭэЮюЯяЬьЎў])я", "ja");
s = Interscript.gsub(s, "(?<=[ЗзЛлНнСсЦц])ь", "́");
s = Interscript.gsub(s, "(?<=[ЗзЛлНнСсЦц])ʹ", "́");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Е", "Je");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"е", "je");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Ё", "Jo");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"ё", "jo");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Ю", "Ju");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"ю", "ju");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"Я", "Ja");
s = Interscript.gsub(s, ""+Interscript.aliases.boundary+"я", "ja");
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_3298061427012743055);
s = Interscript.gsub(s, "’", "j");
s = Interscript.functions.compose(s, {});
return s;
};
map.cache.PRE_3298061427012743055 = ["(?<_0>U040E)|(?<_1>Е(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_2>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Е)|(?<_3>Ё(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_4>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Ё)|(?<_5>Ж(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_6>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Ж)|(?<_7>Х(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_8>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Х)|(?<_9>Ц(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_10>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Ц)|(?<_11>Ч(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_12>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Ч)|(?<_13>Ш(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_14>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Ш)|(?<_15>Щ(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_16>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Щ)|(?<_17>Ю(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_18>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Ю)|(?<_19>Я(?=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ]))|(?<_20>(?<=[АБВГДЕЁЖЗІЙКЛМНОПРСТУU040EФХЦЧШЩЫЭЮЯ])Я)|(?<_21>А)|(?<_22>Б)|(?<_23>В)|(?<_24>Г)|(?<_25>Д)|(?<_26>Е)|(?<_27>Ё)|(?<_28>Ж)|(?<_29>З)|(?<_30>І)|(?<_31>Й)|(?<_32>К)|(?<_33>Л)|(?<_34>М)|(?<_35>Н)|(?<_36>О)|(?<_37>П)|(?<_38>Р)|(?<_39>С)|(?<_40>Т)|(?<_41>У)|(?<_42>Ф)|(?<_43>Х)|(?<_44>Ц)|(?<_45>Ч)|(?<_46>Ш)|(?<_47>Щ)|(?<_48>Ы)|(?<_49>Э)|(?<_50>Ю)|(?<_51>Я)|(?<_52>а)|(?<_53>б)|(?<_54>в)|(?<_55>г)|(?<_56>д)|(?<_57>е)|(?<_58>ё)|(?<_59>ж)|(?<_60>з)|(?<_61>і)|(?<_62>й)|(?<_63>к)|(?<_64>л)|(?<_65>м)|(?<_66>н)|(?<_67>о)|(?<_68>п)|(?<_69>р)|(?<_70>с)|(?<_71>т)|(?<_72>у)|(?<_73>ў)|(?<_74>ф)|(?<_75>х)|(?<_76>ц)|(?<_77>ч)|(?<_78>ш)|(?<_79>щ)|(?<_80>ы)|(?<_81>э)|(?<_82>ю)|(?<_83>я)", ["W","IE","IE","IO","IO","ZH","ZH","KH","KH","TS","TS","CH","CH","SH","SH","SHCH","SHCH","IU","IU","IA","IA","A","B","V","G","D","Ie","Io","Zh","Z","I","J","K","L","M","N","O","P","R","S","T","U","F","Kh","Ts","Ch","Sh","Shch","Y","E","Iu","Ia","a","b","v","g","d","ie","io","zh","z","i","j","k","l","m","n","o","p","r","s","t","u","w","f","kh","ts","ch","sh","shch","y","e","iu","ia"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }