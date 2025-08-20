// 物品数据模型
class Good {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || "";
    this.purchaseDate = data.purchase_date || data.purchaseDate || new Date();
    this.expiryDate = data.expiry_date || data.expiryDate || new Date();
    this.quantity = data.quantity || 1;
    this.unit = data.unit || "个";
    this.notes = data.notes || "";
    this.imageUrl = data.image_url || data.imageUrl || "";
    this.category = data.category || "";
    this.userId = data.user_id || data.userId || null;
    this.createdAt = data.created_at || data.createdAt || new Date();
    this.updatedAt = data.updated_at || data.updatedAt || new Date();
  }

  // 计算剩余天数
  getDaysRemaining() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(this.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(diffDays, 0);
  }

  // 获取物品状态
  getStatus() {
    const daysRemaining = this.getDaysRemaining();

    if (daysRemaining === 0) {
      return "expired";
    } else if (daysRemaining <= 3) {
      return "expiring_soon";
    } else if (daysRemaining <= 7) {
      return "expiring_week";
    } else {
      return "fresh";
    }
  }

  // 转换为数据库格式
  toDatabaseObject() {
    return {
      name: this.name,
      purchase_date: this.purchaseDate,
      expiry_date: this.expiryDate,
      quantity: this.quantity,
      unit: this.unit,
      notes: this.notes,
      image_url: this.imageUrl,
      category: this.category,
      user_id: this.userId,
    };
  }

  // 从数据库对象创建实例
  static fromDatabaseObject(data) {
    return new Good({
      id: data.id,
      name: data.name,
      purchaseDate: new Date(data.purchase_date),
      expiryDate: new Date(data.expiry_date),
      quantity: parseFloat(data.quantity),
      unit: data.unit,
      notes: data.notes,
      imageUrl: data.image_url,
      category: data.category,
      userId: data.user_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    });
  }

  // 验证物品数据
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push("物品名称不能为空");
    }

    if (this.name && this.name.length > 255) {
      errors.push("物品名称不能超过255个字符");
    }

    if (!this.purchaseDate || !(this.purchaseDate instanceof Date)) {
      errors.push("购买日期无效");
    }

    if (!this.expiryDate || !(this.expiryDate instanceof Date)) {
      errors.push("过期日期无效");
    }

    if (this.purchaseDate && this.expiryDate) {
      if (this.expiryDate <= this.purchaseDate) {
        errors.push("过期日期必须晚于购买日期");
      }
    }

    if (!this.quantity || this.quantity <= 0) {
      errors.push("数量必须大于0");
    }

    if (!this.unit || this.unit.trim().length === 0) {
      errors.push("单位不能为空");
    }

    if (this.unit && this.unit.length > 50) {
      errors.push("单位不能超过50个字符");
    }

    if (this.notes && this.notes.length > 1000) {
      errors.push("备注不能超过1000个字符");
    }

    if (this.imageUrl && this.imageUrl.length > 1000) {
      errors.push("图片URL不能超过1000个字符");
    }

    if (this.category && this.category.length > 100) {
      errors.push("分类不能超过100个字符");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 创建用于API响应的对象
  toApiResponse() {
    return {
      id: this.id,
      name: this.name,
      purchaseDate: this.purchaseDate.toISOString().split("T")[0],
      expiryDate: this.expiryDate.toISOString().split("T")[0],
      quantity: this.quantity,
      unit: this.unit,
      notes: this.notes,
      imageUrl: this.imageUrl,
      category: this.category,
      daysRemaining: this.getDaysRemaining(),
      status: this.getStatus(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

module.exports = Good;
