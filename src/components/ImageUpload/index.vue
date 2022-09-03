<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :http-request="upload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5"; //引入腾讯云Cos包
//实列化cos对象
const cos = new COS({
  SecretId: "AKIDqUszpOfhTyCArGOGsDH4apnUw84j6D3g",
  SecretKey: "PYQ1KNAhxwe6HBpBG4cttb2D8l7C0Ypq",
});

export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: "",
      fileUid: null, //记录当前正在上传的uid
      percent: 0,
      showPercent: false, //进度条显示
    };
  },
  methods: {
    //预览图片
    preview(file) {
      this.showDialog = true;
      this.imgUrl = file.url;
    },
    //删除图片
    handleRemove() {
      this.fileList = [];
      this.imgUrl = "";
    },
    //添加图片
    changeFile(file, fileList) {
      this.fileList = fileList.map((item) => item);
      this.fileUid = file.uid;
      this.showPercent = true;
    },
    //上传图片
    upload(params) {
      if (params.file) {
        //执行上传操作
        cos.putObject(
          {
            Bucket: "hdk-1313637238", // 存储桶
            Region: "ap-chengdu", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            //上传成功
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map((item) => {
                if (this.fileUid === item.uid) {
                  return { url: `http://${data.Location}`, upload: true };
                }
                return item;
              });
              //关闭进度条
              setTimeout(() => {
                this.showPercent = false;
                this.percent = 0;
              }, 2000);
            }
          }
        );
      }
    },
  },
  computed: {
    //判断图片数量是否显示加号
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
};
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
/* .pro {
  margin-left: 50px;
  margin-top: 10px;
} */
</style>