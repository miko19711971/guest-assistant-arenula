// Guest Assistant — Via Arenula (multilingual + voice fixed)
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // (se hai un logo o immagini)

const T = {
  en: {
    langName: "English",
    title: "niceflatinrome.com — Virtual Assistant",
    apt: "Apartment: ARENULA16",
    intro: "Hi, I am Samantha, your virtual assistant. Tap a button to get a quick answer.",
    buttons: {
      wifi: "wifi", checkin: "check in", checkout: "check out",
      water: "water", bathroom: "bathroom", gas: "gas",
      eat: "eat", drink: "drink", shop: "shop", visit: "visit",
      experience: "experience", daytrips: "day trips",
      transport: "transport", services: "services", emergency: "emergency"
    },
    // --- Bathroom text (ricostruito) ---
    bathroom: `Bathroom: toilet paper, hand soap, hairdryer and bath mat are provided. 
Towels: 1 large + 1 medium towel per guest. Mirror and waste bin available.`,
  },

  es: {
    langName: "Español",
    title: "niceflatinrome.com — Asistente virtual",
    apt: "Apartamento: ARENULA16",
    intro: "Hola, soy Samantha, tu asistente virtual. Toca un botón para obtener una respuesta rápida.",
    buttons: {
      wifi: "wifi", checkin: "check in", checkout: "check out",
      water: "agua", bathroom: "baño", gas: "gas",
      eat: "comer", drink: "beber", shop: "compras", visit: "visitar",
      experience: "experiencias", daytrips: "excursiones",
      transport: "transporte", services: "servicios", emergency: "emergencia"
    },
    bathroom: `Baño: se proporcionan papel higiénico, jabón de manos, secador de pelo y alfombrilla de baño. 
Toallas: 1 grande + 1 mediana por huésped. Hay espejo y papelera.`,
  },

  fr: {
    langName: "Français",
    title: "niceflatinrome.com — Assistante virtuelle",
    apt: "Appartement : ARENULA16",
    intro: "Bonjour, je suis Samantha, votre assistante virtuelle. Touchez un bouton pour une réponse rapide.",
    buttons: {
      wifi: "wifi", checkin: "check in", checkout: "check out",
      water: "eau", bathroom: "salle de bain", gas: "gaz",
      eat: "manger", drink: "boire", shop: "shopping", visit: "visiter",
      experience: "expériences", daytrips: "excursions",
      transport: "transports", services: "services", emergency: "urgence"
    },
    bathroom: `Salle de bain : papier toilette, savon pour les mains, sèche-cheveux et tapis de bain sont fournis. 
Serviettes : 1 grande + 1 moyenne par personne. Miroir et corbeille disponibles.`,
  },

  de: {
    langName: "Deutsch",
    title: "niceflatinrome.com — Virtuelle Assistenz",
    apt: "Apartment: ARENULA16",
    intro: "Hallo, ich bin Samantha, Ihre virtuelle Assistentin. Tippen Sie auf eine Taste für eine schnelle Antwort.",
    buttons: {
      wifi: "WLAN", checkin: "Check-in", checkout: "Check-out",
      water: "Wasser", bathroom: "Bad", gas: "Gas",
      eat: "Essen", drink: "Trinken", shop: "Einkaufen", visit: "Besichtigen",
      experience: "Erlebnisse", daytrips: "Tagesausflüge",
      transport: "Verkehr", services: "Services", emergency: "Notfall"
    },
    bathroom: `Bad: Toilettenpapier, Handseife, Haartrockner und Badematte sind vorhanden. 
Handtücher: 1 großes + 1 mittleres Handtuch pro Gast. Spiegel und Abfalleimer vorhanden.`,
  },

  it: {
    langName: "Italiano",
    title: "niceflatinrome.com — Assistente virtuale",
    apt: "Appartamento: ARENULA16",
    intro: "Ciao, sono Samantha, la tua assistente virtuale. Tocca un pulsante per una risposta rapida.",
    buttons: {
      wifi: "wifi", checkin: "check in", checkout: "check out",
      water: "acqua", bathroom: "bagno", gas: "gas",
      eat: "mangiare", drink: "bere", shop: "shopping", visit: "visitare",
      experience: "esperienze", daytrips: "gite",
      transport: "trasporti", services: "servizi", emergency: "emergenza"
    },
    bathroom: `Bagno: forniamo carta igienica, sapone per le mani, asciugacapelli e tappetino. 
Asciugamani: 1 grande + 1 medio a persona. Disponibili specchio e cestino.`,
  },
};

const FALL = "en";

app.get("/", (req, res) => {
  const qlang = (req.query.lang || "").toLowerCase();
  const L = T[qlang] || T[FALL];

  const links = Object.entries(T)
    .map(([code, v]) => {
      const active = (L === T[code]) ? 'style="font-weight:700;text-decoration:underline;font-size:15px"' : 'style="font-size:15px"';
      return `<a ${active} href="?lang=${code}">${v.langName}</a>`;
    }).join(" · ");

  const html = `<!doctype html>
<html lang="${qlang || FALL}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${L.title}</title>
<style>
  :root{--brand:#2b2118;--ink:#1f2937;--muted:#6b7280;--bg:#f7f7f7;--card:#fff;--line:#e5e7eb}
  *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink)}
  .wrap{max-width:860px;margin:0 auto;padding:16px}
  header{display:flex;align-items:center;gap:12px;padding:14px;background:var(--card);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}
  .brand{font-weight:800;color:#9a2d00}
  .apt{color:var(--muted)}
  .voice{border:1px solid var(--line);padding:6px 10px;border-radius:10px;background:#fdfdfd}
  .card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin:14px 0}
  .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
  .chip{border:1px solid var(--line);padding:10px 14px;border-radius:999px;background:#fff}
  .lang{font-size:14px;margin-top:8px;color:var(--muted)}
  textarea{width:100%;min-height:120px;margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:8px}
</style>
</head>
<body>
<header class="wrap">
  <div class="brand">niceflatinrome.com</div>
  <div class="apt">${L.apt}</div>
  <button id="voiceBtn" class="voice" aria-pressed="false">Voice: Off</button>
</header>

<main class="wrap">
  <div class="lang">Language / Idioma / Langue / Sprache / Lingua: ${links}</div>

  <section class="card">
    <p id="intro">${L.intro}</p>
    <div class="chips" id="chipRow">
      <!-- pulsanti generati da JS -->
    </div>
    <textarea id="answer" readonly></textarea>
  </section>
</main>

<script>
  const T = ${JSON.stringify(T)};
  let current = "${qlang || FALL}";
  let speaking = false;

  const btn = document.getElementById('voiceBtn');
  btn.addEventListener('click', () => {
    speaking = !speaking;
    btn.textContent = 'Voice: ' + (speaking ? 'On' : 'Off');
    btn.setAttribute('aria-pressed', speaking ? 'true' : 'false');
  });

  const chipRow = document.getElementById('chipRow');
  const answer = document.getElementById('answer');

  function buildChips() {
    chipRow.innerHTML = '';
    const labels = T[current].buttons;
    Object.keys(labels).forEach(key => {
      const c = document.createElement('button');
      c.className = 'chip';
      c.textContent = labels[key];
      c.onclick = () => showAnswer(key);
      chipRow.appendChild(c);
    });
  }

  function pickVoiceFor(lang) {
    const voices = window.speechSynthesis.getVoices();
    // prova match pieno ("fr-FR") poi prefisso ("fr")
    return voices.find(v => v.lang.toLowerCase() === lang)
        || voices.find(v => v.lang.toLowerCase().startsWith(lang.split('-')[0]));
  }

  function speak(text) {
    if (!speaking || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    // set lingua richiesta
    const map = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT' };
    u.lang = map[current] || 'en-US';
    const v = pickVoiceFor(u.lang.toLowerCase());
    if (v) u.voice = v;
    window.speechSynthesis.cancel(); // interrompi eventuale parlato precedente
    window.speechSynthesis.speak(u);
  }

  function showAnswer(key) {
    const L = T[current];
    let text = '';
    if (key === 'bathroom') text = L.bathroom;
    else text = L.intro; // qui puoi mappare gli altri contenuti già esistenti
    answer.value = text;
    speak(text);
  }

  // Se l'utente cambia lingua tramite link, la pagina si ricarica con ?lang=...
  // All'avvio:
  buildChips();
</script>
</body>
</html>`;
  res.setHeader("content-type","text/html; charset=utf-8");
  res.end(html);
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log("Guest assistant up on http://localhost:"+port));
