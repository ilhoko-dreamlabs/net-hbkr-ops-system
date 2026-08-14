const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const toast = document.querySelector("[data-toast]");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2800);
}

menuButton?.addEventListener("click", function () {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menu?.classList.toggle("is-open", !open);
});

menu?.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menuButton?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("is-open");
  });
});

window.addEventListener("scroll", function () { header?.classList.toggle("is-scrolled", window.scrollY > 20); }, { passive: true });
document.querySelectorAll("[data-year]").forEach(function (node) { node.textContent = String(new Date().getFullYear()); });

const reveals = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });
  reveals.forEach(function (node) { observer.observe(node); });
} else {
  reveals.forEach(function (node) { node.classList.add("is-visible"); });
}

document.querySelectorAll("[data-tabs]").forEach(function (group) {
  group.querySelectorAll("[data-tab]").forEach(function (button) {
    button.addEventListener("click", function () {
      const target = button.dataset.tab;
      group.querySelectorAll("[data-tab]").forEach(function (item) { item.classList.toggle("is-active", item === button); });
      document.querySelectorAll("[data-tab-panel]").forEach(function (panel) { panel.classList.toggle("is-active", panel.dataset.tabPanel === target); });
    });
  });
});

document.querySelectorAll("form[data-prototype-form]").forEach(function (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showToast("화면 동작 예시입니다. 입력 정보는 저장되거나 전송되지 않습니다.");
  });
});

document.addEventListener("click", function (event) {
  const mock = event.target.closest("[data-mock-action]");
  if (mock) showToast(mock.dataset.mockAction || "현재는 prototype interaction입니다.");
});

const cases = [{"id":"ops1","stage":"업무 범위 확인","title":"제조 Knowledge Agent","signal":"Problem·Data 확인","next":"진행 판단 maker와 45분 Scope Review","offer":"유료 사전 진단 제안 조건 확인","risk":["SSO API 명세 미확인","개인정보 분류 Owner 미정"],"team":["AX 사전 진단 Lead","RAG Architect","Security Reviewer"],"decision":"유료 사전 진단 제안 가능"},{"id":"ops2","stage":"가능성 확인","title":"ERP 견적 업무 흐름","signal":"반복 Volume 확인","next":"현행 견적 승인 Process 인터뷰","offer":"2주 사전 진단 산출물 가설","risk":["ERP 비용 Limit","전자서명 책임 범위"],"team":["Process Analyst","Automation Engineer"],"decision":"AI보다 업무 흐름 정리가 우선"},{"id":"ops3","stage":"수행팀 구성","title":"Local LLM Platform","signal":"Budget·GPU 확보","next":"Platform Lead + Security 역할 Shortlist","offer":"Architecture 사전 진단 후 본 구축","risk":["망분리 반입 절차","상주 인력 승인"],"team":["LLM Platform Lead","MLOps Engineer","Security Lead"],"decision":"한 명보다 수행팀 구성이 적합"}];
const caseList = document.getElementById("opsCases");
function opsEsc(v){return String(v).replace(/[&<>]/g,function(c){return ({"&":"&amp;","<":"&lt;",">":"&gt;"})[c];});}
function renderCaseList(active){caseList.innerHTML=cases.map(function(item){return '<button class="endpoint-button '+(item.id===active?'is-active':'')+'" data-case="'+item.id+'"><span>'+opsEsc(item.stage)+'</span><strong>'+opsEsc(item.title)+'</strong></button>';}).join("");}
function renderCase(id){const item=cases.find(function(v){return v.id===id;})||cases[0];renderCaseList(item.id);document.getElementById("opsDetail").innerHTML='<div class="output-head"><div><p class="subhead">'+opsEsc(item.stage)+'</p><h3>'+opsEsc(item.title)+'</h3></div><span class="tag tag-verified">'+opsEsc(item.decision)+'</span></div><div class="analysis-grid"><div class="analysis-card"><strong>진행 가능성을 보여주는 정보</strong><p>'+opsEsc(item.signal)+'</p></div><div class="analysis-card"><strong>다음 행동</strong><p>'+opsEsc(item.next)+'</p></div><div class="analysis-card"><strong>제안할 유료 서비스</strong><p>'+opsEsc(item.offer)+'</p></div><div class="analysis-card"><strong>확인할 사항과 위험</strong><ul>'+item.risk.map(function(v){return '<li>'+opsEsc(v)+'</li>';}).join("")+'</ul></div></div><div class="drawer-section"><h3>필요한 수행팀 예상</h3><div class="tags">'+item.team.map(function(v){return '<span class="chip">'+opsEsc(v)+'</span>';}).join("")+'</div></div><p class="method-note">Sample 운영 판단입니다. 가격, 계약 주체, 법률·세무·직업소개 관련 구조는 확정되지 않았습니다.</p>';}
document.addEventListener("click",function(event){const button=event.target.closest("[data-case]");if(button)renderCase(button.dataset.case);});
renderCase(cases[0].id);
