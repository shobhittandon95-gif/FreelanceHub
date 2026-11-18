
const categories = ["Web Development", "Graphic Design", "Writing", "Video Editing"];

const defaultFreelancers = [
  {id: 1, name: "Aarav Sharma", title: "Full-stack web developer", cat: "Web Development", rate: 600, rating: 4.8,
   bio: "4 years building responsive sites and small web apps.", portfolio: ["Cafe ordering website", "Portfolio site for a photographer", "Inventory dashboard"]},
  {id: 2, name: "Meera Iyer", title: "Brand and logo designer", cat: "Graphic Design", rate: 450, rating: 4.9,
   bio: "I design logos, posters and social media kits.", portfolio: ["Logo for a bakery", "College fest poster set", "Instagram template pack"]},
  {id: 3, name: "Rohan Gupta", title: "Blog and SEO writer", cat: "Writing", rate: 300, rating: 4.5,
   bio: "Clear, searchable articles for small businesses.", portfolio: ["30 travel blog posts", "Product descriptions for a store"]},
  {id: 4, name: "Simran Kaur", title: "Video editor", cat: "Video Editing", rate: 500, rating: 4.7,
   bio: "Reels, YouTube edits and event highlight videos.", portfolio: ["Wedding highlight reel", "YouTube channel intro"]},
  {id: 5, name: "Kabir Verma", title: "Front-end developer", cat: "Web Development", rate: 400, rating: 4.2,
   bio: "HTML, CSS and JavaScript landing pages.", portfolio: ["Startup landing page", "Quiz app"]},
  {id: 6, name: "Ananya Das", title: "UI designer", cat: "Graphic Design", rate: 700, rating: 4.6,
   bio: "Mobile app screens and design systems.", portfolio: ["Food delivery app UI", "Banking app redesign"]}
];

function loadData(key, fallback) {
  const text = localStorage.getItem(key);
  if (text === null) {
    return fallback;
  }
  return JSON.parse(text);
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let freelancers = loadData("freelancers", defaultFreelancers);
let projects = loadData("projects", []);
let proposals = loadData("proposals", []);
let me = loadData("me", null);

let role = localStorage.getItem("role");
if (role === null) {
  role = "client";
}
const roleBox = document.getElementById("role");
roleBox.value = role;
roleBox.addEventListener("change", function () {
  localStorage.setItem("role", roleBox.value);
  location.reload();
});

function fillSelect(id, withAll) {
  let options = "";
  if (withAll) {
    options = "<option>All</option>";
  }
  for (let i = 0; i < categories.length; i++) {
    options += "<option>" + categories[i] + "</option>";
  }
  document.getElementById(id).innerHTML = options;
}

function badge(status) {
  const cssName = status.toLowerCase().replace(" ", "-");
  return '<span class="badge ' + cssName + '">' + status + '</span>';
}

function findById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return list[i];
    }
  }
  return null;
}

function showFreelancers() {
  const text = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("cat").value;
  const maxRate = Number(document.getElementById("maxp").value);
  const sortBy = document.getElementById("sort").value;

  const result = [];
  for (let i = 0; i < freelancers.length; i++) {
    const f = freelancers[i];
    const words = (f.name + " " + f.title + " " + f.bio).toLowerCase();
    if (!words.includes(text)) continue;
    if (category !== "All" && f.cat !== category) continue;
    if (maxRate > 0 && f.rate > maxRate) continue;
    result.push(f);
  }

  if (sortBy === "rating") {
    result.sort(function (a, b) { return b.rating - a.rating; });
  } else if (sortBy === "low") {
    result.sort(function (a, b) { return a.rate - b.rate; });
  } else {
    result.sort(function (a, b) { return b.rate - a.rate; });
  }

  let html = "";
  for (let i = 0; i < result.length; i++) {
    const f = result[i];
    let stars = "New";
    if (f.rating > 0) stars = f.rating.toFixed(1);
    html += '<article class="card">' +
      '<div class="row"><h3>' + f.name + '</h3><span>★ ' + stars + '</span></div>' +
      '<p class="muted">' + f.title + '</p>' +
      '<span class="tag">' + f.cat + '</span>' +
      '<p class="rate">₹' + f.rate + '/hr</p>' +
      '<div class="actions">' +
      '<button onclick="viewProfile(' + f.id + ')">View profile</button>' +
      '<button class="primary" onclick="requestFreelancer(' + f.id + ')">Request</button>' +
      '</div></article>';
  }
  if (result.length === 0) {
    html = '<p class="muted">No freelancers match. Try clearing a filter.</p>';
  }
  document.getElementById("list").innerHTML = html;
}

function viewProfile(id) {
  const f = findById(freelancers, id);
  let html = "<h2>" + f.name + "</h2>" +
    '<p class="muted">' + f.title + " | ₹" + f.rate + "/hr</p>" +
    "<p>" + f.bio + "</p><h4>Portfolio</h4><ul>";
  for (let i = 0; i < f.portfolio.length; i++) {
    html += "<li>" + f.portfolio[i] + "</li>";
  }
  html += '</ul><button onclick="closeProfile()">Close</button>';
  const box = document.getElementById("detail");
  box.innerHTML = html;
  box.style.display = "block";
}

function closeProfile() {
  document.getElementById("detail").style.display = "none";
}

function requestFreelancer(id) {
  if (role !== "client") {
    alert("Switch the role to Client to send a request.");
    return;
  }
  const f = findById(freelancers, id);
  localStorage.setItem("target", f.name);
  localStorage.setItem("targetCat", f.cat);
  location.href = "post-project.html";
}

function submitProject(event) {
  event.preventDefault();
  if (role !== "client") {
    alert("Switch the role to Client to post a project.");
    return;
  }
  const title = document.getElementById("ptitle").value.trim();
  const budget = Number(document.getElementById("pbudget").value);
  const desc = document.getElementById("pdesc").value.trim();

  if (title.length < 5) {
    alert("Title must be at least 5 characters.");
    return;
  }
  if (budget < 100) {
    alert("Budget must be at least ₹100.");
    return;
  }
  if (desc.length < 20) {
    alert("Please describe the project in at least 20 characters.");
    return;
  }

  let target = localStorage.getItem("target");
  if (target === null) {
    target = "";
  }
  const project = {
    id: Date.now(),
    title: title,
    cat: document.getElementById("pcat").value,
    budget: budget,
    deadline: document.getElementById("pdeadline").value,
    desc: desc,
    target: target,
    status: "Open"
  };
  projects.push(project);
  saveData("projects", projects);
  localStorage.removeItem("target");
  location.href = "dashboard.html";
}

function fillProfileForm() {
  if (me !== null) {
    document.getElementById("fname").value = me.name;
    document.getElementById("ftitle").value = me.title;
    document.getElementById("fcat").value = me.cat;
    document.getElementById("frate").value = me.rate;
    document.getElementById("fbio").value = me.bio;
    document.getElementById("fport").value = me.portfolio.join("\n");
  }
  if (role !== "freelancer") {
    document.getElementById("profileNote").hidden = false;
    const form = document.getElementById("profileForm");
    for (let i = 0; i < form.elements.length; i++) {
      form.elements[i].disabled = true;
    }
  }
}

function saveProfile(event) {
  event.preventDefault();
  const lines = document.getElementById("fport").value.split("\n");
  const portfolio = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== "") {
      portfolio.push(lines[i].trim());
    }
  }
  me = {
    id: 99,
    name: document.getElementById("fname").value.trim(),
    title: document.getElementById("ftitle").value.trim(),
    cat: document.getElementById("fcat").value,
    rate: Number(document.getElementById("frate").value),
    rating: 0,
    bio: document.getElementById("fbio").value.trim(),
    portfolio: portfolio
  };
  const others = [];
  for (let i = 0; i < freelancers.length; i++) {
    if (freelancers[i].id !== 99) {
      others.push(freelancers[i]);
    }
  }
  others.push(me);
  saveData("freelancers", others);
  saveData("me", me);
  alert("Profile saved. Clients can now find you in Browse.");
  location.href = "index.html";
}

function saveAll() {
  saveData("projects", projects);
  saveData("proposals", proposals);
}

function showDashboard() {
  if (role === "client") {
    showClientDashboard();
  } else {
    showFreelancerDashboard();
  }
}

function showClientDashboard() {
  let html = "<h2>Client dashboard</h2>";
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    html += '<article class="card"><div class="row"><h3>' + p.title + "</h3>" + badge(p.status) + "</div>" +
      '<p class="muted">' + p.cat + " | Budget ₹" + p.budget + " | Due " + p.deadline;
    if (p.target !== "") {
      html += " | Requested: " + p.target;
    }
    html += "</p><p>" + p.desc + "</p><h4>Proposals</h4>";

    let count = 0;
    for (let j = 0; j < proposals.length; j++) {
      const x = proposals[j];
      if (x.projectId === p.id) {
        count++;
        html += '<div class="prop"><b>' + x.fname + "</b> offers ₹" + x.price + " " + badge(x.status) +
          "<br>" + x.msg + "<br>";
        if (p.status === "Open" && x.status === "Pending") {
          html += '<button onclick="acceptProposal(' + x.id + ')">Accept</button>';
        }
        html += "</div>";
      }
    }
    if (count === 0) {
      html += '<p class="muted">No proposals yet.</p>';
    }
    if (p.status === "In Progress") {
      html += '<button class="primary" onclick="completeProject(' + p.id + ')">Mark completed</button>';
    }
    html += "</article>";
  }
  if (projects.length === 0) {
    html += '<p class="muted">You have no projects yet. Use "Post project" to create one.</p>';
  }
  document.getElementById("dashBody").innerHTML = html;
}

function showFreelancerDashboard() {
  if (me === null) {
    document.getElementById("dashBody").innerHTML =
      '<h2>Freelancer dashboard</h2><p class="note">Create your profile first under "My profile".</p>';
    return;
  }
  let html = "<h2>Freelancer dashboard</h2><h3>Open projects</h3>";
  let openCount = 0;
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    if (p.status !== "Open") continue;
    openCount++;
    html += '<article class="card"><div class="row"><h3>' + p.title + "</h3>" + badge("Open") + "</div>" +
      '<p class="muted">' + p.cat + " | Budget ₹" + p.budget + " | Due " + p.deadline;
    if (p.target !== "") {
      html += " | Requested: " + p.target;
    }
    html += "</p><p>" + p.desc + "</p>";
    if (alreadySent(p.id)) {
      html += '<p class="muted">Proposal sent.</p>';
    } else {
      html += '<div class="inline">' +
        '<input id="price' + p.id + '" type="number" min="1" placeholder="Your price (₹)">' +
        '<input id="msg' + p.id + '" placeholder="Short message to the client">' +
        '<button class="primary" onclick="sendProposal(' + p.id + ')">Send proposal</button></div>';
    }
    html += "</article>";
  }
  if (openCount === 0) {
    html += '<p class="muted">No open projects right now.</p>';
  }

  html += "<h3>My proposals</h3>";
  let mine = 0;
  for (let i = 0; i < proposals.length; i++) {
    const x = proposals[i];
    if (x.fname === me.name) {
      mine++;
      html += '<div class="card"><b>' + findById(projects, x.projectId).title + "</b> | ₹" + x.price + " " + badge(x.status) + "</div>";
    }
  }
  if (mine === 0) {
    html += '<p class="muted">You have not sent any proposals yet.</p>';
  }
  document.getElementById("dashBody").innerHTML = html;
}

function alreadySent(projectId) {
  for (let i = 0; i < proposals.length; i++) {
    if (proposals[i].projectId === projectId && proposals[i].fname === me.name) {
      return true;
    }
  }
  return false;
}

function sendProposal(projectId) {
  const price = Number(document.getElementById("price" + projectId).value);
  const msg = document.getElementById("msg" + projectId).value.trim();
  if (price <= 0 || msg.length < 5) {
    alert("Enter a price and a message of at least 5 characters.");
    return;
  }
  proposals.push({id: Date.now(), projectId: projectId, fname: me.name, price: price, msg: msg, status: "Pending"});
  saveAll();
  showDashboard();
}

function acceptProposal(id) {
  const chosen = findById(proposals, id);
  for (let i = 0; i < proposals.length; i++) {
    if (proposals[i].projectId === chosen.projectId) {
      if (proposals[i].id === id) {
        proposals[i].status = "Accepted";
      } else {
        proposals[i].status = "Rejected";
      }
    }
  }
  findById(projects, chosen.projectId).status = "In Progress";
  saveAll();
  showDashboard();
}

function completeProject(id) {
  findById(projects, id).status = "Completed";
  saveAll();
  showDashboard();
}

if (document.getElementById("list")) {
  fillSelect("cat", true);
  showFreelancers();
  const filterIds = ["search", "cat", "maxp", "sort"];
  for (let i = 0; i < filterIds.length; i++) {
    document.getElementById(filterIds[i]).addEventListener("input", showFreelancers);
  }
}

if (document.getElementById("postForm")) {
  fillSelect("pcat", false);
  const target = localStorage.getItem("target");
  if (target !== null) {
    document.getElementById("targetNote").textContent = "This project is a direct request to " + target + ".";
    document.getElementById("targetNote").hidden = false;
    document.getElementById("pcat").value = localStorage.getItem("targetCat");
  }
  document.getElementById("postForm").addEventListener("submit", submitProject);
}

if (document.getElementById("profileForm")) {
  fillSelect("fcat", false);
  fillProfileForm();
  document.getElementById("profileForm").addEventListener("submit", saveProfile);
}

if (document.getElementById("dashBody")) {
  showDashboard();
}
