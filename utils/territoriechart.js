const loadTerritorie = (influcard) => {
  let territories = [];
  influcard.territories.map((t) => {
    const color = influcard.territories_color[t.territory_name.name];

    territories.push({
      value: parseFloat(t.perc),
      territorie: t.territory_name.name,
      color: color,
    });
  });
  territories = territories.sort((a, b) => {
    return a.value - b.value;
  });

  territoriechart(territories);
};

const territoriechart = (data) => {
  var root = am5.Root.new("territorieschart");

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
    })
  );

  // We don't want zoom-out button to appear while animating, so we hide it
  chart.zoomOutButton.set("forceHidden", true);

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var yRenderer = am5xy.AxisRendererY.new(root, {
    minGridDistance: 30,
  });

  yRenderer.grid.template.set("location", 1);

  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "territorie",
      renderer: yRenderer,
      tooltip: am5.Tooltip.new(root, { themeTags: ["axis"] }),
    })
  );

  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      extraMax: 0.1,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0.1,
      }),
    })
  );

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "territorie",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "left",
        labelText: "{valueX}",
      }),
    })
  );

  // Rounded corners for columns
  series.columns.template.setAll({
    cornerRadiusTR: 5,
    cornerRadiusBR: 5,
    strokeOpacity: 0,
  });
  let colors = [];
  data.map((d) => colors.push(am5.color(d.color)));

  chart.get("colors").set("colors", colors);
  // Make each column to be of a different color
  series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  yAxis.data.setAll(data);
  series.data.setAll(data);

  sortCategoryAxis();

  // Get series item by category
  function getSeriesItem(category) {
    for (var i = 0; i < series.dataItems.length; i++) {
      var dataItem = series.dataItems[i];
      if (dataItem.get("categoryY") == category) {
        return dataItem;
      }
    }
  }

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationX: 1,
      sprite: am5.Label.new(root, {
        text: "{valueXWorking.formatNumber('#.# a')}%",
        fill: root.interfaceColors.get("alternativeText"),
        centerX: am5.p100,
        centerY: am5.p50,
        populateText: true,
        fill: am5.color(0x000000),
      }),
    });
  });
  // Axis sorting
  function sortCategoryAxis() {
    // Sort by value
    series.dataItems.sort(function (x, y) {
      return x.get("valueX") - y.get("valueX"); // descending
      //return y.get("valueY") - x.get("valueX"); // ascending
    });

    // Go through each axis item
    am5.array.each(yAxis.dataItems, function (dataItem) {
      // get corresponding series item
      var seriesDataItem = getSeriesItem(dataItem.get("category"));

      if (seriesDataItem) {
        // get index of series data item
        var index = series.dataItems.indexOf(seriesDataItem);
        // calculate delta position
        var deltaPosition =
          (index - dataItem.get("index", 0)) / series.dataItems.length;
        // set index to be the same as series data item index
        dataItem.set("index", index);
        // set deltaPosition instanlty
        dataItem.set("deltaPosition", -deltaPosition);
        // animate delta position to 0
        dataItem.animate({
          key: "deltaPosition",
          to: 0,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    });

    // Sort axis items by index.
    // This changes the order instantly, but as deltaPosition is set,
    // they keep in the same places and then animate to true positions.
    yAxis.dataItems.sort(function (x, y) {
      return x.get("index") - y.get("index");
    });
  }

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000);
  chart.appear(1000, 100);
};
export { loadTerritorie };
