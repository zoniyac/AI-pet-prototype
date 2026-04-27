/* ========= Mock 数据（首页 + 工作台共用） ========= */

// 工具：Unsplash 随机图
function u(seed, w = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${w}`;
}

// 爆款图片
const HOT_IMAGES = [
  { id: "img-1", src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600", category: "food" },
  { id: "img-2", src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600", category: "food" },
  { id: "img-3", src: "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600", category: "home" },
  { id: "img-4", src: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600", category: "home" },
  { id: "img-5", src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600", category: "travel" },
  { id: "img-6", src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600", category: "travel" },
  { id: "img-7", src: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600", category: "food" },
  { id: "img-8", src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600", category: "home" },
];

// 爆款视频（静态图 + 播放图标模拟）
const HOT_VIDEOS = [
  { id: "v-1", src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600" },
  { id: "v-2", src: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600" },
  { id: "v-3", src: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600" },
  { id: "v-4", src: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=600" },
  { id: "v-5", src: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600" },
  { id: "v-6", src: "https://images.unsplash.com/photo-1625794084867-8ddd239946b1?w=600" },
];

// 宠物模特
const PET_MODELS = [
  { id: "p-1", name: "橘橘", breed: "橘猫", type: "cat", src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" },
  { id: "p-2", name: "奶冻", breed: "布偶猫", type: "cat", src: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400" },
  { id: "p-3", name: "灰灰", breed: "英短", type: "cat", src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400" },
  { id: "p-4", name: "小白", breed: "美短", type: "cat", src: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400" },
  { id: "p-5", name: "毛毛", breed: "金毛", type: "dog", src: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" },
  { id: "p-6", name: "柴柴", breed: "柴犬", type: "dog", src: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400" },
  { id: "p-7", name: "哈皮", breed: "哈士奇", type: "dog", src: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=400" },
  { id: "p-8", name: "泰迪", breed: "贵宾犬", type: "dog", src: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400" },
  { id: "p-9", name: "咪咪", breed: "暹罗猫", type: "cat", src: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400" },
  { id: "p-10", name: "旺财", breed: "法斗", type: "dog", src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400" },
];

// 场景
const SCENES = [
  { id: "s-1", name: "法式居家", category: "indoor", src: "https://images.unsplash.com/photo-1558882224-dda166733046?w=400" },
  { id: "s-2", name: "户外草坪", category: "outdoor", src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400" },
  { id: "s-3", name: "厨房场景", category: "indoor", src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
  { id: "s-4", name: "温馨阳台", category: "indoor", src: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400" },
  { id: "s-5", name: "简约白底", category: "solid", src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400" },
  { id: "s-6", name: "节日氛围", category: "indoor", src: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400" },
  { id: "s-7", name: "森林户外", category: "outdoor", src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400" },
  { id: "s-8", name: "纯色黑底", category: "solid", src: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400" },
];

// 生成结果（用户点生成时从中随机取 2 张）
const MOCK_RESULT_POOL = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800",
  "https://images.unsplash.com/photo-1561948955-570b270e7c36?w=800",
  "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
  "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800",
];
