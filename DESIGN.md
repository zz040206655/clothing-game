# 系統設計文件 - 角色換裝遊戲

本文檔詳細闡述了網頁版角色換裝遊戲的系統架構、技術選型、API 設計和實作細節。

## 1. 專案目標 (Project Goal)

開發一個簡單的網頁換裝遊戲，用戶可以為一個基礎角色更換不同部位的服裝（如髮型、上衣、褲子、鞋子），並在介面上即時看到更換後的效果。

## 2. 核心功能 (Core Features)

*   **角色顯示:** 在畫面上顯示一個基礎角色。
*   **服裝庫:** 提供按類型（髮型、上衣等）分類的服裝選項庫。
*   **換裝機制:** 允許用戶點擊服裝選項，將其應用到角色身上。
*   **即時預覽:** 角色的外觀應在用戶選擇服裝後立即更新，無需重新載入頁面。
*   **服裝疊加:** 確保不同部位的服裝能夠以正確的層級順序疊加顯示。

## 3. 系統架構 (System Architecture)

本專案採用 **前後端分離 (Client-Server)** 的架構。

*   **前端 (Client):** 基於 React 的單頁應用 (SPA)，負責所有 UI 渲染和用戶互動邏輯。
*   **後端 (Server):** 基於 Golang (Gin) 的無狀態 API 伺服器，負責提供業務數據 (JSON) 和靜態資源（圖片等）。

### 協作流程

1.  用戶瀏覽器請求遊戲頁面。
2.  Go 後端回傳前端應用的 `index.html` 及打包後的 JS/CSS。
3.  前端 React 應用啟動，透過 AJAX (Fetch API) 向後端請求遊戲數據（角色列表、服裝列表）。
4.  Go 後端回傳 JSON 格式的數據。
5.  前端根據獲取的數據渲染出角色和服裝庫。圖片資源透過標準的 `<img>` 標籤向後端請求。
6.  用戶點擊服裝，前端 React 在內部更新其狀態 (State)，並重新渲染受影響的組件以達到即時預覽。此過程完全在客戶端完成。

## 4. 技術棧 (Technology Stack)

*   **後端 (Backend):**
    *   **語言:** Golang
    *   **Web 框架:** Gin
    *   **理由:** Gin 以其高效能、簡潔的 API 和豐富的中間件生態而聞名，非常適合快速建構 RESTful API。

*   **前端 (Frontend):**
    *   **框架:** React (with TypeScript)
    *   **建構工具:** Vite
    *   **理由:** React 的組件化模型與遊戲的元素（角色、服裝）天然契合。其龐大的生態系統和高效能的 Virtual DOM 機制使其成為現代 Web 開發的首選。Vite 則提供了極致的開發體驗，包括快速的冷啟動和模組熱更新。

## 5. 資料庫與 API 設計 (Database & API Design)

在專案初期，所有數據被硬編碼在後端程式碼中以簡化開發。此處為未來擴展設計資料庫結構。

### 資料庫 Schema (PostgreSQL 範例)

**`characters` 表:**
| 欄位名 | 類型 | 描述 |
|---|---|---|
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR(50) | 角色名稱 |
| `base_image_url` | VARCHAR(255) | 角色基礎圖片路徑 |

**`clothing_items` 表:**
| 欄位名 | 類型 | 描述 |
|---|---|---|
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR(50) | 服裝名稱 |
| `type` | VARCHAR(20) | 服裝類型 ('hair', 'top', etc.) |
| `image_url` | VARCHAR(255) | 服裝圖片路徑 |
| `z_index` | INTEGER | CSS 的 `z-index` 值，用於疊加 |

### RESTful API 接口

*   **獲取所有服裝列表**
    *   **Endpoint:** `GET /api/v1/clothing-items`
    *   **響應 (200 OK):**
        ```json
        [
          {
            "id": 101,
            "name": "Blue T-Shirt",
            "type": "top",
            "image_url": "/assets/images/tops/top1.png",
            "z_index": 20
          },
          ...
        ]
        ```

*   **獲取所有角色列表**
    *   **Endpoint:** `GET /api/v1/characters`
    *   **響應 (200 OK):**
        ```json
        [
          {
            "id": 1,
            "name": "Alex",
            "base_image_url": "/assets/images/characters/alex-base.png"
          },
          ...
        ]
        ```

*   **靜態資源服務**
    *   **路徑:** `GET /assets/*filepath`
    *   **說明:** 後端會將此路徑的請求映射到伺服器的 `assets` 文件夾，以提供圖片等靜態文件。

## 6. 前端 UI/UX 規劃

介面主要分為左右兩欄：

*   **左側 (角色預覽區):** 顯示角色及其身上穿戴的服裝。所有服裝圖片透過 CSS 的絕對定位和 `z-index` 屬性疊加在角色基礎圖片之上。
*   **右側 (服裝庫):**
    *   **分類標籤:** 頂部有一組標籤頁，用於在不同服裝類型（髮型、上衣等）之間切換。
    *   **選項網格:** 顯示當前選定分類下的所有服裝縮圖。每個網格項都是可點擊的。

## 7. 資源處理 (Asset Handling)

*   **策略:** 採用 **獨立圖片** 的策略。每件服裝、每個角色都是一個獨立的 `.png` 文件。
*   **對齊:** 所有圖片資源（包括角色身體）都應具有相同的畫布尺寸，以確保在前端疊加時能夠完美對齊。
*   **目錄結構:** 圖片資源存放在 `assets/images/` 目錄下，並按類型分子文件夾。
    ```
    assets/images/
    ├── characters/
    ├── hair/
    ├── tops/
    ├── bottoms/
    └── shoes/
    ```

*   **服務方式:** 所有圖片由後端 Go 伺服器作為靜態文件提供。在開發過程中，Vite 的代理伺服器會將前端的資源請求轉發給後端。
