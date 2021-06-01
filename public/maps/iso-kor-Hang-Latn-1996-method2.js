var map = function(Interscript) {Interscript.define_map("iso-kor-Hang-Latn-1996-method2", function(Interscript, map) {
map.dependencies = ["var-kor","var-kor-Hang-Hang-jamo"];
map.stages.main = function(s) {
s = Interscript.transliterate("var-kor-Hang-Hang-jamo", s, "main");
s = Interscript.gsub(s, "(?<!"+Interscript.get_alias_re("var-kor", "jamo")+")ᄋ", "");
s = Interscript.gsub(s, "ᄋ", "'");
s = Interscript.gsub(s, "ᆼ", "ng");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("var-kor", "jamo")+")"+Interscript.aliases.none+"(?="+Interscript.get_alias_re("var-kor", "double_cons_jamo")+")", "'");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3821498279324537244);
return s;
};
map.cache.PTREE_3821498279324537244 = {"4352":{"":"g"},"4520":{"":"g"},"4367":{"":"k"},"4543":{"":"k"},"4353":{"":"gg"},"4521":{"":"gg"},"4355":{"":"d"},"4526":{"":"d"},"4368":{"":"t"},"4544":{"":"t"},"4356":{"":"dd"},"55245":{"":"dd"},"4359":{"":"b"},"4536":{"":"b"},"4369":{"":"p"},"4545":{"":"p"},"4360":{"":"bb"},"55270":{"":"bb"},"4364":{"":"j"},"4541":{"":"j"},"4366":{"":"c"},"4542":{"":"c"},"4365":{"":"jj"},"55289":{"":"jj"},"4522":{"":"gs"},"43364":{"":"rg"},"4528":{"":"lg"},"4532":{"":"lt"},"43369":{"":"rb"},"4530":{"":"lb"},"4533":{"":"lp"},"4444":{"":"nj"},"4524":{"":"nj"},"4385":{"":"bs"},"4537":{"":"bs"},"4361":{"":"s"},"4538":{"":"s"},"4362":{"":"ss"},"4539":{"":"ss"},"4370":{"":"h"},"4546":{"":"h"},"4354":{"":"n"},"4523":{"":"n"},"4357":{"":"r"},"4527":{"":"l"},"4358":{"":"m"},"4535":{"":"m"},"43372":{"":"rs"},"4531":{"":"ls"},"43368":{"":"rm"},"4529":{"":"lm"},"4378":{"":"rh"},"4534":{"":"lh"},"4445":{"":"nh"},"4525":{"":"nh"},"4449":{"":"a"},"4453":{"":"eo"},"4457":{"":"o"},"4462":{"":"u"},"4467":{"":"eu"},"4469":{"":"i"},"4450":{"":"ae"},"4454":{"":"e"},"4460":{"":"oe"},"4451":{"":"ya"},"4455":{"":"yeo"},"4461":{"":"yo"},"4466":{"":"yu"},"4452":{"":"yae"},"4456":{"":"ye"},"4458":{"":"wa"},"4463":{"":"weo"},"4465":{"":"wi"},"4459":{"":"wae"},"4464":{"":"we"},"4468":{"":"yi"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }