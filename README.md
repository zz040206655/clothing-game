# 角色換裝小遊戲 (Clothing Game)

這是一個簡單的網頁版角色換裝遊戲，使用 Golang 作為後端，React 作為前端。

## 技術棧 (Technology Stack)

*   **後端 (Backend):**
    *   **語言:** Golang
    *   **框架:** Gin
*   **前端 (Frontend):**
    *   **框架:** React (with TypeScript)
    *   **建構工具:** Vite
*   **套件管理器 (Package Manager):** npm

## 專案結構 (Project Structure)

```
.
├── assets/         # 存放所有靜態資源，如圖片
├── backend/        # Golang 後端專案
│   ├── go.mod
│   ├── go.sum
│   └── main.go
└── frontend/       # React 前端專案
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## 開發環境設置與啟動

**先決條件:**
*   Go (1.18+ a)
*   Node.js (16.x+)

### 1. 啟動後端伺服器

在一個新的終端機中執行：

```bash
# 進入後端目錄
cd backend

# 啟動 Go 伺服器 (預設運行在 http://localhost:8080)
go run main.go
```

### 2. 啟動前端開發伺服器

在 **另一個** 終端機中執行：

```bash
# 進入前端目錄
cd frontend

# 安裝依賴 (僅需初次執行)
# npm install

# 啟動 Vite 開發伺服器 (預設運行在 http://localhost:5173)
npm run dev
```

### 3. 訪問遊戲

打開您的瀏覽器，訪問 **`http://localhost:5173`**。

Vite 開發伺服器已設定代理，會自動將 API 請求 (`/api/...`) 和資源請求 (`/assets/...`) 轉發至後端伺服器。
