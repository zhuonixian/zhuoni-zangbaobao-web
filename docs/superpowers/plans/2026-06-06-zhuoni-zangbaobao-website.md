# 卓尼县藏宝宝官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为卓尼县藏宝宝网络有限责任公司打造品牌展示型静态官网，全屏叙事设计，6个页面，部署到 Cloudflare Pages。

**Architecture:** Astro 5 静态站点生成 + Tailwind CSS 4 样式系统 + Alpine.js 轻量交互。数据存储在 TypeScript 数据文件中，构建时静态生成所有页面。联系表单使用 Formspree 处理。

**Tech Stack:** Astro 5.x, Tailwind CSS 4.x, Alpine.js, Cloudflare Pages, Formspree

---

## File Structure

```
zhuoni_zangbaobao_web/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── wrangler.toml
├── public/
│   ├── favicon.svg
│   └── images/          ← AI生成图片存放于此
│       ├── hero/
│       ├── products/
│       ├── culture/
│       └── about/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── HeroSection.astro
│   │   ├── ProductCard.astro
│   │   ├── ProductFilter.astro
│   │   ├── CultureCard.astro
│   │   ├── NewsCard.astro
│   │   ├── ContactForm.astro
│   │   ├── StatsSection.astro
│   │   └── PageBanner.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── products/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── culture.astro
│   │   ├── news/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── contact.astro
│   ├── data/
│   │   ├── products.ts
│   │   ├── cultures.ts
│   │   └── news.ts
│   └── styles/
│       └── global.css
└── docs/
```

---

## Phase 1: Project Foundation（顺序执行）

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `wrangler.toml`
- Create: `.gitignore`

- [ ] **Step 1: 初始化 Astro 项目**

```bash
cd /home/zhang/workspace/Project/zhuoni_zangbaobao_web
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: 安装依赖**

```bash
npm install
npm install @astrojs/cloudflare @astrojs/tailwind alpinejs @types/alpinejs
```

- [ ] **Step 3: 配置 astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [tailwind()],
  site: 'https://zangbaobao.com',
});
```

- [ ] **Step 4: 配置 tailwind.config.mjs**

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF0E6',
        'tibetan-red': '#860C1E',
        'bronze-gold': '#B6A766',
        'ink-blue': '#1A1A2E',
        'prairie-green': '#2D5016',
        'earth-brown': '#6B4C3B',
        linen: '#E8E0D0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: 配置 tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@data/*": ["src/data/*"]
    }
  }
}
```

- [ ] **Step 6: 创建 .gitignore**

```
# dependencies
node_modules/

# build
dist/

# astro
.astro/

# cloudflare
.wrangler/
.dev.vars

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# superpowers
.superpowers/
```

- [ ] **Step 7: 创建目录结构**

```bash
mkdir -p public/images/{hero,products,culture,about}
mkdir -p src/{layouts,components,pages/products,pages/news,data,styles}
```

- [ ] **Step 8: 验证构建**

```bash
npm run build
```

Expected: 构建成功，输出 `dist/` 目录

- [ ] **Step 9: 初始化 Git 并提交**

```bash
git init
git add .
git commit -m "feat: initialize Astro project with Tailwind CSS"
```

---

### Task 2: 全局样式

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: 创建全局样式文件**

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-cream text-ink-blue font-sans;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer components {
  .section-padding {
    @apply px-6 py-20 md:px-12 lg:px-24;
  }

  .container-custom {
    @apply mx-auto max-w-7xl;
  }

  .tibetan-top-line {
    @apply h-1 bg-gradient-to-r from-tibetan-red via-bronze-gold to-tibetan-red;
  }

  .btn-primary {
    @apply inline-block px-6 py-3 bg-tibetan-red text-white rounded font-semibold
           hover:bg-tibetan-red/90 transition-colors duration-200;
  }

  .btn-outline {
    @apply inline-block px-6 py-3 border-2 border-tibetan-red text-tibetan-red rounded font-semibold
           hover:bg-tibetan-red hover:text-white transition-colors duration-200;
  }

  .btn-gold {
    @apply inline-block px-6 py-3 bg-bronze-gold text-ink-blue rounded font-semibold
           hover:bg-bronze-gold/90 transition-colors duration-200;
  }

  .btn-gold-outline {
    @apply inline-block px-6 py-3 border-2 border-bronze-gold text-bronze-gold rounded font-semibold
           hover:bg-bronze-gold hover:text-ink-blue transition-colors duration-200;
  }

  .tag {
    @apply inline-block px-2 py-0.5 text-xs rounded;
  }

  .card {
    @apply bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200;
  }
}
```

- [ ] **Step 2: 验证构建**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 3: 提交**

```bash
git add src/styles/global.css
git commit -m "feat: add global styles with Tailwind config and custom components"
```

---

### Task 3: BaseLayout 组件

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: 创建 favicon**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#860C1E"/>
  <text x="16" y="22" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#B6A766">藏</text>
</svg>
```

- [ ] **Step 2: 创建 BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import Navbar from '@/components/Navbar.astro';
import Footer from '@/components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const {
  title,
  description = '卓尼县藏宝宝网络有限责任公司 - 藏王故里·秘境卓尼 - 高原绿色生态土特产',
  ogImage = '/images/hero/default.jpg',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content="zh_CN" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <title>{title}</title>
  </head>
  <body class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />

    <script>
      import Alpine from 'alpinejs';
      window.Alpine = Alpine;
      Alpine.start();
    </script>
  </body>
</html>
```

- [ ] **Step 3: 创建 Navbar 占位组件**

```astro
---
// src/components/Navbar.astro
const navLinks = [
  { href: '/', text: '首页' },
  { href: '/about', text: '关于我们' },
  { href: '/products', text: '产品展示' },
  { href: '/culture', text: '文化故事' },
  { href: '/news', text: '新闻资讯' },
  { href: '/contact', text: '联系我们' },
];

const currentPath = Astro.url.pathname;
---

<header x-data="{ open: false }" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
  x-init="window.addEventListener('scroll', () => { scrolled = window.scrollY > 50 })"
  x-data="{ scrolled: false }"
  :class="scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'">
  <div class="container-custom flex items-center justify-between h-16 md:h-20 px-6">
    <a href="/" class="text-xl font-bold text-bronze-gold" :class="scrolled ? 'text-ink-blue' : 'text-bronze-gold'">
      藏宝宝
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-8">
      {navLinks.map((link) => (
        <a
          href={link.href}
          class:list={[
            'text-sm transition-colors duration-200',
            currentPath === link.href
              ? 'text-tibetan-red font-semibold'
              : 'scrolled ? "text-ink-blue/80 hover:text-tibetan-red" : "text-white/80 hover:text-bronze-gold"',
          ]}
        >
          {link.text}
        </a>
      ))}
    </nav>

    <!-- Mobile Menu Button -->
    <button
      class="md:hidden p-2"
      @click="open = !open"
      :class="scrolled ? 'text-ink-blue' : 'text-white'"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path x-show="!open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        <path x-show="open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Mobile Menu -->
  <div
    x-show="open"
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0 -translate-y-4"
    x-transition:enter-end="opacity-100 translate-y-0"
    x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100 translate-y-0"
    x-transition:leave-end="opacity-0 -translate-y-4"
    class="md:hidden bg-white shadow-lg"
  >
    <nav class="flex flex-col py-4">
      {navLinks.map((link) => (
        <a
          href={link.href}
          class:list={[
            'px-6 py-3 text-sm transition-colors',
            currentPath === link.href
              ? 'text-tibetan-red bg-tibetan-red/5 font-semibold'
              : 'text-ink-blue hover:text-tibetan-red hover:bg-tibetan-red/5',
          ]}
          @click="open = false"
        >
          {link.text}
        </a>
      ))}
    </nav>
  </div>
</header>
```

- [ ] **Step 4: 创建 Footer 占位组件**

```astro
---
// src/components/Footer.astro
const navLinks = [
  { href: '/', text: '首页' },
  { href: '/about', text: '关于我们' },
  { href: '/products', text: '产品展示' },
  { href: '/culture', text: '文化故事' },
  { href: '/news', text: '新闻资讯' },
  { href: '/contact', text: '联系我们' },
];

const productCategories = [
  '食用菌类', '中藏药材', '高原畜产', '山珍野菜',
  '粮油加工', '蜂产品', '特色食品', '手工艺品',
];
---

<footer class="bg-ink-blue text-white/80">
  <!-- 藏族纹样装饰线 -->
  <div class="h-1 bg-gradient-to-r from-tibetan-red via-bronze-gold to-tibetan-red"></div>

  <div class="container-custom section-padding">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      <!-- 品牌信息 -->
      <div>
        <h3 class="text-xl font-bold text-bronze-gold mb-4">藏宝宝</h3>
        <p class="text-sm text-white/60 leading-relaxed">
          卓尼县藏宝宝网络有限责任公司致力于高原绿色生态土特产的标准化、品牌化和电商化发展。
        </p>
        <p class="text-sm text-bronze-gold mt-4">藏王故里 · 秘境卓尼</p>
      </div>

      <!-- 快速导航 -->
      <div>
        <h4 class="font-semibold text-white mb-4">快速导航</h4>
        <ul class="space-y-2">
          {navLinks.map((link) => (
            <li>
              <a href={link.href} class="text-sm text-white/60 hover:text-bronze-gold transition-colors">
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- 产品分类 -->
      <div>
        <h4 class="font-semibold text-white mb-4">产品分类</h4>
        <ul class="space-y-2">
          {productCategories.map((cat) => (
            <li>
              <a href={`/products?category=${cat}`} class="text-sm text-white/60 hover:text-bronze-gold transition-colors">
                {cat}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- 联系方式 -->
      <div>
        <h4 class="font-semibold text-white mb-4">联系方式</h4>
        <div class="space-y-3 text-sm text-white/60">
          <p>甘肃省甘南藏族自治州卓尼县</p>
          <p>contact@zangbaobao.com</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 版权信息 -->
  <div class="border-t border-white/10">
    <div class="container-custom px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-xs text-white/40">
        &copy; {new Date().getFullYear()} 卓尼县藏宝宝网络有限责任公司. All rights reserved.
      </p>
      <p class="text-xs text-white/40">
        ICP备案号：待补充
      </p>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: 验证构建**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: add BaseLayout, Navbar, Footer components"
```

---

### Task 4: 数据文件

**Files:**
- Create: `src/data/products.ts`
- Create: `src/data/cultures.ts`
- Create: `src/data/news.ts`

- [ ] **Step 1: 创建产品数据**

```typescript
// src/data/products.ts

export interface Product {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  detail: string;
  origin: string;
  image: string;
  certifications: string[];
  buyLinks?: { label: string; url: string }[];
}

export const categories = [
  { slug: 'all', name: '全部' },
  { slug: 'mushroom', name: '食用菌类' },
  { slug: 'herbs', name: '中藏药材' },
  { slug: 'livestock', name: '高原畜产' },
  { slug: 'wild-plants', name: '山珍野菜' },
  { slug: 'grain-oil', name: '粮油加工' },
  { slug: 'honey', name: '蜂产品' },
  { slug: 'crafts', name: '手工艺品' },
];

export const products: Product[] = [
  {
    slug: 'hei-mu-er',
    name: '卓尼黑木耳',
    category: '食用菌类',
    categorySlug: 'mushroom',
    description: '高原种植，肉质厚实，营养丰富',
    detail: '卓尼县黑木耳采用高原冷凉气候标准化大棚种植，海拔2000米以上，昼夜温差大，生长缓慢使得肉质更加厚实。富含蛋白质、铁、钙等营养成分，是餐桌上的高原珍品。',
    origin: '卓尼县',
    image: '/images/products/hei-mu-er.jpg',
    certifications: ['绿色食品', '地理标志'],
  },
  {
    slug: 'yang-du-jun',
    name: '卓尼羊肚菌',
    category: '食用菌类',
    categorySlug: 'mushroom',
    description: '珍稀食用菌，味道鲜美，营养极高',
    detail: '卓尼县得天独厚的高原气候条件，孕育出品质上乘的羊肚菌。菌盖蜂窝状，肉质细嫩，含有丰富的蛋白质、多种维生素和氨基酸，被誉为"菌中之王"。',
    origin: '卓尼县',
    image: '/images/products/yang-du-jun.jpg',
    certifications: ['有机产品'],
  },
  {
    slug: 'ji-song-rong',
    name: '姬松茸',
    category: '食用菌类',
    categorySlug: 'mushroom',
    description: '营养丰富，口感鲜美',
    detail: '高原种植的姬松茸，80g/罐装，便于储存和运输。味道鲜美，营养价值高，是日常养生的优选食材。',
    origin: '卓尼县',
    image: '/images/products/ji-song-rong.jpg',
    certifications: ['绿色食品'],
  },
  {
    slug: 'dang-gui',
    name: '卓尼当归',
    category: '中藏药材',
    categorySlug: 'herbs',
    description: '2.2万亩种植基地，品质上乘',
    detail: '卓尼当归种植面积达2.2万多亩，在高海拔冷凉气候条件下生长，有效成分含量高，是中药材市场上的优质品种。具有补血活血、调经止痛的功效。',
    origin: '卓尼县',
    image: '/images/products/dang-gui.jpg',
    certifications: ['地理标志', '绿色食品'],
  },
  {
    slug: 'chai-hu',
    name: '卓尼柴胡',
    category: '中藏药材',
    categorySlug: 'herbs',
    description: '3万多亩种植面积，道地药材',
    detail: '卓尼柴胡种植面积达3万多亩，是甘肃省柴胡的主产区之一。高原气候条件下生长的柴胡，有效成分柴胡皂苷含量高，品质上乘。',
    origin: '卓尼县',
    image: '/images/products/chai-hu.jpg',
    certifications: ['绿色食品'],
  },
  {
    slug: 'huang-qi',
    name: '黄芪',
    category: '中藏药材',
    categorySlug: 'herbs',
    description: '6千余亩种植，补气良药',
    detail: '卓尼黄芪在高海拔地区种植，根条粗壮，质地绵韧，粉性足。黄芪甲苷含量符合药典标准，是补气固表的常用中药材。',
    origin: '卓尼县',
    image: '/images/products/huang-qi.jpg',
    certifications: ['绿色食品'],
  },
  {
    slug: 'mao-niu-rou',
    name: '牦牛肉',
    category: '高原畜产',
    categorySlug: 'livestock',
    description: '高原放养，肉质紧实，营养丰富',
    detail: '卓尼县牦牛存栏约11万头，在海拔3000米以上的天然牧场自由放养。牦牛肉蛋白质含量高、脂肪低，富含氨基酸和微量元素，是高原特有的健康食材。',
    origin: '卓尼县',
    image: '/images/products/mao-niu-rou.jpg',
    certifications: ['有机产品'],
  },
  {
    slug: 'jue-ma-zhu-rou',
    name: '蕨麻猪肉',
    category: '高原畜产',
    categorySlug: 'livestock',
    description: '甘南草原散养，肉质鲜嫩',
    detail: '蕨麻猪因常在草原觅食蕨麻（人参果）而得名，是甘南草原特有的猪种。散养方式使肉质紧实鲜嫩，脂肪分布均匀，风味独特。',
    origin: '卓尼县',
    image: '/images/products/jue-ma-zhu-rou.jpg',
    certifications: ['地理标志'],
  },
  {
    slug: 'zang-yang-rou',
    name: '藏羊肉/腊排',
    category: '高原畜产',
    categorySlug: 'livestock',
    description: '高原藏羊，肉质鲜美无膻味',
    detail: '卓尼藏羊在天然草场放牧，食用高原天然牧草和野生药材，肉质细嫩鲜美，无膻味，是藏区传统美食。',
    origin: '卓尼县',
    image: '/images/products/zang-yang-rou.jpg',
    certifications: ['绿色食品'],
  },
  {
    slug: 'sha-ji-cha',
    name: '野生沙棘茶',
    category: '山珍野菜',
    categorySlug: 'wild-plants',
    description: '高原野生沙棘，富含维生素C',
    detail: '卓尼县高海拔地区生长的野生沙棘，制成的沙棘茶色泽金黄，口感酸甜，富含维生素C、E和多种微量元素。30g罐装，方便冲泡。',
    origin: '卓尼县',
    image: '/images/products/sha-ji-cha.jpg',
    certifications: ['有机产品'],
  },
  {
    slug: 'jue-cai',
    name: '野生蕨菜',
    category: '山珍野菜',
    categorySlug: 'wild-plants',
    description: '高原野生采集，清脆爽口',
    detail: '卓尼县境内野生蕨菜，生长在海拔2000米以上的山林间，无污染、纯天然。口感清脆，营养丰富，是餐桌上的时令山珍。',
    origin: '卓尼县',
    image: '/images/products/jue-cai.jpg',
    certifications: ['有机产品'],
  },
  {
    slug: 'jue-ma',
    name: '蕨麻（人参果）',
    category: '山珍野菜',
    categorySlug: 'wild-plants',
    description: '高原人参果，营养丰富',
    detail: '蕨麻又称"人参果"，是甘南高原特有的野生植物。块根富含淀粉、蛋白质和多种维生素，藏族传统食品，可煮粥、煲汤。',
    origin: '卓尼县',
    image: '/images/products/jue-ma.jpg',
    certifications: [],
  },
  {
    slug: 'qing-ke-jiu',
    name: '青稞酒',
    category: '粮油加工',
    categorySlug: 'grain-oil',
    description: '藏族传统酿造，醇香浓郁',
    detail: '采用卓尼高原种植的青稞为原料，传承藏族传统酿造工艺。酒体清澈，醇香浓郁，是藏族人民待客的传统佳酿。',
    origin: '卓尼县',
    image: '/images/products/qing-ke-jiu.jpg',
    certifications: [],
  },
  {
    slug: 'cai-zi-you',
    name: '高原菜籽油',
    category: '粮油加工',
    categorySlug: 'grain-oil',
    description: '高原油菜籽冷榨，纯正天然',
    detail: '卓尼县高原种植的优质油菜籽，采用传统冷榨工艺，保留菜籽油的天然营养成分。色泽金黄，香味浓郁。',
    origin: '卓尼县',
    image: '/images/products/cai-zi-you.jpg',
    certifications: ['绿色食品'],
  },
  {
    slug: 'tu-feng-mi',
    name: '土蜂蜜',
    category: '蜂产品',
    categorySlug: 'honey',
    description: '高原生态蜂蜜，纯天然无添加',
    detail: '卓尼县境内百花盛开的高原草地，为蜜蜂提供了丰富的蜜源。土蜂蜜采集自传统蜂箱，未经加工，保留了蜂蜜的天然风味和营养成分。',
    origin: '卓尼县',
    image: '/images/products/tu-feng-mi.jpg',
    certifications: ['有机产品'],
  },
  {
    slug: 'tao-yan',
    name: '洮砚',
    category: '手工艺品',
    categorySlug: 'crafts',
    description: '中国四大名砚之一，1300年传承',
    detail: '洮砚是中国四大名砚之一，产于卓尼县洮砚乡，距今1300多年历史。以洮河绿石为原料，色泽碧绿、纹理细腻、发墨快而不损毫，属国家级非物质文化遗产。',
    origin: '卓尼县洮砚乡',
    image: '/images/products/tao-yan.jpg',
    certifications: ['国家级非遗', '地理标志'],
  },
  {
    slug: 'ci-xiu',
    name: '藏族刺绣',
    category: '手工艺品',
    categorySlug: 'crafts',
    description: '传统藏族手工刺绣，图案精美',
    detail: '卓尼藏族刺绣融合了觉乃民俗文化的精髓，图案以吉祥八宝、莲花、云纹等传统元素为主，色彩鲜艳，工艺精湛，是极具收藏价值的民族工艺品。',
    origin: '卓尼县',
    image: '/images/products/ci-xiu.jpg',
    certifications: [],
  },
  {
    slug: 'mu-diao',
    name: '藏族木雕',
    category: '手工艺品',
    categorySlug: 'crafts',
    description: '传统木雕工艺，造型精美',
    detail: '卓尼藏族木雕传承百年工艺，以当地优质木材为原料，雕刻藏传佛教图案、吉祥纹样等，造型生动，工艺精湛。',
    origin: '卓尼县',
    image: '/images/products/mu-diao.jpg',
    certifications: [],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'all') return products;
  return products.filter((p) => p.categorySlug === categorySlug);
}
```

- [ ] **Step 2: 创建文化数据**

```typescript
// src/data/cultures.ts

export interface Culture {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  image: string;
  color: string;
}

export const cultures: Culture[] = [
  {
    slug: 'tusi',
    title: '土司历史文化',
    subtitle: '二十余代杨土司传奇',
    description: '卓尼杨土司历经明、清、民国，传承二十余代，是西北地区最具影响力的藏族土司之一。第十九代土司杨积庆在1935年红军长征途经时抢修栈道、开仓放粮，助力红军攻克腊子口天险，为中国革命做出重大贡献。',
    detail: '卓尼土司制度始于明代，杨土司家族统辖卓尼地区长达五百余年。鼎盛时期，卓尼杨土司的势力范围覆盖今甘南州大部分地区，是安多藏区最重要的政治实体之一。\n\n第十九代土司杨积庆（又名杨复兴），在1935年红军长征途经卓尼时，深明大义，下令抢修达拉沟栈道，开仓放粮接济红军，为红军顺利通过天险腊子口提供了关键帮助。新中国成立后，杨积庆被追认为革命烈士。\n\n土司文化留下了丰富的历史遗迹和文化传统，是卓尼最重要的历史文化遗产。',
    image: '/images/culture/tusi.jpg',
    color: '#860C1E',
  },
  {
    slug: 'tibetan-buddhism',
    title: '藏传佛教文化',
    subtitle: '禅定寺 · 贡巴寺',
    description: '卓尼县境内有禅定寺、贡巴寺等历史悠久的藏传佛教寺院，是安多藏区重要的宗教文化中心。',
    detail: '禅定寺是卓尼地区最重要的藏传佛教寺院之一，始建于明代，与卓尼土司家族有着密切的历史渊源。寺院建筑宏伟，收藏有大量珍贵的佛教经典和艺术品。\n\n贡巴寺位于卓尼县西南部，依山而建，气势恢宏。寺院每年举办大型宗教活动，吸引周边信众前来朝拜。\n\n藏传佛教文化深刻影响了卓尼的社会生活、建筑艺术、文学音乐等各个方面，是卓尼文化的重要组成部分。',
    image: '/images/culture/buddhism.jpg',
    color: '#061A74',
  },
  {
    slug: 'tao-yan',
    title: '洮砚产业文化',
    subtitle: '中国四大名砚之一 · 1300年传承',
    description: '洮砚是中国四大名砚之一，产于卓尼县洮砚乡，以色泽碧绿、纹理细腻著称，距今1300多年历史，属国家级非物质文化遗产。',
    detail: '洮砚，又称洮河绿石砚，因其石料产于卓尼县洮砚乡洮河一带而得名。洮砚开采和使用的历史可以追溯到唐代，距今已有1300多年。\n\n洮砚石质温润，色泽碧绿如玉，纹理变化万千，具有"扣之无声、呵之出水"的特点。与端砚、歙砚、澄泥砚并称中国四大名砚。宋代大文豪苏轼、书法家黄庭坚都曾对洮砚推崇备至。\n\n2008年，洮砚制作技艺被列入国家级非物质文化遗产名录。卓尼县被中国文化部命名为"中国洮砚之乡"。',
    image: '/images/culture/tao-yan.jpg',
    color: '#B6A766',
  },
  {
    slug: 'jue-nai',
    title: '觉乃民俗文化',
    subtitle: '巴郎鼓舞 · 非遗传承',
    description: '卓尼藏族由氏羌土著与吐蕃人融合而成，文化兼具藏族共性和鲜明地域特色。巴郎鼓舞是代表性非物质文化遗产。',
    detail: '觉乃（卓尼藏语自称）民俗文化是卓尼最具特色的地域文化。卓尼藏族由古代氏羌土著与公元七八世纪从卫藏迁徙的吐蕃人融合而成，形成了既具有藏族共性又有鲜明地域特色的文化传统。\n\n巴郎鼓舞是觉乃民俗文化的代表，融说、唱、舞为一体，渊源可追溯至古羌人原始宗教仪式。舞蹈时舞者手持巴郎鼓（一种带柄的双面拨浪鼓），边舞边摇，节奏铿锵有力。巴郎鼓舞已被列入国家级非物质文化遗产名录。\n\n觉乃民俗还体现在独特的服饰、饮食、建筑、婚俗等方面，是研究藏族文化多样性的重要样本。',
    image: '/images/culture/jue-nai.jpg',
    color: '#6B4C3B',
  },
  {
    slug: 'ecology',
    title: '自然生态文化',
    subtitle: '大峪沟 · 国家AAAA级景区',
    description: '卓尼县森林覆盖率36.7%，草原植被盖度97.08%，国家AAAA级景区大峪沟被誉为"南有九寨沟，北有大峪沟"。',
    detail: '卓尼县地处青藏高原东部边缘向黄土高原过渡地带，拥有丰富的自然生态资源。林地总面积334万亩，森林覆盖率36.7%，是甘肃省十二大重点林区之一。草原总面积359万亩，天然草原植被盖度97.08%。\n\n大峪沟风景区是国家AAAA级景区，集峡谷、森林、草原、瀑布于一体，秋景尤为迷人，被誉为"藏地秘境"。"南有九寨沟，北有大峪沟"的美誉名不虚传。\n\n此外，洛克之路被誉为"中国最美自驾路线"之一，百年藏寨已有200多年历史，民居以"外不见木，内不见土"的藏式传统苫子房为主，是千年藏族文明的活态记忆。',
    image: '/images/culture/ecology.jpg',
    color: '#2D5016',
  },
];
```

- [ ] **Step 3: 创建新闻数据**

```typescript
// src/data/news.ts

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
}

export const newsCategories = ['全部', '产业动态', '品牌动态', '活动通知'];

export const newsPosts: NewsPost[] = [
  {
    slug: 'black-fungus-conference-2025',
    title: '卓尼县黑木耳产业高质量发展大会圆满举办',
    excerpt: '2025年全国黑木耳产业高质量发展大会在卓尼县成功举办，推动产业升级。',
    content: '2025年，全国黑木耳产业高质量发展大会在卓尼县隆重举办。卓尼县已建成标准化栽培大棚2000多座，黑木耳产业已成为当地农民增收致富的重要支柱产业。大会期间，来自全国各地的食用菌专家学者、企业代表齐聚卓尼，共同探讨黑木耳产业的创新发展路径。',
    date: '2025-06-15',
    category: '产业动态',
    image: '/images/culture/ecology.jpg',
  },
  {
    slug: 'huinong-mall-launch',
    title: '"秘境卓尼"品牌入驻中建惠农商城',
    excerpt: '卓尼县特色农畜产品通过中建惠农商城走向全国市场，助力乡村振兴。',
    content: '卓尼县藏宝宝网络有限责任公司负责运营的"秘境卓尼"县域公共品牌正式入驻中建惠农商城（云筑惠农平台）。首批上架产品包括卓尼山珍姬松茸、野生沙棘茶等特色产品，标志着卓尼县农特产品电商化迈上新台阶。',
    date: '2025-05-20',
    category: '品牌动态',
    image: '/images/products/ji-song-rong.jpg',
  },
  {
    slug: 'consumer-assistance-award',
    title: '公司获评卓尼县消费帮扶优秀企业',
    excerpt: '卓尼县藏宝宝网络有限责任公司被列入卓尼县东西部协作消费帮扶奖补企业花名册。',
    content: '2021年，卓尼县藏宝宝网络有限责任公司被列入卓尼县东西部协作消费帮扶奖补企业花名册，年度销售额20.55万元，获得奖补资金0.62万元。公司持续致力于推动卓尼县农特产品走向更广阔的市场，助力乡村振兴。',
    date: '2025-04-10',
    category: '品牌动态',
    image: '/images/culture/ecology.jpg',
  },
  {
    slug: 'eco-brand-launch',
    title: '"秘境卓尼"县域公共品牌正式启用',
    excerpt: '卓尼县电子商务公共品牌"秘境卓尼"正式启用，推动高原特色产品品牌化。',
    content: '卓尼县电子商务公共品牌"秘境卓尼"正式启用，致力于将高原绿色、生态、无污染的特色农畜产品推向全国。品牌理念为"严选、低价、健康、扶贫"，涵盖食用菌、中藏药材、高原畜产等8大品类产品。',
    date: '2025-03-05',
    category: '品牌动态',
    image: '/images/culture/ecology.jpg',
  },
];

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((n) => n.slug === slug);
}

export function getNewsByCategory(category: string): NewsPost[] {
  if (category === '全部') return newsPosts;
  return newsPosts.filter((n) => n.category === category);
}
```

- [ ] **Step 4: 验证构建**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 5: 提交**

```bash
git add src/data/
git commit -m "feat: add product, culture, and news data files"
```

---

## Phase 2: 页面组件（可并发执行）

> **以下 Task 5-10 互相独立，可由不同 subagent 并发执行。**

### Task 5: PageBanner 通用组件

**Files:**
- Create: `src/components/PageBanner.astro`

- [ ] **Step 1: 创建 PageBanner**

```astro
---
// src/components/PageBanner.astro
interface Props {
  title: string;
  subtitle?: string;
  label?: string;
  gradient?: string;
}

const {
  title,
  subtitle,
  label,
  gradient = 'from-ink-blue to-ink-blue/80',
} = Astro.props;
---

<section class={`relative bg-gradient-to-br ${gradient} pt-32 pb-20 text-center`}>
  <div class="tibetan-top-line absolute top-0 left-0 right-0"></div>
  <div class="container-custom">
    {label && (
      <p class="text-sm tracking-[0.3em] text-bronze-gold mb-2">{label}</p>
    )}
    <h1 class="text-4xl md:text-5xl font-light text-white">{title}</h1>
    {subtitle && (
      <p class="mt-3 text-white/60 text-lg">{subtitle}</p>
    )}
  </div>
</section>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/PageBanner.astro
git commit -m "feat: add PageBanner component"
```

---

### Task 6: HeroSection 组件

**Files:**
- Create: `src/components/HeroSection.astro`

- [ ] **Step 1: 创建 HeroSection**

```astro
---
// src/components/HeroSection.astro
---

<section class="relative h-screen min-h-[600px] flex items-center justify-center bg-ink-blue">
  <!-- 背景图（暂时用渐变占位，后续替换为真实图片） -->
  <div class="absolute inset-0 bg-gradient-to-br from-ink-blue via-ink-blue/90 to-tibetan-red/30"></div>
  <div class="absolute inset-0 bg-black/30"></div>

  <!-- 内容 -->
  <div class="relative z-10 text-center px-6 max-w-3xl mx-auto">
    <p class="text-sm tracking-[0.3em] text-bronze-gold mb-6">藏王故里 · 秘境卓尼</p>
    <h1 class="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
      来自雪域高原的馈赠
    </h1>
    <p class="text-lg text-white/70 mb-10 max-w-xl mx-auto">
      卓尼县藏宝宝网络有限责任公司 · 严选高原绿色生态土特产
    </p>
    <a href="/products" class="btn-gold text-lg">探索产品</a>
  </div>

  <!-- 向下滚动提示 -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
    <p class="text-xs text-white/40 animate-bounce">↓ 向下滚动</p>
  </div>
</section>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/HeroSection.astro
git commit -m "feat: add HeroSection component"
```

---

### Task 7: StatsSection 组件

**Files:**
- Create: `src/components/StatsSection.astro`

- [ ] **Step 1: 创建 StatsSection**

```astro
---
// src/components/StatsSection.astro
const stats = [
  { value: '10万+', label: '服务人口' },
  { value: '136种', label: '野生药材' },
  { value: '8大', label: '产品品类' },
  { value: '5139', label: 'km² 服务区域' },
];
---

<section class="section-padding bg-cream">
  <div class="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
    <div>
      <p class="text-sm tracking-[0.2em] text-tibetan-red mb-2">ABOUT US</p>
      <h2 class="text-3xl md:text-4xl text-ink-blue mb-6">
        扎根秘境卓尼<br />连接高原与世界
      </h2>
      <p class="text-earth-brown leading-relaxed mb-8">
        卓尼县藏宝宝网络有限责任公司是甘南州电商进农村综合示范项目承办企业，致力于将卓尼县高原绿色生态土特产推向全国。
      </p>
      <a href="/about" class="btn-outline">了解更多 →</a>
    </div>
    <div class="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div class="bg-white p-6 rounded-lg text-center shadow-sm">
          <p class="text-3xl font-bold text-tibetan-red">{stat.value}</p>
          <p class="text-sm text-earth-brown mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/StatsSection.astro
git commit -m "feat: add StatsSection component"
```

---

### Task 8: ProductCard 和 ProductFilter 组件

**Files:**
- Create: `src/components/ProductCard.astro`
- Create: `src/components/ProductFilter.astro`

- [ ] **Step 1: 创建 ProductCard**

```astro
---
// src/components/ProductCard.astro
import type { Product } from '@/data/products';

interface Props {
  product: Product;
}

const { product } = Astro.props;

const categoryColors: Record<string, string> = {
  mushroom: 'bg-green-50 text-prairie-green',
  herbs: 'bg-amber-50 text-earth-brown',
  livestock: 'bg-red-50 text-tibetan-red',
  'wild-plants': 'bg-emerald-50 text-emerald-700',
  'grain-oil': 'bg-yellow-50 text-yellow-800',
  honey: 'bg-orange-50 text-orange-700',
  'specialty': 'bg-purple-50 text-purple-700',
  crafts: 'bg-gold-50 text-bronze-gold',
};
---

<div class="card group">
  <div class="h-48 bg-gradient-to-br from-prairie-green/80 to-prairie-green overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      onerror="this.style.display='none'"
    />
  </div>
  <div class="p-5">
    <span class={`tag ${categoryColors[product.categorySlug] || 'bg-gray-50 text-gray-600'}`}>
      {product.category}
    </span>
    <h3 class="text-lg font-semibold text-ink-blue mt-3 mb-2">{product.name}</h3>
    <p class="text-sm text-earth-brown leading-relaxed">{product.description}</p>
    <div class="mt-4 pt-4 border-t border-linen flex justify-between items-center">
      <a href={`/products/${product.slug}`} class="text-sm font-semibold text-tibetan-red hover:underline">
        查看详情 →
      </a>
      <span class="text-xs text-bronze-gold">产地：{product.origin}</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 创建 ProductFilter**

```astro
---
// src/components/ProductFilter.astro
import { categories } from '@/data/products';
---

<div class="flex flex-wrap gap-3 justify-center" x-data="{ active: 'all' }">
  {categories.map((cat) => (
    <button
      class="px-4 py-2 rounded-full text-sm transition-all duration-200"
      :class="active === '${cat.slug}' ? 'bg-tibetan-red text-white' : 'bg-cream text-ink-blue hover:bg-linen'"
      @click={`active = '${cat.slug}'; $dispatch('filter-change', '${cat.slug}')`}
    >
      {cat.name}
    </button>
  ))}
</div>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/ProductCard.astro src/components/ProductFilter.astro
git commit -m "feat: add ProductCard and ProductFilter components"
```

---

### Task 9: CultureCard 和 NewsCard 组件

**Files:**
- Create: `src/components/CultureCard.astro`
- Create: `src/components/NewsCard.astro`

- [ ] **Step 1: 创建 CultureCard**

```astro
---
// src/components/CultureCard.astro
import type { Culture } from '@/data/cultures';

interface Props {
  culture: Culture;
  index: number;
}

const { culture, index } = Astro.props;
const isReversed = index % 2 === 1;
---

<div class:list={['bg-white rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row gap-0', isReversed && 'md:flex-row-reverse']}>
  <div
    class="w-full md:w-1/2 min-h-[250px]"
    style={`background: linear-gradient(135deg, ${culture.color}, ${culture.color}88)`}
  >
    <img
      src={culture.image}
      alt={culture.title}
      class="w-full h-full object-cover"
      loading="lazy"
      onerror="this.style.display='none'"
    />
  </div>
  <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
    <p class="text-sm text-bronze-gold tracking-wider">文化{index + 1}</p>
    <h2 class="text-2xl text-ink-blue mt-2 mb-4">{culture.title}</h2>
    <p class="text-earth-brown leading-relaxed">{culture.description}</p>
    <a href={`/culture#${culture.slug}`} class="inline-block mt-6 text-sm font-semibold text-tibetan-red hover:underline">
      了解更多 →
    </a>
  </div>
</div>
```

- [ ] **Step 2: 创建 NewsCard**

```astro
---
// src/components/NewsCard.astro
import type { NewsPost } from '@/data/news';

interface Props {
  post: NewsPost;
}

const { post } = Astro.props;

const categoryColors: Record<string, string> = {
  '产业动态': 'bg-green-50 text-prairie-green',
  '品牌动态': 'bg-red-50 text-tibetan-red',
  '活动通知': 'bg-amber-50 text-earth-brown',
};
---

<a href={`/news/${post.slug}`} class="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-[200px] min-h-[150px] bg-gradient-to-br from-prairie-green/60 to-prairie-green flex-shrink-0">
      <img
        src={post.image}
        alt={post.title}
        class="w-full h-full object-cover"
        loading="lazy"
        onerror="this.style.display='none'"
      />
    </div>
    <div class="p-5 flex flex-col justify-center">
      <div class="flex items-center gap-3 mb-2">
        <span class={`tag ${categoryColors[post.category] || 'bg-gray-50 text-gray-600'}`}>
          {post.category}
        </span>
        <span class="text-xs text-earth-brown">{post.date}</span>
      </div>
      <h3 class="text-lg font-semibold text-ink-blue group-hover:text-tibetan-red transition-colors">
        {post.title}
      </h3>
      <p class="text-sm text-earth-brown mt-2 leading-relaxed">{post.excerpt}</p>
    </div>
  </div>
</a>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/CultureCard.astro src/components/NewsCard.astro
git commit -m "feat: add CultureCard and NewsCard components"
```

---

### Task 10: ContactForm 组件

**Files:**
- Create: `src/components/ContactForm.astro`

- [ ] **Step 1: 创建 ContactForm**

```astro
---
// src/components/ContactForm.astro
// Formspree 端点后续配置
const formAction = 'https://formspree.io/f/xxxxxxxx';
---

<form action={formAction} method="POST" class="flex flex-col gap-4">
  <div>
    <label for="name" class="block text-sm text-earth-brown mb-1">您的姓名</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full px-4 py-3 border border-linen rounded bg-white text-ink-blue focus:outline-none focus:border-tibetan-red transition-colors"
      placeholder="请输入姓名"
    />
  </div>
  <div>
    <label for="phone" class="block text-sm text-earth-brown mb-1">联系电话</label>
    <input
      type="tel"
      id="phone"
      name="phone"
      class="w-full px-4 py-3 border border-linen rounded bg-white text-ink-blue focus:outline-none focus:border-tibetan-red transition-colors"
      placeholder="请输入电话号码"
    />
  </div>
  <div>
    <label for="email" class="block text-sm text-earth-brown mb-1">电子邮箱</label>
    <input
      type="email"
      id="email"
      name="email"
      class="w-full px-4 py-3 border border-linen rounded bg-white text-ink-blue focus:outline-none focus:border-tibetan-red transition-colors"
      placeholder="请输入邮箱地址"
    />
  </div>
  <div>
    <label for="message" class="block text-sm text-earth-brown mb-1">留言内容</label>
    <textarea
      id="message"
      name="message"
      required
      rows="5"
      class="w-full px-4 py-3 border border-linen rounded bg-white text-ink-blue focus:outline-none focus:border-tibetan-red transition-colors resize-y"
      placeholder="请输入留言内容"
    ></textarea>
  </div>
  <button type="submit" class="btn-primary self-start">提交留言</button>
</form>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/ContactForm.astro
git commit -m "feat: add ContactForm component"
```

---

## Phase 3: 页面实现（可并发执行）

> **以下 Task 11-16 互相独立，可由不同 subagent 并发执行。**
> **每个页面完成后用 `npm run build` 验证。**

### Task 11: 首页（index.astro）

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: 创建首页**

```astro
---
// src/pages/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import HeroSection from '@/components/HeroSection.astro';
import StatsSection from '@/components/StatsSection.astro';
import ProductCard from '@/components/ProductCard.astro';
import CultureCard from '@/components/CultureCard.astro';
import NewsCard from '@/components/NewsCard.astro';
import { products } from '@/data/products';
import { cultures } from '@/data/cultures';
import { newsPosts } from '@/data/news';

const featuredProducts = products.filter((p) =>
  ['hei-mu-er', 'dang-gui', 'jue-ma-zhu-rou', 'tao-yan'].includes(p.slug)
);
const latestNews = newsPosts.slice(0, 3);
---

<BaseLayout title="藏宝宝 - 藏王故里·秘境卓尼 | 高原绿色生态土特产">
  <!-- Hero -->
  <HeroSection />

  <!-- 关于我们精选 -->
  <StatsSection />

  <!-- 产品展示精选 -->
  <section class="section-padding bg-white">
    <div class="container-custom text-center">
      <p class="text-sm tracking-[0.2em] text-tibetan-red mb-2">OUR PRODUCTS</p>
      <h2 class="text-3xl md:text-4xl text-ink-blue mb-2">高原珍品 · 绿色甄选</h2>
      <p class="text-earth-brown mb-12">来自海拔2000米以上雪域高原的天然馈赠</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
      <div class="mt-12">
        <a href="/products" class="btn-outline">查看全部产品 →</a>
      </div>
    </div>
  </section>

  <!-- 文化故事精选 -->
  <section class="section-padding bg-ink-blue text-white">
    <div class="container-custom text-center">
      <p class="text-sm tracking-[0.2em] text-bronze-gold mb-2">CULTURE & STORIES</p>
      <h2 class="text-3xl md:text-4xl text-white mb-12">藏王故里 · 秘境卓尼</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cultures.map((culture) => (
          <a
            href={`/culture#${culture.slug}`}
            class="bg-white/5 border border-bronze-gold/30 rounded-lg p-6 hover:bg-white/10 transition-colors"
          >
            <h3 class="font-semibold text-bronze-gold text-sm mt-2">{culture.title}</h3>
            <p class="text-xs text-white/60 mt-2">{culture.subtitle}</p>
          </a>
        ))}
      </div>
    </div>
  </section>

  <!-- 新闻摘要 -->
  <section class="section-padding bg-cream">
    <div class="container-custom">
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-sm tracking-[0.2em] text-tibetan-red mb-1">NEWS</p>
          <h2 class="text-2xl text-ink-blue">最新动态</h2>
        </div>
        <a href="/news" class="text-sm font-semibold text-tibetan-red hover:underline">查看全部 →</a>
      </div>
      <div class="flex flex-col gap-4">
        {latestNews.map((post) => (
          <NewsCard post={post} />
        ))}
      </div>
    </div>
  </section>

  <!-- 联系CTA -->
  <section class="bg-tibetan-red text-white py-20">
    <div class="container-custom text-center px-6">
      <h2 class="text-3xl font-light mb-4">与我们合作</h2>
      <div class="text-white/70 mb-8 space-y-1 text-sm">
        <p>甘肃省甘南藏族自治州卓尼县</p>
        <p>contact@zangbaobao.com</p>
      </div>
      <div class="flex gap-4 justify-center">
        <a href="/contact" class="btn-gold">联系我们</a>
        <a href="/products" class="btn-gold-outline">在线购买</a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 验证构建**

```bash
npm run build
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page with full-screen narrative sections"
```

---

### Task 12: 关于我们页面

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: 创建关于我们页面**

```astro
---
// src/pages/about.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageBanner from '@/components/PageBanner.astro';
---

<BaseLayout title="关于我们 - 藏宝宝" description="卓尼县藏宝宝网络有限责任公司 - 扎根秘境卓尼，连接高原与世界">
  <PageBanner
    title="关于我们"
    subtitle="扎根秘境卓尼 · 连接高原与世界"
    label="ABOUT US"
  />

  <!-- 公司简介 -->
  <section class="section-padding bg-cream">
    <div class="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl text-ink-blue mb-6">公司简介</h2>
        <p class="text-earth-brown leading-relaxed mb-4">
          卓尼县藏宝宝网络有限责任公司是甘南藏族自治州卓尼县电子商务进农村综合示范项目承办企业。
        </p>
        <p class="text-earth-brown leading-relaxed">
          公司致力于县域公共品牌"秘境卓尼"的建设与运营，推动高原绿色生态土特产的标准化、品牌化和电商化发展，将卓尼县的优质农特产品推向全国市场。
        </p>
      </div>
      <div class="bg-tibetan-red text-white p-8 lg:p-10 rounded-lg">
        <p class="text-sm tracking-wider text-bronze-gold mb-4">核心业务</p>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <span class="text-bronze-gold mt-1">◆</span>
            <span>农产品标准化与质量追溯体系建设</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-bronze-gold mt-1">◆</span>
            <span>县域公共品牌"秘境卓尼"运营</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-bronze-gold mt-1">◆</span>
            <span>电商服务与网络营销策划</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-bronze-gold mt-1">◆</span>
            <span>产品检测与绿色/有机/地理标志认证</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-bronze-gold mt-1">◆</span>
            <span>供应链建设与农产品品牌培育</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- 使命愿景 -->
  <section class="section-padding bg-white">
    <div class="container-custom">
      <h2 class="text-3xl text-ink-blue text-center mb-12">企业使命与愿景</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div class="border-t-4 border-tibetan-red pt-6 text-center">
          <p class="font-bold text-tibetan-red mb-3 text-lg">使命</p>
          <p class="text-earth-brown text-sm leading-relaxed">让高原珍品走出大山<br />让世界品味卓尼</p>
        </div>
        <div class="border-t-4 border-bronze-gold pt-6 text-center">
          <p class="font-bold text-bronze-gold mb-3 text-lg">愿景</p>
          <p class="text-earth-brown text-sm leading-relaxed">成为甘南州领先的<br />农产品电商服务平台</p>
        </div>
        <div class="border-t-4 border-prairie-green pt-6 text-center">
          <p class="font-bold text-prairie-green mb-3 text-lg">价值观</p>
          <p class="text-earth-brown text-sm leading-relaxed">品质为本 · 诚信经营<br />文化传承 · 助农致富</p>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 验证并提交**

```bash
npm run build && git add src/pages/about.astro && git commit -m "feat: add about page"
```

---

### Task 13: 产品展示页面（列表 + 详情）

**Files:**
- Create: `src/pages/products/index.astro`
- Create: `src/pages/products/[slug].astro`

- [ ] **Step 1: 创建产品列表页**

```astro
---
// src/pages/products/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageBanner from '@/components/PageBanner.astro';
import ProductCard from '@/components/ProductCard.astro';
import { products } from '@/data/products';
---

<BaseLayout title="产品展示 - 藏宝宝" description="卓尼高原珍品 - 绿色甄选，来自海拔2000米以上雪域高原的天然馈赠">
  <PageBanner
    title="高原珍品"
    subtitle="来自海拔2000米以上雪域高原的天然馈赠"
    label="OUR PRODUCTS"
    gradient="from-prairie-green to-prairie-green/80"
  />

  <section class="section-padding bg-cream">
    <div class="container-custom">
      <!-- 分类筛选（静态，JS交互后续增强） -->
      <div class="flex flex-wrap gap-3 justify-center mb-12"
        x-data="{ active: 'all' }"
      >
        {['全部', '食用菌类', '中藏药材', '高原畜产', '山珍野菜', '粮油加工', '蜂产品', '手工艺品'].map((cat, i) => {
          const slug = i === 0 ? 'all' : products.find(p => p.category === cat)?.categorySlug || '';
          return (
            <button
              class="px-4 py-2 rounded-full text-sm transition-all duration-200"
              :class={`active === '${slug}' ? 'bg-tibetan-red text-white' : 'bg-white text-ink-blue hover:bg-linen'`}
              @click={`active = '${slug}'`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <!-- 产品网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div x-show={`active === 'all' || active === '${product.categorySlug}'`} x-transition>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 创建产品详情页**

```astro
---
// src/pages/products/[slug].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import ProductCard from '@/components/ProductCard.astro';
import { products, getProductBySlug } from '@/data/products';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = () => {
  return products.map((product) => ({
    params: { slug: product.slug },
  }));
};

const { slug } = Astro.params;
const product = getProductBySlug(slug!);

if (!product) {
  return Astro.redirect('/products');
}

const relatedProducts = products
  .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
  .slice(0, 3);
---

<BaseLayout title={`${product.name} - 藏宝宝`} description={product.description}>
  <!-- 面包屑导航 -->
  <div class="bg-white border-b border-linen">
    <div class="container-custom px-6 py-4">
      <nav class="text-sm text-earth-brown">
        <a href="/" class="hover:text-tibetan-red">首页</a>
        <span class="mx-2">/</span>
        <a href="/products" class="hover:text-tibetan-red">产品展示</a>
        <span class="mx-2">/</span>
        <span class="text-ink-blue">{product.name}</span>
      </nav>
    </div>
  </div>

  <!-- 产品详情 -->
  <section class="section-padding bg-cream">
    <div class="container-custom">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- 产品图片 -->
        <div class="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-prairie-green/40 to-prairie-green/20">
          <img
            src={product.image}
            alt={product.name}
            class="w-full h-full object-cover"
            onerror="this.style.display='none'"
          />
        </div>

        <!-- 产品信息 -->
        <div>
          <span class="tag bg-green-50 text-prairie-green">{product.category}</span>
          <h1 class="text-3xl md:text-4xl text-ink-blue mt-4 mb-6">{product.name}</h1>
          <p class="text-earth-brown leading-relaxed mb-6">{product.detail}</p>

          <!-- 认证标签 -->
          {product.certifications.length > 0 && (
            <div class="flex flex-wrap gap-2 mb-8">
              {product.certifications.map((cert) => (
                <span class="tag bg-prairie-green/10 text-prairie-green border border-prairie-green/20">
                  ✓ {cert}
                </span>
              ))}
            </div>
          )}

          <!-- 产地信息 -->
          <div class="border-t border-linen pt-6 mb-8">
            <p class="text-sm text-earth-brown">
              <span class="text-bronze-gold">产地：</span>{product.origin}
            </p>
          </div>

          <!-- 购买渠道 -->
          <div class="bg-white rounded-lg p-6 border border-linen">
            <p class="font-semibold text-ink-blue mb-4">线上购买渠道</p>
            <div class="flex flex-wrap gap-4">
              <div class="text-center">
                <div class="w-24 h-24 bg-linen rounded-lg flex items-center justify-center mb-2">
                  <span class="text-xs text-earth-brown">微信扫码</span>
                </div>
                <p class="text-xs text-earth-brown">微信购买</p>
              </div>
              <div class="text-center">
                <div class="w-24 h-24 bg-linen rounded-lg flex items-center justify-center mb-2">
                  <span class="text-xs text-earth-brown">淘宝店铺</span>
                </div>
                <p class="text-xs text-earth-brown">淘宝购买</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 相关产品 -->
  {relatedProducts.length > 0 && (
    <section class="section-padding bg-white">
      <div class="container-custom">
        <h2 class="text-2xl text-ink-blue mb-8">相关产品</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard product={p} />
          ))}
        </div>
      </div>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 3: 验证并提交**

```bash
npm run build && git add src/pages/products/ && git commit -m "feat: add products list and detail pages"
```

---

### Task 14: 文化故事页面

**Files:**
- Create: `src/pages/culture.astro`

- [ ] **Step 1: 创建文化故事页面**

```astro
---
// src/pages/culture.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageBanner from '@/components/PageBanner.astro';
import CultureCard from '@/components/CultureCard.astro';
import { cultures } from '@/data/cultures';

const mainCultures = cultures.slice(0, 2);
const sideCultures = cultures.slice(2);
---

<BaseLayout title="文化故事 - 藏宝宝" description="探索卓尼五大地域文化 - 藏王故里·秘境卓尼">
  <PageBanner
    title="藏王故里 · 秘境卓尼"
    subtitle="探索卓尼五大地域文化"
    label="CULTURE & STORIES"
  />

  <!-- 主文化板块 -->
  <section class="section-padding bg-cream">
    <div class="container-custom flex flex-col gap-8">
      {mainCultures.map((culture, i) => (
        <div id={culture.slug}>
          <CultureCard culture={culture} index={i} />
        </div>
      ))}
    </div>
  </section>

  <!-- 次要文化板块 -->
  <section class="section-padding bg-white">
    <div class="container-custom">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sideCultures.map((culture) => (
          <a
            href={`#${culture.slug}`}
            id={culture.slug}
            class="bg-cream rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={`background: ${culture.color}`}
            >
              <span class="text-white text-xl">{culture.title[0]}</span>
            </div>
            <h3 class="font-semibold text-ink-blue mb-2">{culture.title}</h3>
            <p class="text-sm text-earth-brown">{culture.subtitle}</p>
            <p class="text-sm text-earth-brown leading-relaxed mt-3">{culture.description}</p>
          </a>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 验证并提交**

```bash
npm run build && git add src/pages/culture.astro && git commit -m "feat: add culture page"
```

---

### Task 15: 新闻资讯页面（列表 + 详情）

**Files:**
- Create: `src/pages/news/index.astro`
- Create: `src/pages/news/[slug].astro`

- [ ] **Step 1: 创建新闻列表页**

```astro
---
// src/pages/news/index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageBanner from '@/components/PageBanner.astro';
import NewsCard from '@/components/NewsCard.astro';
import { newsPosts } from '@/data/news';
---

<BaseLayout title="新闻资讯 - 藏宝宝" description="卓尼县藏宝宝网络有限责任公司最新动态和行业资讯">
  <PageBanner
    title="新闻资讯"
    label="NEWS"
    gradient="from-earth-brown to-earth-brown/80"
  />

  <section class="section-padding bg-cream">
    <div class="container-custom max-w-4xl">
      <div class="flex flex-col gap-6">
        {newsPosts.map((post) => (
          <NewsCard post={post} />
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 创建新闻详情页**

```astro
---
// src/pages/news/[slug].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import NewsCard from '@/components/NewsCard.astro';
import { newsPosts, getNewsBySlug } from '@/data/news';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = () => {
  return newsPosts.map((post) => ({
    params: { slug: post.slug },
  }));
};

const { slug } = Astro.params;
const post = getNewsBySlug(slug!);

if (!post) {
  return Astro.redirect('/news');
}

const otherPosts = newsPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
---

<BaseLayout title={`${post.title} - 藏宝宝`} description={post.excerpt}>
  <!-- 面包屑 -->
  <div class="bg-white border-b border-linen">
    <div class="container-custom px-6 py-4">
      <nav class="text-sm text-earth-brown">
        <a href="/" class="hover:text-tibetan-red">首页</a>
        <span class="mx-2">/</span>
        <a href="/news" class="hover:text-tibetan-red">新闻资讯</a>
        <span class="mx-2">/</span>
        <span class="text-ink-blue">{post.title}</span>
      </nav>
    </div>
  </div>

  <!-- 文章内容 -->
  <article class="section-padding bg-cream">
    <div class="container-custom max-w-3xl">
      <div class="flex items-center gap-3 mb-6">
        <span class="tag bg-red-50 text-tibetan-red">{post.category}</span>
        <time class="text-sm text-earth-brown">{post.date}</time>
      </div>
      <h1 class="text-3xl md:text-4xl text-ink-blue mb-8">{post.title}</h1>
      <div class="prose prose-lg max-w-none text-earth-brown leading-relaxed">
        <p>{post.content}</p>
      </div>
    </div>
  </article>

  <!-- 其他新闻 -->
  <section class="section-padding bg-white">
    <div class="container-custom max-w-4xl">
      <h2 class="text-2xl text-ink-blue mb-8">其他资讯</h2>
      <div class="flex flex-col gap-4">
        {otherPosts.map((p) => (
          <NewsCard post={p} />
        ))}
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: 验证并提交**

```bash
npm run build && git add src/pages/news/ && git commit -m "feat: add news list and detail pages"
```

---

### Task 16: 联系我们页面

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: 创建联系我们页面**

```astro
---
// src/pages/contact.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import PageBanner from '@/components/PageBanner.astro';
import ContactForm from '@/components/ContactForm.astro';
---

<BaseLayout title="联系我们 - 藏宝宝" description="联系卓尼县藏宝宝网络有限责任公司 - 地址、电话、邮箱及在线留言">
  <PageBanner
    title="联系我们"
    subtitle="期待与您的合作"
    label="CONTACT US"
  />

  <section class="section-padding">
    <div class="container-custom">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-sm">
        <!-- 左：联系表单 -->
        <div class="bg-cream p-8 lg:p-12">
          <p class="text-sm tracking-[0.2em] text-tibetan-red mb-2">CONTACT US</p>
          <h2 class="text-2xl text-ink-blue mb-6">联系我们</h2>
          <ContactForm />
        </div>

        <!-- 右：联系信息 -->
        <div class="bg-ink-blue text-white p-8 lg:p-12">
          <h2 class="text-2xl font-light mb-8">联系方式</h2>
          <div class="space-y-6 mb-10">
            <div>
              <p class="text-sm text-bronze-gold">地址</p>
              <p class="text-white/80 mt-1">甘肃省甘南藏族自治州卓尼县</p>
            </div>
            <div>
              <p class="text-sm text-bronze-gold">邮箱</p>
              <p class="text-white/80 mt-1">contact@zangbaobao.com</p>
            </div>
          </div>

          <!-- 购买渠道 -->
          <div class="border-t border-white/10 pt-6">
            <p class="text-sm text-bronze-gold mb-4">线上购买渠道</p>
            <div class="flex gap-4">
              <div class="text-center">
                <div class="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                  <span class="text-xs text-white/60">微信二维码</span>
                </div>
                <p class="text-xs text-white/60 mt-2">微信购买</p>
              </div>
              <div class="text-center">
                <div class="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                  <span class="text-xs text-white/60">淘宝店铺</span>
                </div>
                <p class="text-xs text-white/60 mt-2">淘宝购买</p>
              </div>
              <div class="text-center">
                <div class="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                  <span class="text-xs text-white/60">惠农商城</span>
                </div>
                <p class="text-xs text-white/60 mt-2">惠农购买</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: 验证并提交**

```bash
npm run build && git add src/pages/contact.astro && git commit -m "feat: add contact page with form and purchase channels"
```

---

## Phase 4: 图片生成与优化（并发执行）

### Task 17: AI 图片生成

**Files:**
- Create: `public/images/hero/default.jpg`
- Create: `public/images/products/*.jpg`
- Create: `public/images/culture/*.jpg`
- Create: `public/images/about/*.jpg`

- [ ] **Step 1: 使用 CLIProxyAPI image2 模型生成图片**

需要生成的图片清单：

**Hero 图片（1张）：**
- `hero/default.jpg` — 卓尼高原风光全景图，蓝天白云下连绵雪山和草原，远景藏族村落，1920x1080

**产品图片（18张）：**
- `products/hei-mu-er.jpg` — 卓尼黑木耳特写，黑色菌耳厚实饱满
- `products/yang-du-jun.jpg` — 羊肚菌特写，蜂窝状菌盖
- `products/ji-song-rong.jpg` — 姬松茸罐装产品
- `products/dang-gui.jpg` — 当归药材特写，切片
- `products/chai-hu.jpg` — 柴胡药材
- `products/huang-qi.jpg` — 黄芪切片
- `products/mao-niu-rou.jpg` — 牦牛肉，高原牦牛
- `products/jue-ma-zhu-rou.jpg` — 蕨麻猪肉
- `products/zang-yang-rou.jpg` — 藏羊肉腊排
- `products/sha-ji-cha.jpg` — 沙棘茶罐装
- `products/jue-cai.jpg` — 野生蕨菜
- `products/jue-ma.jpg` — 蕨麻（人参果）
- `products/qing-ke-jiu.jpg` — 青稞酒瓶装
- `products/cai-zi-you.jpg` — 菜籽油瓶装
- `products/tu-feng-mi.jpg` — 土蜂蜜瓶装
- `products/tao-yan.jpg` — 洮砚，碧绿色砚台
- `products/ci-xiu.jpg` — 藏族刺绣工艺品
- `products/mu-diao.jpg` — 藏族木雕

**文化图片（5张）：**
- `culture/tusi.jpg` — 卓尼土司历史，藏式建筑
- `culture/buddhism.jpg` — 藏传佛教寺院
- `culture/tao-yan.jpg` — 洮砚制作工艺
- `culture/jue-nai.jpg` — 巴郎鼓舞表演
- `culture/ecology.jpg` — 大峪沟自然风光

> 使用 CLIProxyAPI 的 image2 模型，批量调用，每张图 prompt 需包含："卓尼县"、"高原"、"藏区"、"土特产" 等关键词以增强文化辨识度。

- [ ] **Step 2: 提交**

```bash
git add public/images/
git commit -m "feat: add AI-generated images for hero, products, and culture"
```

---

### Task 18: SEO 优化

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: 在 BaseLayout 中添加 JSON-LD 结构化数据**

在 `</head>` 标签前添加：

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "卓尼县藏宝宝网络有限责任公司",
  "description": "高原绿色生态土特产电商服务平台",
  "url": Astro.site?.toString(),
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "卓尼县",
    "addressRegion": "甘肃省甘南藏族自治州",
    "addressCountry": "CN"
  },
  "brand": {
    "@type": "Brand",
    "name": "秘境卓尼"
  }
})} />
```

- [ ] **Step 2: 验证并提交**

```bash
npm run build && git add -A && git commit -m "feat: add JSON-LD structured data for SEO"
```

---

### Task 19: 响应式与可访问性优化

**Files:**
- Modify: `src/components/Navbar.astro`（确保移动端导航完整可用）
- Modify: `src/styles/global.css`（确保焦点样式）

- [ ] **Step 1: 在 global.css 中添加焦点和无障碍样式**

```css
@layer base {
  /* 已有的样式保持不变 */

  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-tibetan-red;
  }

  img {
    @apply max-w-full;
  }
}
```

- [ ] **Step 2: 验证并提交**

```bash
npm run build && git add -A && git commit -m "feat: add accessibility and responsive improvements"
```

---

## Phase 5: 部署

### Task 20: Cloudflare Pages 部署配置

**Files:**
- Modify: `astro.config.mjs`（确认 static output 模式）

- [ ] **Step 1: 确认 astro.config.mjs 使用 static 输出**

确保配置为 `output: 'static'`（无需 adapter，纯静态输出）：

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [tailwind()],
  site: 'https://zangbaobao.com',
});
```

- [ ] **Step 2: 本地预览验证**

```bash
npm run build
npx wrangler pages dev dist
```

Expected: 本地预览可正常访问所有页面

- [ ] **Step 3: 提交最终代码**

```bash
git add -A && git commit -m "feat: finalize Cloudflare Pages deployment config"
```

- [ ] **Step 4: 推送到 GitHub（需用户确认）**

```bash
git remote add origin <repo-url>
git push -u origin main
```

然后通过 Cloudflare Dashboard 连接仓库完成自动部署。

---

## 并发执行策略

| Phase | Tasks | 并发方式 |
|-------|-------|---------|
| Phase 1 | Task 1-4 | 顺序执行（有依赖） |
| Phase 2 | Task 5-10 | **6个 subagent 并发** |
| Phase 3 | Task 11-16 | **6个 subagent 并发** |
| Phase 4 | Task 17-19 | **3个 subagent 并发** |
| Phase 5 | Task 20 | 顺序执行 |
