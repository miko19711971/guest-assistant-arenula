// Guest Assistant — multilingual (EN/ES/FR/DE/IT)
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // per eventuali asset (logo, ecc.)

// ====== CONTENUTI MULTILINGUA ======
const T = {
  en: {
    langName: 'English',
    siteTitle: 'niceflatinrome.com',
    aptLabel: 'Apartment',
    voiceOn: 'Voice: On',
    voiceOff: 'Voice: Off',
    hi: "Hi, I am Samantha, your virtual assistant. Tap a button to get a quick answer.",
    categories: {
      wifi: 'wifi', checkin: 'check in', checkout: 'check out', water: 'water',
      bathroom: 'bathroom', gas: 'gas', eat: 'eat', drink: 'drink', shop: 'shop',
      visit: 'visit', experience: 'experience', daytrips: 'day trips',
      transport: 'transport', services: 'services', emergency: 'emergency'
    },
    answers: {
      wifi: "Wi-Fi: you'll find the router in the living room. The SSID and password are on the label on the back.",
      checkin: "Check-in from 15:00. If you need help call/WhatsApp +39 335 524 5756.",
      checkout: "Before leaving: turn off lights, close windows, leave the keys on the table and gently close the door.",
      water: "Tap water is safe to drink. Hot water is always on.",
      bathroom: "Bathroom: toilet paper, hand soap and a hairdryer are provided.",
      gas: "Cooking: press & turn the knob, hold a few seconds until the flame is steady.",
      eat: "Nearby food tips available in your welcome booklet.",
      drink: "Great cocktails around the area; ask if you need a personal tip.",
      shop: "Groceries and bakeries are within walking distance.",
      visit: "Main sights are walkable; check the booklet for a suggested route.",
      experience: "Romantic stroll at sunset and gelato stop — see suggestions in the guide.",
      daytrips: "Ostia Antica, Tivoli and Castelli Romani are great day trips.",
      transport: "Tram, buses and taxis available; FreeNow app works well.",
      services: "Pharmacy, hospital and ATMs are listed in the info section.",
      emergency: "Emergency numbers: 112 (EU emergency). For assistance call +39 335 524 5756."
    }
  },

  es: {
    langName: 'Español',
    siteTitle: 'niceflatinrome.com',
    aptLabel: 'Apartamento',
    voiceOn: 'Voz: Activada',
    voiceOff: 'Voz: Desactivada',
    hi: "Hola, soy Samantha, tu asistente virtual. Toca un botón para una respuesta rápida.",
    categories: {
      wifi: 'wifi', checkin: 'check in', checkout: 'check out', water: 'agua',
      bathroom: 'baño', gas: 'gas', eat: 'comer', drink: 'beber', shop: 'compras',
      visit: 'visitar', experience: 'experiencia', daytrips: 'excursiones',
      transport: 'transporte', services: 'servicios', emergency: 'emergencia'
    },
    answers: {
      wifi: "Wi-Fi: el router está en el salón. SSID y contraseña en la etiqueta trasera.",
      checkin: "Check-in desde las 15:00. Si necesitas ayuda llama/WhatsApp +39 335 524 5756.",
      checkout: "Antes de salir: apaga las luces, cierra las ventanas y deja las llaves en la mesa.",
      water: "El agua del grifo es potable. El agua caliente está siempre encendida.",
      bathroom: "Baño: papel higiénico, jabón de manos y secador disponibles.",
      gas: "Cocina: presiona y gira la perilla; mantén unos segundos hasta que la llama sea estable.",
      eat: "Recomendaciones cercanas en el folleto de bienvenida.",
      drink: "Buenos cócteles en la zona; pide consejo si lo deseas.",
      shop: "Supermercados y panaderías a pocos minutos caminando.",
      visit: "Atracciones principales a pie; ruta sugerida en la guía.",
      experience: "Paseo romántico al atardecer con helado — ver guía.",
      daytrips: "Ostia Antica, Tivoli y Castelli Romani son buenas excursiones.",
      transport: "Tranvía, autobuses y taxis; la app FreeNow funciona bien.",
      services: "Farmacia, hospital y cajeros en la sección de info.",
      emergency: "Emergencias: 112. Para ayuda llama +39 335 524 5756."
    }
  },

  fr: {
    langName: 'Français',
    siteTitle: 'niceflatinrome.com',
    aptLabel: 'Appartement',
    voiceOn: 'Voix : Activée',
    voiceOff: 'Voix : Désactivée',
    hi: "Bonjour, je suis Samantha, votre assistante virtuelle. Touchez un bouton pour une réponse rapide.",
    categories: {
      wifi: 'wifi', checkin: 'check in', checkout: 'check out', water: 'eau',
      bathroom: 'salle de bain', gas: 'gaz', eat: 'manger', drink: 'boire', shop: 'shopping',
      visit: 'visiter', experience: 'expérience', daytrips: 'excursions',
      transport: 'transport', services: 'services', emergency: 'urgence'
    },
    answers: {
      wifi: "Wi-Fi : routeur au salon. SSID et mot de passe sur l’étiquette arrière.",
      checkin: "Arrivée dès 15h00. Besoin d’aide ? Appelez/WhatsApp +39 335 524 5756.",
      checkout: "Avant de partir : éteignez les lumières, fermez les fenêtres, laissez les clés sur la table.",
      water: "L’eau du robinet est potable. L’eau chaude est toujours disponible.",
      bathroom: "Salle de bain : papier, savon pour les mains, sèche-cheveux fournis.",
      gas: "Cuisine : appuyez et tournez, maintenez quelques secondes jusqu’à flamme stable.",
      eat: "Conseils à proximité dans le livret d’accueil.",
      drink: "Bons cocktails dans le quartier ; demandez un conseil si besoin.",
      shop: "Épiceries et boulangeries accessibles à pied.",
      visit: "Sites principaux à pied ; itinéraire suggéré dans la guide.",
      experience: "Balade au coucher du soleil avec glace — voir guide.",
      daytrips: "Ostia Antica, Tivoli, Castelli Romani : belles excursions.",
      transport: "Tram, bus et taxis ; l’appli FreeNow fonctionne bien.",
      services: "Pharmacie, hôpital et DAB listés dans les infos.",
      emergency: "Urgences : 112. Pour aide, appelez +39 335 524 5756."
    }
  },

  de: {
    langName: 'Deutsch',
    siteTitle: 'niceflatinrome.com',
    aptLabel: 'Apartment',
    voiceOn: 'Stimme: An',
    voiceOff: 'Stimme: Aus',
    hi: "Hallo, ich bin Samantha, deine virtuelle Assistentin. Tippe auf eine Schaltfläche für eine schnelle Antwort.",
    categories: {
      wifi: 'WLAN', checkin: 'Check-in', checkout: 'Check-out', water: 'Wasser',
      bathroom: 'Bad', gas: 'Gas', eat: 'Essen', drink: 'Trinken', shop: 'Shoppen',
      visit: 'Sehenswürdigkeiten', experience: 'Erlebnis', daytrips: 'Tagesausflüge',
      transport: 'Verkehr', services: 'Service', emergency: 'Notfall'
    },
    answers: {
      wifi: "WLAN: Router im Wohnzimmer. SSID & Passwort stehen hinten auf dem Etikett.",
      checkin: "Check-in ab 15:00. Hilfe? Anrufen/WhatsApp +39 335 524 5756.",
      checkout: "Vor Abreise: Lichter aus, Fenster schließen, Schlüssel auf den Tisch legen.",
      water: "Leitungswasser ist trinkbar. Warmwasser ist ständig an.",
      bathroom: "Bad: Toilettenpapier, Handseife, Föhn vorhanden.",
      gas: "Kochen: drücken und drehen, einige Sekunden halten bis die Flamme stabil ist.",
      eat: "Tipps in der Willkommensmappe.",
      drink: "Gute Bars in der Nähe; gern nach Tipp fragen.",
      shop: "Lebensmittel & Bäckereien fußläufig erreichbar.",
      visit: "Wichtigste Sehenswürdigkeiten zu Fuß; Route in der Mappe.",
      experience: "Abendspaziergang bei Sonnenuntergang mit Eis — siehe Guide.",
      daytrips: "Ostia Antica, Tivoli, Castelli Romani sind tolle Ausflüge.",
      transport: "Tram, Busse, Taxis; FreeNow-App funktioniert gut.",
      services: "Apotheke, Krankenhaus, Geldautomaten siehe Infos.",
      emergency: "Notruf: 112. Hilfe: +39 335 524 5756."
    }
  },

  it: {
    langName: 'Italiano',
    siteTitle: 'niceflatinrome.com',
    aptLabel: 'Appartamento',
    voiceOn: 'Voce: Attiva',
    voiceOff: 'Voce: Spenta',
    hi: "Ciao, sono Samantha, la tua assistente virtuale. Tocca un pulsante per una risposta rapida.",
    categories: {
      wifi: 'wifi', checkin: 'check in', checkout: 'check out', water: 'acqua',
      bathroom: 'bagno', gas: 'gas', eat: 'mangiare', drink: 'bere', shop: 'shopping',
      visit: 'visitare', experience: 'esperienza', daytrips: 'gite',
      transport: 'trasporti', services: 'servizi', emergency: 'emergenza'
    },
    answers: {
      wifi: "Wi-Fi: router in salotto. SSID e password sull’etichetta posteriore.",
      checkin: "Check-in dalle 15:00. Se serve aiuto chiama/WhatsApp +39 335 524 5756.",
      checkout: "Prima di partire: spegni le luci, chiudi le finestre, lascia le chiavi sul tavolo.",
      water: "L’acqua del rubinetto è potabile. L’acqua calda è sempre attiva.",
      bathroom: "Bagno: carta igienica, sapone mani, asciugacapelli.",
      gas: "Cucina: premi e gira la manopola, tieni premuto qualche secondo.",
      eat: "Consigli vicini nel welcome booklet.",
      drink: "Ottimi cocktail in zona; chiedi pure un consiglio.",
      shop: "Alimentari e panifici a pochi minuti a piedi.",
      visit: "Attrazioni principali a piedi; itinerario nella guida.",
      experience: "Passeggiata al tramonto con gelato — vedi guida.",
      daytrips: "Ostia Antica, Tivoli, Castelli Romani sono ottime gite.",
      transport: "Tram, bus e taxi; l’app FreeNow funziona bene.",
      services: "Farmacia, ospedale e bancomat nelle info.",
      emergency: "Emergenze: 112. Assistenza: +39 335 524 5756."
    }
  }
};

const FALLBACK = 'en';

// ====== PAGINA ======
app.get('/', (req, res) => {
  const lang = ((req.query.lang || '').toLowerCase()) in T ? req.query.lang.toLowerCase() : FALLBACK;
  const L = T[lang];

  const langLinks = Object.entries(T).map(([code, obj]) => {
    const active = code === lang ? 'style="font-weight:700;text-decoration:underline;font-size:14px;"' : 'style="font-size:14px;"';
    return `<a ${active} href="?lang=${code}">${obj.langName}</a>`;
  }).join(' · ');

  // bottoni
  const btns = Object.entries(L.categories).map(([key, label]) => {
    return `<button class="chip" data-key="${key}">${label}</button>`;
  }).join('');

  // HTML
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${L.siteTitle} — Assistant</title>
<style>
  :root{--brand:#7a1e12;--ink:#1f2937;--muted:#6b7280;--bg:#fafafa;--card:#fff;--line:#e5e7eb}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink)}
  .wrap{max-width:920px;margin:0 auto;padding:14px}
  header{display:flex;align-items:center;gap:12px}
  .logo{font-weight:800;color:#b91c1c}
  .apt{margin-left:auto;color:var(--muted)}
  .voice{border:1px solid var(--line);border-radius:10px;background:#fff;padding:8px 10px;cursor:pointer}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;margin-top:12px}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
  .chip{border:1px solid var(--line);background:#fff;border-radius:22px;padding:8px 12px;cursor:pointer}
  .lang{margin-top:8px;color:var(--muted)}
  .msg{margin-top:14px;line-height:1.5}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="logo">${L.siteTitle}</div>
    <div class="apt">${L.aptLabel}: ARENULA</div>
    <button id="voiceBtn" class="voice" data-on="0">${L.voiceOff}</button>
  </header>

  <div class="lang">Language / Idioma / Langue / Sprache / Lingua: ${langLinks}</div>

  <div class="card">
    <div id="hi">${L.hi}</div>
    <div class="chips">${btns}</div>
    <div id="answer" class="msg"></div>
  </div>
</div>

<script>
  const LANG = ${JSON.stringify(Object.keys(T))}.includes("${lang}") ? "${lang}" : "${FALLBACK}";
  const DATA = ${JSON.stringify(T)};

  // Voce
  let voiceOn = false;
  let selectedVoice = null;

  function pickVoiceFor(lang){
    const voices = window.speechSynthesis.getVoices();
    if(!voices || voices.length===0) return null;
    // prova match perfetto lang-*
    let v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang));
    if(!v){
      // fallback per codice breve (es 'en' => 'en-GB'/'en-US')
      v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang.split('-')[0]));
    }
    // fallback finale: una voce inglese
    if(!v){
      v = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en')) || voices[0];
    }
    return v;
  }

  function speak(text){
    if(!voiceOn || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    if(!selectedVoice) selectedVoice = pickVoiceFor(LANG);
    if(selectedVoice){ u.voice = selectedVoice; u.lang = selectedVoice.lang; }
    else { u.lang = LANG; }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  // Assicura che le voci siano caricate in Safari/iOS
  window.speechSynthesis.onvoiceschanged = () => {
    selectedVoice = pickVoiceFor(LANG);
  };

  // Toggle voce
  const voiceBtn = document.getElementById('voiceBtn');
  voiceBtn.addEventListener('click', () => {
    voiceOn = !voiceOn;
    voiceBtn.dataset.on = voiceOn ? '1' : '0';
    voiceBtn.textContent = voiceOn ? DATA[LANG].voiceOn : DATA[LANG].voiceOff;
    if(voiceOn){ speak(DATA[LANG].hi); }
  });

  // Risposte
  const out = document.getElementById('answer');
  document.querySelectorAll('.chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.key;
      const text = (DATA[LANG].answers[key]) || '';
      out.textContent = text;
      speak(text);
    });
  });
</script>
</body>
</html>`;
  res.setHeader('content-type', 'text/html; charset=utf-8');
  res.end(html);
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log('Guest assistant up on http://localhost:'+port));
