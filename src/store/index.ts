// Utilities
import { createPinia, type Pinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 創建 pinia
const pinia: Pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;

// Defined
import useApp from '@/store/appSetting';
import useSystem from '@/store/systemSetting';
import useUser from "@/store/userSetting";

export { useApp, useSystem, useUser };
