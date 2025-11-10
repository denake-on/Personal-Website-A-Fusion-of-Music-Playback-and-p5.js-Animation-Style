# SpicaBlog Frontend

一个基于纯前端（HTML + CSS + JavaScript）的个人主页示例，用于展示项目、文章以及动态水母背景和歌词轮播等效果。

## 功能概览

- **动态水母背景**：使用 `p5.js` 绘制的多水母动画，持续漂浮于页面背景。
- **自动播放音乐**：支持自动尝试播放 `theme.mp3`，若浏览器限制则在首次点击/按键后启动。
- **导航 + 卡片列表**：项目/比赛/科研/实习/其他五大分类，通过 `index.json` 动态生成卡片列表。
- **Markdown 文章预览**：点击卡片切换至文章详情视图，右侧使用 `marked.js` 将 `.md` 渲染为 HTML。
- **歌词轮播**：左侧展示歌词（JSON 数据源）。
- **响应式布局**：大屏幕为左右布局，小屏幕自动折叠为上下布局。

## 核心目录结构

```
frontend/
├── basic.html                     # 主页面（含样式 / 逻辑）
├── assets/
│   ├── articles/                  # Markdown 文章与目录配置
│   │   ├── index.json             # 文章元数据（id/category/path 等）
│   │   ├── *.md                   # 对应文章的 Markdown 正文
│   ├── data/
│   │   └── lyrics.json            # 歌词轮播内容（日中对照）
│   ├── js/
│   │   ├── audio/autoPlay.js      # 自动播放音乐辅助脚本
│   │   └── p5-jellyfish/sketch.js # p5.js 水母动画
│   ├── media/
│   │   ├── images/                # 图片资源（卡片封面、文章插图）
│   │   └── music/theme.mp3        # 背景音乐
└── ...
```

## 本地开发

因为浏览器会阻止 `file://` 协议下的 `fetch` 请求，请务必通过本地静态服务器打开：

```bash
# 进入项目根目录
cd D:/code/spicaBlog

# Python
python -m http.server 8000

# 或使用 Node (需要安装 http-server)
npx http-server . -p 8000 --cors -c-1
```

然后访问：`http://localhost:8000/frontend/basic.html`

## 添加文章

1. 在 `frontend/assets/articles/` 中新增 `.md` 文件（推荐 UTF-8 编码）。
2. 在 `frontend/assets/articles/index.json` 中追加一条记录（`id` 与卡片关联，`category` 为 projects/contests/research/internships/other）。
   ```json
   {
     "id": "p3",
     "title": "项目：XXX",
     "category": "projects",
     "path": "./assets/articles/my-project.md",
     "excerpt": "一句话简介",
     "cover": "./assets/media/images/my-cover.png"
   }
   ```
3. 刷新页面 → 导航对应分类 → 点击卡片即可加载 Markdown。

## 歌词维护

在 `frontend/assets/data/lyrics.json` 中维护歌词数组，每条包含 `ja` 和 `zh` 字段。页面启动后会每 4 秒自动轮播。

## 部署建议

- **版本管理**：推荐使用 Git（例如 GitHub）管理项目源代码。
- **静态托管**：该前端纯静态资源，可直接部署到 Vercel、Netlify 或 GitHub Pages。
- **环境要求**：需确保静态服务器允许访问 `.json` 与 `.md` 文件。

