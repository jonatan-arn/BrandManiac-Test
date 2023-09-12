const loadGenderPie = (influcard) => {
  const data = [
    {
      value: influcard.insight_perc_m,
      category: "Hombre",
    },
    {
      value: influcard.insight_perc_f,
      category: "Mujer",
    },
  ];
  genderRadiusPie(data);
};

const genderRadiusPie = (data) => {
  var root = am5.Root.new("genderpie");

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
  var chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    })
  );

  // Create series
  // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
  var series = chart.series.push(
    am5percent.PieSeries.new(root, {
      calculateAggregates: true,
      valueField: "value",
      categoryField: "category",
      alignLabels: false,
    })
  );

  // Set up adapters for variable slice radius
  // https://www.amcharts.com/docs/v5/concepts/settings/adapters/
  series.slices.template.adapters.add("radius", function (radius, target) {
    var dataItem = target.dataItem;
    var high = series.getPrivate("valueHigh");

    if (dataItem) {
      var value = target.dataItem.get("valueWorking", 0);
      return (radius * value) / high;
    }
    return radius;
  });
  series
    .get("colors")
    .set("colors", [am5.color(0x46c2f2), am5.color(0xcf3aae)]);
  // Set data
  // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
  series.data.setAll(data);
  series.slices.template.states.create("hover", { scale: 1 });
  series.slices.template.states.create("active", { shiftRadius: 0 });
  series.labels.template.set("forceHidden", true);
  series.ticks.template.setAll({
    forceHidden: true,
  });
  series.slices.template.set("tooltipText", "");

  // Create legend
  // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      marginTop: 15,
      marginBottom: 15,
      layout: root.verticalLayout,
    })
  );

  legend.data.setAll(series.dataItems);

  // Play initial series animation
  // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
  series.appear(1000, 100);
};

export { loadGenderPie };
