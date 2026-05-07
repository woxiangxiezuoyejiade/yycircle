---
title: AIGC 检测与模型溯源项目记录
published: 2026-05-01
description: 记录 AIGC 文本检测与模型归因项目中的方法、实验和工程实现。
tags: [AIGC Detection, Model Attribution, NLP]
category: AIGC Detection
---

AIGC 检测与模型溯源的难点并不只是分类精度，更在于开放环境下的稳定性和泛化能力。

## 我正在关注的方法线

当前比较关注的信号包括：

- Neural Classifier
- Perplexity-based Features
- Stylometric Signals
- Open-set Rejection

这些方法各有优点，但单独使用时也各自存在局限。

## 工程实现里常见的问题

在真正搭实验平台时，我最常碰到的问题反而不是模型本身，而是：

- 数据来源和标注标准不一致
- 不同模型家族风格差异带来的偏移
- 推理速度与特征提取成本之间的权衡
- 开集样本和分布外样本的处理方式

## 接下来会继续记录什么

这个方向后续会继续记录：

- 数据组织与实验协议
- 特征工程与模型选择
- 归因任务和检测任务的拆分
- 面向真实场景的失败案例

我希望最终把它沉淀成一个既能做研究、也能支撑工程实验的平台。
