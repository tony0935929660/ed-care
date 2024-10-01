import { createApp } from 'vue'
import router from './router';
import pinia from './store';
// style
import '@/assets/style/base.css';
import '@/assets/style/public.scss';
import '@/assets/style/systemCollapse.scss';
// main vue
import App from './App.vue'

// 1. 引入你需要的组件
import { 
  Collapse, CollapseItem,
  Toast,
  NavBar,
  Icon,
  Field, CellGroup,
  Picker, Popup,
  Checkbox, CheckboxGroup,
  BackTop,
  Form,
  DatePicker,
  TimePicker,
  Calendar,
  Rate,
  Empty,
  Dialog,
  Image as VanImage,
  Uploader,
  List, Cell,
} from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';

/** Register Vue */
const vue = createApp(App)
.use(router)
.use(pinia)
.use(Collapse)
.use(CollapseItem)
.use(Toast)
.use(NavBar)
.use(Icon)
.use(Field)
.use(CellGroup)
.use(Picker)
.use(Popup)
.use(Checkbox)
.use(CheckboxGroup)
.use(BackTop)
.use(Form)
.use(DatePicker)
.use(TimePicker)
.use(Calendar)
.use(Rate)
.use(Empty)
.use(Dialog)
.use(VanImage)
.use(Uploader)
.use(List)
.use(Cell);

router.isReady().then(() => vue.mount('#app'));