const loadVideoChart = (influcard) => {
  let weekdata = [];
  influcard.account_post_day_data.map((w) => {
    let day = "";
    switch (w.day_id) {
      case "1":
        day = "L";
        break;
      case "2":
        day = "M";
        break;
      case "3":
        day = "X";
        break;
      case "4":
        day = "J";
        break;
      case "5":
        day = "V";
        break;
      case "6":
        day = "S";
        break;
      case "7":
        day = "D";
        break;
      default:
        break;
    }
    let value = parseFloat(w.vr_r);
    weekdata.push({ value, day, day_id: w.day_id });
  });
  weekdata.sort((a, b) => {
    return a.day_id - b.day_id;
  });
  videoChart(weekdata);
};

const videoChart = (data) => {
  var root = am5.Root.new("wekkchart");

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({});

  xRenderer.grid.template.setAll({
    location: 1,
  });

  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "day",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      numberFormat: "#'%'",

      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1,
      }),
    })
  );

  // Create series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "day",
    })
  );

  series.columns.template.setAll({
    strokeOpacity: 0,
  });
  series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  xAxis.data.setAll(data);
  series.data.setAll(data);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);
};
export { loadVideoChart };
