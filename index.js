// Guest Assistant — Arenula (5 lingue, voice solo su "check out")
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // se hai logo/immagini

// ======================= TESTI =======================
// Compila i testi sotto per ogni lingua e categoria.
// Basta sostituire le stringhe "" con i tuoi contenuti finali.
const ANSWERS = {
  en: {
    wifi: "Wi-Fi: network + password on the router label.",
    "check in": "Check-in from 15:00. Use the intercom per istruzioni locali.",
    "check out": "Before leaving: turn off lights, close windows, leave keys on the table, gently close the door.",
    water: "Tap water is safe to drink. Hot water is always on.",
    bathroom: "Bathroom: toilet paper, hand soap, hairdryer and bath mat are provided. 1 large + 1 medium towel per guest.",
    gas: "Gas: to cook choose the burner, press and turn the knob, keep pressed a few seconds until the flame is steady.",
    eat: "Nearby restaurants…",
    drink: "Aperitivo / bars…",
    shop: "Markets and shops…",
    visit: "What to see nearby…",
    experience: "Suggested walks / experiences…",
    "day trips": "Day trips ideas…",
    transport: "Tram/bus/taxi info…",
    services: "Pharmacy, hospital, ATMs, SIM, laundry, luggage…",
    emergency: "112 (EU emergency), 118 (medical), 113 (police), 115 (fire)."
  },
  es: {
    wifi: "Wi-Fi: red y contraseña en la etiqueta del router.",
    "check in": "Check-in desde las 15:00. Usa el portero según las instrucciones.",
    "check out": "Antes de salir: apaga las luces, cierra las ventanas, deja las llaves en la mesa y cierra suavemente la puerta.",
    water: "El agua del grifo es potable. El agua caliente está siempre encendida.",
    bathroom: "Baño: papel higiénico, jabón de manos, secador y alfombrilla. 1 toalla grande + 1 mediana por huésped.",
    gas: "Gas: para cocinar elige el fuego, presiona y gira la perilla, mantén presionado unos segundos hasta que la llama sea estable.",
    eat: "Restaurantes cercanos…",
    drink: "Bares / aperitivo…",
    shop: "Mercados y tiendas…",
    visit: "Qué ver cerca…",
    experience: "Paseos / experiencias sugeridas…",
    "day trips": "Excursiones de un día…",
    transport: "Tranvía/autobús/taxi…",
    services: "Farmacia, hospital, cajeros, SIM, lavandería, consigna…",
    emergency: "112 (emergencias), 118 (médicos), 113 (policía), 115 (bomberos)."
  },
  fr: {
    wifi: "Wi-Fi : réseau et mot de passe sur l’étiquette du routeur.",
    "check in": "Arrivée à partir de 15h00. Utilisez l’interphone selon les instructions.",
    "check out": "Avant de partir : éteignez les lumières, fermez les fenêtres, laissez les clés sur la table et fermez doucement la porte.",
    water: "L’eau du robinet est potable. L’eau chaude est toujours disponible.",
    bathroom: "Salle de bain : papier toilette, savon mains, sèche-cheveux, tapis. 1 grande + 1 moyenne serviette par personne.",
    gas: "Gaz : pour cuisiner, choisissez le brûleur, appuyez et tournez le bouton, maintenez quelques secondes jusqu’à flamme stable.",
    eat: "Restaurants à proximité…",
    drink: "Bars / apéritif…",
    shop: "Marchés et boutiques…",
    visit: "À voir à proximité…",
    experience: "Balades / expériences suggérées…",
    "day trips": "Excursions à la journée…",
    transport: "Tram/bus/taxis…",
    services: "Pharmacie, hôpital, DAB, SIM, laverie, consignes…",
    emergency: "112 (urgence), 118 (médical), 113 (police), 115 (pompiers)."
  },
  de: {
    wifi: "WLAN: Netzwerk und Passwort auf dem Router-Label.",
    "check in": "Check-in ab 15:00. Sprechanlage laut Anleitung benutzen.",
    "check out": "Vor der Abreise: Lichter aus, Fenster schließen, Schlüssel auf dem Tisch lassen, Tür sanft schließen.",
    water: "Leitungswasser ist trinkbar. Warmwasser ist immer verfügbar.",
    bathroom: "Bad: Toilettenpapier, Handseife, Föhn, Badematte. 1 großes + 1 mittleres Handtuch pro Gast.",
    gas: "Gas: Zum Kochen Brenner wählen, Knopf drücken und drehen, einige Sekunden halten bis die Flamme stabil ist.",
    eat: "Restaurants in der Nähe…",
    drink: "Bars / Aperitivo…",
    shop: "Märkte und Geschäfte…",
    visit: "Sehenswürdigkeiten in der Nähe…",
    experience: "Spaziergänge / Erlebnisse…",
    "day trips": "Tagesausflüge…",
    transport: "Tram/Bus/Taxi…",
    services: "Apotheke, Krankenhaus, Geldautomaten, SIM, Wäscherei, Gepäck…",
    emergency: "112 (Notruf), 118 (Rettung), 113 (Polizei), 115 (Feuerwehr)."
  },
  it: {
    wifi: "Wi-Fi: rete e password sull’etichetta del router.",
    "check in": "Check-in dalle 15:00. Usa il citofono come da istruzioni.",
    "check out": "Prima di uscire: spegni le luci, chiudi le finestre, lascia le chiavi sul tavolo e chiudi la porta con delicatezza.",
    water: "L’acqua del rubinetto è potabile. L’acqua calda è sempre attiva.",
    bathroom: "Bagno: carta igienica, sapone mani, asciugacapelli, tappetino. 1 telo + 1 asciugamano medio a persona.",
    gas: "Gas: per cucinare scegli il fornello, premi e gira la manopola, tieni premuto qualche secondo finché la fiamma è stabile.",
    eat: "Ristoranti in zona…",
    drink: "Bar / aperitivo…",
    shop: "Mercati e negozi…",
    visit: "Cosa vedere nei dintorni…",
    experience: "Passeggiate / esperienze consigliate…",
    "day trips": "Gite in giornata…",
    transport: "Tram/bus/taxi…",
    services: "Farmacia, ospedale, bancomat, SIM, lavanderia, deposito bagagli…",
    emergency: "112 (emergenze), 118 (sanitaria), 113 (polizia), 115 (vigili del fuoco)."
  }
};

const UI = {
  en: { langName: "English", apt: "Apartment: ARENULA16", intro: "Hi, I am Samantha, your virtual assistant. Tap a button to get a quick answer.", },
  es: { langName: "Español", apt: "Apartamento: ARENULA16", intro: "Hola, soy Samantha, tu asistente virtual. Toca un botón para obtener una respuesta rápida.", },
  fr: { langName: "Français", apt: "Appartement : ARENULA16", intro: "Bonjour, je suis Samantha, votre assistante virtuelle. Touchez un bouton pour une réponse rapide.", },
  de: { langName: "Deutsch", apt: "Apartment: ARENULA16", intro: "Hallo, ich bin Samantha, Ihre virtuelle Assistentin. Tippen Sie auf eine Taste für eine schnelle Antwort.", },
  it: { langName: "Italiano", apt: "Appartamento: ARENULA16", intro: "Ciao, sono Samantha, la tua assistente virtuale. Tocca un pulsante per una risposta rapida.", }
};

const LABELS = {
  en: ["wifi","check in","check out","water","bathroom","gas","eat","drink","shop","visit","experience","day trips","transport","services","emergency"],
  es: ["wifi","check in","check out","agua","baño","gas","comer","beber","compras","visitar","experiencias","excursiones","transporte","servicios","emergencia"],
  fr: ["wifi","check in","check out","eau","salle de bain","gaz","manger","boire","shopping","visiter","expériences","excursions","transports","services","urgence"],
  de: ["WLAN","Check-in","Check-out","Wasser","Bad","Gas","Essen","Trinken","Einkaufen","Besichtigen","Erlebnisse","Tagesausflüge","Verkehr","Services","Notfall"],
  it: ["wifi","check in","check out","acqua","bagno","gas","mangiare","bere","shopping","visitare","esperienze","gite","trasporti","servizi","emergenza"]
};

// mappa etichetta->chiave interna (così qualunque lingua apre lo stesso contenuto)
const KEYMAP = {
  wifi:"wifi","check in":"check in","check out":"check out",water:"water",eau:"water",agua:"water",Wasser:"water",acqua:"water",
  bathroom:"bathroom","salle de bain":"bathroom",baño:"bathroom",Bad:"bathroom",bagno:"bathroom",
  gas:"gas",
  eat:"eat",manger:"eat",comer:"eat",Essen:"eat",mangiare:"eat",
  drink:"drink",boire:"drink",beber:"drink",Trinken:"drink",bere:"drink",
  shop:"shop",shopping:"shop",compras:"shop",Einkaufen:"shop",shopping_it:"shop",
  visit:"visit",visitar:"visit",visiter:"visit",Besichtigen:"visit",visitare:"visit",
  experience:"experience","expériences":"experience",experiencias:"experience",Erlebnisse:"experience",esperienze:"experience",
  "day trips":"day trips",excursiones:"day trips","excursions":"day trips","Tagesausflüge":"day trips",gite:"day trips",
  transport:"transport","transporte":"transport","transports":"transport","Verkehr":"transport",trasporti:"transport",
  services:"services","servicios":"services","services_fr":"services","Services":"services",servizi:"services",
  emergency:"emergency","emergencia":"emergency","urgence":"emergency","Notfall":"emergency","emergenza":"emergency"
};

// ======================= SERVER HTML =======================
const FALL = "en";

app.get("/", (req, res) => {
  const q = (req.query.lang || "").toLowerCase();
  const lang = UI[q] ? q : FALL;

  const langLinks = Object.keys(UI).map(code => {
    const active = code === lang ? 'style="font-weight:700;text-decoration:underline;font-size:16px"' : 'style="font-size:16px"';
    return `<a ${active} href="?lang=${code}">${UI[code].langName}</a>`;
  }).join(" · ");

  const chips = LABELS[lang].map(lbl => `<button class="chip" data-lbl="${lbl}">${lbl}</button>`).join("");

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>niceflatinrome.com — Virtual Assistant</title>
<style>
  :root{--brand:#2b2118;--ink:#1f2937;--muted:#6b7280;--bg:#f7f7f7;--card:#fff;--line:#e5e7eb}
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink)}
  .wrap{max-width:860px;margin:0 auto;padding:16px}
  header{display:flex;align-items:center;gap:12px;padding:14px;background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
  .brand{font-weight:800;color:#9a2d00}
  .apt{color:var(--muted)}
  .voice{border:1px solid var(--line);padding:10px 14px;border-radius:12px;background:#fdfdfd;font-size:16px}
  .lang{font-size:14px;margin:10px 0;color:var(--muted)}
  .card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:14px 0}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
  .chip{border:1px solid var(--line);padding:10px 14px;border-radius:999px;background:#fff}
  textarea{width:100%;min-height:140px;margin-top:12px;padding:10px;border:1px solid var(--line);border-radius:8px}
  .warn{color:#7c2d12;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:8px;margin-top:10px}
</style>
</head>
<body>
<header class="wrap">
  <div class="brand">niceflatinrome.com</div>
  <div class="apt">${UI[lang].apt}</div>
  <button id="voiceBtn" class="voice" aria-pressed="false">Voice: Off</button>
</header>

<main class="wrap">
  <div class="lang">Language / Idioma / Langue / Sprache / Lingua: ${langLinks}</div>

  <section class="card">
    <p id="intro">${UI[lang].intro}</p>
    <div class="chips" id="chips">${chips}</div>
    <textarea id="answer" readonly></textarea>
    <div id="warn" class="warn" style="display:none"></div>
  </section>
</main>

<script>
  const UI = ${JSON.stringify(UI)};
  const ANSWERS = ${JSON.stringify(ANSWERS)};
  const KEYMAP = ${JSON.stringify(KEYMAP)};
  const lang = "${lang}";

  let voiceOn = false;
  const voiceBtn = document.getElementById('voiceBtn');
  voiceBtn.addEventListener('click', () => {
    voiceOn = !voiceOn;
    voiceBtn.textContent = 'Voice: ' + (voiceOn ? 'On' : 'Off');
    voiceBtn.setAttribute('aria-pressed', voiceOn ? 'true' : 'false');
  });

  const answer = document.getElementById('answer');
  const warn = document.getElementById('warn');

  function pickVoiceFor(code){
    const map = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT' };
    const target = (map[code]||'en-US').toLowerCase();
    const vs = window.speechSynthesis.getVoices();
    return vs.find(v=>v.lang.toLowerCase()===target) || vs.find(v=>v.lang.toLowerCase().startsWith(target.slice(0,2)));
  }

  function speakCheckout(text){
    if(!voiceOn || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    const map = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT' };
    u.lang = map[lang] || 'en-US';
    const v = pickVoiceFor(lang);
    if(v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  document.getElementById('chips').addEventListener('click', (e)=>{
    if(!e.target.matches('.chip')) return;
    const label = e.target.getAttribute('data-lbl');
    const key = KEYMAP[label] || label;
    const L = ANSWERS[lang] || {};
    const txt = L[key];

    if(txt){
      warn.style.display = 'none';
      answer.value = txt;
      // *** Samantha parla SOLO su "check out" ***
      if(key === 'check out') speakCheckout(txt);
    }else{
      answer.value = '';
      warn.textContent = 'Content for "'+label+'" is not set yet in this language.';
      warn.style.display = 'block';
    }
  });
</script>
</body>
</html>`;
  res.setHeader("content-type","text/html; charset=utf-8");
  res.end(html);
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log("Assistant live on http://localhost:"+port));
