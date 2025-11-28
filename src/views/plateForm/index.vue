<template>
    <div id="plateformapp">
      <StarBackground />
        <div>
            <!-- Header -->
            <header class="plateformapp-header">
                <div style="border-right: 1px solid rgba(102,102,102,0.3);height: 100%;display: flex;align-items: center;padding: 15px;">
                    <img src="/src/assets/logo-whitebg.png" alt="" width="100px">
                </div>
                <div></div>
                <div style="padding: 0 20px;display: flex;justify-content: center;align-items: center;cursor: pointer;" @click="handleLogout">
                  <img src="/src/assets/loginOut.svg" alt="" srcset="" width="20px" style="margin-right: 5px;"/>
                    <span>退出登录</span>
                </div>
            </header>
            <div class="plateformapp-content">
                <div>
                    <div class="title">📅 日历</div>
                    <div>
                        <d-calendar></d-calendar>
                    </div>
                </div>
                <div>
                    <div class="title">📝 平台链接</div>
                    <platform-link></platform-link>
                </div>
                <div>
                  <div class="title">  <div>🌤️ 天气预报</div></div>
                  <weather-widget city="北京" unit="c"></weather-widget>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import DCalendar from '@/components/calendar/index.vue';
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { Session, Local } from "@/utils/storage";
import WeatherWidget from '@/components/weatherWidget/index.vue'; // 引入组件
import PlatformLink from '@/components/platformLink/index.vue';
import StarBackground from '@/components/StartBackground/index.vue'
const { t } = useI18n();
function handleLogout() {
 ElMessageBox({
          closeOnClickModal: false,
          closeOnPressEscape: false,
          title: t("message.user.logOutTitle"),
          message: t("message.user.logOutMessage"),
          showCancelButton: true,
          confirmButtonText: t("message.user.logOutConfirm"),
          cancelButtonText: t("message.user.logOutCancel"),
          buttonSize: 'default',
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = t("message.user.logOutExit");
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 700);
            } else {
              done();
            }
          },
        })
          .then(async () => {
            Session.clear(); // 清除缓存/token等
            window.location.reload();
          })
          .catch(() => {});
}
</script>

<style scoped lang="scss">
/* 基础样式 */
#plateformapp {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #ffffff;
    background-color: #151519;
    height: 100%;
    padding: 20px;

    &>div {
        max-width: 1600px;
        margin: 0 auto;

    }
}
.title{
    margin-bottom: 10px;
}
/* 头部样式 */
.plateformapp-header {
  position: relative;
    background-color: #17171c;
    height: 60px;
    text-align: center;
    color: white;
    border: 1px solid rgba(102, 102, 102, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    overflow: hidden; /* 防止光点溢出 */
}
.plateformapp-content{
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
    height: auto;
    &>div:nth-child(2){
        flex: 3;
    }
    &>div:nth-child(1),&>div:nth-child(3){
        flex: 2;
        max-width: 300px;
    }
}
</style>