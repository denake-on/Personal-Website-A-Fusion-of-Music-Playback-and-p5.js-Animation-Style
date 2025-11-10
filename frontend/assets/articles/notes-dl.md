# 读书笔记：《深度学习导论》

记录对关键章节的理解与实践要点。

## 基础
- 过拟合与正则化：L2、Dropout
- 激活函数选择与梯度消失

## 训练技巧
- 学习率策略：Cosine / Warmup
- BatchNorm 与 LayerNorm 取舍

```python
# 线性层 + 激活 + Dropout
x = F.dropout(F.relu(self.fc(x)), p=0.2, training=self.training)
```

> 后续将补充 Transformer 章节与实验复现。


