---
title: AI Agent 学习路线与研究笔记
published: 2026-04-30
description: 整理 AI Agent 相关的学习路线、核心概念和研究问题。
tags: [Agent, Memory]
category: Agent
---

AI Agent 相关工作非常容易被“产品形态”带着走，但如果从研究角度看，还是需要先把问题空间拆清楚。

## 我目前的学习路线

我把学习内容大致分成四层：

1. Agent 基础能力：规划、工具调用、反思、工作流编排
2. 记忆系统：短期上下文、长期记忆、检索更新与遗忘
3. 运行边界：权限、工具沙箱、状态一致性、失败恢复
4. 安全与评测：Prompt Injection、工具滥用、记忆污染、系统级评测

## 当前最关心的问题

几个我认为值得持续跟踪的问题：

- 长上下文和长期记忆如何影响安全边界
- 工具调用链中哪些位置最容易形成提权
- 多 Agent 协作时，错误和风险如何传播
- 如何设计更贴近真实运行环境的 Agent Evaluation

## 记录方式

后续我会把这一方向拆成更细的专题，包括：

- Agent Memory 风险
- Prompt Injection 与防护
- Tool Use Security
- Runtime Safeguards

MocLab 的意义之一，就是把这些零散的笔记逐步变成结构化的研究材料。
