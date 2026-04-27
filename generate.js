/* ========= 图片生成工作台交互 ========= */

// ===== URL 参数 =====
const urlParams = new URLSearchParams(location.search);
const preCategory = urlParams.get("category");
const prePetId = urlParams.get("petId");
const preSceneId = urlParams.get("sceneId");

// ===== 状态 =====
const state = {
  productImage: null,     // dataURL
  activeTab: "pet",       // pet | scene
  subTab: "recommend",    // 子分类
  selectedPet: null,
  selectedScene: null,
  prompt: "",
  isGenerating: false,
  credits: 28,
};

// 如果从场景卡片进入 → 切到场景 tab
if (preSceneId) state.activeTab = "scene";

// ===== Toast =====
const toastEl = document.getElementById("toast");
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2000);
}

// ===== Lightbox =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
document.getElementById("lightboxClose").addEventListener("click", () => lightbox.classList.remove("show"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("show"); });
function openLightbox(src) { lightboxImg.src = src; lightbox.classList.add("show"); }

/* ========= 1. 商品图上传 ========= */
const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const uploadPreview = document.getElementById("uploadPreview");
const previewImg = document.getElementById("previewImg");

uploadBox.addEventListener("click", (e) => {
  if (e.target.closest(".mini-btn")) return;
  fileInput.click();
});
uploadBox.addEventListener("dragover", (e) => { e.preventDefault(); uploadBox.classList.add("drag"); });
uploadBox.addEventListener("dragleave", () => uploadBox.classList.remove("drag"));
uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadBox.classList.remove("drag");
  const f = e.dataTransfer.files[0];
  if (f) handleFile(f);
});
fileInput.addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (f) handleFile(f);
});

function handleFile(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) { toast("仅支持 JPG / PNG / WebP 格式"); return; }
  if (file.size > 10 * 1024 * 1024) { toast("图片大小不能超过 10MB"); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    state.productImage = ev.target.result;
    previewImg.src = state.productImage;
    uploadPlaceholder.hidden = true;
    uploadPreview.hidden = false;
    updateGenerateBtn();
  };
  reader.readAsDataURL(file);
}

document.getElementById("replaceBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.click();
});
document.getElementById("removeBtn").addEventListener("click", (e) => {
  e.stopPropagation();
  state.productImage = null;
  fileInput.value = "";
  uploadPreview.hidden = true;
  uploadPlaceholder.hidden = false;
  updateGenerateBtn();
});

/* ========= 2. 宠物/场景 Tab ========= */
const subTabsEl = document.getElementById("subTabs");
const cardGridEl = document.getElementById("cardGrid");

// 一级 Tab
document.querySelectorAll(".pri-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".pri-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    state.activeTab = tab.dataset.ptab;
    state.subTab = "recommend";
    renderSubTabs();
    renderCardGrid();
  });
});

// 子分类 Tab 配置
const SUB_TABS = {
  pet: [
    { key: "recommend", name: "推荐" },
    { key: "cat", name: "猫" },
    { key: "dog", name: "狗" },
  ],
  scene: [
    { key: "recommend", name: "推荐" },
    { key: "indoor", name: "室内" },
    { key: "outdoor", name: "户外" },
    { key: "solid", name: "纯色背景" },
  ],
};

function renderSubTabs() {
  const tabs = SUB_TABS[state.activeTab];
  subTabsEl.innerHTML = tabs
    .map((t) => `<button class="sub-tab ${t.key === state.subTab ? "active" : ""}" data-sub="${t.key}">${t.name}</button>`)
    .join("");
  subTabsEl.querySelectorAll(".sub-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.subTab = btn.dataset.sub;
      renderSubTabs();
      renderCardGrid();
    });
  });
}

function filterItems() {
  if (state.activeTab === "pet") {
    if (state.subTab === "recommend") return PET_MODELS;
    return PET_MODELS.filter((p) => p.type === state.subTab);
  } else {
    if (state.subTab === "recommend") return SCENES;
    return SCENES.filter((s) => s.category === state.subTab);
  }
}

function renderCardGrid() {
  const items = filterItems();
  const selectedId = state.activeTab === "pet"
    ? (state.selectedPet && state.selectedPet.id)
    : (state.selectedScene && state.selectedScene.id);

  cardGridEl.innerHTML = items
    .map(
      (item) => `
        <div class="grid-card ${item.id === selectedId ? "selected" : ""}" data-id="${item.id}">
          <img src="${item.src}" alt="${item.name || ""}" />
          <div class="check"><svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6.5L5 8.5 9 4"/></svg></div>
          <div class="card-name">${item.name || ""}${item.breed ? " · " + item.breed : ""}</div>
        </div>`
    )
    .join("");

  cardGridEl.querySelectorAll(".grid-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const item = items.find((x) => x.id === id);
      if (state.activeTab === "pet") state.selectedPet = item;
      else state.selectedScene = item;
      renderCardGrid();
      updateGenerateBtn();
    });
  });
}

/* ========= 3. 生成按钮 & 提示词 ========= */
const btnGenerate = document.getElementById("btnGenerate");
const btnPrompt = document.getElementById("btnPrompt");
const promptBox = document.getElementById("promptBox");
const promptInput = document.getElementById("promptInput");
const promptCount = document.getElementById("promptCount");

btnPrompt.addEventListener("click", () => {
  const show = promptBox.hidden;
  promptBox.hidden = !show;
  btnPrompt.classList.toggle("active", show);
});
promptInput.addEventListener("input", (e) => {
  state.prompt = e.target.value;
  promptCount.textContent = e.target.value.length;
});

function updateGenerateBtn() {
  const ready = state.productImage && state.selectedPet && state.selectedScene;
  btnGenerate.disabled = !ready && !state.isGenerating;
}

btnGenerate.addEventListener("click", () => {
  if (state.isGenerating) return;
  if (!state.productImage) { toast("请先上传商品图"); return; }
  if (!state.selectedPet) { toast("请选择一个宠物模特"); return; }
  if (!state.selectedScene) { toast("请选择一个场景"); return; }
  if (state.credits < 2) {
    toast("积分不足，请充值");
    return;
  }
  // mock 未登录判断：第一次点击触发登录
  if (!localStorage.getItem("logged_in")) {
    document.getElementById("loginModal").hidden = false;
    return;
  }
  startGenerate();
});

// 登录弹窗
document.getElementById("loginClose").addEventListener("click", () => {
  document.getElementById("loginModal").hidden = true;
});
document.getElementById("loginSubmit").addEventListener("click", () => {
  localStorage.setItem("logged_in", "1");
  document.getElementById("loginModal").hidden = true;
  toast("登录成功，新用户赠送 10 积分");
  startGenerate();
});

/* ========= 4. 生成流程 ========= */
const stateEmpty = document.getElementById("stateEmpty");
const stateLoading = document.getElementById("stateLoading");
const stateDone = document.getElementById("stateDone");
const progressBar = document.getElementById("progressBar");
const loadingText = document.getElementById("loadingText");

function switchState(name) {
  stateEmpty.hidden = name !== "empty";
  stateLoading.hidden = name !== "loading";
  stateDone.hidden = name !== "done";
}

function startGenerate() {
  state.isGenerating = true;
  btnGenerate.disabled = true;
  btnGenerate.innerHTML = `<span class="loading-mini">生成中...</span>`;
  switchState("loading");

  // 模拟进度（总耗时约 5s，真实场景 30s）
  let pct = 0;
  const totalTime = 5000;
  const start = Date.now();
  const timer = setInterval(() => {
    const elapsed = Date.now() - start;
    pct = Math.min(99, (elapsed / totalTime) * 100);
    progressBar.style.width = pct + "%";
    if (pct > 60) loadingText.textContent = "正在调整构图和光影...";
    if (pct > 85) loadingText.textContent = "就快好了，宠物正在摆 pose...";
  }, 100);

  setTimeout(() => {
    clearInterval(timer);
    progressBar.style.width = "100%";
    finishGenerate();
  }, totalTime);
}

function finishGenerate() {
  // 扣积分
  state.credits -= 2;
  document.getElementById("creditsLeft").textContent = state.credits;

  // 随机取 2 张结果
  const pool = [...MOCK_RESULT_POOL].sort(() => Math.random() - 0.5);
  const imgs = document.querySelectorAll(".result-img");
  imgs[0].src = pool[0];
  imgs[1].src = pool[1];

  state.isGenerating = false;
  btnGenerate.innerHTML = `<span class="btn-label">开始生成</span><span class="cost">-2 积分</span>`;
  updateGenerateBtn();
  switchState("done");
}

// 重新生成
document.getElementById("btnRegen").addEventListener("click", () => {
  if (state.credits < 2) { toast("积分不足"); return; }
  startGenerate();
});

// 结果卡片操作
document.querySelectorAll(".result-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    const btn = e.target.closest(".res-btn");
    const img = card.querySelector(".result-img");
    if (!btn) {
      // 点击卡片本身 → 预览
      openLightbox(img.src);
      return;
    }
    e.stopPropagation();
    const act = btn.dataset.act;
    if (act === "preview") openLightbox(img.src);
    if (act === "download") {
      // 模拟下载
      const a = document.createElement("a");
      a.href = img.src;
      a.download = `pet-ai-${Date.now()}.jpg`;
      a.target = "_blank";
      a.click();
      toast("已触发下载");
    }
    if (act === "favorite") {
      btn.classList.toggle("faved");
      btn.textContent = btn.classList.contains("faved") ? "已收藏" : "收藏";
      toast(btn.classList.contains("faved") ? "已收藏到我的作品" : "已取消收藏");
    }
  });
});

/* ========= 初始化：处理从首页带来的参数 ========= */
function init() {
  // 预选 tab
  document.querySelectorAll(".pri-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.ptab === state.activeTab);
  });

  // 预选宠物
  if (prePetId) {
    const pet = PET_MODELS.find((p) => p.id === prePetId);
    if (pet) {
      state.selectedPet = pet;
      state.activeTab = "pet";
      state.subTab = pet.type;
    }
  }
  // 预选场景
  if (preSceneId) {
    const scene = SCENES.find((s) => s.id === preSceneId);
    if (scene) {
      state.selectedScene = scene;
      state.activeTab = "scene";
      state.subTab = scene.category;
    }
  }
  // 品类参数（暂未和模特绑定，仅演示）
  if (preCategory) {
    toast(`已根据「${{ toy: "宠物玩具", travel: "宠物出行", home: "宠物居家" }[preCategory] || preCategory}」预置推荐`);
  }

  renderSubTabs();
  renderCardGrid();
  updateGenerateBtn();
}
init();
