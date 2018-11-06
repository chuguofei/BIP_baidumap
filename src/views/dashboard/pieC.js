module.exports = {
    bar: {
      chart: {
        type: 'pie',
        spacing: [0, 0, 0, 0],
        margin: [0, 0, 0, 0],
        height: '180px'
      },
      title: { text: '', floating: true, align: 'center', verticalAlign: 'middle', },
      colors: ['#F7464A', '#46BFBD', '#FDB45C','#4CBE5D'],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderWidth: 0,
          innerSize: '60%',
          shadow: false,
          center: ['50%', '50%'],
          dataLabels: {
            enabled: false
          },
          showInLegend: true,
          point: {
            events: {
              click(e) {
                this.series.chart.setTitle({ text: this.name + '<br/>' + Math.round(this.percentage * 100) / 100 + '%' });
              }
            }
          },
        }
      },
      tooltip: { enabled: false },
      legend: {
        enabled: true,
        symbolRadius: 3,
        align: 'left',
        verticalAlign: 'middle',
        floating: true,
        layout: "vertical"
      },
      series: [{
        type: 'pie',
        data: [
          { name: '收入', y: 20 },
          { name: '成本', y: 15 },
          { name: '利润', y: 5 },
        ]
      }]
  
    }
  }