const path = require("path");

const {
  fileUploadError,
  unSupportedFileType,
  publishGoodsError,
  invalidGoodsID,
} = require("../constant/err.type");

const {
  createGoods,
  updateGoods,
  findGoods,
  findUser,
  updateAdmin
} = require("../service/my.service");

class GoodsController {
  async upload(ctx, next) {
    console.log(ctx.request.files);
    const { file } = ctx.request.files;
    // console.log(file)
    const fileTypes = ["image/jpeg", "image/png"];
    if (file) {
      if (!fileTypes.includes(file.type)) {
        return ctx.app.emit("error", unSupportedFileType, ctx);
      }
      ctx.body = {
        code: 0,
        message: "图片上传成功",
        result: {
          goods_img: path.basename(file.path),
        },
      };
    } else {
      return ctx.app.emit("error", fileUploadError, ctx);
    }
  }
  async create(ctx) {
    try {
      const { createdAt, updatedAt, ...res } = await createGoods(
        ctx.request.body
      );
      ctx.body = {
        code: 0,
        message: "创建成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
      return ctx.app.emit("error", publishGoodsError, ctx);
    }
  }
  async update(ctx) {
    try {
      const res = await updateGoods(ctx.params.id, ctx.request.body);

      if (res) {
        ctx.body = {
          code: 0,
          message: "修改成功",
          result: "",
        };
      } else {
        // return ctx.app.emit('error', invalidGoodsID, ctx)
      }
    } catch (err) {
      console.error(err);
    }
  }
  async findAll(ctx) {
    try {
      // 1. 解析pageNum和pageSize
      let { name } = ctx.query;
      // 2. 调用数据处理的相关方法
      const res = await findGoods(name);
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: "获取列表成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
    }
  }
  async getUser(ctx) {
    try {
      // 1. 解析pageNum和pageSize
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      // 2. 调用数据处理的相关方法
      const res = await findUser(pageNum, pageSize);
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: "获取用户列表成功",
        result: res,
      };
    } catch (err) {
      console.error(err);
    }
  }
  async updatetUser(ctx) {
    try {
      const res = await updateAdmin(ctx.params.id, ctx.request.body);

      if (res) {
        ctx.body = {
          code: 0,
          message: "修改成功",
          result: "",
        };
      } else {
        // return ctx.app.emit('error', invalidGoodsID, ctx)
      }
    } catch (error) {
      console.error(err);
    }
  }
}

module.exports = new GoodsController();
