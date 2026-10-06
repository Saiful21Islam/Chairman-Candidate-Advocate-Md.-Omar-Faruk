// ১. ১ থেকে ৯ নম্বর ওয়ার্ডের তালিকা
const wards = Array.from({ length: 9 }, (_, i) => `${i + 1} নং ওয়ার্ড`);

// ২. বিষয়/ক্যাটাগরি তালিকা (নতুন বিষয় লেখার অপশনসহ)
const categories = [
  "🛣️ রাস্তাঘাট ও যোগাযোগ অবকাঠামো",
  "🚰 সুপেয় পানি ও গভীর নলকূপ",
  "🌊 ড্রেনেজ ব্যবস্থা ও বন্যা/জলাবদ্ধতা",
  "🚫 মাদক নিয়ন্ত্রণ, নিরাপত্তা ও আইনশৃঙ্খলা",
  "🎓 শিক্ষা, যুব সমাজ ও খেলার মাঠ",
  "💡 রাস্তার বাতি (স্ট্রিট লাইট)",
  "🧹 বর্জ্য ব্যবস্থাপনা ও পরিবেশ",
  "➕ অন্যান্য (নিজের মতো নতুন বিষয় লিখুন)"
];

// ৩. জনগণের চাহিদা ও প্রস্তাবিত পরিকল্পনা লিস্ট (ম্যানুয়ালি আপডেটযোগ্য)
let manualPlans = [
  {
    title: "স্বচ্ছ শাসন ও জবাবদিহিতা",
    icon: "fa-scale-balanced",
    desc: "ইউনিয়ন পরিষদের সকল ডিজিটাল সেবা ও সনদপত্র হয়রানিমুক্ত উপায়ে নিশ্চিত করা।"
  },
  {
    title: "টেকসই ড্রেনেজ ও রাস্তাঘাট",
    icon: "fa-road",
    desc: "ওয়ার্ড ভিত্তিক কাঁচা রাস্তা পাকাকরণ ও জলাবদ্ধতা নিরসনে ড্রেনেজ নেটওয়ার্ক তৈরি।"
  },
  {
    title: "সুপেয় পানির নিশ্চয়তা",
    icon: "fa-faucet-drip",
    desc: "প্রতিটি ওয়ার্ডে গভীর নলকূপ স্থাপন ও খাবার পানির সংকট দূর করা।"
  },
  {
    title: "মাদকমুক্ত যুব সমাজ ও খেলাধুলা",
    icon: "fa-shield-heart",
    desc: "তরুণদের খেলাধুলার সুযোগ সৃষ্টি করা এবং মাদকের বিরুদ্ধে কঠোর অবস্থান।"
  }
];

let publicPosts = [
  {
    id: 1,
    name: "আব্দুল্লাহ আল মামুন",
    ward: "৩ নং ওয়ার্ড",
    topic: "🛣️ রাস্তাঘাট ও যোগাযোগ অবকাঠামো",
    title: "বাজার সংলগ্ন প্রধান রাস্তা মেরামত",
    desc: "বর্ষায় বাজারের রাস্তাটি খানাখন্দে ভরে গেছে। দ্রুত সংস্কারের দাবি জানাচ্ছি।",
    upvotes: 18,
    time: "১ ঘণ্টা আগে"
  }
];

// ইউজার মেটাডেটা ক্যাপচার (IP, Location)
let userMetaData = { ip: "অজ্ঞাত IP", location: "অনুমতি দেওয়া হয়নি" };
let currentLang = "bn";

// DOM লোড হলে রান হবে
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown("iWard", wards, "ওয়ার্ড নির্বাচন করুন");
  populateDropdown("vWard", wards, "ওয়ার্ড নির্বাচন করুন");
  populateDropdown("iCat", categories, "বিষয় নির্বাচন করুন");

  renderIdeas();
  renderSchedule();
  renderFeed();
  fetchUserData();
});

// ড্রপডাউন পপুলেট
function populateDropdown(elemId, list, defaultText) {
  const select = document.getElementById(elemId);
  if (!select) return;
  select.innerHTML = `<option value="">${defaultText}</option>`;
  list.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

// কাস্টম বিষয়ের ঘর প্রদর্শন অন/অফ
function checkCustomTopic(val) {
  const box = document.getElementById("customCatBox");
  if (val.includes("নতুন বিষয় লিখুন")) {
    box.classList.remove("hidden");
  } else {
    box.classList.add("hidden");
  }
}

// ম্যানুয়ালি নতুন প্ল্যান যোগ করার ফাংশন
function addNewPlan(title, icon = "fa-lightbulb", desc) {
  manualPlans.unshift({ title, icon, desc });
  renderIdeas();
}

function renderIdeas() {
  const box = document.getElementById("ideas");
  if (!box) return;

  box.innerHTML = manualPlans.map(item => `
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="w-12 h-12 bg-royal-50 rounded-xl flex items-center justify-center text-royal-600 text-xl mb-4">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <h3 class="font-bold text-navy-900 text-lg mb-2">${item.title}</h3>
      <p class="text-slate-600 text-sm">${item.desc}</p>
    </div>
  `).join('');
}

// ইউজার IP ও Geolocation ট্র্যাক
async function fetchUserData() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    userMetaData.ip = data.ip;
  } catch (err) {
    console.log("IP সংগৃহীত হয়নি:", err);
  }

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userMetaData.location = `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`;
      },
      (err) => console.log("লোকেশন অনুমতি মেলেনি:", err.message)
    );
  }
}

// ১১ ডিজিটের বিডি মোবাইল নম্বর ভ্যালিডেশন
function isValidBDPhone(phone) {
  return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(phone);
}

// প্রিভিউ মোডাল
function openPreview() {
  const name = document.getElementById("iName").value.trim();
  const ward = document.getElementById("iWard").value;
  let topic = document.getElementById("iCat").value;

  if (topic.includes("নতুন বিষয় লিখুন")) {
    topic = document.getElementById("iCustomCat").value.trim() || "অন্যান্য কাস্টম বিষয়";
  }

  const title = document.getElementById("iTitle").value.trim();
  const desc = document.getElementById("iDesc").value.trim();

  if (!name || !ward || !topic || !title || !desc) {
    alert("অনুগ্রহ করে ফর্মে তারকাচিহ্নিত (*) সকল ঘর সঠিকভাবে পূরণ করুন।");
    return;
  }

  document.getElementById("pN").textContent = name;
  document.getElementById("pW").textContent = ward;
  document.getElementById("pC").textContent = "বিষয়: " + topic;
  document.getElementById("pT").textContent = title;
  document.getElementById("pD").textContent = desc;

  document.getElementById("pm").classList.remove("hidden");
}

function closePreview() {
  document.getElementById("pm").classList.add("hidden");
}

// ফর্ম জমা নেওয়া
document.getElementById("issueForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  submitIssue();
});

function submitIssue() {
  const name = document.getElementById("iName").value.trim();
  const ward = document.getElementById("iWard").value;
  const phone = document.getElementById("iPhone").value.trim();
  const email = document.getElementById("iEmail").value.trim() || "দেওয়া হয়নি";

  let topic = document.getElementById("iCat").value;
  if (topic.includes("নতুন বিষয় লিখুন")) {
    topic = document.getElementById("iCustomCat").value.trim() || "নতুন নাগরিক প্রস্তাবনা";
  }

  const title = document.getElementById("iTitle").value.trim();
  const desc = document.getElementById("iDesc").value.trim();
  const msg = document.getElementById("iMsg");

  // বিডি মোবাইল নম্বর চেক
  if (!isValidBDPhone(phone)) {
    msg.className = "text-sm font-semibold text-red-600";
    msg.textContent = "❌ অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01869913211)।";
    return;
  }

  // সংগৃহীত ডাটা পে-লোড
  const payload = {
    id: Date.now(),
    name,
    ward,
    phone,
    email,
    topic,
    title,
    desc,
    userIp: userMetaData.ip,
    userLocation: userMetaData.location,
    upvotes: 1,
    time: "এখনই"
  };

  console.log("জমা হওয়া সকল তথ্য (IP, Location সহ):", payload);

  // ফিডে যোগ করা
  publicPosts.unshift(payload);
  renderFeed();

  // স্বয়ংক্রিয়ভাবে চাহিদা ও প্রস্তাবিত পরিকল্পনায় যুক্ত করা
  addNewPlan(title, "fa-star", desc);

  msg.className = "text-sm font-semibold text-green-600";
  msg.textContent = "✅ আপনার নতুন প্রস্তাবনা ও সমস্যা সফলভাবে জমা হয়েছে!";

  document.getElementById("issueForm").reset();
  document.getElementById("customCatBox").classList.add("hidden");
}

// পাবলিক ফিড রেন্ডারিং
function renderFeed() {
  const box = document.getElementById("feedBox");
  const count = document.getElementById("cnt");
  if (!box) return;

  count.textContent = publicPosts.length;
  box.innerHTML = "";

  publicPosts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3";
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-navy-900">${post.name}</h4>
          <span class="text-xs text-royal-600 font-semibold">${post.ward}</span>
        </div>
        <span class="text-xs text-slate-400">${post.time}</span>
      </div>
      <span class="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold inline-block">${post.topic}</span>
      <h5 class="font-bold text-slate-800">${post.title}</h5>
      <p class="text-sm text-slate-600">${post.desc}</p>
      <div class="pt-2 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
        <button onclick="upvote(${post.id})" class="flex items-center gap-1.5 hover:text-royal-600 font-semibold">
          <i class="fa-regular fa-thumbs-up"></i> একমত (${post.upvotes})
        </button>
        <span class="text-slate-400"><i class="fa-solid fa-shield-halved text-green-600 mr-1"></i>ভেরিফাইড নাগরিক</span>
      </div>
    `;
    box.appendChild(card);
  });
}

function upvote(id) {
  const post = publicPosts.find(p => p.id === id);
  if (post) {
    post.upvotes++;
    renderFeed();
  }
}

// সময়সূচি রেন্ডারিং
function renderSchedule() {
  const body = document.getElementById("schBody");
  if (!body) return;

  const meetings = [
    { ward: "১, ২ ও ৩ নং ওয়ারড", date: "১৫ নভেম্বর ...", time: "বিকাল ৪:০০ টা", place: "রাজারকূল হাই স্কুল মাঠ" },
    { ward: "৪, ৫ ও ৬ নং ওয়ার্ড", date: "১৭ নভেম্বর ২০২৬", time: "বিকাল ৪:০০ টা", place: "নূরপাড়া জামে মসজদ সংলগ্ন" },
    { ward: "৭, ৮ ও ৯ নং ওয়ার্ড", date: "১৯ নভেম্বর ২०२६", time: "বিকাল ४:०० टा", place: "मोल्लापाड़ा प्राथमिक विद्यालय" }
  ];

  body.innerHTML = meetings.map(m => `
    <tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="p-3 font-semibold text-navy-900">${m.ward}</td>
      <td class="p-3">${m.date}</td>
      <td class="p-3">${m.time}</td>
      <td class="p-3 text-royal-600 font-medium">${m.place}</td>
    </tr>
  `).join('');
}

// ভাষা পরিবর্তন (Bangla / English)
function toggleLang() {
  currentLang = currentLang === "bn" ? "en" : "bn";
  document.getElementById("langLabel").textContent = currentLang === "bn" ? "English" : "বাংলা";
  document.querySelectorAll("[data-bn]").forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) el.textContent = text;
  });
}

// স্বেচ্ছাসেবক ফর্ম
document.getElementById("volForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("vName").value.trim();
  const phone = document.getElementById("vPhone").value.trim();
  const ward = document.getElementById("vWard").value;

  if (!isValidBDPhone(phone)) {
    alert("অনুগ্রহ করে একটি ১১ ডিজিটের সঠিক মোবাইল নম্বর দিন।");
    return;
  }

  const text = `আসসালামু আলাইকুম, আমি ${name} (${ward})। অ্যাডভোকেট মু. ওমর ফারুক স্যারের নির্বাচনী প্রচারণায় স্বেচ্ছাসেবক হিসেবে কাজ করতে চাই। মোবাইল: ${phone}`;
  window.open(`https://wa.me/8801869913211?text=${encodeURIComponent(text)}`, "_blank");
});