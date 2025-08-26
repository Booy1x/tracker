const express = require("express");
const router = express.Router();
const supabase = require("../config/db");

// GET /api/goods - 获取所有物品列表
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("goods")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("获取物品列表错误:", error);
      return res.status(500).json({
        success: false,
        message: "获取物品列表失败",
        error: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("获取物品列表异常:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error: error.message,
    });
  }
});

// GET /api/goods/:id - 获取单个物品详情
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 验证UUID格式
    if (
      !id ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "无效的ID格式",
      });
    }

    const { data, error } = await supabase
      .from("goods")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("获取物品详情错误:", error);
      return res.status(404).json({
        success: false,
        message: "物品不存在",
        error: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "物品不存在",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("获取物品详情异常:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error: error.message,
    });
  }
});

// POST /api/goods - 添加新物品
router.post("/", async (req, res) => {
  try {
    const { name, purchase_date, expiry_date, quantity, notes, category } =
      req.body;

    // 基础数据验证
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "物品名称不能为空",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "物品名称不能超过100个字符",
      });
    }

    // 验证日期格式
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (purchase_date && !dateRegex.test(purchase_date)) {
      return res.status(400).json({
        success: false,
        message: "购买日期格式错误，应为YYYY-MM-DD",
      });
    }

    if (expiry_date && !dateRegex.test(expiry_date)) {
      return res.status(400).json({
        success: false,
        message: "过期日期格式错误，应为YYYY-MM-DD",
      });
    }

    // 验证日期逻辑
    if (purchase_date && expiry_date) {
      const purchase = new Date(purchase_date);
      const expiry = new Date(expiry_date);
      if (expiry < purchase) {
        return res.status(400).json({
          success: false,
          message: "过期日期不能早于购买日期",
        });
      }
    }

    // 分类验证
    if (category && typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "分类必须是字符串",
      });
    }

    if (category && category.length > 100) {
      return res.status(400).json({
        success: false,
        message: "分类不能超过100个字符",
      });
    }

    // 创建新物品
    const newItem = {
      name: name.trim(),
      purchase_date: purchase_date || null,
      expiry_date: expiry_date || null,
      category: category ? category.trim() : null,
      notes: notes ? notes.trim() : null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("goods")
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error("添加物品错误:", error);
      return res.status(500).json({
        success: false,
        message: "添加物品失败",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "物品添加成功",
      data,
    });
  } catch (error) {
    console.error("添加物品异常:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error: error.message,
    });
  }
});

// DELETE /api/goods/:id - 删除物品
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 验证ID格式（UUID格式）
    if (
      !id ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "无效的ID格式",
      });
    }

    // 直接删除物品（不检查存在性，让数据库处理）
    const { data, error: deleteError } = await supabase
      .from("goods")
      .delete()
      .eq("id", id)
      .select(); // 返回被删除的行

    if (deleteError) {
      console.error("删除物品错误:", deleteError);
      return res.status(500).json({
        success: false,
        message: "删除物品失败",
        error: deleteError.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "物品不存在",
      });
    }

    res.json({
      success: true,
      message: "物品删除成功",
    });
  } catch (error) {
    console.error("删除物品异常:", error);
    res.status(500).json({
      success: false,
      message: "服务器内部错误",
      error: error.message,
    });
  }
});

module.exports = router;
