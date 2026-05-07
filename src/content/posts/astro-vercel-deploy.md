---
title: Astro + Vercel 博客部署记录
published: 2026-05-02
description: 从克隆 MocLab 模板、本地配置、推送自己的 GitHub，到域名购买、Vercel 部署和 Cloudflare 接入的一套完整流程。
tags: [Astro, Vercel, Cloudflare, Deploy]
category: Blog
pinned: true
---

这篇文章专门记录 `MocLab` 这套博客系统的实际部署流程。目标不是只把站点“跑起来”，而是把从模板到正式上线的整条路径说明白，方便后面自己复现，也方便别人直接照着做。

这套流程适合下面这种起点：

- 先直接使用现成模板仓库：`https://github.com/Zhong0118/moclabdemo.git`
- 在本地把它跑起来并改成自己的内容
- 创建一个你自己的 GitHub 仓库来托管修改后的博客
- 使用 Vercel 做静态部署
- 买一个自己的域名
- 用 Cloudflare 做 DNS 和后续管理

## 一、先拿到模板代码

第一步是把模板仓库拉到本地。

```bash
git clone https://github.com/Zhong0118/moclabdemo.git
cd moclabdemo
```

如果你更习惯先在 GitHub Desktop 里下载也可以，但命令行方式通常最直接。

拉下来之后，先不要急着部署，建议先在本地跑通。

## 二、本地环境准备

这套项目使用的是 `Node.js + pnpm + Astro`。

如果你本地第一次跑前端项目，经常会遇到这几类问题：

- `npm` 版本太低
- `pnpm` 没安装
- `node` 版本太旧
- 安装依赖时报错

最省事的处理方式通常是：

1. 先安装一个新的 Node.js 版本
2. 再更新 npm
3. 再安装或更新 pnpm

建议直接安装当前可用的 Node.js LTS 版本。装好以后，先检查版本：

```bash
node -v
npm -v
pnpm -v
```

如果 `pnpm` 没有安装，可以执行：

```bash
npm install -g pnpm
```

如果 `pnpm` 太旧，也可以更新：

```bash
npm install -g pnpm@latest
```

如果你本地之前装过很老的 Node，最常见的现象是：

- `pnpm install` 过程中报语法错误
- Astro 相关依赖安装失败
- 构建时提示 Node 版本不满足要求

这时候不要死磕旧环境，直接把 Node 换新通常最快。

## 三、安装依赖并本地运行

环境准备好以后，在项目根目录执行：

```bash
pnpm install
```

安装完成后，先本地启动开发环境：

```bash
pnpm dev
```

如果只是验证构建是否正常，也可以直接跑：

```bash
pnpm build
```

只要 `pnpm build` 能通过，就说明这套博客的核心静态构建链路是通的，后面接 Vercel 时会顺很多。

## 四、把模板改成你自己的博客

模板拉下来之后，至少要先改下面几类内容。

### 1. 改个人信息

最核心的站点信息配置在：

```text
src/config/moclabSite.ts
```

这里通常要改：

- 网站名称
- 你的名字
- 身份介绍
- 简介
- GitHub 链接
- 邮箱
- 导航菜单

### 2. 改网站基础配置

站点级设置在：

```text
src/config/siteConfig.ts
```

这里通常会改：

- 站点标题
- 副标题
- `site_url`
- 主题色配置
- 默认明暗模式
- 页面开关

如果后面你换成自己的域名，这里的 `site_url` 最好也同步改成正式地址。

### 3. 改头像和个人卡片

头像路径和个人卡片信息主要来自：

```text
src/config/moclabSite.ts
src/config/profileConfig.ts
```

### 4. 改博客文章

文章写在：

```text
src/content/posts/
```

你可以删掉默认示例文章，也可以保留一部分再慢慢替换。

### 5. 改 About、友链、赞赏、公告

常见内容入口如下：

```text
关于页：src/content/spec/about.md
友链：src/config/friendsConfig.ts
赞赏：src/config/sponsorConfig.ts
公告：src/config/announcementConfig.ts
壁纸与横幅：src/config/backgroundWallpaper.ts
```

如果你后面只想维护博客内容，不想每次都翻代码，可以直接看我前面写的维护说明：

```text
docs/blog-system-guide.md
```

## 五、把这个项目放到你自己的 GitHub

当你在本地改完自己的内容后，不建议一直继续推原模板仓库，最好建立一个属于你自己的 GitHub 仓库。

### 方案一：新建自己的空仓库，然后绑定远程

先去 GitHub 上新建一个新的 repository，例如：

```text
my-blog
```

然后在本地项目目录执行：

```bash
git remote -v
```

如果当前远程还是模板仓库，你可以改成自己的仓库：

```bash
git remote remove origin
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

然后提交并推送：

```bash
git add .
git commit -m "init my blog"
git branch -M main
git push -u origin main
```

### 方案二：直接在 GitHub 上导入模板后再拉本地

如果你不想手动改远程，也可以先在 GitHub 上创建自己的仓库，再把本地代码推上去，本质上是一样的。

## 六、什么时候适合开始接 Vercel

建议满足下面几件事后再接 Vercel：

1. 本地 `pnpm install` 正常
2. 本地 `pnpm build` 能过
3. 站点标题、个人信息、基础配置至少已经改成自己的
4. 代码已经推到你自己的 GitHub 仓库

只要这几件事都满足，Vercel 那边一般就比较顺。

## 七、用 Vercel 部署博客

### 1. 登录 Vercel

打开：

```text
https://vercel.com/
```

建议直接用 GitHub 账号登录，这样后面导入仓库最方便。

### 2. 导入你的 GitHub 仓库

登录后：

1. 点击 `Add New...`
2. 选择 `Project`
3. 授权 Vercel 访问你的 GitHub
4. 选择你刚才新建的博客仓库

### 3. 检查构建配置

像这种 Astro 静态站点，一般 Vercel 会自动识别。

通常重点只要确认：

```text
Framework Preset: Astro
Install Command: pnpm install
Build Command: pnpm build
Output Directory: dist
```

如果它已经自动识别好了，通常不需要额外改。

### 4. 开始部署

确认没问题后直接点部署。

部署成功后，你会先拿到一个 Vercel 提供的默认域名，例如：

```text
your-project.vercel.app
```

这时候你就已经可以先访问站点了。

建议先用这个默认域名检查：

- 首页能不能打开
- 文章页能不能打开
- 分类、标签、归档是否正常
- 图片资源是否正常
- 自定义页面是否正常

## 八、买自己的域名

如果你想正式长期使用，下一步通常就是买域名。

域名在哪里买都可以，常见平台都行。买的时候有几个简单建议：

- 优先选择短、容易记的域名
- 尽量避免太复杂的拼写
- 如果是个人站，`.com`、`.top`、`.xyz` 之类都比较常见
- 如果你以后要长期使用，尽量一开始就确定好主域名

比如你最后可能会用：

```text
www.example.com
example.com
```

## 九、把域名接到 Cloudflare

Cloudflare 在这套流程里主要负责：

- DNS 管理
- 域名解析
- HTTPS 辅助
- 后续缓存、安全和规则管理

### 1. 注册并登录 Cloudflare

打开：

```text
https://www.cloudflare.com/
```

注册账号并登录。

### 2. 把域名添加到 Cloudflare

在 Cloudflare 后台添加你的站点，例如：

```text
example.com
```

Cloudflare 会扫描你当前已有的 DNS 记录。如果你是新域名，没有太多记录也没关系。

### 3. 修改域名注册商的 Nameserver

这是 Cloudflare 接入里最关键的一步。

Cloudflare 会给你两条 Nameserver，例如：

```text
xxx.ns.cloudflare.com
yyy.ns.cloudflare.com
```

你需要回到你买域名的平台，在域名管理面板里，把原来的 Nameserver 改成 Cloudflare 提供的这两条。

这一步完成后，域名的 DNS 控制权才真正切到 Cloudflare。

注意：

- Nameserver 生效通常需要一点时间
- 有时几分钟，有时几个小时
- 不同注册商传播时间不一样

## 十、把域名绑定到 Vercel

等 Cloudflare 接管好域名之后，就可以回到 Vercel 里绑定正式域名。

### 1. 在 Vercel 项目里添加 Domain

进入你的 Vercel 项目后台：

1. 打开项目
2. 进入 `Settings`
3. 找到 `Domains`
4. 添加你的域名

例如：

```text
example.com
www.example.com
```

### 2. 按照 Vercel 提示配置 DNS

如果你使用的是 Cloudflare，通常需要在 Cloudflare 的 DNS 里添加 Vercel 要求的记录。

常见情况一般是下面两类：

#### 根域名

可能需要：

- `A` 记录
- 或 `ALIAS / CNAME Flattening` 形式

#### `www` 子域名

通常更常见的是：

- `CNAME`

Vercel 后台会明确告诉你应该填什么值，你按它给的值填就可以，不要死记固定 IP。

### 3. 在 Cloudflare 里添加 DNS 记录

到 Cloudflare 的 `DNS` 页面，把 Vercel 要求的记录补上。

一个常见思路是：

- `@` 指向主站
- `www` 指向 Vercel 分配的目标

如果你不确定是否要开 Cloudflare 代理，前期建议先使用更稳妥的方式：

- 先保证解析正确
- 先让站点稳定可访问
- 后续再决定要不要开代理、缓存和其他安全规则

## 十一、域名生效后要同步改项目配置

一旦正式域名确定了，记得把项目里的站点地址也改掉。

配置位置：

```text
src/config/siteConfig.ts
```

重点改这个字段：

```ts
site_url: "https://你的正式域名"
```

例如：

```ts
site_url: "https://www.moclab.top"
```

这样会影响：

- sitemap
- RSS
- 部分 SEO 元信息
- 站点分享链接

改完后重新提交并推送，Vercel 会自动重新部署。

## 十二、后续更新博客的日常流程

当站点已经跑通以后，后面的更新其实就很简单了。

平时你大概只需要做下面这些事：

1. 本地改文章或配置
2. 本地运行 `pnpm dev`
3. 本地检查无误后执行 `pnpm build`
4. 提交到你自己的 GitHub
5. Vercel 自动触发重新部署

也就是说，后面真正的更新链路通常是：

```text
本地修改 -> git commit -> git push -> Vercel 自动部署
```

## 十三、最容易遇到的坑

### 1. Node 或 pnpm 版本太旧

这是最常见的问题之一。

现象通常包括：

- 依赖装不上
- 构建报错
- 某些包语法不兼容

处理方式通常就是：

- 更新 Node
- 更新 npm
- 更新 pnpm

### Windows 新手最常见报错排查

如果你是在 Windows 上第一次跑这个项目，下面这些问题最常见。

#### 1. `node`、`npm` 或 `pnpm` 命令找不到

现象通常是：

```text
'node' 不是内部或外部命令
'pnpm' 不是内部或外部命令
```

这一般说明：

- Node.js 还没安装
- 安装了但没有正确加入系统环境变量
- 终端还没有重新打开

建议处理顺序：

1. 重新安装最新的 Node.js LTS
2. 安装完后关闭当前终端，再重新打开
3. 重新执行 `node -v`、`npm -v`
4. 如果 `pnpm` 还没有，再执行 `npm install -g pnpm`

#### 2. 安装依赖时卡住或报网络错误

现象可能包括：

- `pnpm install` 很慢
- 下载某些包失败
- registry 连接异常

这类问题很多时候不是项目本身坏了，而是网络或镜像源问题。可以先检查你的网络环境，再重新执行：

```bash
pnpm install
```

如果你之前切过奇怪的镜像源，也建议顺手检查一下 `npm` 和 `pnpm` 的 registry 配置。

#### 3. 执行脚本时报 PowerShell 权限或策略问题

有些 Windows 环境里，PowerShell 可能会对脚本执行更敏感。

如果你遇到的不是代码报错，而是系统层面的执行限制，最稳妥的方式通常是：

- 改用普通终端重新执行
- 或者用管理员身份重新打开终端
- 或者优先用 `cmd` / Windows Terminal 测试是不是 PowerShell 环境问题

不要一上来就怀疑项目代码有问题，先把终端环境和权限分开排查。

#### 4. `pnpm install` 后仍然跑不起来

这时建议按下面顺序排查：

1. 先确认 Node 版本是不是过旧
2. 再确认 `pnpm -v` 是否正常
3. 删除失败后残留的依赖缓存再重新安装
4. 重新执行 `pnpm build`

如果换了新版 Node 和新版 pnpm 之后还是不行，通常再看具体报错信息定位会更有效。

#### 5. 本地能打开，但样式或图片不对

这类问题通常优先检查：

- 图片路径是否真实存在
- 配置里的路径是不是写错
- 是否改动了 `src/config/` 下的关键文件
- 是否有文章 frontmatter 写错导致页面结构异常

建议优先用：

```bash
pnpm build
```

去检查最终构建结果，因为很多内容层问题会在构建阶段直接暴露出来。

### 2. 本地能跑，Vercel 构建失败

常见原因：

- 有资源路径写错
- 配置文件改坏
- frontmatter 格式不合法
- 某些图片路径不存在
- 环境和本地依赖缓存不一致

所以每次上线前，最好先本地跑：

```bash
pnpm build
```

### 3. 域名加上后打不开

常见原因：

- Cloudflare 的 Nameserver 还没完全生效
- DNS 记录没有按 Vercel 要求填写
- 根域名和 `www` 只配了一部分
- HTTPS 证书还在签发中

这类问题通常不是代码问题，而是域名解析和 DNS 配置问题。

### Cloudflare 和 Vercel 的 DNS 示例

这一段不写死某一个固定值，因为 Vercel 后台给出的目标值才是最终标准，但可以先理解常见配置长什么样。

#### 例子 1：根域名 `example.com`

在 Vercel 里添加：

```text
example.com
```

然后 Vercel 可能会提示你在 Cloudflare 里添加根域名解析记录。常见形式类似：

```text
Type: A
Name: @
Value: 76.76.21.21
```

或者 Vercel 也可能根据你的项目类型给出别的建议。这里最重要的原则是：

- 以 Vercel 后台提示为准
- 不要死记某一个旧教程里的固定 IP

#### 例子 2：`www.example.com`

在 Vercel 里再添加：

```text
www.example.com
```

Cloudflare 里常见会配置成：

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

同样，这里的目标值也应以 Vercel 后台当时给你的内容为准。

#### 例子 3：主域名跳转到 `www`

有些人喜欢统一把：

```text
example.com
```

跳到：

```text
www.example.com
```

也有人反过来统一到裸域名。这个没有绝对标准，但建议你只保留一个主入口，避免：

- 搜索引擎收录分散
- 分享链接不统一
- 自己后续维护混乱

通常可以在 Vercel 的域名设置里指定首选域名。

#### 在 Cloudflare 后台里你通常会看到什么

一个比较常见的 DNS 结果可能长这样：

```text
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

有时你还会看到：

```text
TXT
CAA
MX
```

这些不一定都和博客本身直接相关，不要看到记录多就慌。对博客站点来说，最关键的是先把：

- 根域名
- `www`

这两个访问入口跑通。

#### Cloudflare 代理要不要开

Cloudflare 里每条记录旁边一般会有代理开关。

前期建议是：

1. 先按 Vercel 的要求把解析配正确
2. 先确认站点可以正常打开
3. 再决定是否开启代理、缓存和其他规则

如果一开始就同时改很多开关，后面出问题时不容易判断是：

- Vercel 绑定问题
- Cloudflare DNS 问题
- Cloudflare 代理问题

#### 一个更稳的实际顺序

如果你第一次做这套流程，我建议 DNS 相关就按这个节奏来：

1. 在 Vercel 里先添加域名
2. 看 Vercel 明确要求你填什么记录
3. 去 Cloudflare 一条一条照着填
4. 等解析生效
5. 确认 `example.com` 和 `www.example.com` 都能访问
6. 再决定哪个作为主域名
7. 最后回项目里同步修改 `site_url`

### 4. 改了配置但线上没更新

先检查：

- 代码是不是已经 push 到自己的 GitHub
- Vercel 是否触发了新的 deploy
- 改的是不是正确的配置文件

## 十四、我自己建议的实际顺序

如果从零开始，我会建议按下面顺序做：

1. 克隆模板仓库 `https://github.com/Zhong0118/moclabdemo.git`
2. 安装新的 Node.js
3. 安装或更新 pnpm
4. 执行 `pnpm install`
5. 执行 `pnpm dev` 和 `pnpm build`
6. 把站点标题、个人信息、头像、文章、友链、赞赏先改成自己的
7. 创建自己的 GitHub 仓库并 push
8. 在 Vercel 导入仓库并完成第一次部署
9. 买域名
10. 把域名接到 Cloudflare
11. 在 Vercel 绑定域名
12. 在 Cloudflare 按 Vercel 提示配置 DNS
13. 回项目里把 `site_url` 改成正式域名
14. 再次 push，等待 Vercel 自动重建

## 十五、最后的理解

这套博客真正的核心并不是“如何点一下部署按钮”，而是把下面这条链路稳定下来：

```text
模板代码
-> 本地可运行
-> 内容和配置改成自己的
-> 托管到自己的 GitHub
-> Vercel 自动部署
-> Cloudflare 管理 DNS
-> 绑定自己的正式域名
```

只要这条链路打通，后面维护博客其实就会轻松很多。

对我来说，部署不是项目的终点，而是开始稳定写作和持续迭代的起点。
