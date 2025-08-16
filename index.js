// index.js — Guest Assistant (multilingual + auto voice)

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // serve logo ecc.

// ---------- Lingue supportate ----------
const LANGS = {
  en: {label: 'English',  ttsLang: 'en-US', voiceHint: 'Samantha'},
  es: {label: 'Español',  ttsLang: 'es-ES', voiceHint: 'Monica'},
  fr: {label: 'Français', ttsLang: 'fr-FR', voiceHint: 'Amelie'},
  de: {label: 'Deutsch',  ttsLang: 'de-DE', voiceHint: 'Anna'},
  it: {label: 'Italiano', ttsLang: 'it-IT', voiceHint: 'Alice'}
};
const DEFAULT_LANG = 'en';

// ---------- Dati appartamento (esempio Arenula 16) ----------
const apartment = {
  apartment_id: 'ARENULA16',
  name: 'Via Arenula 16',
  address: 'Via Arenula 16, Rome, Italy',
  checkin_time: '15:00',
  checkout_time: '11:00',

  // Wi-Fi
  wifi_note: 'Router on the desk by the window. Turn it to see SSID & password.',
  wifi_ssid: 'See router label',
  wifi_password: 'See router label',

  // Acqua / Bagno
  water_note: 'Tap water is safe to drink. Hot water is always available.',
  ac_note: 'Please switch off the air conditioning when you go out.',
  bathroom_amenities: 'Toilet paper, hand soap, bath mat, hairdryer.',
  towels_note: 'Per guest: 1 large + 1 medium towel. Bed is prepared on arrival.',

  // Gas
  gas_steps:
    'Gas valve: horizontal=open, vertical=closed. Choose burner. Light a match/lighter. Turn & press the black knob until the flame is steady, then release.',

  // Building
  intercom_code: 'C8',
  elevator_note: 'Elevator for owners only — please do not use.',
  main_door_hours: '08:00–13:00 and 15:30–18:00',
  concierge: 'Paolo',

  // Servizi vicini
  pharmacy: 'Farmacia Arenula, Via Arenula 19–21 — +39 06 686 8815',
  hospital: 'Fatebenefratelli Hospital, Tiber Island 1',
  atms: 'Unicredit (Largo Arenula 1), BNL (Via Arenula 41), Intesa (Via Arenula 27)',
  sims: 'Vodafone (Corso Vittorio Emanuele II, 209), TIM (Piazza Venezia, 2), Iliad (Via del Corso, 282)',
  laundry: 'Self-service laundry: Via Arenula 47',
  luggage: 'Radical Storage at Largo di Torre Argentina (5 min)',

  // Trasporti
  transport:
    'Tram 8 (Arenula/Cairoli) → Trastevere or Piazza Venezia. Bus 40/64 → Termini & Vatican. Taxi: +39 06 3570 or FreeNow app.',
  airports:
    'Fiumicino: Tram 8 → Trastevere → FL1 train (~45 min). Ciampino: Terravision bus or taxi. Private transfer: Welcome Pickups.',

  // Emergenze
  emergency:
    'EU Emergency 112 • Police 113 • Ambulance 118 • Fire 115 • English doctor +39 06 488 2371 • 24h vet +39 06 660 681',

  // Eat/Drink/See
  eat: 'Roscioli; Emma Pizzeria; Ditirambo; Osteria da Fortunata; Pianostrada; Forno Campo de’ Fiori; Gelateria del Teatro.',
  drink: 'Caffè Camerino (Largo Arenula 30); Irish Pub (Largo Argentina); Modius Radisson Rooftop.',
  shop: 'Via Arenula delis/bakeries/gelato; Piazza Costaguti fish market; Forno Boccione; Mercato Monti (weekends).',
  visit:
    'Largo di Torre Argentina (temples & cat sanctuary); Portico d’Ottavia; Tiber Island; Piazza Farnese; hidden churches (Chiesa Nuova, S. Maria in Campitelli, S. Barbara dei Librari).',
  experiences:
    'Evening walk: Largo Argentina → Ghetto → Tiber Island → Teatro di Marcello; aperitivo at Camerino or Modius; pastries at Forno Boccione; sunset on Lungotevere.',
  daytrips:
    'Ostia Antica (~40 min); Tivoli (Villa d’Este & Hadrian’s Villa ~1h); Castelli Romani (villages & wine).',

  // Check-out
  checkout_note:
    'Before leaving: turn off lights/AC, close windows, leave keys on the table, gently close the door.',

  host_phone: '+39 335 5245756'
};

// ---------- Testi UI per ciascuna lingua ----------
const UI = {
  en: {
    welcome: 'Hi, I’m Samantha, your virtual guide. Tap a button to get a quick answer.',
    inputPH: 'Type a message… e.g., wifi, gas, transport',
    buttons: ['wifi','check in','check out','water','AC','bathroom','gas',
      'eat','drink','shop','visit','experience','day trips','transport','services','emergency']
  },
  es: {
    welcome: 'Hola, soy Samantha, tu guía virtual. Toca un botón para obtener una respuesta rápida.',
    inputPH: 'Escribe un mensaje… p. ej., wifi, gas, transporte',
    buttons: ['wifi','check in','check out','agua','AC','baño','gas',
      'comer','beber','comprar','visitar','experiencia','excursiones','transporte','servicios','emergencia']
  },
  fr: {
    welcome: 'Bonjour, je suis Samantha, votre guide virtuel. Touchez un bouton pour une réponse rapide.',
    inputPH: 'Écrivez un message… ex. wifi, gaz, transport',
    buttons: ['wifi','check in','check out','eau','AC','salle de bain','gaz',
      'manger','boire','shopping','visiter','expérience','excursions','transport','services','urgence']
  },
  de: {
    welcome: 'Hallo, ich bin Samantha, Ihre virtuelle Begleiterin. Tippen Sie auf einen Button für eine schnelle Antwort.',
    inputPH: 'Nachricht eingeben… z. B. WLAN, Gas, Verkehr',
    buttons: ['wifi','check in','check out','wasser','AC','bad','gas',
      'essen','trinken','einkauf','besuchen','erlebnis','tagesausflüge','transport','services','notfall']
  },
  it: {
    welcome: 'Ciao, sono Samantha, la tua guida virtuale. Tocca un pulsante per una risposta rapida.',
    inputPH: 'Scrivi un messaggio… es. wifi, gas, trasporti',
    buttons: ['wifi','check in','check out','acqua','AC','bagno','gas',
      'mangiare','bere','shopping','visitare','esperienza','gite','trasporti','servizi','emergenza']
  }
};

// ---------- FAQ multilingua (stesse chiavi, testi per lingua) ----------
const faqs = [
  { key:'wifi',
    utter: ['wifi','wi-fi','internet','password','router'],
    ans: {
      en: `Wi-Fi: ${apartment.wifi_note}\nNetwork: ${apartment.wifi_ssid}. Password: ${apartment.wifi_password}.`,
      es: `Wi-Fi: ${apartment.wifi_note}\nRed: ${apartment.wifi_ssid}. Clave: ${apartment.wifi_password}.`,
      fr: `Wi-Fi : ${apartment.wifi_note}\nRéseau : ${apartment.wifi_ssid}. Mot de passe : ${apartment.wifi_password}.`,
      de: `WLAN: ${apartment.wifi_note}\nNetz: ${apartment.wifi_ssid}. Passwort: ${apartment.wifi_password}.`,
      it: `Wi-Fi: ${apartment.wifi_note}\nRete: ${apartment.wifi_ssid}. Password: ${apartment.wifi_password}.`
    }
  },
  { key:'check in',
    utter: ['check in','arrival','access','intercom','code','arribo','arrivée','ankunft','ingresso','citofono'],
    ans: {
      en: `Check-in from ${apartment.checkin_time}. Intercom code: ${apartment.intercom_code}. Main door hours: ${apartment.main_door_hours}. Concierge: ${apartment.concierge}. Need help? Call ${apartment.host_phone}.`,
      es: `Check-in desde las ${apartment.checkin_time}. Portero: ${apartment.intercom_code}. Puerta principal: ${apartment.main_door_hours}. Conserje: ${apartment.concierge}. ¿Ayuda? ${apartment.host_phone}.`,
      fr: `Arrivée à partir de ${apartment.checkin_time}. Interphone : ${apartment.intercom_code}. Porte : ${apartment.main_door_hours}. Concierge : ${apartment.concierge}. Besoin d’aide ? ${apartment.host_phone}.`,
      de: `Check-in ab ${apartment.checkin_time}. Klingel: ${apartment.intercom_code}. Haustür: ${apartment.main_door_hours}. Concierge: ${apartment.concierge}. Hilfe? ${apartment.host_phone}.`,
      it: `Check-in dalle ${apartment.checkin_time}. Citofono: ${apartment.intercom_code}. Portone: ${apartment.main_door_hours}. Portineria: ${apartment.concierge}. Aiuto? ${apartment.host_phone}.`
    }
  },
  { key:'check out',
    utter: ['check out','leave','departure','salida','départ','abreise','uscita'],
    ans: {
      en: apartment.checkout_note,
      es: 'Antes de salir: apaga luci/AC, chiudi le finestre, lascia le chiavi sul tavolo, chiudi la porta con delicatezza.',
      fr: 'Avant de partir : éteignez lumières/clim, fermez les fenêtres, laissez les clés sur la table, fermez la porte doucement.',
      de: 'Vor dem Verlassen: Licht/Klima aus, Fenster schließen, Schlüssel auf dem Tisch lassen, Tür sanft schließen.',
      it: 'Prima di uscire: spegni luci/AC, chiudi le finestre, lascia le chiavi sul tavolo, chiudi piano la porta.'
    }
  },
  { key:'water',
    utter: ['water','hot water','drinkable','tap','agua','eau','wasser','acqua'],
    ans: {
      en: apartment.water_note,
      es: 'El agua del grifo es potable. El agua caliente está siempre disponible.',
      fr: 'L’eau du robinet est potable. L’eau chaude est toujours disponible.',
      de: 'Leitungswasser ist trinkbar. Warmwasser ist immer verfügbar.',
      it: 'L’acqua del rubinetto è potabile. L’acqua calda è sempre disponibile.'
    }
  },
  { key:'AC',
    utter: ['ac','air conditioning','aircon','aria','clima','aire','clim'],
    ans: {
      en: apartment.ac_note,
      es: 'Por favor, apaga el aire acondicionado cuando salgas.',
      fr: 'Merci d’éteindre la climatisation en sortant.',
      de: 'Bitte Klimaanlage ausschalten, wenn Sie gehen.',
      it: 'Per favore spegni l’aria condizionata quando esci.'
    }
  },
  { key:'bathroom',
    utter: ['bathroom','hairdryer','soap','towels','baño','salle de bain','bad','bagno'],
    ans: {
      en: `Bathroom: ${apartment.bathroom_amenities}\nTowels: ${apartment.towels_note}`,
      es: `Baño: ${apartment.bathroom_amenities}\nToallas: ${apartment.towels_note}`,
      fr: `Salle de bain : ${apartment.bathroom_amenities}\nServiettes : ${apartment.towels_note}`,
      de: `Bad: ${apartment.bathroom_amenities}\nHandtücher: ${apartment.towels_note}`,
      it: `Bagno: ${apartment.bathroom_amenities}\nAsciugamani: ${apartment.towels_note}`
    }
  },
  { key:'gas',
    utter: ['gas','kitchen','cook','flame','burner','cocina','gaz','küche','cucina'],
    ans: {
      en: `Gas use: ${apartment.gas_steps}`,
      es: `Uso del gas: ${apartment.gas_steps}`,
      fr: `Gaz : ${apartment.gas_steps}`,
      de: `Gasherd: ${apartment.gas_steps}`,
      it: `Uso gas: ${apartment.gas_steps}`
    }
  },
  { key:'services',
    utter: ['pharmacy','hospital','atm','sim','laundry','luggage','servizi','servicios','services','dienstleistungen'],
    ans: {
      en: `Pharmacy: ${apartment.pharmacy}\nHospital: ${apartment.hospital}\nATMs: ${apartment.atms}\nSIMs: ${apartment.sims}\nLaundry: ${apartment.laundry}\nLuggage: ${apartment.luggage}`,
      es: `Farmacia: ${apartment.pharmacy}\nHospital: ${apartment.hospital}\nCajeros: ${apartment.atms}\nSIM: ${apartment.sims}\nLavandería: ${apartment.laundry}\nEquipaje: ${apartment.luggage}`,
      fr: `Pharmacie : ${apartment.pharmacy}\nHôpital : ${apartment.hospital}\nDAB : ${apartment.atms}\nSIM : ${apartment.sims}\nLaverie : ${apartment.laundry}\nBagages : ${apartment.luggage}`,
      de: `Apotheke: ${apartment.pharmacy}\nKrankenhaus: ${apartment.hospital}\nGeldautomaten: ${apartment.atms}\nSIMs: ${apartment.sims}\nWäscherei: ${apartment.laundry}\nGepäck: ${apartment.luggage}`,
      it: `Farmacia: ${apartment.pharmacy}\nOspedale: ${apartment.hospital}\nBancomat: ${apartment.atms}\nSIM: ${apartment.sims}\nLavanderia: ${apartment.laundry}\nDeposito bagagli: ${apartment.luggage}`
    }
  },
  { key:'transport',
    utter: ['transport','tram','bus','taxi','airport','train','transporte','transport','verkehr','trasporti'],
    ans: {
      en: `${apartment.transport}\nAirports: ${apartment.airports}`,
      es: `${apartment.transport}\nAeropuertos: ${apartment.airports}`,
      fr: `${apartment.transport}\nAéroports : ${apartment.airports}`,
      de: `${apartment.transport}\nFlughäfen: ${apartment.airports}`,
      it: `${apartment.transport}\nAeroporti: ${apartment.airports}`
    }
  },
  { key:'eat', utter: ['eat','restaurant','dinner','lunch','comer','manger','essen','mangiare'],
    ans: { en: apartment.eat, es: apartment.eat, fr: apartment.eat, de: apartment.eat, it: apartment.eat }
  },
  { key:'drink', utter: ['drink','bar','wine','cocktail','beber','boire','trinken','bere'],
    ans: { en: apartment.drink, es: apartment.drink, fr: apartment.drink, de: apartment.drink, it: apartment.drink }
  },
  { key:'shop', utter: ['shop','market','shopping','comprar','shopping','einkauf','shopping'],
    ans: { en: apartment.shop, es: apartment.shop, fr: apartment.shop, de: apartment.shop, it: apartment.shop }
  },
  { key:'visit', utter: ['what to visit','see','sight','attraction','museum','visitar','visiter','besuchen','visitare'],
    ans: { en: apartment.visit, es: apartment.visit, fr: apartment.visit, de: apartment.visit, it: apartment.visit }
  },
  { key:'experience', utter: ['experience','walk','tour','itinerary','sunset','romantic','experiencia','expérience','erlebnis','esperienza'],
    ans: { en: apartment.experiences, es: apartment.experiences, fr: apartment.experiences, de: apartment.experiences, it: apartment.experiences }
  },
  { key:'day trips', utter: ['day trip','tivoli','ostia','castelli','excursion','excursión','excursion','tagesausflug','gite'],
    ans: { en: apartment.daytrips, es: apartment.daytrips, fr: apartment.daytrips, de: apartment.daytrips, it: apartment.daytrips }
  },
  { key:'emergency', utter: ['emergency','police','ambulance','fire','doctor','vet','emergencia','urgence','notfall','emergenza'],
    ans: { en: apartment.emergency, es: apartment.emergency, fr: apartment.emergency, de: apartment.emergency, it: apartment.emergency }
  }
];

// ---------- OpenAI (risposta nella lingua scelta) ----------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const client = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

function norm(s){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim(); }
function detect(message){
  const t = norm(message); let best=null, score=0;
  for (const f of faqs){
    let s=0; for (const u of f.utter){ if (t.includes(norm(u))) s++; }
    if (s>score){ best=f; score=s; }
  }
  return best;
}
async function polish(raw, userMsg, lang){
  if (!client) return raw;
  const langName = LANGS[lang]?.label || LANGS[DEFAULT_LANG].label;
  const sys = `You are a concise apartment assistant. ALWAYS answer in ${langName}. Keep facts as given; do not invent. Max ~120 words.`;
  try{
    const r = await client.responses.create({
      model: OPENAI_MODEL,
      input: [
        {role:'system', content: sys},
        {role:'developer', content: `Apartment data: ${JSON.stringify(apartment)}`},
        {role:'user', content: `Guest asked: ${userMsg}\nDraft answer:\n${raw}`}
      ]
    });
    return r.output_text || raw;
  }catch{ return raw; }
}

// ---------- API ----------
app.post('/api/message', async (req,res)=>{
  const { message='', lang=DEFAULT_LANG } = req.body || {};
  const m = detect(message);
  let raw;
  if (m) {
    raw = m.ans[lang] || m.ans[DEFAULT_LANG];
  } else {
    // fallback generico localizzato
    const fallback = {
      en: 'I did not find a direct answer. Use the quick buttons (wifi, gas, transport…) or type a keyword.',
      es: 'No encontré una respuesta directa. Usa los botones rápidos (wifi, gas, transporte…) o escribe una palabra clave.',
      fr: 'Je ne trouve pas de réponse directe. Utilisez les boutons rapides (wifi, gaz, transport…) ou tapez un mot-clé.',
      de: 'Keine direkte Antwort gefunden. Nutzen Sie die Schnellbuttons (WLAN, Gas, Transport…) oder geben Sie ein Stichwort ein.',
      it: 'Non ho trovato una risposta diretta. Usa i pulsanti rapidi (wifi, gas, trasporti…) o scrivi una parola chiave.'
    }[lang] || '…';
    raw = fallback;
  }
  const text = await polish(raw, message, lang);
  res.json({ text, intent: m?.key || null });
});

// ---------- UI ----------
app.get('/', (_req,res)=>{
  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Guest Help — ${apartment.name}</title>
<link rel="icon" href="logo-niceflatinrome.jpg">
<style>
*{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f6f6}
.wrap{max-width:760px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e0e0e0;padding:10px 14px}
.h-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.h-left{display:flex;align-items:center;gap:10px}
.brand{font-weight:700;color:#a33}
.apt{margin-left:auto;opacity:.75}
img.logo{height:36px;width:auto;display:block}
.controls{display:flex;gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap}
#langbar{display:flex;gap:10px;font-weight:700}
#langbar button{border:1px solid #ddd;background:#fff;border-radius:10px;padding:6px 10px;cursor:pointer}
#langbar button.active{background:#2b2118;color:#fff;border-color:#2b2118}
#voiceBtn{padding:6px 10px;border:1px solid #ddd;background:#fff;border-radius:10px;cursor:pointer}
#voiceBtn[aria-pressed="true"]{background:#2b2118;color:#fff;border-color:#2b2118}
main{flex:1;padding:12px}
.msg{max-width:85%;line-height:1.35;border-radius:12px;padding:10px 12px;margin:8px 0;white-space:pre-wrap}
.msg.wd{background:#fff;border:1px solid #e0e0e0}
.msg.me{background:#e8f0fe;border:1px solid #c5d5ff;margin-left:auto}
.quick{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.quick button{border:1px solid #d6c5b8;background:#fff;color:#333;padding:6px 10px;border-radius:12px;cursor:pointer}
.quick button:active{transform:translateY(1px)}
footer{position:sticky;bottom:0;background:#fff;display:flex;gap:8px;padding:10px;border-top:1px solid #e0e0e0}
input{flex:1;padding:12px;border:1px solid #cbd5e1;border-radius:10px;outline:none}
#sendBtn{padding:12px 14px;border:1px solid #2b2118;background:#2b2118;color:#fff;border-radius:10px;cursor:pointer}
</style></head>
<body>
<div class="wrap">
  <header>
    <div class="h-row">
      <div class="h-left">
        <img class="logo" src="logo-niceflatinrome.jpg" alt="NiceFlatInRome">
        <div class="brand">niceflatinrome.com</div>
      </div>
      <div class="apt">Apartment: ${apartment.apartment_id}</div>
    </div>
    <div class="controls">
      <div id="langbar" aria-label="Language"></div>
      <button id="voiceBtn" aria-pressed="false" title="Toggle voice">🔇 Voice: Off</button>
    </div>
  </header>

  <main id="chat" aria-live="polite"></main>

  <footer>
    <input id="input" placeholder="" autocomplete="off">
    <button id="sendBtn">Send</button>
  </footer>
</div>

<script>
// ---- Stato lingua ----
const LANGS = ${JSON.stringify(LANGS)};
const UI = ${JSON.stringify(UI)};
let lang = localStorage.getItem('lang') || '${DEFAULT_LANG}';

// ---- Chat UI ----
const chatEl = document.getElementById('chat');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const langbar = document.getElementById('langbar');

function setLangBar(){
  langbar.innerHTML = '';
  for(const code of Object.keys(LANGS)){
    const b=document.createElement('button');
    b.textContent = LANGS[code].label;
    if(code===lang) b.classList.add('active');
    b.onclick = ()=>{ lang = code; localStorage.setItem('lang',lang); refreshUI(); };
    langbar.appendChild(b);
  }
}
function add(type, txt){
  const d=document.createElement('div');
  d.className='msg '+(type==='me'?'me':'wd');
  d.textContent=txt; chatEl.appendChild(d); chatEl.scrollTop=chatEl.scrollHeight;
}
function buildQuick(){
  const wrap=document.createElement('div'); wrap.className='quick';
  for (const it of UI[lang].buttons){
    const b=document.createElement('button'); b.textContent=it;
    b.onclick=()=>{ input.value=it; send(); }; wrap.appendChild(b);
  }
  return wrap;
}
function welcome(){
  add('wd', UI[lang].welcome);
  chatEl.appendChild(buildQuick());
}
function refreshUI(){
  // pulisci chat e rifai welcome
  chatEl.innerHTML=''; welcome();
  // placeholder input localizzato
  input.placeholder = UI[lang].inputPH;
  // aggiorna bottone lingua
  setLangBar();
}

// ---- Voce: auto in base alla lingua ----
let voiceOn=false, pick=null;
function pickVoice(){
  const want = LANGS[lang]?.ttsLang || 'en-US';
  const hint = (LANGS[lang]?.voiceHint || '').toLowerCase();
  const all = window.speechSynthesis ? (speechSynthesis.getVoices()||[]) : [];
  // priorità: lang match + name hint → lang match → any
  pick = all.find(v=>v.lang?.startsWith(want) && v.name?.toLowerCase().includes(hint))
      || all.find(v=>v.lang?.startsWith(want))
      || all[0] || null;
}
if ('speechSynthesis' in window){
  pickVoice(); window.speechSynthesis.onvoiceschanged = pickVoice;
}
function warm(){ try{ const u=new SpeechSynthesisUtterance(''); if(pick) u.voice=pick; u.lang=LANGS[lang]?.ttsLang||'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch{} }
function speak(t){
  if(!voiceOn||!('speechSynthesis' in window))return;
  try{ const u=new SpeechSynthesisUtterance(t); if(pick) u.voice=pick; u.lang=LANGS[lang]?.ttsLang||'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch{}
}
document.getElementById('voiceBtn').addEventListener('click',e=>{
  voiceOn=!voiceOn; e.currentTarget.setAttribute('aria-pressed',String(voiceOn));
  e.currentTarget.textContent = voiceOn ? '🔊 Voice: On' : '🔇 Voice: Off';
  if(voiceOn) warm();
});

// ---- Invio messaggi ----
async function send(){
  const text=(input.value||'').trim(); if(!text) return;
  add('me',text); input.value='';
  try{
    const r=await fetch('/api/message',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text, lang})});
    const data=await r.json(); const bot=data.text||'…';
    add('wd',bot); speak(bot);
  }catch{ add('wd','Network error. Please try again.'); }
}
sendBtn.addEventListener('click',send);
input.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });

// Init
setLangBar();
refreshUI();
</script>
</body></html>`;
  res.setHeader('content-type','text/html; charset=utf-8');
  res.end(html);
});

// ---------- Start ----------
const port = process.env.PORT || 8787;
app.listen(port, ()=>console.log('Guest assistant up on http://localhost:'+port));
