# 科研：多模态语义对齐

提出新的跨模态对齐损失，在图文检索任务上取得更优表现。

## 方法
- 结合 InfoNCE 与结构对齐约束
- 引入温度参数的自适应调整
- 负样本强化：hard negatives 采样

## 结果
- Flickr30k / MSCOCO 上检索指标提升 1.5%~2.3%
- 消融实验验证各模块有效

```python
loss = info_nce(text, image) + lambda_align * align_loss(text, image)
```

> 后续将开源训练配置与复现实验脚本。


