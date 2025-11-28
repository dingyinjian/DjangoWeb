<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// === 数据定义 ===
const city = ref('Beijing')
const weather = ref(null)
const loading = ref(false)
const error = ref('')
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY // 推荐使用环境变量

// === 获取天气函数 ===
const fetchWeather = async () => {
  if (!city.value.trim()) return

  loading.value = true
  error.value = ''
  weather.value = null

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city.value,
        appid: '2fa32b106ae25e361b2a62f50344d999',
        units: 'metric', // 摄氏度
        lang: 'zh_cn'   // 中文描述（可选）
      }
    })

    weather.value = response.data
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = '城市未找到，请检查名称'
    } else if (err.response?.status === 401) {
      error.value = 'API Key 无效，请检查配置'
    } else {
      error.value = '网络错误或服务不可用'
    }
    console.error('获取天气失败:', err)
  } finally {
    loading.value = false
  }
}

// === 页面加载时获取默认城市天气 ===
onMounted(() => {
  fetchWeather()
})

// === 工具函数：获取天气图标 URL ===
const getIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
</script>

<template>
  <div class="weather-widget">
  
    <!-- 错误提示 -->
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <!-- 天气信息 -->
    <div v-else-if="weather" class="weather-info">
      <div>{{ weather.name }}, {{ weather.sys.country }}</div>
      <div class="temp">{{ Math.round(weather.main.temp) }}°C</div>
      <div class="description">{{ weather.weather[0].description }}</div>
      <img
        :src="getIconUrl(weather.weather[0].icon)"
        :alt="weather.weather[0].description"
        class="weather-icon"
      />
      <p>体感温度 {{ Math.round(weather.main.feels_like) }}°C</p>
      <p>湿度 {{ weather.main.humidity }}%</p>
    </div>

    <div v-else-if="!error && !loading" class="placeholder">
      输入城市查看天气
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  max-width: 400px;
  /* margin: 2rem auto; */
  padding: 1.5rem;
  border-radius:5px;
  /* background: linear-gradient(135deg, #7f7fd5, #86a8e7); */
  background:#ffffff0d;
  /* color: white; */
  text-align: center;
  /* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; */
  border: 1px solid #ffffff1a;
  border-radius: 8px;
}

.search-box input {
  padding: 0.6rem 1rem;
  width: 70%;
  border: none;
  border-radius: 6px 0 0 6px;
  outline: none;
}

.search-box button {
  padding: 0.6rem 1rem;
  background: #4a4a9c;

  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
}

.search-box button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  color: #ff6b6b;
  font-weight: bold;
}

.weather-info {
  margin-top: 1.5rem;
}

.temp {
  font-weight: bold;
  margin: 0.5rem 0;
}

.description {
  text-transform: capitalize;
}

.weather-icon {
  margin: 1rem auto;
  max-width: 100px;
}

.placeholder {
  margin-top: 2rem;
  color: #ddd;
  font-style: italic;
}
</style>