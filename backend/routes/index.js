const express = require("express");
const router = express.Router();
const supabase = require("../config/db");

// 基础健康检查
router.get("/health", (req, res) => {
  res.json({ status: "OK", service: "tracker-backend" });
});

// 数据库连接检查
router.get("/health/db", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        status: "ERROR",
        message: "Supabase未配置",
        guide: "请查看 config/supabase-setup.md 获取设置指南",
      });
    }

    // 测试数据库连接
    const { error } = await supabase.from("auth.users").select("id").limit(1);

    if (error) {
      throw error;
    }

    res.json({
      status: "OK",
      message: "数据库连接正常",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "数据库连接失败",
      error: error.message,
    });
  }
});

// 添加物品相关API路由
router.use("/goods", require("./goodsRoutes"));

module.exports = router;
