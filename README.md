MocLab 博客系统维护说明
这份文档只介绍当前项目里的博客系统，不包含学术页部分。
这是基于Flyfish魔改的

## 1. 博客内容放在哪里

博客文章统一放在：

```text
src/content/posts/
```

支持的文章格式是：

```text
.md
.mdx
```

也就是说，你平时发博客，最常见的做法就是直接在 `src/content/posts/` 下面新建一个 Markdown 文件。

例如：

```text
src/content/posts/why-moclab.md
src/content/posts/agent-security-notes.md
src/content/posts/aigc-detection-log.mdx
```

如果你想用脚本快速创建文章，也可以直接运行：

```bash
pnpm new-post your-post-name
```

这个命令对应的脚本在：

```text
scripts/new-post.js
```

它会自动在 `src/content/posts/` 下生成一篇带基础 frontmatter 的新文章。

## 2. 文章的基本格式

当前博客文章的数据结构定义在：

```text
src/content.config.ts
```

最常用的写法如下：

```md
---
title: 为什么我要搭建 MocLab
published: 2026-05-05
description: 记录搭建个人技术博客的原因、定位与长期计划。
image: ""
tags: ["Blog", "Research", "Personal"]
category: "Reflection"
draft: false
lang: "zh-CN"
---

这里开始写正文。
```

常用字段说明：

```text
title        文章标题，必填
published    发布时间，必填
description  文章简介，列表页和 SEO 会用到
image        封面图，可留空
tags         标签数组，可写多个
category     分类，只写一个
draft        是否草稿，true 时生产环境不会显示
lang         语言标记，可留空
updated      更新时间，可选
pinned       是否置顶，可选
author       作者，可选
sourceLink   原文链接，可选
licenseName  许可名称，可选
licenseUrl   许可链接，可选
comment      是否开启评论，可选
password     文章密码，可选
passwordHint 密码提示，可选
```

## 3. 发博客的原理

这个博客使用的是 Astro Content Collection。

简单理解就是：

1. 你把文章写进 `src/content/posts/`
2. `src/content.config.ts` 负责校验文章 frontmatter 格式
3. Astro 在构建时读取这些文章
4. 首页、归档、标签页、分类页、文章详情页都会自动使用这些内容

所以平时新增文章时，一般不需要手动去改路由或页面组件，只需要：

1. 新建文章文件
2. 填好 frontmatter
3. 写正文
4. 运行 `pnpm build` 或 `pnpm dev`

## 4. 标签和分类的逻辑

### 标签怎么写

标签来自文章 frontmatter 里的：

```yaml
tags: ["AI Agent", "Memory", "Security"]
```

特点：

1. `tags` 是数组，所以一篇文章可以有多个标签
2. 标签名按你写的字符串原样统计
3. 同名标签会自动聚合到标签页

标签统计逻辑在：

```text
src/utils/content-utils.ts
```

对应函数：

```text
getTagList()
```

标签页入口在：

```text
src/pages/tags.astro
```

点击标签后，实际会跳到归档页并带查询参数：

```text
/archive/?tag=xxx
```

对应逻辑在：

```text
src/utils/url-utils.ts
```

### 分类怎么写

分类来自文章 frontmatter 里的：

```yaml
category: "AI Agent"
```

特点：

1. `category` 是单个字符串，不是数组
2. 一篇文章通常只属于一个分类
3. 如果为空，会被归到“未分类”

分类统计逻辑也在：

```text
src/utils/content-utils.ts
```

对应函数：

```text
getCategoryList()
```

分类页入口在：

```text
src/pages/categories.astro
```

点击分类后，实际会跳到：

```text
/archive/?category=xxx
```

如果文章没有分类，会走：

```text
/archive/?uncategorized=true
```

## 5. 文章 URL 的规则

文章详情页路由在：

```text
src/pages/posts/[...slug].astro
```

文章链接是根据你在 `src/content/posts/` 里的文件路径生成的。

例如：

```text
src/content/posts/why-moclab.md
```

通常会生成：

```text
/posts/why-moclab/
```

如果你用了子目录：

```text
src/content/posts/research/agent-memory.md
```

通常会生成：

```text
/posts/research/agent-memory/
```

## 6. 头像和个人信息在哪里改

最核心的个人资料入口在：

```text
src/config/moclabSite.ts
```

这里集中维护了：

```text
siteName
name
identity
blogTagline
description
blogBio
avatar
avatarFallback
github
email
blogNavigation
```

你平时最常改的是这些字段：

```ts
siteName: "MocLab"
name: "Zhongxu / Moc"
identity: "Computer Science Graduate Student"
blogTagline: "..."
blogBio: "..."
avatar: "/assets/images/icon3.jpg"
github: "https://github.com/..."
email: "mailto:your-email@example.com"
```

博客左侧个人卡片真正读取的配置在：

```text
src/config/profileConfig.ts
```

不过它本身只是从 `moclabSite.ts` 映射过去，所以一般你直接改：

```text
src/config/moclabSite.ts
```

就够了。

头像显示组件在：

```text
src/components/widget/Profile.astro
```

## 7. 网站标题、导航和基础站点信息在哪里改

站点级配置主要在：

```text
src/config/siteConfig.ts
```

这里控制的内容包括：

```text
站点标题
副标题
站点 URL
SEO 描述
主题色相
默认明暗模式
导航栏 logo
页面开关
文章列表布局
分页数量
分析统计
```

当前导航菜单的数据来源在：

```text
src/config/moclabSite.ts
```

导航配置会被：

```text
src/config/navBarConfig.ts
src/components/layout/Navbar.astro
```

读取并渲染。

如果你要修改博客导航项，优先改：

```text
src/config/moclabSite.ts
```

## 8. 壁纸、横幅和主题色在哪里改

### 主题色相

主题色相配置在：

```text
src/config/siteConfig.ts
```

对应字段：

```ts
themeColor: {
  hue: 250,
  fixed: false,
  defaultMode: "system",
}
```

其中：

```text
hue          主题色相
fixed        是否锁定色相
defaultMode  默认明暗模式
```

### 壁纸和横幅

壁纸、横幅、首页大图相关配置在：

```text
src/config/backgroundWallpaper.ts
```

这里控制的内容包括：

```text
壁纸模式
桌面端和移动端图片
首页横幅标题和副标题
导航栏在横幅上的透明/模糊表现
轮播
波浪动画
遮罩透明度
```

你平时最常改的字段有：

```ts
mode: "banner"
switchable: true
src: {
  desktop: [...],
  mobile: [...],
}
banner: {
  homeText: {
    title: "MocLab",
    subtitle: [...],
  }
}
```

### 壁纸图片放哪里

当前配置里引用的壁纸图片主要在：

```text
src/assets/images/DesktopWallpaper/
```

如果你要替换首页横幅图片，通常有两种做法：

1. 把新图放进 `src/assets/images/DesktopWallpaper/`
2. 然后去 `src/config/backgroundWallpaper.ts` 改 `src.desktop` 和 `src.mobile`

如果你想完全不要横幅图，只保留纯色背景，也是在这个文件里改 `mode`。

## 9. 明暗模式和文章布局在哪里改

博客当前保留的可调项主要是：

```text
明暗模式
文章列表/网格布局
```

相关设置组件在：

```text
src/components/controls/DisplaySettingsIntegrated.svelte
```

文章列表默认布局在：

```text
src/config/siteConfig.ts
```

对应字段：

```ts
postListLayout: {
  defaultMode: "list",
  mobileDefaultMode: "list",
  allowSwitch: true,
}
```

含义是：

```text
defaultMode         桌面端默认布局
mobileDefaultMode   移动端默认布局
allowSwitch         是否允许用户手动切换列表/网格
```

## 10. 公告在哪里改

首页公告卡片配置在：

```text
src/config/announcementConfig.ts
```

可改内容包括：

```text
公告标题
公告正文
跳转按钮文案
跳转链接
是否允许关闭
```

例如：

```ts
title: "公告"
content: "欢迎来到 MocLab..."
link: {
  enable: true,
  text: "了解更多",
  url: "https://academic.moclab.top",
}
```

## 11. 友链在哪里改

友链页面配置在：

```text
src/config/friendsConfig.ts
```

这个文件里有两部分：

### 页面级配置

```ts
friendsPageConfig: {
  title,
  description,
  showCustomContent,
  showComment,
  randomizeSort,
}
```

### 友链列表数据

```ts
friendLinks: [
  {
    title,
    imgurl,
    desc,
    siteurl,
    tags,
    weight,
    enabled,
  }
]
```

字段含义：

```text
title    站点名称
imgurl   站点图标或头像
desc     简介
siteurl  链接地址
tags     标签
weight   排序权重，越大越靠前
enabled  是否显示
```

友链页面本体在：

```text
src/pages/friends.astro
```

## 12. 赞赏在哪里改

赞赏页面配置在：

```text
src/config/sponsorConfig.ts
```

你可以在这里改：

```text
页面标题
说明文案
赞赏用途
是否在文章页显示赞赏按钮
赞赏方式列表
```

最重要的是：

```ts
methods: [
  {
    name,
    icon,
    qrCode,
    link,
    description,
    enabled,
  }
]
```

字段含义：

```text
name         赞赏方式名称
icon         图标
qrCode       收款码图片
link         外链方式，例如 GitHub Sponsors
description  说明
enabled      是否显示
```

赞赏页面本体在：

```text
src/pages/sponsor.astro
```

如果你要换支付宝或微信收款码，通常是：

1. 把新图片放到合适的静态资源目录
2. 修改 `src/config/sponsorConfig.ts` 里的 `qrCode` 路径

## 13. About 页面在哪里改

博客里的关于页内容来自：

```text
src/content/spec/about.md
```

如果你只是想改“关于我”的正文，一般直接改这个文件即可。

## 14. 常改文件速查表

### 发文章

```text
src/content/posts/
```

### 改文章字段规则

```text
src/content.config.ts
```

### 快速新建文章脚本

```text
scripts/new-post.js
```

### 改个人信息

```text
src/config/moclabSite.ts
```

### 改头像映射

```text
src/config/profileConfig.ts
```

### 改网站基础配置

```text
src/config/siteConfig.ts
```

### 改壁纸和横幅

```text
src/config/backgroundWallpaper.ts
```

### 改公告

```text
src/config/announcementConfig.ts
```

### 改友链

```text
src/config/friendsConfig.ts
```

### 改赞赏

```text
src/config/sponsorConfig.ts
```

### 改导航

```text
src/config/moclabSite.ts
```

### 改关于页

```text
src/content/spec/about.md
```

## 15. 本地预览和构建

开发时常用命令：

```bash
pnpm dev
```

构建检查命令：

```bash
pnpm build
```

建议你每次改完以下内容后都跑一次构建：

1. 新文章 frontmatter
2. 导航配置
3. 头像路径
4. 壁纸图片路径
5. 友链图片路径
6. 赞赏二维码路径

## 16. 最简单的日常维护流程

如果只是普通发文，最常见流程就是：

1. 在 `src/content/posts/` 新建一篇 `.md`
2. 按 frontmatter 格式补全标题、时间、标签、分类、简介
3. 写正文
4. 跑 `pnpm dev` 本地看效果
5. 最后跑 `pnpm build`

如果只是改个人资料，最常见流程就是：

1. 改 `src/config/moclabSite.ts`
2. 如果换头像，确认图片路径有效
3. 跑 `pnpm build`

如果只是改首页横幅或壁纸，最常见流程就是：

1. 改 `src/config/backgroundWallpaper.ts`
2. 如有需要替换图片资源
3. 跑 `pnpm build`

## 17. 评论和访客信息

按照.env.example里的信息去改，新建一个.env文件，提供一个域名即可。具体操作可以看另一篇文档
