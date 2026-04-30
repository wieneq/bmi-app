# BMI 計算器 PWA

一個快速、美觀且功能完整的身體質量指數 (BMI) 計算器，採用漸進式網頁應用程式 (PWA) 技術開發。

## ✨ 功能特色

- 📊 **精準計算** - 支援公制 (cm/kg) 和英制 (ft/lb) 單位
- 🎨 **美觀介面** - 現代化設計，響應式佈局
- 📱 **PWA 支援** - 可安裝到主畫面，離線也能使用
- 🏥 **台灣標準** - 依據衛生福利部國民健康署 BMI 分類標準
- 🎯 **即時回饋** - 提供健康建議和視覺化 BMI 量表
- ⚡ **快速輕量** - 純前端實作，無需後端伺服器

## 🚀 線上體驗

- **Vercel**: [部署後更新此連結]
- **GitHub Pages**: [部署後更新此連結]

## 📋 BMI 分類標準

| BMI 範圍 | 分類 | 狀態 |
|---------|------|------|
| < 18.5 | 體重過輕 | 🟦 |
| 18.5 - 24.0 | 體重正常 | 🟩 |
| 24.0 - 27.0 | 體重過重 | 🟨 |
| 27.0 - 30.0 | 輕度肥胖 | 🟧 |
| 30.0 - 35.0 | 中度肥胖 | 🟥 |
| ≥ 35.0 | 重度肥胖 | 🔴 |

## 🛠️ 技術架構

- **前端**: 純 HTML5 + CSS3 + JavaScript (ES6+)
- **PWA**: Service Worker + Web App Manifest
- **樣式**: 客製化 CSS，支援暗色模式主題色
- **部署**: Vercel / GitHub Pages

## 📦 本地開發

```bash
# 複製專案
git clone https://github.com/[your-username]/bmi-pwa.git

# 進入目錄
cd bmi-pwa

# 使用任何靜態伺服器運行
# 方法 1: 使用 Python
python -m http.server 8000

# 方法 2: 使用 Node.js (需先安裝 http-server)
npx http-server -p 8000

# 方法 3: 使用 VS Code Live Server 擴充功能
```

然後開啟瀏覽器訪問 `http://localhost:8000`

## 📱 PWA 安裝

1. 使用支援 PWA 的瀏覽器（Chrome、Edge、Safari 等）訪問網站
2. 點擊瀏覽器的「安裝」或「新增到主畫面」提示
3. 應用程式將安裝到你的裝置，可離線使用

## 📄 檔案結構

```
bmi-pwa/
├── index.html          # 主頁面
├── app.js              # 應用程式邏輯
├── style.css           # 樣式表
├── sw.js              # Service Worker
├── manifest.json      # PWA 配置
├── icons/             # 應用程式圖示
│   ├── icon-192.png
│   └── icon-512.png
└── README.md          # 專案說明
```

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📝 授權

MIT License

## 👨‍💻 作者

開發於 2026 年 4 月
