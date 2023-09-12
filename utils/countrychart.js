const loadCountry = (influcard) => {
  let countrys = influcard.insightsCountry.sort((a, b) => {
    return b.amount - a.amount;
  });
  for (let c of countrys) {
    const { country, percentage } = c;
    let country_container = document.getElementById("country_container");

    let column = document.createElement("div");
    let text = document.createElement("span");
    let chart = document.createElement("div");
    let number = document.createElement("div");
    text.textContent = country;
    number.textContent = `${percentage}%`;

    column.classList.add("column_year");
    text.classList.add("text_year");
    chart.classList.add("year");
    number.classList.add("year_number");
    chart.id = country;
    country_container.appendChild(column);
    column.appendChild(text);
    column.appendChild(chart);
    column.appendChild(number);
    countryChart(country, parseInt(percentage));
  }
};

const countryChart = (number, quantity) => {
  var root = am5.Root.new(number);

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      layout: root.verticalLayout,
    })
  );

  // Add legend
  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
    })
  );

  var data = [
    {
      category: "",
      from: 0,
      to: quantity,
      name: number,
      columnSettings: {
        fill: am5.color(0xfc0313),
      },
    },
  ];

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );
  yAxis.data.setAll([{ category: "" }]);

  yAxis.axisHeader.get("background").set("forceHidden", true);
  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      max: 100,
      numberFormat: "#'%'",
      renderer: am5xy.AxisRendererX.new(root, {}),
    })
  );

  xAxis.get("renderer").labels.template.set("forceHidden", true);

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "to",
      openValueXField: "from",
      categoryYField: "category",
      categoryXField: "name",
    })
  );

  series.columns.template.setAll({
    strokeWidth: 0,
    strokeOpacity: 0,
    height: am5.percent(100),
    templateField: "columnSettings",
  });

  series.data.setAll(data);

  series.appear();
  chart.appear(1000, 100);
};
export { loadCountry };
