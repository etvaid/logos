'use client';

import React, { useState, useCallback } from 'react';

// =============================================================================
// INSTANT TRANSLATOR - 100% CLIENT-SIDE, ZERO API CALLS
// =============================================================================

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
  'λεγω':'say','λεγει':'says','ειπον':'said','ειπεν':'said',
  'ποιεω':'make','ποιει':'makes','εποιησα':'made','εποιησεν':'made',
  'γινομαι':'become','γινεται':'becomes','εγενετο':'became',
  'ερχομαι':'come','ερχεται':'comes','ηλθον':'came','ηλθεν':'came',
  'οιδα':'know','οιδεν':'knows','ειδον':'saw','ιδε':'behold','ιδου':'behold',
  'βλεπω':'see','βλεπει':'sees','ακουω':'hear','ακουει':'hears',
  'γραφω':'write','γραφει':'writes','εγραψα':'wrote',
  'διδωμι':'give','διδωσι':'gives','εδωκα':'gave','εδωκεν':'gave',
  'λαμβανω':'take','λαμβανει':'takes','ελαβον':'took','ελαβεν':'took',
  'γινωσκω':'know','γινωσκει':'knows','εγνων':'knew',
  'πιστευω':'believe','πιστευει':'believes',
  'αγαπαω':'love','αγαπα':'loves',
  'ζαω':'live','ζη':'lives','ζην':'to live',
  'αποθνησκω':'die','αποθνησκει':'dies','απεθανον':'died',
  'ζητει':'seeks','ζητειν':'seek','ζητεω':'seek',
  'ηγε':'led','αγω':'lead','αγει':'leads',
  'κινειται':'moves','μεταβαλλει':'changes',
  'μενει':'remains','εμαχοντο':'fought',
  'εφυλαττον':'guarded','εβουλετο':'wished',
  'ρει':'flows','συνεστηκεν':'consists',
  'ελευθεροι':'frees','θελω':'want','θελει':'wants',
  'δυναμαι':'can','δυναται':'can',
  'δει':'must','φημι':'say','φησι':'says','εφη':'said',
  'καλεω':'call','ευρισκω':'find','φερω':'bring',
  'σωζω':'save','σωζει':'saves',
  'αγαθος':'good','αγαθη':'good','αγαθον':'good','αγαθοι':'good',
  'κακος':'bad','κακη':'bad','κακον':'bad',
  'καλος':'beautiful','καλη':'beautiful','καλον':'beautiful',
  'μεγας':'great','μεγαλη':'great','μεγα':'great',
  'μικρος':'small','μικρα':'small','μικρον':'small',
  'πολυς':'much','πολλη':'much','πολυ':'much','πολλοι':'many','πολλα':'many',
  'ολος':'whole','ολη':'whole','ολον':'whole',
  'πας':'all','πασα':'all','παν':'all','παντες':'all','παντα':'all',
  'δικαιος':'just','αληθης':'true',
  'νεος':'new','παλαιος':'old',
  'σοφος':'wise','σοφη':'wise','σοφοι':'wise',
  'ισχυρος':'strong','πρωτος':'first','εσχατος':'last',
  'αθανατος':'immortal','μεγιστος':'greatest','μεγιστον':'greatest',
  'ανδρειως':'bravely','τεσσαρων':'four',
  'ουδεν':'nothing','ουδεις':'no one',
  'ουκ':'not','ουχ':'not','ου':'not','μη':'not',
  'αλλος':'other','αυτος':'he','αυτη':'she','αυτο':'it',
  'μονος':'alone','μονον':'only',
  'ο':'the','η':'the','το':'the','οι':'the','αι':'the','τα':'the',
  'τον':'the','την':'the','τους':'the','τας':'the',
  'του':'of the','της':'of the','των':'of the',
  'τω':'to the','τη':'to the','τοις':'to the','ταις':'to the',
  'και':'and','αλλα':'but','ουν':'therefore','γαρ':'for','δε':'but',
  'μεν':'indeed','τε':'and','ει':'if','εαν':'if','οτι':'that','ως':'as',
  'ωστε':'so that','ινα':'in order that','οτε':'when',
  'εν':'in','εις':'into','εκ':'from','εξ':'from','απο':'from','προς':'toward',
  'υπο':'by','περι':'about','δια':'through','κατα':'according to',
  'μετα':'with','συν':'with','παρα':'beside','επι':'upon',
  'εγω':'I','εμε':'me','εμου':'my',
  'συ':'you','σε':'you','σου':'your',
  'αυτον':'him','αυτου':'his','αυτην':'her','αυτης':'her',
  'ημεις':'we','ημας':'us','ημων':'our',
  'υμεις':'you','υμας':'you','υμων':'your',
  'αυτοι':'they','αυτους':'them','αυτων':'their',
  'τις':'someone','τι':'something',
  'ουτος':'this','τουτο':'this','εκεινος':'that',
  'ος':'who','α':'which',
  'νυν':'now','τοτε':'then','πως':'how','ουτως':'thus','εκει':'there',
  'αει':'always','ετι':'still',
  'δυο':'two','τρεις':'three','πεντε':'five',
  'δεκα':'ten','εκατον':'hundred',
  'αθηναιοι':'Athenians','ελληνες':'Greeks',
};

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
  'libertas':'liberty','terra':'earth','sol':'sun','lucem':'light','lux':'light',
  'luna':'moon','nox':'night','arma':'arms','virum':'man','virumque':'and the man',
  'troiae':'Troy','oris':'shores','fato':'fate','mare':'sea','carmen':'song',
  'deos':'gods','di':'gods','deum':'god','dei':'gods',
  'belli':'of war','pacis':'of peace',
  'regis':'of king','populi':'of people',
  'urbis':'of city','viri':'of man',
  'vitae':'of life','vitam':'life',
  'mortis':'of death','mortem':'death',
  'sum':'am','es':'are','est':'is','sumus':'we are','sunt':'are',
  'eram':'was','erat':'was','erant':'were',
  'ero':'will be','erit':'will be','erunt':'will be',
  'esse':'to be','fui':'was','fuit':'was','fuerunt':'were',
  'habeo':'have','habet':'has','habent':'have',
  'dico':'say','dicit':'says','dixit':'said',
  'facio':'make','facit':'makes','fecit':'made',
  'facta':'made','factum':'made',
  'video':'see','videt':'sees','vidi':'saw','vidit':'saw',
  'venio':'come','venit':'comes','veni':'came',
  'amo':'love','amat':'loves','amavi':'loved',
  'do':'give','dat':'gives','dedit':'gave',
  'cano':'sing','carpe':'seize',
  'fugit':'flees','redit':'returns',
  'quaerit':'seeks','vivit':'lives',
  'pugnaverunt':'fought','duxit':'led',
  'vincit':'conquers','liberat':'frees',
  'bonus':'good','bona':'good','bonum':'good',
  'malus':'bad','mala':'bad','malum':'bad',
  'magnus':'great','magna':'great','magnum':'great',
  'parvus':'small','longus':'long','longa':'long',
  'brevis':'short','novus':'new','nova':'new',
  'vetus':'old','fortis':'brave',
  'omnipotens':'almighty',
  'primus':'first','prima':'first',
  'ultimus':'last','ultima':'last',
  'omnis':'all','omne':'all','omnes':'all','omnia':'all',
  'totus':'whole','tota':'whole',
  'divisa':'divided','aeterna':'eternal','aeternus':'eternal',
  'tres':'three','immortalis':'immortal',
  'fortiter':'bravely',
  'vera':'true','verus':'true',
  'summa':'highest','summum':'highest',
  'pulchra':'beautiful',
  'romanus':'Roman','romani':'Romans',
  'fortissimi':'bravest',
  'et':'and','sed':'but','in':'in','ad':'to','per':'through','cum':'with',
  'de':'from','ex':'out of','ab':'from','non':'not',
  'contra':'against','inter':'between','sine':'without','post':'after','ante':'before',
  'super':'above','sub':'under','trans':'across','pro':'for',
  'atque':'and','ac':'and','aut':'or','vel':'or','neque':'nor','nec':'nor',
  'nam':'for','enim':'for','autem':'however','tamen':'however','ergo':'therefore',
  'quod':'because','quia':'because',
  'si':'if','nisi':'unless','ut':'so that',
  'qui':'who','quae':'which','quis':'who','quid':'what',
  'hic':'this','haec':'this','hoc':'this',
  'ille':'that','illa':'that','illud':'that',
  'ego':'I','me':'me','tu':'you','te':'you',
  'nos':'we','nobis':'to us','noster':'our',
  'vos':'you','vobis':'to you',
  'is':'he','ea':'she','id':'it','eius':'his',
  'se':'himself','ipse':'himself',
  'meus':'my','tuus':'your','suus':'his',
  'semper':'always','numquam':'never','saepe':'often','iam':'now','nunc':'now',
  'sic':'thus','ita':'so','etiam':'also',
  'bene':'well','male':'badly',
  'unus':'one','duo':'two','quattuor':'four','quinque':'five',
  'decem':'ten','centum':'hundred','mille':'thousand',
};

function translate(text: string) {
  console.log('Translating:', text);
  const isGreek = /[\u0370-\u03FF\u1F00-\u1FFF]/.test(text);
  const vocab = isGreek ? G : L;
  console.log('Is Greek:', isGreek);

  let norm = text.normalize('NFD').toLowerCase();
  console.log('Normalized:', norm);

  if (isGreek) {
    // Keep only Greek base letters (0370-03FF) and whitespace
    norm = norm.split('').filter(c => {
      const code = c.charCodeAt(0);
      return (code >= 0x0370 && code <= 0x03FF) || c === ' ';
    }).join('');
  } else {
    norm = norm.replace(/[^a-z\s]/g, '');
  }
  console.log('Filtered:', norm);

  const words = norm.trim().split(/\s+/).filter(w => w.length > 0);
  console.log('Words:', words);

  const out = words.map(w => {
    const found = vocab[w];
    console.log(`  "${w}" -> "${found || w}"`);
    return found || w;
  });

  let result = out.join(' ');
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  console.log('Result:', result);

  return { translation: result || '(no translation)', language: isGreek ? 'Greek' : 'Latin' };
}

export default function TranslatePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{translation: string, language: string} | null>(null);

  // Auto-translate as user types
  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    if (newText.trim()) {
      setResult(translate(newText));
    } else {
      setResult(null);
    }
  }, []);

  const handleTranslate = useCallback(() => {
    if (text.trim()) setResult(translate(text));
  }, [text]);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#C9A962] mb-6 text-center">Translate</h1>

        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleTranslate(); }}
          placeholder="Enter Greek or Latin..."
          className="w-full h-28 p-4 bg-white/5 border border-white/10 rounded-lg resize-none focus:outline-none focus:border-[#C9A962] text-lg mb-4"
          autoFocus
        />

        <div className="flex gap-2 mb-4">
          <button onClick={() => handleTextChange('ὁ θεὸς ἀγαθός ἐστιν καὶ ἡ ἀλήθεια ἐλευθεροῖ τὸν ἄνθρωπον.')} className="text-xs text-gray-500 hover:text-white">Greek sample</button>
          <button onClick={() => handleTextChange('Vita brevis est, ars longa. Tempus fugit.')} className="text-xs text-gray-500 hover:text-white">Latin sample</button>
        </div>

        <button
          onClick={handleTranslate}
          disabled={!text.trim()}
          className="w-full py-3 bg-[#C9A962] text-black font-bold rounded-lg hover:bg-[#D4B872] disabled:opacity-50 mb-6"
        >
          Translate
        </button>

        {result && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="text-[#C9A962] text-sm mb-2">{result.language} → English</div>
            <p className="text-xl">{result.translation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
