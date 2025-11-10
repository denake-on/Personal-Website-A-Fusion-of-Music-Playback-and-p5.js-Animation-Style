# 项目：视觉导航机器人

本项目结合 SLAM 与深度学习，实现未知室内环境的自主导航与避障。

## 亮点
- ORB-SLAM2 / VINS 等方案对比与选型
- 端到端导航策略 vs 经典规划的融合
- 回环检测与地图构建优化

## 实验
- 仿真环境：Gazebo
- 真实环境：办公楼层与宿舍走廊

```bash
roslaunch nav_bringup mapping.launch
```

> 后续将开源关键模块与评测脚本。


