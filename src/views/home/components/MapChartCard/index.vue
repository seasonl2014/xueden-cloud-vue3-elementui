<template>

      <el-card shadow="never" class="cus-card homeBoxCard" v-loading="loading">
          <template #header>
            <span>{{t('page.home.mapchartcard.card-title')}}</span>
            <el-tag type="success" class="float-right">{{t('page.home.text-day')}}</el-tag>
          </template>
          <div class="height340" ref="worksChartRef" />
          <el-divider />

      </el-card>

</template>
<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref, watch } from "vue";
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
import { EChartOption } from 'echarts';
import useEcharts from '@/composables/useEcharts';
import { StateType as HomeStateType } from "../../store";
import { ChartDataType } from '../../data';

const mapChartOption: EChartOption = {
  tooltip: {
    trigger: 'item',
  },
  dataRange: {
    orient: "horizontal",
    min: 0,
    max: 55e3,
    text: ["高", "低"],
    splitNumber: 0
  },
  series: [
    {
      name: "最近30天浏览量",
      type: "map",
      mapType: "china",
      mapLocation: {
        x: "center"
      },
      selectedMode: "multiple",
      itemStyle: {
        normal: {
          label: {
            show: !0
          }
        },
        emphasis: {
          label: {
            show: !0
          }
        }
      },
      data: [
        //23,60,20,36,23,85,23
      ],
    },
  ],
};

interface WorksChartCardSetupData {
    t: Function;
    loading: boolean;
    worksChartRef: Ref;
}

export default defineComponent({
    name: 'MapChartCard',
    setup(): WorksChartCardSetupData {
        const store = useStore<{ Home: HomeStateType}>();
        const { t } = useI18n();

        // chart Data
        const chartData = computed<ChartDataType>(()=> store.state.Home.mapChartData.pv);
        console.info("地图chartData：",chartData.value)
        // echarts 图表
        const worksChartRef = ref<HTMLDivElement>();
        const echarts = useEcharts(worksChartRef, mapChartOption);
        watch([echarts, chartData],()=> {
          if(echarts.value) {
              const option: EChartOption = {
                series: [
                  {
                    // data: [3, 1, 1, 2, 2, 2, 2]
                    data: chartData.value,
                  },
                ],
              };
              echarts.value.setOption(option);
          }
        });

        // 读取数据 func
        const loading = ref<boolean>(true);
        const getData = async () => {
            loading.value = true;
            await store.dispatch('Home/queryMapChartData');
            loading.value = false;
        };

        onMounted(()=> {
           getData();
        });


        return {
            t,
            loading: loading as unknown as boolean,
            worksChartRef,
        }
    }
})
</script>
<style lang="scss" scoped>
.homeBoxCard {
  margin-bottom: 24px;
  ::v-deep(.el-card__header) {
    padding-left: 12px;
    padding-right: 12px;
  }
  ::v-deep(.el-card__body) {
    padding: 12px;
    font-size: 14px;
    line-height: 1.5715;
  }
  ::v-deep(.el-divider) {
    margin: 8px 0;
  }
  .num {
    font-size: 30px;
    color: #515a6e;
  }
  .height40 {
    height: 40px;
  }
}
</style>
