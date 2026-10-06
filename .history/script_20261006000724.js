// ====== CONFIG: তথ্যগুলো নিজের প্রয়োজন মতো পরিবর্তন করুন ======
const CONFIG = {
  whatsapp: "880186991391",           // দেশের কোডসহ নম্বর, + ছাড়া
  phone: "+8801869913921",
  email: "you@example.com",
  office: {
    bn: "নির্বাচনী কার্যালয়: রাজারকুল, রামু, কক্সবাজার",
    en: "Campaign Office: Rajarkul, Ramu, Cox's Bazar"
  },
  facebook: "#",
  wards: 9,
  // উঠান বৈঠকের সময়সূচি: {ward:"৩", date:"২০২৬-১০-১২", time:"বিকাল ৪টা", place:"স্থান"}
  schedule: []
};

let lang = 'bn';
const L = (bn, en) => lang === 'bn' ? bn : en;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bnNum = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const $ = id => document.getElementById(id);

const IDEAS = [
  ['fa-eye', 'স্বচ্ছ ইউনিয়ন পরিষদ', 'Transparent Union Parishad', 'বছরে অন্তত একবার উন্মুক্ত বাজেট সভা এবং প্রতিটি প্রকল্পের খরচ প্রকাশ।', 'An open budget meeting every year and public cost of every project.'],
  ['fa-bolt', 'দ্রুত ডিজিটাল সেবা', 'Fast Digital Services', 'সনদ ও নিবন্ধনে হয়রানি ছাড়া নির্দিষ্ট সময়ে সেবা।', 'Certificates and registrations delivered in a fixed time, without hassle.'],
  ['fa-hand-holding-heart', 'ভাতা ও ত্রাণে নিরপেক্ষতা', 'Fair Allowances & Relief', 'তালিকা প্রকাশ্যে যাচাই করে দলমতের ঊর্ধ্বে সুবিধাভোগী নির্বাচন।', 'Beneficiary lists verified in public, above party lines.'],
  ['fa-road', 'রাস্তা ও ড্রেনেজ', 'Roads & Drainage', 'ওয়ার্ডভিত্তিক তালিকা করে ধাপে ধাপে মেরামত।', 'A ward-wise priority list, repaired step by step.'],
  ['fa-ban', 'মাদকমুক্ত রাজারকুল', 'Drug-Free Rajarkul', 'অভিভাবক, যুবক ও মসজিদ কমিটিকে নিয়ে সচেতনতা ও খেলাধুলা।', 'Awareness and sports with parents, youth and mosque committees.'],
  ['fa-laptop-code', 'তরুণদের আইটি ও ফ্রিল্যান্সিং', 'IT & Freelancing for Youth', 'স্থানীয় প্রশিক্ষণ ও কর্মসংস্থানমুখী দক্ষতা কর্মশালা।', 'Local training and job-oriented skill workshops.'],
  ['fa-people-roof', 'নারী ও কিশোরীদের দক্ষতা', 'Skills for Women & Girls', 'সেলাই, হস্তশিল্প, ছোট ব্যবসার প্রশিক্ষণ এবং নির্যাতন প্রতিরোধে সহায়তা।', 'Tailoring, handicraft, small-business training and support against violence.'],
  ['fa-scale-balanced', 'আইনি সহায়তা', 'Legal Help', 'সালিশের মাধ্যমে গ্রাম্য বিরোধ দ্রুত ও ন্যায্যভাবে মেটানোর চেষ্টা।', 'Settling local disputes quickly and fairly through mediation.'],
  ['fa-lightbulb', 'পরিচ্ছন্ন ও নিরাপদ এলাকা', 'Clean & Safe Locality', 'বাজার ও সড়কে আলো, বর্জ্য ব্যবস্থাপনা, দুর্যোগ প্রস্তুতি।', 'Lighting, waste management and disaster preparedness.']
];

function applyLang() {
  document.documentElement.lang = lang;
  $('langLabel').textContent = lang === 'bn' ? 'English' : 'বাংলা';
  document.querySelectorAll('[data-bn]').forEach(el => {
    const t = el.dataset[lang];
    if (el.matches('input,textarea')) el.placeholder = t; else el.textContent = t;
  });
  
  const w = lang === 'bn' ? 'ওয়ার্ড নির্বাচন করুন' : 'Select ward';
  ['iWard', 'vWard'].forEach(id => {
    const s = $(id), v = s.value;
    s.innerHTML = `<option value="">${w}</option>` + Array.from({ length: CONFIG.wards }, (_, i) => `<option value="${i + 1}">${L(bnNum(i + 1) + ' নং ওয়ার্ড', 'Ward ' + (i + 1))}</option>`).join('');
    s.value = v;
  });

  const c = $('iCat'), cv = c.value;
  c.innerHTML = IDEAS.map((x, i) => `<option value="${i}">${x[lang === 'bn' ? 1 : 2]}</option>`).join('') + `<option value="o">${L('অন্যান্য', 'Other')}</option>`;
  c.value = cv || '0';

  $('ideas').innerHTML = IDEAS.map(x => `<div class="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-royal-600 shadow-soft"><div class="w-10 h-10 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center mb-3"><i class="fa-solid ${x[0]}"></i></div><h3 class="font-bold text-navy-900 mb-1">${x[lang === 'bn' ? 1 : 2]}</h3><p class="text-sm text-slate-600">${x[lang === 'bn' ? 3 : 4]}</p></div>`).join('');

  $('schBody').innerHTML = CONFIG.schedule.length ? CONFIG.schedule.map(r => `<tr class="border-b"><td class="p-3">${esc(r.ward)}</td><td class="p-3">${esc(r.date)}</td><td class="p-3">${esc(r.time)}</td><td class="p-3">${esc(r.place)}</td></tr>`).join('') : `<tr><td colspan="4" class="p-5 text-center text-slate-500">${L('সময়সূচি শীঘ্রই প্রকাশ করা হবে।', 'Schedule will be announced soon.')}</td></tr>`;

  $('fOffice').textContent = CONFIG.office[lang];$('fPhone').textContent = CONFIG.phone;
  $('fMail').textContent = CONFIG.email;
  $('fFb').href = CONFIG.facebook;
  $('fWa').href = 'https://wa.me/8801869913921' + CONFIG.whatsapp;

  renderFeed();
}

function toggleLang() {
  lang = lang === 'bn' ? 'en' : 'bn';
  applyLang();
}

const KEY = 'rajarkul_posts';
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch (e) { return [] }
};
const save = d => {
  try { localStorage.setItem(KEY, JSON.stringify(d)) } catch (e) { }
};
const catName = v => v === 'o' ? L('অন্যান্য', 'Other') : IDEAS[v][lang === 'bn' ? 1 : 2];

function renderFeed() {
  const d = load();
  $('cnt').textContent = lang === 'bn' ? bnNum(d.length) : d.length;
  $('feedBox').innerHTML = d.length ? d.map(p => `<div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between gap-4"><div>
    <p class="font-bold text-navy-900">${esc(p.name)}</p>
    <p class="text-xs text-slate-500 mb-2"><i class="fa-solid fa-location-dot text-gold-500 mr-1"></i>${L(bnNum(p.ward) + ' নং ওয়ার্ড', 'Ward ' + p.ward)} · ${esc(catName(p.cat))}</p>
    <p class="font-bold text-sm">${esc(p.title)}</p><p class="text-xs text-slate-700 mt-1">${esc(p.desc)}</p></div>
    <div class="flex justify-between items-center text-xs border-t pt-3"><span class="text-slate-400">${esc(p.date)}</span>
    <button onclick="upvote(${p.id})" class="bg-slate-100 hover:bg-royal-50 px-3 py-1.5 rounded-lg font-semibold" aria-label="support"><i class="fa-solid fa-thumbs-up text-gold-500 mr-1"></i>${p.up}</button></div></div>`).join('')
    : `<p class="col-span-full text-center text-slate-500 py-8">${L('এখনো কোনো পোস্ট নেই। প্রথম পরামর্শটি আপনিই দিন।', 'No posts yet. Be the first to share.')}</p>`;
}

function upvote(id) {
  save(load().map(p => p.id === id ? { ...p, up: p.up + 1 } : p));
  renderFeed();
}

function formData() {
  return {
    name: $('iName').value.trim(),
    ward: $('iWard').value,
    phone: $('iPhone').value.trim(),
    cat: $('iCat').value,
    title: $('iTitle').value.trim(),
    desc: $('iDesc').value.trim()
  }
}

function openPreview() {
  const f = $('issueForm');
  if (!f.reportValidity()) return;
  const d = formData();
  $('pN').textContent = d.name;
  $('pW').textContent = L(bnNum(d.ward) + ' নং ওয়ার্ড', 'Ward ' + d.ward);
  $('pC').textContent = catName(d.cat);$('pT').textContent = d.title;
  $('pD').textContent = d.desc;
  $('pm').classList.remove('hidden');
}

function closePreview() {
  $('pm').classList.add('hidden');
}

function submitIssue() {
  const d = formData();
  save([{ id: Date.now(), name: d.name, ward: d.ward, cat: d.cat, title: d.title, desc: d.desc, up: 1, date: new Date().toISOString().slice(0, 10) }, ...load()]);
  const msg = `${L('নতুন পরামর্শ', 'New suggestion')}\n${d.name} (${d.phone})\n${L('ওয়ার্ড', 'Ward')}: ${d.ward}\n${catName(d.cat)}\n${d.title}\n${d.desc}`;
  $('issueForm').reset();
  renderFeed();
  $('iMsg').innerHTML = `<span class="text-green-700">${L('পোস্ট যুক্ত হয়েছে। সরাসরি আমাদের কাছে পাঠাতে:', 'Posted. To send it to us directly:')}</span> <a class="underline text-green-700" target="_blank" rel="noopener" href="https://wa.me/8801869913921${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}">WhatsApp</a>`;
}

// Event Listeners
$('issueForm').addEventListener('submit', e => {
  e.preventDefault();
  openPreview();
});

$('volForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = `${L('স্বেচ্ছাসেবক হতে চাই', 'I want to volunteer')}\n${$('vName').value} (${$('vPhone').value})\n${L('ওয়ারড', 'Ward')}: ${$('vWard').value}`;
  window.open('https://wa.me/8801869913921' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  e.target.reset();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePreview();
});

// Initialize Application Language
applyLang();