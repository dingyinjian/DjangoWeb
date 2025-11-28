<template>
  <div class="system-menu-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.app-container .el-dialog', '.app-container .el-dialog__header']">
          {{ title }}
        </div>
      </template>
      <el-form :model="state.ruleForm" :rules="state.ruleRules" ref="ruleFormRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="state.ruleForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="state.ruleForm.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="state.ruleForm.category" placeholder="请输入分类" filterable clearable allow-create
            style="width: 100%">
            <el-option v-for="group in state.categoryGroups" :key="group.dict_value" :label="group.dict_label"
              :value="group.dict_value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input type="textarea" v-model="state.ruleForm.description"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="封面图">
          <el-upload list-type="picture-card" :file-list="imgList" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :http-request="handleImageChange">
            <plus />
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { addApi, updateApi, getApiGroup, uploadSingleFile, uploadMultipleFiles } from "@/api/system/link";
import { ElMessage } from "element-plus";
import { Plus } from '@element-plus/icons-vue'
const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})
const imgList = ref([])
const emit = defineEmits(['ok'])
const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const previewUrl = ref('')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const images=ref([])
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  // 表单参数对象
  ruleForm: {
    id: 0,
    title: "",
    url: "",
    category: "",
    images: [''],
    description: "",
  },
  // 类型数据配置参数

  // 是否数据API鉴权
  enableOptions: [
    {
      "dict_value": "0",
      "dict_label": "需要"
    },
    {
      "dict_value": "1",
      "dict_label": "不需要"
    }
  ],
  categoryGroups: <any>[],
  // 表单校验
  ruleRules: {
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" },
    ],
    url: [
      { required: true, message: "链接不能为空", trigger: "blur" },
    ],
    category: [
      { required: true, message: "请选择分类", trigger: "blur" },
    ],

  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));
  if(row.images&&row.images.length>0){
  imgList.value=row.images.map((item,index)=>({name:item.split('/').pop() || 'image',url:import.meta.env.VITE_API_URL+item,uid:index+item.split('/').pop()}))
  }
  state.isShowDialog = true;
  state.loading = false;
  // 查询配置参数状态数据配置参数
  proxy.getDicts("link_category").then((response: any) => {
    state.categoryGroups = response.data.data;
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditApiModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 处理图片选择
// 处理图片选择并上传
const handleImageChange = async (file: any) => {
  console.log(file)
  const rawFile = file.file;
  if (!rawFile || !rawFile.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件');
    return;
  }
  try {
    // 显示 loading 或禁用按钮（可选）
    state.loading = true;
    // 调用独立上传接口
    const res = await uploadSingleFile(rawFile); // 你已封装好的方法
    imgList.value.push({name:res.original_name,url:import.meta.env.VITE_API_URL+res.url,uid:res.id})
    ElMessage.success('图片上传成功');
  } catch (error) {
    console.log(error)
    ElMessage.error('图片上传失败，请重试');
  } finally {
    state.loading = false;
  }
};
function handleRemove(file: any, fileList: any) {
  const index=imgList.value.findIndex(item=>item.uid===file.uid)
  if(index>-1){
    imgList.value.splice(index,1)
  }
}
function handlePictureCardPreview(file: any) {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;

  formWrap.validate((valid: boolean) => {
    console.log(imgList.value)
    if (valid) {
      // 构造普通对象，不再用 FormData（除非后端要求必须用 FormData）
      const payload = {
        title: state.ruleForm.title,
        url: state.ruleForm.url,
        category: state.ruleForm.category,
        description: state.ruleForm.description,
        images:imgList.value.map(item=>item.url.replace(/^https?:\/\/[^\/]+/, '')), // 现在是字符串 URL
        id: state.ruleForm.id
      };
      if (state.ruleForm.id && state.ruleForm.id !== 0) {
        updateApi(payload).then((response) => {
          ElMessage.success("修改成功");
          emit('ok');
          closeDialog(state.ruleForm);
        }).catch(() => {
          state.loading = false;
        });
      } else {
        addApi(payload).then((response) => {
          ElMessage.success("新增成功");
          emit('ok');
          closeDialog(state.ruleForm);
        }).catch(() => {
          state.loading = false;
        });
      }
    }
  });
};

defineExpose({
  openDialog,
});
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>