var map = function(Interscript) {Interscript.define_map("alalc-ell-Grek-Latn-2010", function(Interscript, map) {
map.dependencies = ["unicode"];
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<=[ΑαΕεΟοΗηΩω])Υ", "U");
s = Interscript.gsub(s, "(?<=[ΑαΕεΟοΗηΩω])υ", "u");
s = Interscript.gsub(s, "(?<=[ΑαΕεΟοΗηΩω])ύ", "u");
s = Interscript.gsub(s, "Υ(?=[Ιιί])", "U");
s = Interscript.gsub(s, "υ(?=[Ιιί])", "u");
s = Interscript.gsub(s, "Γ(?=[γΓξΞχΧ])", "N");
s = Interscript.gsub(s, "γ(?=[γΓξΞχΧ])", "n");
s = Interscript.gsub(s, "(?<=Κ)Γ(?=Ν)", "N");
s = Interscript.gsub(s, "(?<=κ)γ(?=ν)", "n");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")Γ(?![κΚ]"+Interscript.aliases.boundary+")(?=[κΚ])", "N");
s = Interscript.gsub(s, "(?<!"+Interscript.aliases.boundary+")γ(?![κΚ]"+Interscript.aliases.boundary+")(?=[κΚ])", "n");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")ΝΤ", "Ḏ");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")Ντ", "Ḏ");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")ντ", "ḏ");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")ΜΠ", "B");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")Μπ", "B");
s = Interscript.gsub(s, "(?<="+Interscript.aliases.boundary+")μπ", "b");
s = Interscript.gsub(s, ";", "?");
s = Interscript.gsub(s, ";", "?");
s = Interscript.parallel_regexp_gsub(s, map.cache.PRE_2802605322030195100);
return s;
};
map.cache.PRE_2802605322030195100 = ["(?<_0>Θ(?=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ]))|(?<_1>(?<=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ])Θ)|(?<_2>Φ(?=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ]))|(?<_3>(?<=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ])Φ)|(?<_4>Χ(?=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ]))|(?<_5>(?<=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ])Χ)|(?<_6>Ψ(?=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ]))|(?<_7>(?<=[ΆΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΈΉΊΌΏΪΫ])Ψ)|(?<_8>')|(?<_9>Ά)|(?<_10>Α)|(?<_11>Β)|(?<_12>Γ)|(?<_13>Δ)|(?<_14>Ε)|(?<_15>Ζ)|(?<_16>Η)|(?<_17>Θ)|(?<_18>Ι)|(?<_19>Κ)|(?<_20>Λ)|(?<_21>Μ)|(?<_22>Ν)|(?<_23>Ξ)|(?<_24>Ο)|(?<_25>Π)|(?<_26>Ρ)|(?<_27>Σ)|(?<_28>Τ)|(?<_29>Υ)|(?<_30>Φ)|(?<_31>Χ)|(?<_32>Ψ)|(?<_33>Ω)|(?<_34>Έ)|(?<_35>Ή)|(?<_36>Ί)|(?<_37>Ό)|(?<_38>Ύ)|(?<_39>Ώ)|(?<_40>Ϊ)|(?<_41>Ϋ)|(?<_42>ά)|(?<_43>α)|(?<_44>β)|(?<_45>γ)|(?<_46>δ)|(?<_47>ε)|(?<_48>ζ)|(?<_49>η)|(?<_50>θ)|(?<_51>ι)|(?<_52>κ)|(?<_53>λ)|(?<_54>μ)|(?<_55>ν)|(?<_56>ξ)|(?<_57>ο)|(?<_58>π)|(?<_59>ρ)|(?<_60>σ)|(?<_61>ς)|(?<_62>τ)|(?<_63>υ)|(?<_64>φ)|(?<_65>χ)|(?<_66>ψ)|(?<_67>ω)|(?<_68>έ)|(?<_69>ή)|(?<_70>ί)|(?<_71>ό)|(?<_72>ύ)|(?<_73>ώ)|(?<_74>ϊ)|(?<_75>ϋ)|(?<_76>ΐ)|(?<_77>ΰ)|(?<_78>·)|(?<_79>·)", ["TH","TH","PH","PH","CH","CH","PS","PS","","A","A","V","G","D","E","Z","Ē","Th","I","K","L","M","N","X","O","P","R","S","T","Y","Ph","Ch","Ps","Ō","E","Ē","I","O","Y","Ō","I","Y","a","a","v","g","d","e","z","ē","th","i","k","l","m","n","x","o","p","r","s","s","t","y","ph","ch","ps","ō","e","ē","i","o","y","ō","i","y","i","y",";",";"]];
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }