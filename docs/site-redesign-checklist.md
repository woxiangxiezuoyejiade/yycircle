# MocLab 站点改造清单

这份清单用于把当前站点逐步改造成更适合“学术主页 + 技术博客 + 个人履历展示”的形态。

## 一、改造目标

- 站点统计增加“今日访客 / 累计访客 / 主页进入次数”等更有意义的指标
- 评论系统正式启用，并兼顾低门槛、可维护和反垃圾
- 学术页从“展示页”升级为“个人主页 / 简历主页”
- 各个模块默认只展示 4 项，支持 `Load More`
- 个人技术、学校生涯、方向兴趣、实习经历、论文、GitHub、典型文章形成统一叙事
- 字体与视觉风格更偏学术化，但不牺牲博客阅读体验

## 二、建议先定的关键决策

这些项建议先确认，否则后面的实现会反复改。

### 1. 统计方案

- 推荐：`Umami` 负责全站访客统计
- 推荐：评论系统负责文章页阅读量
- 推荐：主页“重新进入一次才算一次”单独做自定义事件统计

结论：

- 不建议自己按 IP 统计唯一访客
- 不建议把“全站统计”完全绑在 Twikoo / Waline 上

### 2. 评论系统方案

- 推荐首选：`Waline`
- 备选：`Artalk`
- 不推荐作为主评论：`Giscus`

推荐原因：

- `Waline` 适合匿名评论、必填字段控制、邮件通知、审核、页面浏览量统计
- `Artalk` 更强在审核、验证码、垃圾评论治理，但部署略重

### 3. 评论开放策略

推荐默认策略：

- 所有人都可以评论
- 新评论先审核后显示
- `昵称` 必填
- `邮箱` 选填
- `个人网站` 不强制
- 开启频率限制和反垃圾

这样既保留留言门槛低的优势，也能防止恶意评论泛滥。

## 三、当前代码结构对应关系

### 页面入口

- 学术页入口：[src/pages/academic.astro](../src/pages/academic.astro)
- About 页入口：[src/pages/about.astro](../src/pages/about.astro)
- 博客分页入口：[src/pages/[...page].astro](../src/pages/[...page].astro)

### 学术页模块

- Hero：[src/components/academic/AcademicHero.astro](../src/components/academic/AcademicHero.astro)
- 研究方向：[src/components/academic/ResearchFocus.astro](../src/components/academic/ResearchFocus.astro)
- 项目区：[src/components/academic/AcademicProjects.astro](../src/components/academic/AcademicProjects.astro)
- 文章区：[src/components/academic/SelectedWriting.astro](../src/components/academic/SelectedWriting.astro)
- 个人资料区：[src/components/academic/AcademicProfile.astro](../src/components/academic/AcademicProfile.astro)

### 数据与配置

- 学术数据：[src/data/academic.ts](../src/data/academic.ts)
- 项目数据：[src/data/projects.ts](../src/data/projects.ts)
- 个人基础信息：[src/config/moclabSite.ts](../src/config/moclabSite.ts)
- 侧边资料卡：[src/config/profileConfig.ts](../src/config/profileConfig.ts)
- 评论配置：[src/config/commentConfig.ts](../src/config/commentConfig.ts)
- 全站配置：[src/config/siteConfig.ts](../src/config/siteConfig.ts)
- 字体配置：[src/config/fontConfig.ts](../src/config/fontConfig.ts)
- 侧边栏配置：[src/config/sidebarConfig.ts](../src/config/sidebarConfig.ts)
- 统计挂件：[src/components/widget/SiteStats.astro](../src/components/widget/SiteStats.astro)

## 四、分阶段实施清单

## Phase 1：先把基础设施跑通

目标：让评论和统计先可用，避免后面页面重构好了却没有数据闭环。

### 1. 接入全站统计

要做的事：

- 在 [src/config/siteConfig.ts](../src/config/siteConfig.ts) 中启用站点统计配置
- 选择 `Umami` 作为全站统计来源
- 在布局层确认脚本正确注入
- 新增“主页进入事件”统计逻辑

建议实现：

- 全站访客：使用 `Umami`
- 今日访客 / 累计访客：通过 `Umami API` 获取
- 首页 entry：只在首次进入 `/` 时发送一次自定义事件
- 使用 `sessionStorage` 避免同一轮站内跳转反复上报

涉及文件：

- [src/config/siteConfig.ts](../src/config/siteConfig.ts)
- [src/layouts/Layout.astro](../src/layouts/Layout.astro)
- [src/components/widget/SiteStats.astro](../src/components/widget/SiteStats.astro)

验收标准：

- 首页可显示今日访客
- 首页可显示累计访客
- 可单独看到主页进入次数
- 同一用户站内切换页面不会重复记为主页重新进入

### 2. 正式开启评论系统

要做的事：

- 在 [src/config/commentConfig.ts](../src/config/commentConfig.ts) 中把 `type` 从 `none` 改为目标评论系统
- 配置服务端地址
- 开启评论与浏览量统计
- 根据最终策略配置字段要求

推荐优先配置成：

- `type: "waline"`
- `login: "disable"` 或 `login: "enable"`
- `meta: ['nick', 'mail']`
- `requiredMeta: ['nick']`
- `visitorCount: true`

说明：

- `login: "disable"` 更接近“游客直接留言”
- `login: "enable"` 表示既允许匿名，也允许登录
- 如果要极度严格，可后续切到 `force`

涉及文件：

- [src/config/commentConfig.ts](../src/config/commentConfig.ts)
- [src/components/comment/Waline.astro](../src/components/comment/Waline.astro)
- [src/components/comment/index.astro](../src/components/comment/index.astro)
- [src/components/layout/PostMeta.astro](../src/components/layout/PostMeta.astro)

验收标准：

- 文章页评论区正常显示
- 游客可以正常发表评论
- 阅读量正常显示
- 评论提交后能在后台审核

### 3. 评论治理方案补全

要做的事：

- 开启审核机制
- 配置评论通知邮箱
- 配置限频 / 反垃圾
- 明确是否公开评论者邮箱

推荐策略：

- 评论公开区不显示邮箱
- 邮箱仅用于通知和头像映射
- 先开启审核
- 后续如果垃圾评论多，再补验证码 / 更强风控

涉及内容：

- 评论服务端环境变量
- Waline 或 Artalk 后台配置

验收标准：

- 评论需审核才能前台显示
- 管理员能收到新评论提醒
- 被回复用户在填写邮箱时能收到通知

## Phase 2：学术页结构重排

目标：把当前 academic 页从“几块卡片”提升成真正的个人主页。

### 4. 调整区域顺序

建议最终顺序：

1. Hero + 核心身份
2. 个人技术 / 学校生涯
3. 个人方向与兴趣
4. 实习 / 工作经历
5. 学术论文 / 研究成果
6. GitHub / 开源项目
7. 典型 Posts / Writing

当前需要改动：

- 把现在底部的 `Academic Profile` 提到最上方
- 拆出新的 `Experience`、`Publications`、`GitHub Showcase` 区域
- 保留 `Research Focus`，但位置后移到个人概览之后

涉及文件：

- [src/pages/academic.astro](../src/pages/academic.astro)
- [src/components/academic/AcademicProfile.astro](../src/components/academic/AcademicProfile.astro)
- 新增组件目录 `src/components/academic/`

验收标准：

- 页面第一屏就能看出“你是谁、做什么、擅长什么”
- 页面顺序符合学术主页和个人简历阅读逻辑

### 5. 扩展数据模型

当前数据还偏简单，建议拆成以下结构：

- `profile`
- `educationTimeline`
- `experienceTimeline`
- `researchFocus`
- `publications`
- `projects`
- `githubRepositories`
- `selectedWriting`
- `skills`

建议放置位置：

- 学术相关主数据：`src/data/academic.ts`
- GitHub 手动精选仓库：新建 `src/data/github.ts`
- 时间线数据：可继续放 `academic.ts`，也可拆 `timeline.ts`

验收标准：

- 数据与样式分离
- 页面内容后续可直接改数据文件，不必频繁改组件结构

## Phase 3：默认 4 项 + Load More

目标：所有主要区块都更克制、更整洁。

### 6. 把写死的前 4 项改成统一策略

当前已确认：

- [src/pages/academic.astro](../src/pages/academic.astro) 中 `Selected Writing` 已写死 `slice(0, 4)`

建议统一成：

- `Projects` 默认显示 4 个
- `Writing` 默认显示 4 个
- `GitHub` 默认显示 4 个
- `Publications` 默认显示 4 个

实现建议：

- 每个列表组件接收 `initialCount`
- 当 `items.length > initialCount` 时显示 `Load More`
- 展开后显示全部，按钮切换为 `Show Less` 可选

可新增：

- `src/components/common/ExpandableGrid.astro`
- 或使用 Svelte 小组件做交互

验收标准：

- 默认首屏更短
- 用户可以主动展开全部
- 移动端不会被长列表拉得过深

## Phase 4：GitHub 模块落地

目标：把博客、研究、开源三者真正连起来。

### 7. GitHub 展示策略

推荐分两层：

- 第一层：手动精选仓库
- 第二层：可选自动拉取 GitHub API 数据

MVP 做法：

- 新建 `src/data/github.ts`
- 手动维护 4 到 8 个重点仓库
- 字段建议包含：
  - `name`
  - `description`
  - `url`
  - `tags`
  - `status`
  - `highlight`

后续增强：

- 构建时通过 GitHub API 拉取 star、language、更新时间
- 或复用现有 GitHub 卡片思路

已有基础：

- [src/plugins/rehype-component-github-card.mjs](../src/plugins/rehype-component-github-card.mjs)

验收标准：

- 访问者能快速看到你的代表性仓库
- 仓库区不只是外链列表，而是有筛选、有定位、有介绍

## Phase 5：个人简历模块重做

目标：让 academic 页兼顾“主页感”和“简历感”。

### 8. 重做 Academic Profile 区域

当前 [src/components/academic/AcademicProfile.astro](../src/components/academic/AcademicProfile.astro) 内容偏轻，建议升级为：

- `Education`
- `Technical Stack`
- `Research Interests`
- `Contact`
- `Available for`

其中 `Technical Stack` 建议变成：

- icon + 文本
- 按方向分组
- 例如：`Language / ML / Infra / Frontend / Writing`

推荐示例分组：

- `Languages`: Python, TypeScript, SQL
- `ML`: PyTorch, Transformers, scikit-learn
- `Infra`: Vercel, Docker, MongoDB
- `Frontend`: Astro, Svelte, Tailwind
- `Research`: Latex, Experiment Design, Visualization

验收标准：

- 不只是标签云
- 一眼能看出你会什么，且更专业

### 9. 增加时间线区域

建议新增：

- `Education Timeline`
- `Internship / Experience Timeline`

推荐新增文件：

- `src/components/academic/AcademicTimeline.astro`
- `src/components/academic/ExperienceSection.astro`

数据建议加入：

- 时间
- 机构
- 身份
- 重点工作 / 研究内容
- 可选链接

验收标准：

- 页面既像个人主页，也能承担简历用途
- 时间线结构清楚，不再只有卡片平铺

## Phase 6：字体与视觉升级

目标：提升学术气质，但不做成“过于严肃的论文模板”。

### 10. 字体策略

当前 [src/config/fontConfig.ts](../src/config/fontConfig.ts) 里自定义字体功能还未启用。

建议：

- 学术页标题：偏 serif
- 正文和 UI：无衬线
- 代码：现有等宽字体继续保留

推荐方向：

- 中文标题：`Noto Serif SC` 或 `Source Han Serif SC`
- 正文：`MiSans` 保留

建议做法：

- 先全站不改
- 优先只给 academic 页标题单独套 class

涉及文件：

- [src/config/fontConfig.ts](../src/config/fontConfig.ts)
- [src/components/features/FontManager.astro](../src/components/features/FontManager.astro)
- 学术页各组件 class

验收标准：

- 标题更有学术感
- 正文仍然清晰耐读
- 博客页不被过度影响

### 11. 区块视觉统一

建议统一以下设计语言：

- 所有 section 有一致标题层级
- 卡片圆角、边框、阴影统一
- 标签、按钮、状态 badge 使用同一套语义
- 增加更细的分隔、留白、节奏控制

重点优化对象：

- [src/components/academic/AcademicHero.astro](../src/components/academic/AcademicHero.astro)
- [src/components/academic/ResearchFocus.astro](../src/components/academic/ResearchFocus.astro)
- [src/components/academic/AcademicProjects.astro](../src/components/academic/AcademicProjects.astro)
- [src/components/academic/SelectedWriting.astro](../src/components/academic/SelectedWriting.astro)

验收标准：

- 页面风格统一
- 不同区域有层次，但不显得割裂

## 五、内容维护规则

后续改内容时建议这样分工：

### 改文案内容

- 去 `src/data/*`
- 去 `src/config/*`
- About 正文去 [src/content/spec/about.md](../src/content/spec/about.md)

### 改布局顺序

- 去 [src/pages/academic.astro](../src/pages/academic.astro)

### 改样式与模块结构

- 去 `src/components/academic/*`

### 改全站侧边资料

- 去 [src/config/profileConfig.ts](../src/config/profileConfig.ts)
- 去 [src/config/moclabSite.ts](../src/config/moclabSite.ts)

## 六、推荐最终文件补充

建议新增这些文件：

- `src/data/github.ts`
- `src/components/academic/ExperienceSection.astro`
- `src/components/academic/PublicationsSection.astro`
- `src/components/academic/GitHubShowcase.astro`
- `src/components/academic/AcademicTimeline.astro`
- `src/components/common/ExpandableGrid.astro`

## 七、建议执行顺序

按最稳的顺序执行：

1. 开评论系统
2. 接站点统计
3. 学术页重排顺序
4. 扩数据结构
5. 做 `Load More`
6. 加 GitHub 区
7. 加时间线和论文区
8. 最后调整字体和视觉细节

## 八、最小可上线版本

如果先做一个可上线 MVP，建议只做这些：

- 启用 `Waline`
- 开启评论审核
- 接入 `Umami`
- 学术页把 `Academic Profile` 提到最上面
- `Projects / Writing` 默认 4 个 + `Load More`
- 新增一个手动维护的 `GitHub` 展示区
- `Technical Stack` 改成 icon + 文本

这版做完后，站点就已经会明显更完整。

## 九、后续增强项

后续可以再加：

- 论文列表按年份分组
- GitHub 自动同步 star / language / 更新时间
- 最近评论挂件
- 热门文章或精选文章挂件
- 访客来源 / 设备分布统计
- 主页 entry 自定义事件看板

## 十、实施时要注意的点

- 不要把“全站访客统计”交给 Twikoo 单独承担，Twikoo 官方 FAQ 目前明确提到不支持站点级访问统计
- 评论字段不要一步到位做太复杂，先用 `昵称必填 + 邮箱选填`
- 学术页尽量“数据驱动”，不要把长文案和数组直接写死在组件里
- `Load More` 逻辑最好抽成通用组件，避免每个区块重复写一套
- 字体先做局部试点，不要一开始全站替换
