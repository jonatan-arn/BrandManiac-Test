const loadPieHeader = (influcard) => {
  pieheader(influcard.reach_formated_graph, 0x2e63b7, "reachdiv");
  pieheader(influcard.relevance_formated_graph, 0xffd332, "relevancediv");
  pieheader(influcard.resonance_formated_graph, 0x32ffd3, "resonancediv");
};

const pieheader = (number, color, id) => {
  let root = am5.Root.new(id);
  const end = 100 - number;
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
  // start and end angle must be set both for chart and series
  let chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
    })
  );

  // Create series
  // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
  // start and end angle must be set both for chart and series
  let series = chart.series.push(
    am5percent.PieSeries.new(root, {
      radius: am5.percent(95),
      innerRadius: am5.percent(85),
      valueField: "value",
      categoryField: "category",
      alignLabels: false,
    })
  );

  series.states.create("hidden", {
    startAngle: 180,
    endAngle: 180,
  });

  series.slices.template.setAll({
    templateField: "sliceSettings",
    strokeOpacity: 0,
  });

  series.labels.template.setAll({
    textType: "circular",
  });

  series.slices.template.states.create("hover", { scale: 1 });
  series.slices.template.states.create("active", { shiftRadius: 0 });
  series.labels.template.set("forceHidden", true);

  series.ticks.template.setAll({
    forceHidden: true,
  });
  series.slices.template.set("tooltipText", "");

  // Set data
  // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
  series.data.setAll([
    {
      category: "",
      value: number,
      sliceSettings: { fill: am5.color(color) },
    },
    {
      category: "",
      value: end,
      sliceSettings: { fill: am5.color(0xf7f7f7) },
    },
  ]);
};
export { loadPieHeader };
