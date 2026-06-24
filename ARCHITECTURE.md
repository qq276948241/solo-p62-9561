# 邻里宠物 - 项目架构说明

> 给小区养猫养狗居民用的宠物互助平台，React + TypeScript + Vite + Tailwind CSS 单页应用。

## 一、技术栈一览

| 层 | 选型 | 版本 |
|---|---|---|
| 前端框架 | React | 18.x |
| 语言 | TypeScript | 5.x |
| 构建工具 | Vite | 5.x |
| 样式 | Tailwind CSS | 3.x |
| 路由 | React Router DOM | 6.x |
| 图标 | Lucide React | latest |

## 二、目录结构

```
project62/
├── public/                     # 静态资源（favicon 等）
├── src/
│   ├── assets/                 # 图片等打包资源
│   ├── components/             # 可复用 UI 组件
│   │   ├── Tag.tsx             #   标签（疫苗状态、品种等）
│   │   ├── Modal.tsx           #   通用弹窗（带遮罩、ESC 关闭）
│   │   ├── PhotoSlider.tsx     #   照片轮播（自动播放 + 手动切换）
│   │   └── PetCard.tsx         #   宠物信息卡片（含收藏按钮）
│   ├── pages/                  # 页面级组件（对应路由）
│   │   ├── Home.tsx            #   首页（地图 + 列表混合布局）
│   │   └── PetDetail.tsx       #   宠物详情页
│   ├── data/
│   │   └── mockPets.ts         #   Mock 宠物数据（6 只示例）
│   ├── hooks/
│   │   ├── useFavorites.ts     #   收藏状态管理（localStorage 持久化 + 跨组件同步）
│   │   └── useTheme.ts         #   主题切换（预留）
│   ├── types/
│   │   └── index.ts            #   全局 TypeScript 类型定义
│   ├── lib/
│   │   └── utils.ts            #   工具函数
│   ├── App.tsx                 #   路由表
│   ├── main.tsx                #   应用入口
│   └── index.css               #   全局样式 + Tailwind 入口
├── tailwind.config.js          #   Tailwind 主题扩展（奶咖/森林绿色系）
├── vite.config.ts              #   Vite 配置（含 @ 路径别名）
└── package.json
```

## 三、路由

路由表在 [App.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/App.tsx)：

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | [Home.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/pages/Home.tsx) | 首页：顶部搜索栏 + 左侧占位地图 + 右侧宠物卡片列表 |
| `/pet/:id` | [PetDetail.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/pages/PetDetail.tsx) | 详情页：照片轮播 + 主人信息 + 疫苗状态 + 联系主人弹窗 |

## 四、组件职责

### 4.1 通用组件

#### [Tag.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/components/Tag.tsx)
圆角胶囊标签，三种变体：
- `vaccinated` → 森林绿底白字（已打疫苗）
- `unvaccinated` → 灰底白字（未打疫苗）
- `default` → 奶咖深底森林绿字（默认）

#### [Modal.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/components/Modal.tsx)
通用弹窗容器：
- 半透明黑色遮罩 + 毛玻璃，点击遮罩或按 ESC 关闭
- 可选 `title` prop，右上角自带关闭按钮
- 打开时锁滚动（`body.overflow = 'hidden'`）
- `animate-slide-up` + `animate-fade-in` 动画进场

#### [PhotoSlider.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/components/PhotoSlider.tsx)
照片轮播：
- 默认自动播放（4s 间隔，`autoPlay` / `interval` 可配）
- 左右箭头 + 底部圆点指示器
- `transform: translateX` + 500ms ease-out 平滑切换

#### [PetCard.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/components/PetCard.tsx)
宠物卡片，**自管收藏状态**（内部调 `useFavorites`，不依赖父组件传 prop）：
- 左上：疫苗标签 Tag
- 右上：❤️ 收藏切换按钮（心形填充 = 已收藏，灰色 = 未收藏），`stopPropagation` 防止跳详情
- 中部：名字、物种 emoji 标签、品种
- 底部：距离信息 + 📍 图标
- 点击整体 → `navigate('/pet/:id')` 跳详情页

### 4.2 页面组件

#### [Home.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/pages/Home.tsx)
首页结构从上到下：

1. **搜索栏（sticky）**：Logo + 搜索输入框 + 品种标签筛选 + 物种筛选（全部/狗狗/猫咪） + 发布按钮
2. **主体（左右分栏，移动端上下堆叠）**
   - 左侧 1/2：**占位地图**
     - SVG 网格背景 + 两条横向两条纵向"道路"
     - 中心 📍 用户位置（带呼吸动画）
     - 各宠物位置按 `pet.location.x/y` 百分比定位
     - 鼠标悬停标记点显示名字 + 距离
     - 点击标记点底部浮出迷你预览卡
     - 右下角图例（绿=狗、黄=猫）
   - 右侧 1/2：**附近的宠物伙伴**
     - 横向滑动的卡片列表（`hide-scrollbar` 样式隐藏滚动条，两侧渐变遮罩提示可滑）
     - 下方"全部宠物"网格（1~2 列响应式）
3. **发布弹窗**：点右上角发布按钮打开，内含名字/品种/物种/疫苗/性格/微信号表单

列表排序规则：`isFavorite(a.id) ? 0 : 1`，**收藏的永远排在前面**。

#### [PetDetail.tsx](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/pages/PetDetail.tsx)
详情页结构从上到下：

1. **顶部导航（sticky）**：返回按钮 + 标题 + 分享按钮
2. **照片轮播**：`PhotoSlider` 组件
3. **宠物信息卡**：名字 + 物种 + 疫苗 Tag + 距离 + 可联系标签 + 性格描述
4. **主人信息卡**：头像 + 昵称 + 在线状态
5. **温馨提示**：奶咖色背景圆角卡片
6. **底部固定按钮栏**：`联系主人` 大按钮（森林绿，圆角）
7. **联系主人弹窗**：主人头像昵称 + 微信号显示 + 一键复制（`navigator.clipboard.writeText`）

## 五、数据流：Mock 数据如何到页面

```
[types/index.ts] 定义 Pet 类型
        │
        ▼
[data/mockPets.ts] 导出 mockPets: Pet[]（6 条示例）
        │
        ├──▶ [pages/Home.tsx]      直接 import → filteredPets（搜索/品种/物种筛选 + 收藏排序）
        │                                     │
        │                                     ├──▶ 横向滑动列表：map → <PetCard pet={pet} />
        │                                     └──▶ 全部宠物网格：map → <PetCard pet={pet} className="w-full" />
        │
        └──▶ [pages/PetDetail.tsx] 直接 import → useParams 取 id → mockPets.find(p => p.id === Number(id))
```

目前是**纯前端 mock**，没有后端接口。要接真实后端时，只需把 `mockPets` 的直接 import 换成 `useEffect + fetch` 或 React Query 调用，其余组件不用改。

## 六、主题配色（奶咖 + 森林绿）

### 6.1 Tailwind 主题扩展

定义在 [tailwind.config.js](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/tailwind.config.js#L10-L27)：

```js
colors: {
  cream:       "#F5E6D3",   // 奶咖色（主背景）
  "cream-dark":"#E8D5BC",   // 奶咖深（次要背景、边框、标签底色）
  forest:      "#4A6741",   // 森林绿（主强调色：按钮、文字、图标）
  "forest-light": "#5C7A52",// 森林绿浅（hover 状态）
  "forest-dark":  "#3A5431",// 森林绿深（active 状态）
},
borderRadius: {
  card: "16px",             // 所有卡片统一圆角
},
boxShadow: {
  card:        "0 4px 12px rgba(0,0,0,0.08)",   // 默认卡片阴影
  "card-hover":"0 8px 24px rgba(0,0,0,0.12)",   // hover 时加深
},
fontFamily: {
  sans: ['"PingFang SC"', '"Microsoft YaHei"', "system-ui", "sans-serif"],
}
```

使用方式：直接写 `bg-cream`、`text-forest`、`rounded-card`、`shadow-card`。

### 6.2 全局样式

在 [index.css](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/index.css) 中：
- `body` 背景色 `#F5E6D3` 奶咖
- 自定义细滚动条（森林绿半透明 thumb）
- `hide-scrollbar` 工具类（横向列表用）
- 三套关键帧：`fade-in`、`slide-up`、`pulse-soft`，对应 `.animate-*` 类

## 七、收藏功能（useFavorites Hook）

核心实现：[useFavorites.ts](file:///d:/code/ai-prompt/solo-chrome-dev-F12/repos/repo62/project62/src/hooks/useFavorites.ts)

### 7.1 为什么要这么设计

最初版本是每个组件自己 `useState` 一份收藏集合，结果出现问题：**详情页点了收藏，返回首页卡片不刷新**，因为两个组件各自维护独立的 state，互不通信。

解决方案：**模块级单一数据源 + 订阅-发布模式**。

### 7.2 内部逻辑分层

```
┌─ 模块顶层（所有 hook 实例共享） ─────────────────────────┐
│  let favorites: Set<number>        ← 唯一权威数据源        │
│  const subscribers: Set<()=>void>  ← 订阅者回调集合         │
│  updateFavorites(next)             ← 唯一的"写"入口        │
│      ① 替换 favorites 变量                                │
│      ② persistFavorites → localStorage.setItem           │
│      ③ subscribers.forEach(sub => sub()) 广播通知          │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─ 每个组件实例 ────────────────────────────────────────────┐
│  useForceRerender()                                        │
│      useState(0) 维护 tick                                 │
│      useEffect 注册 subscriber：() => setTick(t => t+1)    │
│      组件卸载时从 subscribers 移除                          │
│                                                            │
│  useFavorites() 开头调用 useForceRerender()                │
│  返回：favorites / favoriteIds / favoritesCount            │
│        isFavorite(id) / addFavorite(id)                    │
│        removeFavorite(id) / toggleFavorite(id)             │
│        clearFavorites()                                    │
└──────────────────────────────────────────────────────────┘
```

### 7.3 API

| 返回值 | 类型 | 说明 |
|---|---|---|
| `favorites` | `Set<number>` | 收藏 ID 集合（直接读模块变量） |
| `favoriteIds` | `number[]` | 收藏 ID 数组（memoized，size 变才重算） |
| `favoritesCount` | `number` | 收藏总数（memoized） |
| `isFavorite(id)` | `(number) => boolean` | 是否已收藏 |
| `addFavorite(id)` | `(number) => void` | 添加 |
| `removeFavorite(id)` | `(number) => void` | 删除 |
| `toggleFavorite(id)` | `(number) => void` | 切换 |
| `clearFavorites()` | `() => void` | 清空全部 |

### 7.4 持久化

localStorage key：`pet-favorites`，值是 `number[]` 的 JSON 字符串。
- 初始化时 `loadFavorites()` 从存储读取并转成 `Set`
- 每次修改都走 `persistFavorites()` 写回
- try/catch 包裹，JSON 解析或写入失败静默降级为 `new Set()`

## 八、开发与验证命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动 Vite 开发服务器（默认端口 5173，占用时自动递增） |
| `npm run build` | 构建生产版本到 `dist/` |
| `npm run preview` | 本地预览生产构建 |
| `npm run check` | `tsc -b --noEmit` 类型检查（无运行时副作用） |
| `npm run lint` | ESLint 检查 |

## 九、接入后端接口的改造建议

当前 mock 数据直接 import 静态数组，后续接后端时：

1. 在 `src/api/` 新建 `pets.ts`，封装 `fetchPets()`、`getPet(id)` 等方法
2. `Home.tsx` 和 `PetDetail.tsx` 用 React Query / SWR 替换直接 import
3. 收藏接口如果走后端，把 `useFavorites` 内部的 `updateFavorites` 改成先调 API 成功再更新本地状态即可，订阅广播机制保留
