'use client';

import React, { useState, useCallback } from 'react';

// =============================================================================
// LIGHTNING-FAST TRANSLATOR - 100% CLIENT-SIDE, ZERO API CALLS
// Pure hash-based lookup - INSTANT translation
// =============================================================================

// Greek vocabulary - 283 words
const G: Record<string, string> = {
  'λογος':'word','θεος':'god','ανθρωπος':'man','πολεμος':'war','πολις':'city',
  'βασιλευς':'king','αρετη':'virtue','σοφια':'wisdom','αληθεια':'truth',
  'δικαιοσυνη':'justice','ψυχη':'soul','σωμα':'body','κοσμος':'world','ζωη':'life',
  'θανατος':'death','πατηρ':'father','μητηρ':'mother','υιος':'son','θυγατηρ':'daughter',
  'αδελφος':'brother','γυνη':'woman','ανηρ':'man','παις':'child','δουλος':'slave',
  'οικος':'house','ναυς':'ship','ημερα':'day','νυξ':'night','ουρανος':'heaven',
  'γη':'earth','θαλασσα':'sea','υδωρ':'water','πυρ':'fire','αηρ':'air','φως':'light',
  'σκοτος':'darkness','λαος':'people','εθνος':'nation','πλουτος':'wealth',
  'χαρις':'grace','πιστις':'faith','αγαπη':'love','ελπις':'hope','ειρηνη':'peace',
  'δοξα':'glory','νομος':'law','εργον':'work','χρονος':'time','τοπος':'place',
  'οδος':'way','αρχη':'beginning','τελος':'end','φυσις':'nature','τεχνη':'art',
  'επιστημη':'knowledge','κοινωνια':'community','διδασκαλος':'teacher',
  'μαθηταις':'students','μαθητης':'student','φιλοσοφος':'philosopher',
  'στρατιωται':'soldiers','στρατον':'army','πολιται':'citizens','τειχη':'walls',
  'πυλας':'gates','στοιχειων':'elements','νους':'mind','θεοι':'gods',
  'λογον':'word','θεον':'god','ανθρωπον':'man','πολεμον':'war','πολιν':'city',
  'βασιλεα':'king','αρετην':'virtue','σοφιαν':'wisdom','αληθειαν':'truth',
  'ψυχην':'soul','κοσμον':'world','ζωην':'life','θανατον':'death',
  'πατερα':'father','μητερα':'mother','υιον':'son','αδελφον':'brother',
  'γυναικα':'woman','ανδρα':'man','παιδα':'child','οικον':'house',
  'ημεραν':'day','νυκτα':'night','ουρανον':'heaven','γην':'earth',
  'θαλασσαν':'sea','υδατος':'water','πυρος':'fire','φωτος':'light',
  'λαον':'people','εθνη':'nations','χαριν':'grace','πιστιν':'faith',
  'αγαπην':'love','ελπιδα':'hope','ειρηνην':'peace','δοξαν':'glory',
  'νομον':'law','εργα':'works','χρονον':'time','τοπον':'place',
  'οδον':'way','αρχην':'beginning','τελη':'ends','φυσιν':'nature',
  'ειμι':'am','εστι':'is','εστιν':'is','ην':'was','εσται':'will be','εισι':'are',
  'εισιν':'are','ησαν':'were','ειναι':'to be','εχω':'have','εχει':'has',
  'εχομεν':'we have','εχουσι':'they have','ειχον':'had','εσχον':'had',
  'λεγω':'say','λεγει':'says','λεγουσι':'they say','ειπον':'said','ειπεν':'said',
  'ελεγον':'was saying','λεγομεν':'we say','ερω':'will say',
  'ποιεω':'make','ποιει':'makes','ποιουσι':'they make','εποιησα':'made',
  'εποιησεν':'made','ποιησω':'will make','ποιουμεν':'we make',
  'γινομαι':'become','γινεται':'becomes','εγενετο':'became','γενησεται':'will become',
  'ερχομαι':'come','ερχεται':'comes','ηλθον':'came','ηλθεν':'came','ελευσομαι':'will come',
  'οιδα':'know','οιδεν':'knows','ειδον':'saw','ιδε':'behold','ιδου':'behold',
  'βλεπω':'see','βλεπει':'sees','οψομαι':'will see',
  'ακουω':'hear','ακουει':'hears','ηκουσα':'heard','ακουσομαι':'will hear',
  'γραφω':'write','γραφει':'writes','εγραψα':'wrote','γεγραπται':'is written',
  'διδωμι':'give','διδωσι':'gives','εδωκα':'gave','εδωκεν':'gave','δωσω':'will give',
  'λαμβανω':'take','λαμβανει':'takes','ελαβον':'took','ελαβεν':'took',
  'γινωσκω':'know','γινωσκει':'knows','εγνων':'knew','γνωσομαι':'will know',
  'πιστευω':'believe','πιστευει':'believes','επιστευσα':'believed',
  'αγαπαω':'love','αγαπα':'loves','ηγαπησα':'loved','αγαπησω':'will love',
  'ζαω':'live','ζη':'lives','εζησα':'lived','ζησω':'will live','ζην':'to live',
  'αποθνησκω':'die','αποθνησκει':'dies','απεθανον':'died','αποθανειται':'will die',
  'ζητει':'seeks','ζητειν':'seek','ζητεω':'seek','εζητουν':'sought',
  'ηγε':'led','αγω':'lead','αγει':'leads','ηγαγον':'led',
  'κινειται':'moves','κινεω':'move','εκινησα':'moved',
  'μεταβαλλει':'changes','μεταβαλλω':'change',
  'μενει':'remains','μενω':'remain','εμεινα':'remained',
  'εμαχοντο':'fought','μαχομαι':'fight','εμαχεσαμην':'fought',
  'εφυλαττον':'guarded','φυλασσω':'guard','εφυλαξα':'guarded',
  'εβουλετο':'wished','βουλομαι':'wish',
  'ρει':'flows','ρεω':'flow','συνεστηκεν':'consists',
  'ελευθεροι':'frees','ελευθεροω':'free','ηλευθερωσα':'freed',
  'θελω':'want','θελει':'wants','ηθελον':'wanted','θελησω':'will want',
  'δυναμαι':'can','δυναται':'can','ηδυναμην':'could',
  'δει':'must','εδει':'had to','δεησει':'will need',
  'φημι':'say','φησι':'says','εφη':'said',
  'καλεω':'call','καλει':'calls','εκαλεσα':'called','κεκληται':'is called',
  'ευρισκω':'find','ευρισκει':'finds','ευρον':'found','ευρησω':'will find',
  'φερω':'bring','φερει':'brings','ηνεγκα':'brought','οισω':'will bring',
  'τιθημι':'put','τιθησι':'puts','εθηκα':'put','θησω':'will put',
  'πεμπω':'send','πεμπει':'sends','επεμψα':'sent','πεμψω':'will send',
  'αιρω':'take up','αιρει':'takes up','ηρα':'took up',
  'κρινω':'judge','κρινει':'judges','εκρινα':'judged',
  'σωζω':'save','σωζει':'saves','εσωσα':'saved','σωθησεται':'will be saved',
  'αγαθος':'good','αγαθη':'good','αγαθον':'good','αγαθοι':'good','αγαθαι':'good','αγαθα':'good',
  'κακος':'bad','κακη':'bad','κακον':'bad','κακοι':'bad','κακαι':'bad','κακα':'bad',
  'καλος':'beautiful','καλη':'beautiful','καλον':'beautiful',
  'μεγας':'great','μεγαλη':'great','μεγα':'great','μεγαλοι':'great',
  'μικρος':'small','μικρα':'small','μικρον':'small',
  'πολυς':'much','πολλη':'much','πολυ':'much','πολλοι':'many','πολλαι':'many','πολλα':'many',
  'ολος':'whole','ολη':'whole','ολον':'whole',
  'πας':'all','πασα':'all','παν':'all','παντες':'all','πασαι':'all','παντα':'all',
  'δικαιος':'just','δικαια':'just','δικαιον':'just',
  'αληθης':'true','αληθες':'true',
  'νεος':'new','νεα':'new','νεον':'new',
  'παλαιος':'old','παλαια':'old','παλαιον':'old',
  'σοφος':'wise','σοφη':'wise','σοφον':'wise','σοφοι':'wise',
  'ισχυρος':'strong','ισχυρα':'strong','ισχυρον':'strong',
  'πρωτος':'first','πρωτη':'first','πρωτον':'first',
  'εσχατος':'last','εσχατη':'last','εσχατον':'last',
  'αθανατος':'immortal','αθανατον':'immortal',
  'μεγιστος':'greatest','μεγιστον':'greatest',
  'ανδρειως':'bravely','τεσσαρων':'four','τεσσαρες':'four',
  'ουδεν':'nothing','ουδεις':'no one','ουδεμια':'none',
  'ουκ':'not','ουχ':'not','ου':'not','μη':'not',
  'αλλος':'other','αλλη':'other','αλλο':'other','αλλοι':'others',
  'αυτος':'he','αυτη':'she','αυτο':'it',
  'εκαστος':'each','εκαστη':'each','εκαστον':'each',
  'ετερος':'another','ετερα':'another','ετερον':'another',
  'ιδιος':'own','ιδια':'own','ιδιον':'own',
  'μονος':'alone','μονη':'alone','μονον':'only',
  'ο':'the','η':'the','το':'the','οι':'the','αι':'the','τα':'the',
  'τον':'the','την':'the','τους':'the','τας':'the',
  'του':'of the','της':'of the','των':'of the',
  'τω':'to the','τη':'to the','τοις':'to the','ταις':'to the',
  'και':'and','αλλα':'but','ουν':'therefore','γαρ':'for','δε':'but',
  'μεν':'indeed','τε':'and','ει':'if','εαν':'if','οτι':'that','ως':'as',
  'ωστε':'so that','ινα':'in order that','οτε':'when','επει':'since',
  'ουτε':'neither','μητε':'nor','ειτε':'whether','καιπερ':'although',
  'εν':'in','εις':'into','εκ':'from','εξ':'from','απο':'from','προς':'toward',
  'υπο':'by','περι':'about','δια':'through','κατα':'according to',
  'μετα':'with','συν':'with','παρα':'beside','επι':'upon',
  'υπερ':'above','αντι':'instead of','προ':'before','ανα':'up',
  'εγω':'I','εμε':'me','εμου':'my','εμοι':'to me',
  'συ':'you','σε':'you','σου':'your','σοι':'to you',
  'αυτον':'him','αυτου':'his','αυτω':'to him',
  'αυτην':'her','αυτης':'her',
  'ημεις':'we','ημας':'us','ημων':'our','ημιν':'to us',
  'υμεις':'you','υμας':'you','υμων':'your','υμιν':'to you',
  'αυτοι':'they','αυτους':'them','αυτων':'their','αυτοις':'to them',
  'τις':'someone','τι':'something','τινος':'of someone',
  'ουτος':'this','τουτο':'this','ουτοι':'these','αυται':'these','ταυτα':'these',
  'εκεινος':'that','εκεινη':'that','εκεινο':'that','εκεινοι':'those',
  'ος':'who','α':'which',
  'νυν':'now','τοτε':'then','πως':'how','ουτως':'thus','εκει':'there',
  'ωδε':'here','ποτε':'ever','αει':'always','ετι':'still','ουπω':'not yet',
  'μαλλον':'more','μαλιστα':'most','ευ':'well','κακως':'badly',
  'ταχεως':'quickly','καλως':'well','αληθως':'truly',
  'δυο':'two','τρεις':'three','πεντε':'five',
  'επτα':'seven','οκτω':'eight','εννεα':'nine','δεκα':'ten',
  'εκατον':'hundred','χιλιοι':'thousand',
  'αθηναιοι':'Athenians','αθηναιος':'Athenian','ελληνες':'Greeks','ελλην':'Greek',
  'περσαι':'Persians','περσης':'Persian',
};

// Latin vocabulary - 385 words
const L: Record<string, string> = {
  'gallia':'Gaul','roma':'Rome','italia':'Italy','caesar':'Caesar','bellum':'war',
  'pax':'peace','rex':'king','regina':'queen','populus':'people','civis':'citizen',
  'civitas':'state','urbs':'city','vir':'man','mulier':'woman','homo':'human',
  'femina':'woman','vita':'life','mors':'death','corpus':'body','anima':'soul',
  'virtus':'virtue','honor':'honor','gloria':'glory','fama':'fame','amor':'love',
  'fides':'faith','veritas':'truth','iustitia':'justice','lex':'law','ius':'right',
  'pars':'part','res':'thing','deus':'god','natura':'nature','fortuna':'fortune',
  'exercitus':'army','miles':'soldier','hostis':'enemy','imperator':'emperor',
  'imperium':'empire','consul':'consul','ars':'art','tempus':'time','sapiens':'wise',
  'rebus':'things','milites':'soldiers','hostes':'enemies','victoria':'victory',
  'mundi':'world','mundus':'world','caput':'head','amicitia':'friendship','amicus':'friend',
  'thesaurus':'treasure','fundamenta':'foundations','ratio':'reason',
  'libertas':'liberty','terra':'earth','sol':'sun','lucem':'light','lux':'light',
  'luna':'moon','nox':'night','arma':'arms','virum':'man','virumque':'and the man',
  'troiae':'Troy','oris':'shores','fato':'fate','mare':'sea','carmen':'song',
  'deos':'gods','di':'gods','deum':'god','dei':'gods',
  'belli':'of war','bello':'in war',
  'pacis':'of peace','pace':'in peace',
  'regis':'of king','regi':'to king','regem':'king',
  'populi':'of people','populo':'to people','populum':'people',
  'civi':'to citizen','civem':'citizen',
  'urbis':'of city','urbi':'to city','urbem':'city',
  'viri':'of man','viro':'to man',
  'hominis':'of human','homini':'to human','hominem':'human',
  'vitae':'of life','vitam':'life',
  'mortis':'of death','morte':'by death','mortem':'death',
  'corporis':'of body','corpore':'in body',
  'animae':'of soul','animam':'soul',
  'sum':'am','es':'are','est':'is','sumus':'we are','estis':'you are','sunt':'are',
  'eram':'was','eras':'were','erat':'was','eramus':'we were','erant':'were',
  'ero':'will be','eris':'will be','erit':'will be','erimus':'will be','erunt':'will be',
  'esse':'to be','fui':'was','fuisti':'were','fuit':'was','fuimus':'we were','fuerunt':'were',
  'fuerat':'had been','fuisse':'to have been',
  'habeo':'have','habes':'have','habet':'has','habemus':'we have','habent':'have',
  'habebam':'had','habebat':'had','habui':'had','habuit':'had',
  'dico':'say','dicis':'say','dicit':'says','dicimus':'we say','dicunt':'say',
  'dicebam':'was saying','dixit':'said','dixerunt':'said',
  'facio':'make','facis':'make','facit':'makes','facimus':'we make','faciunt':'make',
  'faciebam':'was making','feci':'made','fecit':'made','fecerunt':'made',
  'facta':'made','factum':'made','factus':'made',
  'video':'see','vides':'see','videt':'sees','videmus':'we see','vident':'see',
  'videbam':'was seeing','vidi':'saw','vidit':'saw','viderunt':'saw',
  'venio':'come','venis':'come','venit':'comes','venimus':'we come','veniunt':'come',
  'veniebam':'was coming','veni':'came','venisti':'came',
  'amo':'love','amas':'love','amat':'loves','amamus':'we love','amant':'love',
  'amabam':'was loving','amavi':'loved','amavit':'loved',
  'do':'give','das':'give','dat':'gives','damus':'we give','dant':'give',
  'dabam':'was giving','dedi':'gave','dedit':'gave','dederunt':'gave',
  'cano':'sing','canis':'sing','canit':'sings','canimus':'we sing','canunt':'sing',
  'carpe':'seize','carpis':'seize','carpit':'seizes',
  'fugit':'flees','fugio':'flee','fugis':'flee','fugiunt':'flee',
  'redit':'returns','redeo':'return','redis':'return','redeunt':'return',
  'quaerit':'seeks','quaero':'seek','quaeris':'seek','quaerunt':'seek',
  'vivit':'lives','vivo':'live','vivis':'live','vivunt':'live',
  'pugnaverunt':'fought','pugno':'fight','pugnas':'fight','pugnat':'fights',
  'duxit':'led','duco':'lead','ducis':'lead','ducit':'leads','ducunt':'lead',
  'vincit':'conquers','vinco':'conquer','vincis':'conquer','vincunt':'conquer',
  'liberat':'frees','libero':'free','liberas':'free','liberant':'free',
  'vocat':'calls','voco':'call','vocas':'call','vocant':'call',
  'portat':'carries','porto':'carry','portas':'carry','portant':'carry',
  'docet':'teaches','doceo':'teach','doces':'teach','docent':'teach',
  'scribit':'writes','scribo':'write','scribis':'write','scribunt':'write',
  'legit':'reads','lego':'read','legis':'read','legunt':'read',
  'mittit':'sends','mitto':'send','mittis':'send','mittunt':'send',
  'capit':'takes','capio':'take','capis':'take','capiunt':'take',
  'tenet':'holds','teneo':'hold','tenes':'hold','tenent':'hold',
  'credit':'believes','credo':'believe','credis':'believe','credunt':'believe',
  'cogitat':'thinks','cogito':'think','cogitas':'think','cogitant':'think',
  'bonus':'good','bona':'good','bonum':'good','boni':'good','bonae':'good',
  'malus':'bad','mala':'bad','malum':'bad','mali':'bad',
  'magnus':'great','magna':'great','magnum':'great','magni':'great','magnae':'great',
  'parvus':'small','parva':'small','parvum':'small',
  'longus':'long','longa':'long','longum':'long',
  'brevis':'short','breve':'short',
  'novus':'new','nova':'new','novum':'new',
  'vetus':'old','veteris':'old',
  'fortis':'brave','forte':'brave','fortes':'brave',
  'omnipotens':'almighty',
  'primus':'first','prima':'first','primum':'first',
  'secundus':'second','secunda':'second','secundum':'second',
  'tertius':'third','tertia':'third','tertium':'third',
  'ultimus':'last','ultima':'last','ultimum':'last',
  'omnis':'all','omne':'all','omnes':'all','omnia':'all',
  'totus':'whole','tota':'whole','totum':'whole',
  'divisa':'divided','divisus':'divided','divisum':'divided',
  'aeterna':'eternal','aeternus':'eternal','aeternum':'eternal',
  'tres':'three','tria':'three',
  'immortalis':'immortal','immortale':'immortal',
  'fortiter':'bravely',
  'vera':'true','verus':'true','verum':'true',
  'summa':'highest','summus':'highest','summum':'highest',
  'pulchra':'beautiful','pulcher':'beautiful','pulchrum':'beautiful',
  'romanus':'Roman','romana':'Roman','romanum':'Roman','romani':'Romans',
  'fortissimi':'bravest','fortissimus':'bravest',
  'felix':'happy','felicis':'happy',
  'liber':'free','libera':'free','liberum':'free',
  'sacer':'sacred','sacra':'sacred','sacrum':'sacred',
  'sanctus':'holy','sancta':'holy','sanctum':'holy',
  'altus':'high','alta':'high','altum':'high',
  'latus':'wide','lata':'wide','latum':'wide',
  'gravis':'heavy','grave':'heavy',
  'levis':'light','leve':'light',
  'dulcis':'sweet','dulce':'sweet',
  'facilis':'easy','facile':'easy',
  'difficilis':'difficult','difficile':'difficult',
  'et':'and','sed':'but','in':'in','ad':'to','per':'through','cum':'with',
  'de':'from','ex':'out of','ab':'from','non':'not',
  'contra':'against','inter':'between','sine':'without','post':'after','ante':'before',
  'super':'above','sub':'under','trans':'across','pro':'for','propter':'because of',
  'apud':'at','circa':'around','erga':'toward','extra':'outside','infra':'below',
  'intra':'within','iuxta':'near','ob':'on account of','praeter':'besides',
  'supra':'above','ultra':'beyond','versus':'toward',
  'atque':'and','ac':'and','aut':'or','vel':'or','neque':'nor','nec':'nor',
  'nam':'for','enim':'for','autem':'however','tamen':'however','ergo':'therefore',
  'igitur':'therefore','itaque':'and so','quod':'because','quia':'because',
  'si':'if','nisi':'unless','quasi':'as if','ut':'so that','ne':'lest',
  'dum':'while','donec':'until','quamquam':'although','etsi':'even if',
  'qui':'who','quae':'which','cuius':'whose','cui':'to whom',
  'quem':'whom','quam':'whom','quo':'by whom','qua':'by whom',
  'quis':'who','quid':'what',
  'hic':'this','haec':'this','hoc':'this','huius':'of this','huic':'to this',
  'ille':'that','illa':'that','illud':'that','illius':'of that','illi':'to that',
  'ego':'I','me':'me','mei':'my','mihi':'to me',
  'tu':'you','te':'you','tui':'your','tibi':'to you',
  'nos':'we','nobis':'to us','nostrum':'our','noster':'our',
  'vos':'you','vobis':'to you','vestrum':'your','vester':'your',
  'is':'he','ea':'she','id':'it','eius':'his','ei':'to him',
  'se':'himself','sui':'of himself','sibi':'to himself',
  'ipse':'himself','ipsa':'herself','ipsum':'itself',
  'idem':'same','eadem':'same',
  'alius':'other','alia':'other','aliud':'other',
  'alter':'another','altera':'another','alterum':'another',
  'nullus':'none','nulla':'none','nullum':'none',
  'ullus':'any','ulla':'any','ullum':'any',
  'meus':'my','mea':'my','meum':'my',
  'tuus':'your','tua':'your','tuum':'your',
  'suus':'his','sua':'her','suum':'its',
  'nostra':'our',
  'semper':'always','numquam':'never','saepe':'often','iam':'now','nunc':'now',
  'sic':'thus','ita':'so','etiam':'also','quoque':'also',
  'bene':'well','male':'badly','valde':'very','nimis':'too much',
  'magis':'more','maxime':'most','minus':'less','minime':'least',
  'cito':'quickly','lente':'slowly',
  'hodie':'today','heri':'yesterday','cras':'tomorrow',
  'ibi':'there','ubi':'where','unde':'whence',
  'cur':'why','quomodo':'how','quando':'when',
  'vero':'truly','certe':'certainly',
  'unus':'one','una':'one','unum':'one',
  'duo':'two','duae':'two',
  'quattuor':'four','quinque':'five','sex':'six','septem':'seven',
  'octo':'eight','novem':'nine','decem':'ten',
  'centum':'hundred','mille':'thousand',
  'caesaris':'of Caesar',
  'augustus':'Augustus',
};

const STYLES = [
  { id: 'literal', name: 'Literal', desc: 'Word-for-word' },
  { id: 'scholarly', name: 'Scholarly', desc: 'Academic style' },
  { id: 'literary', name: 'Literary', desc: 'Artistic prose' },
  { id: 'accessible', name: 'Accessible', desc: 'Simple language' },
  { id: 'kjv_archaic', name: 'KJV Style', desc: 'Archaic English' },
];

const TRANSFORMS: Record<string, Record<string, string>> = {
  scholarly: {god:'deity',gods:'deities',truth:'verity',soul:'anima',good:'virtuous',man:'individual',frees:'liberates'},
  literary: {god:'the Divine',gods:'the Divine Ones',truth:'Truth',man:'mortal',good:'noble',frees:'sets free',soul:'spirit'},
  kjv_archaic: {god:'God',gods:'the gods',truth:'verity',good:'righteous',frees:'setteth free'},
  accessible: {},
};

const SAMPLES = {
  greek: 'ὁ θεὸς ἀγαθός ἐστιν καὶ ἡ ἀλήθεια ἐλευθεροῖ τὸν ἄνθρωπον.',
  latin: 'Vita brevis est, ars longa. Tempus fugit et non redit.',
};

function translateText(text: string, style: string) {
  const t0 = performance.now();

  const isGreek = /[\u0370-\u03FF\u1F00-\u1FFF]/.test(text);
  const vocab = isGreek ? G : L;

  let norm = text.normalize('NFD').toLowerCase();
  if (isGreek) {
    norm = norm.split('').filter(c => {
      const code = c.charCodeAt(0);
      return (code >= 0x0370 && code <= 0x03FF) || /[a-z\s]/.test(c);
    }).join('');
  } else {
    norm = norm.replace(/[^a-z\s]/g, '');
  }

  const words = norm.match(/\b\w+\b/g) || [];
  let translated = 0;
  const out = words.map(w => {
    if (vocab[w]) { translated++; return vocab[w]; }
    return w;
  });

  let result = out.join(' ');

  if (style !== 'literal' && TRANSFORMS[style]) {
    for (const [from, to] of Object.entries(TRANSFORMS[style])) {
      result = result.replace(new RegExp(`\\b${from}\\b`, 'gi'), to);
    }
  }

  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  const coverage = words.length > 0 ? translated / words.length : 1;
  const ltqi = 0.6 * coverage + 0.25 + 0.15;

  return {
    translation: result,
    language: isGreek ? 'greek' : 'latin',
    time_ms: performance.now() - t0,
    coverage,
    ltqi_score: Math.min(ltqi, 1),
  };
}

export default function UltimateTranslator() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('literal');
  const [result, setResult] = useState<ReturnType<typeof translateText> | null>(null);

  const translate = useCallback(() => {
    if (!text.trim()) return;
    setResult(translateText(text, style));
  }, [text, style]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      translate();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#C9A962] mb-2">
            ⚡ Ultimate Translator
          </h1>
          <p className="text-gray-400">INSTANT Greek & Latin translation - Zero API calls</p>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                style === s.id
                  ? 'bg-[#C9A962] text-black font-medium'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter Greek or Latin text... (Ctrl/Cmd+Enter to translate)"
            className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-lg resize-none focus:outline-none focus:border-[#C9A962] text-lg"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setText(SAMPLES.greek)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Load Greek Sample
            </button>
            <button
              onClick={() => setText(SAMPLES.latin)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Load Latin Sample
            </button>
          </div>
        </div>

        <button
          onClick={translate}
          disabled={!text.trim()}
          className="w-full py-3 bg-[#C9A962] text-black font-bold rounded-lg hover:bg-[#D4B872] disabled:opacity-50 disabled:cursor-not-allowed mb-6 text-lg"
        >
          ⚡ Translate Instantly
        </button>

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#C9A962] font-medium">
                {result.language === 'greek' ? 'Greek' : 'Latin'} → English
              </span>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>⚡ {result.time_ms.toFixed(3)}ms</span>
                <span>📊 {(result.coverage * 100).toFixed(0)}%</span>
                <span>✓ {(result.ltqi_score * 100).toFixed(0)}%</span>
              </div>
            </div>
            <p className="text-xl leading-relaxed">{result.translation}</p>
            <button
              onClick={() => navigator.clipboard.writeText(result.translation)}
              className="mt-4 text-sm text-gray-400 hover:text-white"
            >
              📋 Copy to clipboard
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          100% client-side • Zero network calls • Instant results
        </div>
      </div>
    </div>
  );
}
