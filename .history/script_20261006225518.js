// ১. ওয়ার্ডের তালিকা (১ থেকে ৯)
const wards = Array.from({ length: 9 }, (_, i) => `${i + 1} নং ওয়ার্ড`);

// ২. ডিফল্ট বিষয় এবং কাস্টম বিষয় যোগ করার সুযোগ
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

// ৩. জনগণের চাহিদা ও প্রস্তাবিত পরিকল্পনার ম্যানুয়াল লিস্ট
let manualPlans = [
  {
    title: "স্বচ্ছ শাসন ও জবাবদিহিতা",
    icon: "fa-scale-balanced",
    desc: "ইউনিয়ন পরিষদের সকল নাগরিক সেবা সহজ ও হয়রানিমুক্ত করা।"
  },
  {
    title: "টেকসই ড্রেনেজ ও রাস্তাঘাট",
    icon: "fa-road",
    desc: "ওয়ার্ড ভিত্তিক জরাজীর্ণ রাস্তা সংস্কার ও ড্রেনেজ নেটওয়ার্ক গঠন।"
  },
  {
    title: "সুপেয় পানির নিশ্চয়তা",
    icon: "fa-faucet-drip",
    desc: "প্রতিটি ওয়াডে আর্সেনিকমুক্ত গভীর নলকূপ স্থাপন করা।"
  }
];

let publicPosts = [];

// ইউজার ট্র্যাক ডেটা
let userMetaData = { ip: "অজ্ঞাত IP", location: "অনুমতি দেওয়া হয়নি" };

document.addEventListener("DOMContentLoaded", () => {
  populateDropdown("iWard", wards, "ওয়ার্ড নির্বাচন করুন");
  populateDropdown("iCat", categories, "বিষয় নির্বাচন করুন");
  
  renderIdeas();
  fetchUserData();
});

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

// কাস্টম বিষয়ের ফিল্ড প্রদর্শন অন/অফ করা
function checkCustomTopic(val) {
  const box = document.getElementById("customCatBox");
  if (val.includes("নতুন বিষয় লিখুন")) {
    box.classList.remove("hidden");
  } else {
    box.classList.add("hidden");
  }
}

// ৪. জনগণের চাহিদা ও প্রস্তাবিত পরিকল্পনা ম্যানুয়ালি যুক্ত করার ফাংশন
function addNewPlan(title, icon = "fa-lightbulb", desc) {
  manualPlans.push({ title, icon, desc });
  renderIdeas(); // সেকশন রিফ্রেশ করা
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

// IP ও লোকেশন সংগ্রহ
async function fetchUserData() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    userMetaData.ip = data.ip;
  } catch (err) { console.log(err); }

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => { userMetaData.location = `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`; },
      (err) => console.log(err.message)
    );
  }
}

function isValidBDPhone(phone) {
  return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(phone);
}

// প্রিভিউ খোলা
function openPreview() {
  const name = document.getElementById("iName").value.trim();
  const ward = document.getElementById("iWard").value;
  let topic = document.getElementById("iCat").value;
  
  if (topic.includes("নতুন বিষয় লিখুন")) {
    topic = document.getElementById("iCustomCat").value.trim() || "অন্যান্য";
  }

  const title = document.getElementById("iTitle").value.trim();
  const desc = document.getElementById("iDesc").value.trim();

  if (!name || !ward || !topic || !title || !desc) {
    alert("অনুগ্রহ করে আবশ্যকীয় সকল ঘর পূরণ করুন।");
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
  const email = document.getElementById("iEmail").value.trim() || "দেওয়া হয়নি";
  
  let topic = document.getElementById("iCat").value;
  if (topic.includes("নতুন বিষয় লিখুন")) {
    topic = document.getElementById("iCustomCat").value.trim() || "নতুন পরামর্শ";
  }

  const title = document.getElementById("iTitle").value.trim();
  const desc = document.getElementById("iDesc").value.trim();
  const msg = document.getElementById("iMsg");

  if (!isValidBDPhone(phone)) {
    msg.className = "text-sm font-semibold text-red-600";
    msg.textContent = "❌ সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01869913211)।";
    return;
  }

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

  console.log("জমা হওয়া সম্পূর্ণ তথ্য:", payload);

  // ১. ফিডে পোস্ট যোগ
  publicPosts.unshift(payload);
  renderFeed();

  // ২. যদি নতুন বিষয়/পরামর্শটি চমৎকার হয় তবে তা ম্যানুয়ালি চাহিদা ও পরিকল্পনায় যোগ করার সুবিধা:
  // উদাহরণস্বরূপ:
  addNewPlan(title, "fa-star", desc);

  msg.className = "text-sm font-semibold text-green-600";
  msg.textContent = "✅ আপনার নতুন প্রস্তাবটি জমা হয়েছে এবং পরিকল্পনা তালিকায় যুক্ত করা হয়েছে!";

  document.getElementById("issueForm").reset();
  document.getElementById("customCatBox").classList.add("hidden");
}

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
    `;
    box.appendChild(card);
  });
}