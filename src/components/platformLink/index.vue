<template>
  <div class="platformLink">
    <div class="tabs">
      <div v-for="value in categoryOptions" :key="value.dict_value" @click="handleTabClick(value.dict_value)"
        :class="['tab', { active: activeTab === value.dict_value }]">
        {{ value.dict_label }}
      </div>
    </div>
    <div class="tab-content">
      <div v-for="(item, index) in tableData" :key="index">
        <!-- <div><a :href="item.url" target="_blank" rel="noopener noreferrer" style="color:#d9c38c;text-decoration:none;">{{ item.title }}</a></div>
        <div><span style="color: #666;">{{ item.description }}</span></div> -->
        <div class="card-title">
          <div><img src="https://gips3.baidu.com/it/u=2728692158,262351799&fm=3081&app=3081&f=PNG?w=225&h=225" alt=""
              width="48px"></div>
          <div>
            <div>{{ item.title }}</div>
            <div style="font-size: 12px;color:#737580;">副标题副标题副标题副标题副标题副标题副标题</div>
          </div>
        </div>
        <div class="card-remark">
          一个模型上下文协议服务器，提供网页内容抓取功能，将HTML转换为Markdown以便于处理。
        </div>
        <div>
          <div style="color:#737580;font-size: 12px;">2025.09.19</div>
          <!-- <div></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';
import { listApi, getApiGroup } from '@/api/system/link';

const { proxy } = getCurrentInstance();
const tableData = ref([]);
const activeTab = ref(0);
const categoryOptions = ref([]);

onBeforeMount(async () => {
  await getTableList();
});

async function getTableList() {
  proxy.getDicts('link_category').then((response) => {
    categoryOptions.value = response.data.data;
    if (categoryOptions.value.length > 0) {
      const firstValue = categoryOptions.value[0].dict_value;
      activeTab.value = firstValue;
      handleQuery(firstValue);
    }
  });
}

const handleTabClick = (value) => {
  activeTab.value = value;
  handleQuery(value);
};

const handleQuery = (category) => {
  listApi({ category }).then((response) => {
    console.log(response);
    tableData.value = response.data.data;
  });
};
</script>

<style scoped lang="scss">
.platformLink {
  // border: 1px solid #ffffff1a;
  // border-radius: 12px;
  // padding: 16px;
  // background-color: #ffffff0d; /* 修改为纯黑色 */
  color: #e0e0e0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.tabs {
  border: 1px solid #ffffff1a;
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

.tab {
  padding: 10px 18px;
  cursor: pointer;
  position: relative;
  color: #aaa;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  z-index: 1;

  // 悬停效果：光晕 + 上浮
  &:hover {
    color: #fff;
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.08);
    // box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }

  // 修改后的激活状态颜色和去掉了横线虚线装饰
  &.active {
    color: #fff;
    background: linear-gradient(90deg, #2d3040 0%, #596cb6 100%);
    box-shadow: 0 4px 16px rgba(119, 120, 214, .29);
  }
}

.tab-content {
  padding: 12px 0;
  min-height: 120px;
  line-height: 1.6;
  font-size: 14px;
  display: flex;
  gap: 10px;
  &>div {
    background:#ffffff0d;
    border: 1px solid #ffffff1a;
    padding: 17px 14px;
    flex: 1;
    margin-bottom: 10px;
    border-radius: 8px;
    transition: transform 0.3s ease,box-shadow 0.3s ease,background 0.3s ease;;
  }
  &>div:hover{
    transform: translateY(-3px);
    box-shadow:  0 6px 30px 0 rgba(119, 120, 214, .29);
    background:url(https://mcpworld.bdstatic.com/store/v2/865ad5d/mcp-server-store/1a012b0/assets/mcpCardBg.35787ce4.png) no-repeat center center / cover;
  }
}

.card-title {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}
.card-remark{
  margin: 15px 0;
}
</style>