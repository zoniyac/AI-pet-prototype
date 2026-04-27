/* ========= 首页交互 ========= */

// 头像下拉菜单
const avatarWrap = document.getElementById("avatarWrap");
avatarWrap.addEventListener("click", (e) => {
  e.stopPropagation();
  avatarWrap.classList.toggle("open");
});
document.addEventListener("click", () => avatarWrap.classList.remove("open"));

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
document.getElementById("lightboxClose").addEventListener("click", () => lightbox.classList.remove("show"));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("show"); });
function openLightbox(src) { lightboxImg.src = src; lightbox.classList.add("show"); }

// 跳转到生成页，带参数
function goToGenerate(params = {}) {
  const query = new URLSearchParams(params).toString();
  location.href = `generate.html${query ? "?" + query : ""}`;
}

/* ===== 渲染横向滚动行 ===== */
function renderRow(rowName, renderCardFn) {
  const section = document.querySelector(`[data-row="${rowName}"]`);
  if (!section) return;
  const track = section.querySelector(".row-track");

  // 渲染卡片
  track.innerHTML = "";
  const items = {
    "hot-images": HOT_IMAGES,
    "hot-videos": HOT_VIDEOS,
    "models": PET_MODELS,
    "scenes": SCENES,
  }[rowName];

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "scroll-card";
    card.innerHTML = renderCardFn(item);
    track.appendChild(card);

    // 点击事件：卡片主体 → Lightbox；hover 按钮 → 跳生成
    card.addEventListener("click", (e) => {
      const btn = e.target.closest(".hover-btn");
      if (btn) {
        e.stopPropagation();
        const action = btn.dataset.act;
        const params = { from: rowName, id: item.id };
        if (rowName === "models") params.petId = item.id;
        if (rowName === "scenes") params.sceneId = item.id;
        if (action === "image") goToGenerate(params);
        if (action === "video") showToast("视频生成即将开放");
        if (action === "same") goToGenerate(params);
        return;
      }
      openLightbox(item.src);
    });
  });

  // 箭头滚动
  const [prev, next] = section.querySelectorAll(".arrow");
  const scrollStep = 400;
  prev.addEventListener("click", () => track.scrollBy({ left: -scrollStep, behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: scrollStep, behavior: "smooth" }));
}

// 爆款图片
renderRow("hot-images", (item) => `
  <img src="${item.src}" alt="爆款图片" />
  <div class="card-hover">
    <div class="card-hover-btns">
      <button class="hover-btn" data-act="same">制作同款</button>
    </div>
  </div>
`);

// 爆款视频（用图片 + 播放图标模拟）
renderRow("hot-videos", (item) => `
  <img src="${item.src}" alt="爆款视频" />
  <div class="play-icon">▶</div>
  <div class="card-hover">
    <div class="card-hover-btns">
      <button class="hover-btn" data-act="same">制作同款</button>
    </div>
  </div>
`);

// 宠物模特
renderRow("models", (item) => `
  <img src="${item.src}" alt="${item.name}" />
  <div class="card-hover">
    <div class="name">${item.name}</div>
    <div class="breed">${item.breed}</div>
    <div class="card-hover-btns">
      <button class="hover-btn" data-act="image">制作图片</button>
      <button class="hover-btn ghost" data-act="video">制作视频</button>
    </div>
  </div>
`);

// 场景
renderRow("scenes", (item) => `
  <img src="${item.src}" alt="${item.name}" />
  <div class="card-hover">
    <div class="name">${item.name}</div>
    <div class="card-hover-btns">
      <button class="hover-btn" data-act="image">制作图片</button>
      <button class="hover-btn ghost" data-act="video">制作视频</button>
    </div>
  </div>
`);

// Hero 视频卡片（占位）
document.querySelectorAll(".video-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("视频生成即将开放，敬请期待");
  });
});

/* ===== toast ===== */
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
