var map = function(Interscript) {Interscript.define_map("iso-kor-Hang-Latn-1996-method1", function(Interscript, map) {
map.dependencies = ["var-kor","var-kor-Hang-Hang-jamo"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-kor-Hang-Hang-jamo", s, "main");
s = Interscript.gsub(s, "(?<!"+Interscript.get_alias_re("var-kor", "jamo")+")ᄋ", "");
s = Interscript.gsub(s, "ᄋ", "'");
s = Interscript.gsub(s, "ᆼ", "ng");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-kor", "jamo")+")"+Interscript.aliases.none+"(?="+Interscript.get_alias_re("var-kor", "double_cons_jamo")+")", "'");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-kor", "jamo")+")"+Interscript.aliases.none+"(?="+Interscript.get_alias_re("var-kor", "aspirated_cons_jamo")+")", "'");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_69893738736064295);
return s;
};
map.cache.PTREE_69893738736064295 = {"4352":{"":"k"},"4520":{"":"k"},"4367":{"":"kh"},"4543":{"":"kh"},"4353":{"":"kk"},"4521":{"":"kk"},"4355":{"":"t"},"4526":{"":"t"},"4368":{"":"th"},"4544":{"":"th"},"4356":{"":"tt"},"55245":{"":"tt"},"4359":{"":"p"},"4536":{"":"p"},"4369":{"":"ph"},"4545":{"":"ph"},"4360":{"":"pp"},"55270":{"":"pp"},"4364":{"":"c"},"4541":{"":"c"},"4366":{"":"ch"},"4542":{"":"ch"},"4365":{"":"cc"},"55289":{"":"cc"},"4522":{"":"ks"},"43364":{"":"rk"},"4528":{"":"lk"},"4532":{"":"lth"},"43369":{"":"rp"},"4530":{"":"lp"},"4533":{"":"lph"},"4444":{"":"nc"},"4524":{"":"nc"},"4385":{"":"ps"},"4537":{"":"ps"},"4361":{"":"s"},"4538":{"":"s"},"4362":{"":"ss"},"4539":{"":"ss"},"4370":{"":"h"},"4546":{"":"h"},"4354":{"":"n"},"4523":{"":"n"},"4357":{"":"r"},"4527":{"":"l"},"4358":{"":"m"},"4535":{"":"m"},"43372":{"":"rs"},"4531":{"":"ls"},"43368":{"":"rm"},"4529":{"":"lm"},"4378":{"":"rh"},"4534":{"":"lh"},"4445":{"":"nh"},"4525":{"":"nh"},"4449":{"":"a"},"4453":{"":"eo"},"4457":{"":"o"},"4462":{"":"u"},"4467":{"":"eu"},"4469":{"":"i"},"4450":{"":"ae"},"4454":{"":"e"},"4460":{"":"oe"},"4451":{"":"ya"},"4455":{"":"yeo"},"4461":{"":"yo"},"4466":{"":"yu"},"4452":{"":"yae"},"4456":{"":"ye"},"4458":{"":"wa"},"4463":{"":"weo"},"4465":{"":"wi"},"4459":{"":"wae"},"4464":{"":"we"},"4468":{"":"yi"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }