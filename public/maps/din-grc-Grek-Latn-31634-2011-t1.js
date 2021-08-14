var map = function(Interscript) {Interscript.define_map("din-grc-Grek-Latn-31634-2011-t1", function(Interscript, map) {
map.dependencies = [];
map.aliases.grek_any = "Ά";
map.aliases_re.grek_any = "(?:Ά|[Έ-Ͽ]|[ἀ-ᾼ])";
map.aliases.grek_latn_any = Interscript.get_alias("din-grc-Grek-Latn-31634-2011-t1", "grek_any");
map.aliases_re.grek_latn_any = "(?:"+Interscript.get_alias_re("din-grc-Grek-Latn-31634-2011-t1", "grek_any")+"|[a-z]|[A-Z])";
map.stages.main = function(s) {
s = Interscript.gsub(s, "(?<=[ΑαΕεΗηΟο])[ΥΎῪὙ]", "U");
s = Interscript.gsub(s, "(?<=[ΑαΕεΗηΟο])[υύύύὺῦὐὔὒὖ]", "u");
s = Interscript.gsub(s, ";", "?");
s = Interscript.gsub(s, ";", "?");
s = Interscript.gsub(s, "Γ(?=[γΓξΞχΧ])", "N");
s = Interscript.gsub(s, "γ(?=[γΓξΞχΧ])", "n");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("din-grc-Grek-Latn-31634-2011-t1", "grek_latn_any")+")Γ(?=[κΚ]"+Interscript.get_alias_re("din-grc-Grek-Latn-31634-2011-t1", "grek_latn_any")+")", "N");
s = Interscript.gsub(s, "(?<="+Interscript.get_alias_re("din-grc-Grek-Latn-31634-2011-t1", "grek_latn_any")+")γ(?=[κΚ]"+Interscript.get_alias_re("din-grc-Grek-Latn-31634-2011-t1", "grek_latn_any")+")", "n");
s = Interscript.parallel_replace_tree(s, map.cache.PTREE_3947585057555950832);
s = Interscript.gsub(s, "(?<=[AEIOUYĒŌaeiouyēō])[Hh]", "");
s = Interscript.gsub(s, "(?<=[A-Z])(?:Th|Ch|Ps)", function(a){return a.toUpperCase();});
s = Interscript.gsub(s, "(?:Th|Ch|Ps)(?=[A-Z])", function(a){return a.toUpperCase();});
return s;
};
map.cache.PTREE_3947585057555950832 = {"913":{"8025":{"":"HAU"},"8029":{"":"HAU"},"8027":{"":"HAU"},"8031":{"":"HAU"},"8017":{"":"Hau"},"8021":{"":"Hau"},"8019":{"":"Hau"},"8023":{"":"Hau"},"7993":{"":"HAI"},"7997":{"":"HAI"},"7995":{"":"HAI"},"7999":{"":"HAI"},"7985":{"":"Hai"},"7989":{"":"Hai"},"7987":{"":"Hai"},"7991":{"":"Hai"},"":"A"},"945":{"8025":{"":"HAU"},"8029":{"":"HAU"},"8027":{"":"HAU"},"8031":{"":"HAU"},"8017":{"":"hau"},"8021":{"":"hau"},"8019":{"":"hau"},"8023":{"":"hau"},"7993":{"":"HAI"},"7997":{"":"HAI"},"7995":{"":"HAI"},"7999":{"":"HAI"},"7985":{"":"hai"},"7989":{"":"hai"},"7987":{"":"hai"},"7991":{"":"hai"},"":"a"},"917":{"8025":{"":"HEU"},"8029":{"":"HEU"},"8027":{"":"HEU"},"8031":{"":"HEU"},"8017":{"":"Heu"},"8021":{"":"Heu"},"8019":{"":"Heu"},"8023":{"":"Heu"},"7993":{"":"HEI"},"7997":{"":"HEI"},"7995":{"":"HEI"},"7999":{"":"HEI"},"7985":{"":"Hei"},"7989":{"":"Hei"},"7987":{"":"Hei"},"7991":{"":"Hei"},"":"E"},"949":{"8025":{"":"HEU"},"8029":{"":"HEU"},"8027":{"":"HEU"},"8031":{"":"HEU"},"8017":{"":"heu"},"8021":{"":"heu"},"8019":{"":"heu"},"8023":{"":"heu"},"7993":{"":"HEI"},"7997":{"":"HEI"},"7995":{"":"HEI"},"7999":{"":"HEI"},"7985":{"":"hei"},"7989":{"":"hei"},"7987":{"":"hei"},"7991":{"":"hei"},"":"e"},"919":{"8025":{"":"HĒU"},"8029":{"":"HĒU"},"8027":{"":"HĒU"},"8031":{"":"HĒU"},"8017":{"":"Hēu"},"8021":{"":"Hēu"},"8019":{"":"Hēu"},"8023":{"":"Hēu"},"":"Ē"},"951":{"8025":{"":"HĒU"},"8029":{"":"HĒU"},"8027":{"":"HĒU"},"8031":{"":"HĒU"},"8017":{"":"hēu"},"8021":{"":"hēu"},"8019":{"":"hēu"},"8023":{"":"hēu"},"":"ē"},"927":{"8025":{"":"HOU"},"8029":{"":"HOU"},"8027":{"":"HOU"},"8031":{"":"HOU"},"8017":{"":"Hou"},"8021":{"":"Hou"},"8019":{"":"Hou"},"8023":{"":"Hou"},"7993":{"":"HOI"},"7997":{"":"HOI"},"7995":{"":"HOI"},"7999":{"":"HOI"},"7985":{"":"Hoi"},"7989":{"":"Hoi"},"7987":{"":"Hoi"},"7991":{"":"Hoi"},"":"O"},"959":{"8025":{"":"HOU"},"8029":{"":"HOU"},"8027":{"":"HOU"},"8031":{"":"HOU"},"8017":{"":"hou"},"8021":{"":"hou"},"8019":{"":"hou"},"8023":{"":"hou"},"7993":{"":"HOI"},"7997":{"":"HOI"},"7995":{"":"HOI"},"7999":{"":"HOI"},"7985":{"":"hoi"},"7989":{"":"hoi"},"7987":{"":"hoi"},"7991":{"":"hoi"},"":"o"},"933":{"7993":{"":"HYI"},"7997":{"":"HYI"},"7995":{"":"HYI"},"7999":{"":"HYI"},"7985":{"":"Hyi"},"7989":{"":"Hyi"},"7987":{"":"Hyi"},"7991":{"":"Hyi"},"":"Y"},"965":{"7993":{"":"HYI"},"7997":{"":"HYI"},"7995":{"":"HYI"},"7999":{"":"HYI"},"7985":{"":"hyi"},"7989":{"":"hyi"},"7987":{"":"hyi"},"7991":{"":"hyi"},"":"y"},"902":{"":"A"},"8122":{"":"A"},"8120":{"":"A"},"8121":{"":"A"},"7944":{"":"A"},"7948":{"":"A"},"7950":{"":"A"},"7945":{"":"Ha"},"7949":{"":"Ha"},"7947":{"":"Ha"},"7951":{"":"Ha"},"8124":{"":"A"},"8072":{"":"A"},"8074":{"":"A"},"8076":{"":"A"},"8078":{"":"A"},"8073":{"":"Ha"},"8075":{"":"Ha"},"8077":{"":"Ha"},"8079":{"":"Ha"},"914":{"":"B"},"915":{"":"G"},"916":{"":"D"},"904":{"":"E"},"7960":{"":"E"},"8136":{"":"E"},"7962":{"":"E"},"7964":{"":"E"},"7961":{"":"He"},"7963":{"":"He"},"7965":{"":"He"},"918":{"":"Z"},"905":{"":"Ē"},"7976":{"":"Ē"},"8138":{"":"Ē"},"7978":{"":"Ē"},"7980":{"":"Ē"},"7982":{"":"Ē"},"7977":{"":"Hē"},"7979":{"":"Hē"},"7981":{"":"Hē"},"7983":{"":"Hē"},"8140":{"":"Ē"},"8088":{"":"Ē"},"8090":{"":"Ē"},"8092":{"":"Ē"},"8094":{"":"Ē"},"8089":{"":"Hē"},"8091":{"":"Hē"},"8093":{"":"Hē"},"8095":{"":"Hē"},"920":{"":"Th"},"921":{"":"I"},"906":{"":"I"},"8152":{"":"I"},"8153":{"":"I"},"7992":{"":"I"},"8154":{"":"I"},"7994":{"":"I"},"7996":{"":"I"},"7998":{"":"I"},"7993":{"":"Hi"},"7995":{"":"Hi"},"7997":{"":"Hi"},"7999":{"":"Hi"},"922":{"":"K"},"923":{"":"L"},"924":{"":"M"},"925":{"":"N"},"926":{"":"X"},"908":{"":"O"},"8008":{"":"O"},"8184":{"":"O"},"8010":{"":"O"},"8012":{"":"O"},"8009":{"":"Ho"},"8011":{"":"Ho"},"8013":{"":"Ho"},"928":{"":"P"},"929":{"":"R"},"8172":{"":"Rh"},"931":{"":"S"},"932":{"":"T"},"910":{"":"Y"},"8170":{"":"Y"},"8168":{"":"Y"},"8169":{"":"Y"},"8025":{"":"Hy"},"8027":{"":"Hy"},"8029":{"":"Hy"},"8031":{"":"Hy"},"934":{"":"Ph"},"935":{"":"Ch"},"936":{"":"Ps"},"937":{"":"Ō"},"911":{"":"Ō"},"8040":{"":"Ō"},"8186":{"":"Ō"},"8042":{"":"Ō"},"8044":{"":"Ō"},"8046":{"":"Ō"},"8041":{"":"Hō"},"8043":{"":"Hō"},"8045":{"":"Hō"},"8047":{"":"Hō"},"8188":{"":"Ō"},"8104":{"":"Ō"},"8106":{"":"Ō"},"8108":{"":"Ō"},"8110":{"":"Ō"},"8105":{"":"Hō"},"8107":{"":"Hō"},"8109":{"":"Hō"},"8111":{"":"Hō"},"938":{"":"Ï"},"939":{"":"Ÿ"},"940":{"":"a"},"8049":{"":"a"},"7936":{"":"a"},"8048":{"":"a"},"8112":{"":"a"},"8113":{"":"a"},"8118":{"":"a"},"7938":{"":"a"},"7940":{"":"a"},"7942":{"":"a"},"7937":{"":"ha"},"7939":{"":"ha"},"7941":{"":"ha"},"7943":{"":"ha"},"8115":{"":"a"},"8114":{"":"a"},"8116":{"":"a"},"8119":{"":"a"},"8064":{"":"a"},"8066":{"":"a"},"8068":{"":"a"},"8070":{"":"a"},"8065":{"":"ha"},"8067":{"":"ha"},"8069":{"":"ha"},"8071":{"":"ha"},"946":{"":"b"},"947":{"":"g"},"948":{"":"d"},"941":{"":"e"},"8051":{"":"e"},"7952":{"":"e"},"8050":{"":"e"},"7954":{"":"e"},"7956":{"":"e"},"7953":{"":"he"},"7955":{"":"he"},"7957":{"":"he"},"950":{"":"z"},"942":{"":"ē"},"8053":{"":"ē"},"7968":{"":"ē"},"8052":{"":"ē"},"8134":{"":"ē"},"7970":{"":"ē"},"7972":{"":"ē"},"7974":{"":"ē"},"7969":{"":"hē"},"7971":{"":"hē"},"7973":{"":"hē"},"7975":{"":"hē"},"8131":{"":"ē"},"8080":{"":"ē"},"8130":{"":"ē"},"8132":{"":"ē"},"8135":{"":"ē"},"8082":{"":"ē"},"8084":{"":"ē"},"8086":{"":"ē"},"8081":{"":"hē"},"8083":{"":"hē"},"8085":{"":"hē"},"8087":{"":"hē"},"952":{"":"th"},"977":{"":"th"},"953":{"":"i"},"943":{"":"i"},"8055":{"":"i"},"7984":{"":"i"},"8054":{"":"i"},"8144":{"":"i"},"8145":{"":"i"},"8150":{"":"i"},"7986":{"":"i"},"7988":{"":"i"},"7990":{"":"i"},"7985":{"":"hi"},"7987":{"":"hi"},"7989":{"":"hi"},"7991":{"":"hi"},"954":{"":"k"},"955":{"":"l"},"956":{"":"m"},"957":{"":"n"},"958":{"":"x"},"972":{"":"o"},"8057":{"":"o"},"8000":{"":"o"},"8056":{"":"o"},"8002":{"":"o"},"8004":{"":"o"},"8001":{"":"ho"},"8003":{"":"ho"},"8005":{"":"ho"},"960":{"":"p"},"961":{"":"r"},"8164":{"":"r"},"8165":{"":"rh"},"963":{"":"s"},"962":{"":"s"},"964":{"":"t"},"973":{"":"y"},"8059":{"":"y"},"8016":{"":"y"},"8058":{"":"y"},"8160":{"":"y"},"8161":{"":"y"},"8166":{"":"y"},"8018":{"":"y"},"8020":{"":"y"},"8022":{"":"y"},"8017":{"":"hy"},"8019":{"":"hy"},"8021":{"":"hy"},"8023":{"":"hy"},"966":{"":"ph"},"967":{"":"ch"},"968":{"":"ps"},"969":{"":"ō"},"974":{"":"ō"},"8032":{"":"ō"},"8060":{"":"ō"},"8182":{"":"ō"},"8034":{"":"ō"},"8036":{"":"ō"},"8038":{"":"ō"},"8033":{"":"hō"},"8035":{"":"hō"},"8037":{"":"hō"},"8039":{"":"hō"},"8179":{"":"ō"},"8096":{"":"ō"},"8178":{"":"ō"},"8180":{"":"ō"},"8183":{"":"ō"},"8098":{"":"ō"},"8100":{"":"ō"},"8102":{"":"ō"},"8097":{"":"hō"},"8099":{"":"hō"},"8101":{"":"hō"},"8103":{"":"hō"},"970":{"":"ï"},"971":{"":"ÿ"},"912":{"":"ï"},"8146":{"":"ï"},"8151":{"":"ï"},"944":{"":"ÿ"},"8162":{"":"ÿ"},"8167":{"":"ÿ"},"988":{"":"W"},"989":{"":"w"},"1010":{"":"s"},"1017":{"":"S"},"183":{"":";"}};
});};if (typeof module !== 'undefined') { module.exports = map; }else if (typeof Interscript !== 'undefined') { map(Interscript); }else { throw "We couldn't dispatch Interscript from a map!"; }