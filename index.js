// Guest Assistant — Via Arenula 16 (EN/ES/FR/DE/IT) + multi-voice
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai'; // opzionale: se non imposti la KEY, il server funziona lo stesso

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // logo, favicon, ecc.

// ---------- DATI APPARTAMENTO ----------
const apt = {
  id: 'ARENULA16',
  name: 'Via Arenula 16',
  address: 'Via Arenula 16, Rome, Italy',
  checkin_time: '15:00',
  checkout_time: '11:00',

  // Wi-Fi
  wifi_note: 'Router on the desk by the window. Turn it to see SSID & password.',
  wifi_ssid: 'See router label',
  wifi_password: 'See router label',

  // Water / AC / Bathroom
  water_note: 'Tap water is safe to drink. Hot water is always available.',
  ac_note: 'Please switch off the air conditioning when you go out.',
  bathroom_amenities: 'Toilet paper, hand soap, bath mat, hairdryer.',
  towels_note: 'Per guest: 1 large + 1 medium towel. Bed is prepared on arrival.',

  // Gas / kitchen
  gas_steps:
    'Gas valve: horizontal=open, vertical=closed. Choose burner. Light a match/lighter. Turn & press the black knob until the flame is steady, then release.',

  // Building
  intercom_code: 'C8',
  elevator_note: 'Elevator for owners only — please do not use.',
  main_door_hours: '08:00–13:00 and 15:30–18:00',
  concierge: 'Paolo',

  // Services nearby
  pharmacy: 'Farmacia Arenula, Via Arenula 19–21 — +39 06 686 8815',
  hospital: 'Fatebenefratelli Hospital, Tiber Island 1',
  atms: 'Unicredit (Largo Arenula 1), BNL (Via Arenula 41), Intesa (Via Arenula 27)',
  sims: 'Vodafone (Corso Vittorio Emanuele II, 209), TIM (Piazza Venezia, 2), Iliad (Via del Corso, 282)',
  laundry: 'Self-service laundry: Via Arenula 47',
  luggage: 'Radical Storage at Largo di Torre Argentina (5 min)',

  // Transport
  transport:
    'Tram 8 (Arenula/Cairoli) → Trastevere or Piazza Venezia. Bus 40/64 → Termini & Vatican. Taxi: +39 06 3570 or FreeNow app.',
  airports:
    'Fiumicino: Tram 8 → Trastevere → FL1 train (~45 min). Ciampino: Terravision bus or taxi. Private transfer: Welcome Pickups.',

  // Safety
  emergency:
    'EU Emergency 112 • Police 113 • Ambulance 118 • Fire 115 • English doctor +39 06 488 2371 • 24h vet +39 06 660 681',

  // Eat/Drink/See
  eat:
    'Roscioli; Emma Pizzeria; Ditirambo; Osteria da Fortunata; Pianostrada; Forno Campo de’ Fiori; Gelateria del Teatro.',
  drink:
    'Caffè Camerino (Largo Arenula 30); Irish Pub (Largo Argentina); Modius Radisson Rooftop.',
  shop:
    'Via Arenula delis/bakeries/gelato; Piazza Costaguti fish market; Forno Boccione; Mercato Monti (weekends).',
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

// ---------- DIZIONARIO MULTILINGUA ----------
const UI = {
  en: {
    langLabel: 'Language',
    welcome: 'Hi, I am Samantha, your virtual assistant. Tap a button to get a quick answer.',
    inputPH: 'Type a message… e.g., wifi, gas, transport',
    buttons: ['wifi','check in','check out','water','bathroom','gas','eat','drink','shop','visit','experience','day trips','transport','services','emergency'],
    sections: {
      wifi: (a)=>`Wi-Fi: ${a.wifi_note}\nNetwork: ${a.wifi_ssid}. Password: ${a.wifi_password}.`,
      'check in': (a)=>`Check-in from ${a.checkin_time}.\nIntercom: ${a.intercom_code}.\nMain door: ${a.main_door_hours}.\nConcierge: ${a.concierge}.\nNeed help? Call ${a.host_phone}.`,
      'check out': (a)=>a.checkout_note,
      water: (a)=>a.water_note,
      bathroom: (a)=>`Bathroom: ${a.bathroom_amenities}\nTowels: ${a.towels_note}`,
      gas: (a)=>`Gas use: ${a.gas_steps}`,
      eat: (a)=>a.eat,
      drink: (a)=>a.drink,
      shop: (a)=>a.shop,
      visit: (a)=>a.visit,
      experience: (a)=>a.experiences,
      'day trips': (a)=>a.daytrips,
      transport: (a)=>`${a.transport}\nAirports: ${a.airports}`,
      services: (a)=>`Pharmacy: ${a.pharmacy}\nHospital: ${a.hospital}\nATMs: ${a.atms}\nSIMs: ${a.sims}\nLaundry: ${a.laundry}\nLuggage: ${a.luggage}`,
      emergency: (a)=>a.emergency
    },
    voices: ['en-US','en-GB','en'] // preferenze tag voce
  },
  es: {
    langLabel: 'Idioma',
    welcome: 'Hola, soy Samantha, tu asistente virtual. Toca un botón para obtener una respuesta rápida.',
    inputPH: 'Escribe… p. ej., wifi, gas, transporte',
    buttons: ['wifi','check in','check out','agua','baño','gas','comer','beber','compras','visitar','experiencias','excursiones','transporte','servicios','emergencia'],
    sections: {
      wifi: (a)=>`Wi-Fi: ${a.wifi_note}\nRed: ${a.wifi_ssid}. Contraseña: ${a.wifi_password}.`,
      'check in': (a)=>`Check-in desde las ${a.checkin_time}.\nPortero: ${a.intercom_code}.\nPuerta principal: ${a.main_door_hours}.\nConserje: ${a.concierge}.\n¿Necesitas ayuda? Llama al ${a.host_phone}.`,
      'check out': (a)=>'Antes de salir: apaga luces/AC, cierra ventanas, deja las llaves en la mesa, cierra la puerta suavemente.',
      agua: (a)=>'El agua del grifo es potable. El agua caliente está siempre disponible.',
      baño: (a)=>`Baño: papel higiénico, jabón de manos, alfombrilla, secador.\nToallas: por huésped, 1 grande + 1 mediana. La cama está preparada.`,
      gas: (a)=>'Válvula: horizontal=abierta, vertical=cerrada. Elige el fogón. Enciende cerilla/encendedor. Gira y mantén pulsado el mando negro hasta que la llama sea estable, luego suelta.',
      comer: (a)=>a.eat,
      beber: (a)=>a.drink,
      compras: (a)=>a.shop,
      visitar: (a)=>a.visit,
      experiencias: (a)=>a.experiences,
      excursiones: (a)=>a.daytrips,
      transporte: (a)=>`${a.transport}\nAeropuertos: ${a.airports}`,
      servicios: (a)=>`Farmacia: ${a.pharmacy}\nHospital: ${a.hospital}\nCajeros: ${a.atms}\nSIM: ${a.sims}\nLavandería: ${a.laundry}\nConsigna: ${a.luggage}`,
      emergencia: (a)=>a.emergency
    },
    voices: ['es-ES','es'] 
  },
  fr: {
    langLabel: 'Langue',
    welcome: 'Bonjour, je suis Samantha, votre assistante virtuelle. Touchez un bouton pour une réponse rapide.',
    inputPH: 'Écrivez… ex. wifi, gaz, transport',
    buttons: ['wifi','check in','check out','eau','salle de bain','gaz','manger','boire','shopping','visiter','expériences','excursions','transports','services','urgence'],
    sections: {
      wifi: (a)=>`Wi-Fi : ${a.wifi_note}\nRéseau : ${a.wifi_ssid}. Mot de passe : ${a.wifi_password}.`,
      'check in': (a)=>`Arrivée à partir de ${a.checkin_time}.\nInterphone : ${a.intercom_code}.\nPorte principale : ${a.main_door_hours}.\nConcierge : ${a.concierge}.\nBesoin d’aide ? ${a.host_phone}.`,
      'check out': (a)=>'Avant de partir : éteindre lumières/clim, fermer les fenêtres, laisser les clés sur la table, fermer doucement la porte.',
      eau: (a)=>'L’eau du robinet est potable. L’eau chaude est toujours disponible.',
      'salle de bain': (a)=>`Salle de bain : papier toilettes, savon mains, tapis, sèche-cheveux.\nServiettes : 1 grande + 1 moyenne par personne. Lit prêt à l’arrivée.`,
      gaz: (a)=>'Vanne gaz : horizontale=ouvert, verticale=fermé. Choisir le brûleur. Allumer une allumette. Tourner et maintenir le bouton noir jusqu’à flamme stable, puis relâcher.',
      manger: (a)=>a.eat,
      boire: (a)=>a.drink,
      shopping: (a)=>a.shop,
      visiter: (a)=>a.visit,
      expériences: (a)=>a.experiences,
      excursions: (a)=>a.daytrips,
      transports: (a)=>`${a.transport}\nAéroports : ${a.airports}`,
      services: (a)=>`Pharmacie : ${a.pharmacy}\nHôpital : ${a.hospital}\nDAB : ${a.atms}\nSIM : ${a.sims}\nLaverie : ${a.laundry}\nConsigne : ${a.luggage}`,
      urgence: (a)=>a.emergency
    },
    voices: ['fr-FR','fr']
  },
  de: {
    langLabel: 'Sprache',
    welcome: 'Hallo, ich bin Samantha, Ihre virtuelle Assistentin. Tippen Sie auf einen Button für eine schnelle Antwort.',
    inputPH: 'Schreiben… z. B. WLAN, Gas, Transport',
    buttons: ['wifi','check in','check out','wasser','bad','gas','essen','trinken','shopping','besuchen','erlebnisse','ausflüge','verkehr','dienste','notfall'],
    sections: {
      wifi: (a)=>`WLAN: ${a.wifi_note}\nNetzwerk: ${a.wifi_ssid}. Passwort: ${a.wifi_password}.`,
      'check in': (a)=>`Check-in ab ${a.checkin_time}.\nSprechanlage: ${a.intercom_code}.\nHaupteingang: ${a.main_door_hours}.\nHausmeister: ${a.concierge}.\nHilfe? ${a.host_phone}.`,
      'check out': (a)=>'Vor dem Gehen: Licht/Klima aus, Fenster schließen, Schlüssel auf den Tisch, Tür sanft schließen.',
      wasser: (a)=>'Leitungswasser ist trinkbar. Warmwasser ist immer verfügbar.',
      bad: (a)=>`Bad: Toilettenpapier, Handseife, Badematte, Föhn.\nHandtücher: pro Gast 1 groß + 1 mittel. Bett ist vorbereitet.`,
      gas: (a)=>'Gas: Hebel waagrecht=auf, senkrecht=zu. Brenner wählen. Streichholz/Feuerzeug. Knopf drücken & drehen bis Flamme stabil, dann loslassen.',
      essen: (a)=>a.eat,
      trinken: (a)=>a.drink,
      shopping: (a)=>a.shop,
      besuchen: (a)=>a.visit,
      erlebnisse: (a)=>a.experiences,
      ausflüge: (a)=>a.daytrips,
      verkehr: (a)=>`${a.transport}\nFlughäfen: ${a.airports}`,
      dienste: (a)=>`Apotheke: ${a.pharmacy}\nKrankenhaus: ${a.hospital}\nGeldautomaten: ${a.atms}\nSIM: ${a.sims}\nWäscherei: ${a.laundry}\nGepäck: ${a.luggage}`,
      notfall: (a)=>a.emergency
    },
    voices: ['de-DE','de']
  },
  it: {
    langLabel: 'Lingua',
    welcome: 'Ciao, sono Samantha, la tua assistente virtuale. Tocca un pulsante per una risposta rapida.',
    inputPH: 'Scrivi… es. wifi, gas, trasporti',
    buttons: ['wifi','check in','check out','acqua','bagno','gas','mangiare','bere','shopping','visitare','esperienze','gite','trasporti','servizi','emergenza'],
    sections: {
      wifi: (a)=>`Wi-Fi: ${a.wifi_note}\nRete: ${a.wifi_ssid}. Password: ${a.wifi_password}.`,
      'check in': (a)=>`Check-in dalle ${a.checkin_time}.\nCitofono: ${a.intercom_code}.\nPortone: ${a.main_door_hours}.\nPortiere: ${a.concierge}.\nServe aiuto? ${a.host_phone}.`,
      'check out': (a)=>'Prima di uscire: spegni luci/AC, chiudi le finestre, lascia le chiavi sul tavolo, chiudi la porta delicatamente.',
      acqua: (a)=>'L’acqua del rubinetto è potabile. L’acqua calda è sempre disponibile.',
      bagno: (a)=>`Bagno: carta igienica, sapone mani, tappetino, asciugacapelli.\nAsciugamani: per ospite 1 grande + 1 medio. Il letto è pronto.`,
      gas: (a)=>'Valvola gas: orizzontale=aperto, verticale=chiuso. Scegli il fornello. Accendi fiammifero/accendino. Gira e tieni premuto il pomello nero finché la fiamma è stabile, poi rilascia.',
      mangiare: (a)=>a.eat,
      bere: (a)=>a.drink,
      shopping: (a)=>a.shop,
      visitare: (a)=>a.visit,
      esperienze: (a)=>a.experiences,
      gite: (a)=>a.daytrips,
      trasporti: (a)=>`${a.transport}\nAeroporti: ${a.airports}`,
      servizi: (a)=>`Farmacia: ${a.pharmacy}\nOspedale: ${a.hospital}\nBancomat: ${a.atms}\nSIM: ${a.sims}\nLavanderia: ${a.laundry}\nDeposito bagagli: ${a.luggage}`,
      emergenza: (a)=>a.emergency
    },
    voices: ['it-IT','it']
  }
};

// ---------- INTENT DETECTION (per lingua) ----------
function norm(s){ return (s||'').toLowerCase().replace(/\s+/g,' ').trim(); }
function detectIntent(lang, message){
  const labels = UI[lang].buttons;
  const t = norm(message);
  // match per parola esatta su etichetta o sinonimi principali EN
  for (const label of labels){
    const key = norm(label);
    if (t.includes(key)) return label; // es. "acqua" in IT
  }
  // fallback: controlla alcune parole chiave comuni
  const map = {
    wifi:['wifi','wi-fi','internet'],
    gas:['gas','cook','fornello','cocinar','gaz'],
  };
  for (const [intent, arr] of Object.entries(map)){
    if (arr.some(k=>t.includes(k))) return intent;
  }
  return null;
}

// ---------- AI (opzionale) ----------
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const client = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

async function polish(raw, userMsg, lang){
  if (!client) return raw;
  const sys = `You are a concise apartment assistant. ALWAYS answer in ${lang}. Keep facts as given; do not invent.`;
  try{
    const r = await client.responses.create({
      model: OPENAI_MODEL,
      input: [
        { role:'system', content: sys },
        { role:'developer', content: `Apartment data: ${JSON.stringify(apt)}` },
        { role:'user', content: `Guest asked: ${userMsg}\nDraft answer:\n${raw}` }
      ]
    });
    return r.output_text || raw;
  }catch{ return raw; }
}

// ---------- API ----------
app.post('/api/message', async (req,res)=>{
  const { message='', lang='en' } = req.body || {};
  const L = UI[lang] ? lang : 'en';
  const intent = detectIntent(L, message);
  let raw;
  if (intent && UI[L].sections[intent]) {
    raw = UI[L].sections[intent](apt);
  } else {
    // risposta di fallback nella lingua scelta
    const fallback = {
      en:'I did not find a direct answer. Try a quick button (wifi, gas, transport…).',
      es:'No encontré una respuesta directa. Prueba con un botón rápido (wifi, gas, transporte…).',
      fr:'Je n’ai pas trouvé de réponse directe. Essayez un bouton (wifi, gaz, transports…).',
      de:'Keine direkte Antwort gefunden. Nutzen Sie die Buttons (WLAN, Gas, Verkehr …).',
      it:'Non ho trovato una risposta diretta. Prova i pulsanti rapidi (wifi, gas, trasporti…).'
    }[L];
    raw = fallback;
  }
  const text = await polish(raw, message, L);
  res.json({ text, intent: intent || null, lang: L });
});

// ---------- UI ----------
app.get('/', (req,res)=>{
  const current = (req.query.lang||'en').toLowerCase();
  const L = UI[current] ? current : 'en';

  const langLinks = Object.keys(UI).map(code=>{
    const bold = code===L ? 'style="font-weight:700;text-decoration:underline"' : '';
    const name = {en:'English',es:'Español',fr:'Français',de:'Deutsch',it:'Italiano'}[code];
    return `<a ${bold} href="?lang=${code}">${name}</a>`;
  }).join(' · ');

  const html = `<!doctype html>
<html lang="${L}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Guest Assistant — ${apt.name}</title>
<link rel="icon" type="image/png" href="logo-niceflatinrome.jpg">
<style>
*{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f6f6;color:#1f2937}
.wrap{max-width:780px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e0e0e0;padding:10px 14px}
.h-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.h-left{display:flex;align-items:center;gap:10px}
.brand{font-weight:700;color:#a33}
.apt{margin-left:auto;opacity:.75}
img.logo{height:36px;width:auto;display:block}
.controls{display:flex;gap:10px;margin-top:8px;align-items:center}
.lang{font-size:14px}
#voiceBtn{padding:10px 14px;border:1px solid #2b2118;background:#2b2118;color:#fff;border-radius:12px;cursor:pointer;font-size:15px;font-weight:700}
#voiceBtn[aria-pressed="false"]{background:#fff;color:#2b2118}
main{flex:1;padding:12px}
.msg{max-width:85%;line-height:1.4;border-radius:12px;padding:10px 12px;margin:8px 0;white-space:pre-wrap}
.msg.wd{background:#fff;border:1px solid #e0e0e0}
.msg.me{background:#e8f0fe;border:1px solid #c5d5ff;margin-left:auto}
.quick{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.quick button{border:1px solid #d6c5b8;background:#fff;color:#333;padding:7px 11px;border-radius:12px;cursor:pointer}
.quick button:active{transform:translateY(1px)}
footer{position:sticky;bottom:0;background:#fff;display:flex;gap:8px;padding:10px;border-top:1px solid #e0e0e0}
input{flex:1;padding:12px;border:1px solid #cbd5e1;border-radius:10px;outline:none}
#sendBtn{padding:12px 14px;border:1px solid #2b2118;background:#2b2118;color:#fff;border-radius:10px;cursor:pointer}
.smallmuted{font-size:12px;opacity:.7}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="h-row">
      <div class="h-left">
        <img class="logo" src="logo-niceflatinrome.jpg" alt="NiceFlatInRome">
        <div class="brand">niceflatinrome.com</div>
      </div>
      <div class="apt">Apartment: ${apt.id}</div>
    </div>
    <div class="controls">
      <div class="lang"><b>${UI[L].langLabel}:</b> ${langLinks}</div>
      <button id="voiceBtn" aria-pressed="false" title="Toggle voice">🔇 Voice: Off</button>
    </div>
    <div class="smallmuted">Address: ${apt.address}</div>
  </header>

  <main id="chat" aria-live="polite"></main>

  <footer>
    <input id="input" placeholder="${UI[L].inputPH}" autocomplete="off">
    <button id="sendBtn">Send</button>
  </footer>
</div>

<script>
const LANG='${L}';
const UI=${JSON.stringify(UI)}[LANG];
const chatEl=document.getElementById('chat');
const input=document.getElementById('input');
const sendBtn=document.getElementById('sendBtn');

// ---- VOICE (sceglie automaticamente la voce corretta per lingua) ----
let voiceOn=false, pick=null;
function pickVoice(){
  const all = window.speechSynthesis ? (speechSynthesis.getVoices()||[]) : [];
  // prova per tag preferiti in ordine
  for (const tag of UI.voices){
    const v = all.find(x => x.lang && x.lang.toLowerCase().startsWith(tag.toLowerCase()));
    if (v){ pick=v; return; }
  }
  pick = all[0] || null;
}
if ('speechSynthesis' in window){
  pickVoice(); window.speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(t){
  if(!voiceOn || !('speechSynthesis' in window)) return;
  try{
    const u=new SpeechSynthesisUtterance(t);
    if(pick) u.voice=pick;
    // forza il language tag principale (es. 'fr-FR')
    u.lang = (pick && pick.lang) ? pick.lang : (UI.voices[0] || 'en-US');
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  }catch{}
}
const voiceBtn=document.getElementById('voiceBtn');
voiceBtn.addEventListener('click', e=>{
  voiceOn=!voiceOn;
  e.currentTarget.setAttribute('aria-pressed', String(voiceOn));
  e.currentTarget.textContent = voiceOn ? '🔊 Voice: On' : '🔇 Voice: Off';
  if(voiceOn) speak(''); // niente frase introduttiva
});

// ---- CHAT ----
function add(type, txt){
  const d=document.createElement('div');
  d.className='msg '+(type==='me'?'me':'wd');
  d.textContent=txt;
  chatEl.appendChild(d);
  chatEl.scrollTop=chatEl.scrollHeight;
}

function welcome(){
  add('wd', UI.welcome);
  const q=document.createElement('div'); q.className='quick';
  for(const label of UI.buttons){
    const b=document.createElement('button'); b.textContent=label;
    b.onclick=()=>{ input.value=label; send(); };
    q.appendChild(b);
  }
  chatEl.appendChild(q);
}

async function send(){
  const text=(input.value||'').trim(); if(!text) return;
  add('me',text); input.value='';
  try{
    const r=await fetch('/api/message',{ method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:text, lang: LANG}) });
    const data=await r.json();
    const bot=data.text||'…';
    add('wd',bot);
    // Legge SOLO la risposta (niente prefissi/suffissi)
    speak(bot);
  }catch{
    add('wd','Network error.');
  }
}
sendBtn.addEventListener('click',send);
input.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });

welcome();
</script>
</body></html>`;
  res.setHeader('content-type','text/html; charset=utf-8');
  res.end(html);
});

// ---------- START ----------
const port = process.env.PORT || 8787;
app.listen(port, ()=>console.log('Guest assistant up on http://localhost:'+port));
