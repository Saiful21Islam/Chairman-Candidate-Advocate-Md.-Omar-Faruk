// ১. ১ থেকে ৯ নম্বর ওয়ার্ডের তালিকা
const wards = Array.from({ length: 9 }, (_, i) => `${i + 1} নং ওয়ার্ড`);

// ২. নতুন ক্যাটাগরি/বিষয়সমূহ
const categories = [
  "🛣️ রাস্তাঘাট ও যোগাযোগ অবকাঠামো",
  "🚰 সুপেয় পানি ও গভীর নলকূপ",
  "🌊 ড্রেনেজ ব্যবস্থা ও বন্যা/জলাবদ্ধতা",
  "🚫 মাদক নিয়ন্ত্রণ, নিরাপত্তা ও আইনশৃঙ্খলা",
  "🎓 শিক্ষা, যুব সমাজ ও খেলার মাঠ",
  "💡 রাস্তার বাতি (স্ট্রিট লাইট)",
  "🧹 বর্জ্য ব্যবস্থাপনা ও পরিবেশ",
  "💬 অন্যান্য নাগরিক সমস্যা ও প্রস্তাবনা"
];

// ৩. ইনিশিয়াল ফেক/ডেমো ডেটা (জনগণের পোস্ট)
let publicPosts = [
  {
    id: 1,
    name: "মোহাম্মদ রফিক",
    ward: "১ নং ওয়ার্ড",
    topic: "🛣️ রাস্তাঘাট ও যোগাযোগ অবকাঠামো",
    title: "মেইন সড়ক সংস্কার প্রয়োজন",
    desc: "১ নম্বর ওয়ার্ডের প্রধান রাস্তাটি বর্ষার পানিতে নষ্ট হয়ে গেছে। দ্রুত সংস্কার করা প্রয়োজন।",
    upvotes: 12,
    time: "২ ঘণ্টা আগে"
  },
  {
    id: 2,
    name: "আব্দুল করিম",
    ward: "৪ নং ওয়ার্ড",
    topic: "🚰 সুপেয় পানি ও গভীর নলকূপ",
    title: "খাবার পানির তীব্র সংকট",
    desc: "আমাদের এলাকায় খাবার পানির তীব্র সমস্যা। অন্তত ২-৩টি আর্সেনিকমুক্ত নলকূপ স্থাপন দরকার।",
    upvotes: 24,
    time: "৫ ঘণ্টা আগে"
  }
];

// ৪. ইউজার মেটাডেটা ক্যাপচার (IP, Geolocation)
let userMetaData = {
  ip: "অজ্ঞাত IP",
  location: "অনুমতি দেওয়া হয়নি"
};

// ভাষা স্টেট
let currentLang = "bn";

// পেজ লোড হলে রান হবে
document.addEventListener("DOMContentLoaded", () => {
  populateDropdown("iWard", wards, "ওয়ার্ড নির্বাচন করুন");
  populateDropdown("vWard", wards, "ওয়ার্ড নির্বাচন করুন");
  populateDropdown("iCat", categories, "বিষয় নির্বাচন করুন");
  
  renderIdeas();
  renderSchedule();
  renderFeed();
  fetchUserData();
  updateLanguageUI();
});

// ড্রপডাউন অপশন পপুলেট
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

// IP ও লোকেশন ট্র্যাক করার ফাংশন
async function fetchUserData() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    userMetaData.ip = data.ip;
  } catch (err) {
    console.log("IP তথ্য পাওয়া যায়নি:", err);
  }

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userMetaData.location = `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`;
      },
      (err) => {
        console.log("লোকেশন পারমিশন পাওয়া যায়নি:", err.message);
      }
    );
  }
}

// ১১ ডিজিট বিডি নম্বর ভ্যালিডেশন
function isValidBDPhone(phone) {
  const bdRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
  return bdRegex.test(phone);
}

// প্রিভিউ মোডাল
function openPreview() {
  const name = document.getElementById("iName").value.trim();
  const ward = document.getElementById("iWard").value;
  const topic = document.getElementById("iCat").value;
  const title = document.getElementById("iTitle").value.trim();
  const desc = document.getElementById("iDesc").value.trim();

  if (!name || !ward || !topic || !title || !desc) {
    alert("অনুগ্রহ করে ফর্মে তারকাচিহ্নিত (*) ঘরগুলো পূরণ করুন।");
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

// ফর্ম সাবমিশন
document.getElementById("issueForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  submitIssue();
});

function submitIssue() {
  const name = document.getElementById("iName").value.trim();
  const ward = document.getElementById("iWard").value;
  const phone = document.getElementById("iPhone").value.trim();
  const email = document.getElementById("iEmail").value.trim() || "দেওয়া হয়নি";
  const topic = document.getElementById("iCat").value;
  const title = document.getElementById("iTitle").value.trim();
  const desc = document.getElementById("iDesc").value.trim();
  const msg = document.getElementById("iMsg");

  // বিডি মোবাইল নম্বর ফিল্টারিং
  if (!isValidBDPhone(phone)) {
    msg.className = "text-sm font-semibold text-red-600";
    msg.textContent = "❌ অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01869913211)।";
    return;
  }

  // পে-লোড ডাটা
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

  console.log("জমা হওয়া সম্পূর্ণ ডাটা:", payload);

  // পাব্লিক ফিডে এড করা
  publicPosts.unshift(payload);
  renderFeed();

  msg.className = "text-sm font-semibold text-green-600";
  msg.textContent = "✅ আপনার সমস্যা/পরামর্শ সফলভাবে জমা হয়েছে! ধন্যবাদ।";

  document.getElementById("issueForm").reset();
}

// ফিড রেন্ডারিং
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

// আইডিয়া/চাহিদা সেকশন রেন্ডার
function renderIdeas() {
  const box = document.getElementById("ideas");
  if (!box) return;

  const items = [
    { title: "স্বচ্ছ শাসন ও জবাবদিহিতা", icon: "fa-scale-balanced", desc: "ইউনিয়ন পরিষদের সকল সেবা হয়রানিমুক্ত ও ডিজিটাল উপায়ে নিশ্চিত করা।" },
    { title: "টেকসই ড্রেনেজ ও রাস্তাঘাট", icon: "fa-road", desc: "ওয়ার্ড ভিত্তিক সমস্যার তালিকা তৈরি করে অগ্রাধিকার ভিত্তিতে উন্নয়নকাজ বাস্তবায়ন।" },
    { title: "সুপেয় পানি ও স্বাস্থ্যসেবা", icon: "fa-faucet-drip", desc: "প্রতিটি ওয়াডে আর্সেনিকমুক্ত সুপেয় পানির ব্যবস্থা ও ফ্রি মেডিক্যাল ক্যাম্প।" },
    { title: "মাদকমুক্ত যুব সমাজ", icon: "fa-shield-heart", desc: "তরুণদের জন্য খেলার মাঠ, আইটি প্রশিক্ষণ ও সামাজিক কাজে সম্পৃক্তকরণ।" },
    { title: "পরিবেশ ও বর্জ্য ব্যবস্থাপনা", icon: "fa-leaf", desc: "পরিচ্ছন্ন গ্রাম ও পরিবেশবান্ধব রাজারকুল গড়ে তোলার উদ্যোগ।" },
    { title: "জরুরি নাগরিক সুবিধা", icon: "fa-lightbulb", desc: "স্ট্রিট লাইট স্থাপন ও রাতে নিরাপদ চলাচলের সুব্যবস্থা করা।" }
  ];

  box.innerHTML = items.map(item => `
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div class="w-12 h-12 bg-royal-50 rounded-xl flex items-center justify-center text-royal-600 text-xl mb-4">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <h3 class="font-bold text-navy-900 text-lg mb-2">${item.title}</h3>
      <p class="text-slate-600 text-sm">${item.desc}</p>
    </div>
  `).join('');
}

// সময়সূচি রেন্ডার (১-৯ নম্বর ওয়ার্ড)
function renderSchedule() {
  const body = document.getElementById("schBody");
  if (!body) return;

  const meetings = [
    { ward: "১, ২ ও ৩ নং ওয়ার্ড", date: "১৫ নভেম্বর ২০২৬", time: "বিকাল ৪:০০ টা", place: "রাজারকূল হাই স্কুল মাঠ" },
    { ward: "৪, ৫ ও ৬ নং ওয়ার্ড", date: "১৭ নভেম্বর ২০২৬", time: "বিকাল ৪:০০ টা", place: "নূরপাড়া জামে মসজিদ সংলগ্ন" },
    { ward: "৭, ৮ ও ৯ নং ওয়ার্ড", date: "১৯ নভেম্বর ২০২৬", time: "বিকাল ৪:০০ টা", place: "মোল্লাপাড়া প্রাথমিক বিদ্যালয়" }
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
  updateLanguageUI();
}

function updateLanguageUI() {
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

  const text = `আসসালামু আলাইকুম, আমি ${name} (${ward})। অ্যাডভোকেট মু. ওমর ফারুক স্যারের নির্বাচনী প্রচারণায় স্বেচ্ছাসেবক হিসেবে যুক্ত হতে চাই। মোবাইল: ${phone}`;
  window.open(`https://wa.me/8801869913211?text=${encodeURIComponent(text)}`, "_blank");
});