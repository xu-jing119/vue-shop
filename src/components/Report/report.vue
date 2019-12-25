<template>
  <div>
        <Mbx nav1='数据统计' nav2='数据报表'></Mbx>
        <!-- 卡片区域 -->
        <el-card>
             <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
        // 需要合并的数据
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created(){},
 async mounted(){
       // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status!==200){
            return this.$message.error('获取折线图数据失败')
        }


        // 指定图表的配置项和数据
     const result= _.merge(res.data,this.options)

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>
