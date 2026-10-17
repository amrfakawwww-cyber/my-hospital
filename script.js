
const $ = (id) => document.getElementById(id);


function showMessage(elementId, text, type) {
  const el = $(elementId);
  el.className = "msg " + type;     
  el.textContent = text;
}

function goToBooking(department, doctor = "") {
  $("dept").value = department;
  fillDoctorSelect();
  $("doc").value = doctor;
  $("book").scrollIntoView();
}


function renderDepartments() {

  $("deptList").innerHTML = departments.map(([icon, name, desc]) => `
    <div class="card">
      <div class="ic">${icon}</div>
      <h3>${name}</h3>
      <p>${desc}</p>
      <button data-dept="${name}">احجز</button>
    </div>
  `).join("");


  $("dept").innerHTML =
    '<option value="">اختر القسم</option>' +
    departments.map(([, name]) => `<option>${name}</option>`).join("");


  $("deptList").onclick = (e) => {
    const dept = e.target.dataset.dept;
    if (dept) goToBooking(dept);
  };
}

let currentCategory = "الكل";  

function renderTabs() {
  const categories = ["الكل", ...new Set(doctors.map((d) => d[2]))];

  $("tabs").innerHTML = categories.map((c) =>
    `<button class="${c === currentCategory ? "on" : ""}">${c}</button>`
  ).join("");

  $("tabs").onclick = (e) => {
    if (e.target.tagName !== "BUTTON") return;
    currentCategory = e.target.textContent;
    renderTabs();
    renderDoctors();
  };
}

function renderDoctors() {
  const query = $("search").value.trim();


  const result = doctors.filter(([name, , dept]) =>
    (currentCategory === "الكل" || dept === currentCategory) &&
    name.includes(query)
  );

  if (result.length === 0) {
    $("docList").innerHTML = '<p class="subtitle">لا توجد نتائج</p>';
    return;
  }

  $("docList").innerHTML = result.map(([name, title, dept, years]) => `
    <div class="card">
      <div class="ic">👨‍⚕️</div>
      <h3>${name}</h3>
      <p>${title}</p>
      <p>خبرة ${years} سنة</p>
      <button data-doc="${name}" data-dept="${dept}">احجز معه</button>
    </div>
  `).join("");
}

function setupDoctors() {
  renderTabs();
  renderDoctors();
  $("search").oninput = renderDoctors;

  $("docList").onclick = (e) => {
    const doc = e.target.dataset.doc;
    if (doc) goToBooking(e.target.dataset.dept, doc);
  };
}



function renderReviews() {
  $("revList").innerHTML = reviews.map(([name, text, stars]) => `
    <div class="card">
      <div class="stars">${"★".repeat(stars)}${"☆".repeat(5 - stars)}</div>
      <p>"${text}"</p>
      <h3>${name}</h3>
    </div>
  `).join("");
}

function renderFaqs() {
  $("faqList").innerHTML = faqs.map(([q, a]) => `
    <details><summary>${q}</summary><p>${a}</p></details>
  `).join("");
}



function setupCounters() {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      countUp(entry.target);
    });
  });

  document.querySelectorAll(".number").forEach((n) => observer.observe(n));
}

function countUp(el) {
  const target = +el.dataset.number;
  const step = Math.ceil(target / 60);
  let value = 0;

  const timer = setInterval(() => {
    value = Math.min(value + step, target);
    el.textContent = value.toLocaleString("ar-EG");
    if (value >= target) clearInterval(timer);
  }, 25);
}


function fillDoctorSelect() {
  const dept = $("dept").value;
  $("doc").innerHTML =
    '<option value="">أي طبيب متاح</option>' +
    doctors.filter((d) => d[2] === dept)
           .map((d) => `<option>${d[0]}</option>`).join("");
}

function setupBookingForm() {

  $("date").min = new Date().toISOString().split("T")[0];
  $("dept").onchange = fillDoctorSelect;

  $("bookForm").onsubmit = (e) => {
    e.preventDefault();

    const phone = $("phone").value.trim();


    if (!/^[0-9+ ]{8,15}$/.test(phone))
      return showMessage("bookMsg", "رقم الهاتف غير صحيح", "err");
    if (!$("dept").value)
      return showMessage("bookMsg", "من فضلك اختر القسم", "err");
    if (!$("time").value)
      return showMessage("bookMsg", "من فضلك اختر الوقت", "err");

    showMessage("bookMsg",
      `تم الحجز يا ${$("name").value} — ${$("dept").value} — ${$("date").value} الساعة ${$("time").value}`,
      "ok");
    e.target.reset();

  };
}



function setupContactForm() {
  $("contactForm").onsubmit = (e) => {
    e.preventDefault();
    showMessage("contactMsg", "تم استلام رسالتك، شكرًا لك", "ok");
    e.target.reset();
  };
}


function setupUI() {

  $("menuBtn").onclick = () => $("menu").classList.toggle("open");
  $("menu").onclick    = () => $("menu").classList.remove("open");


  $("themeBtn").onclick = () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  };


  addEventListener("scroll", () => {
    $("topBtn").style.display = scrollY > 400 ? "block" : "none";
  });
  $("topBtn").onclick = () => scrollTo({ top: 0 });
}



renderDepartments();
setupDoctors();
renderReviews();
renderFaqs();
setupCounters();
setupBookingForm();
setupContactForm();
setupUI();