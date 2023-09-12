const loadDay = (influcard) => {
  const moments = JSON.parse(influcard.post_moment_json);
  for (let k in moments) {
    let m = moments[k];
    let src = "";
    switch (m.type) {
      case "Noche":
        src = "assets/img/noche.svg";
        break;
      case "Tarde":
        src = "assets/img/tarde.svg";
        break;
      case "Mañana":
        src = "assets/img/mañana.svg";
        break;
    }
    m.pictureSettings = {
      src,
    };
    moments[k] = m;
  }

  // moments = moments.sort((a, b) => {
  //   return b.id - a.id;
  // });
  dayChart(moments);
};

const dayChart = (data) => {
  var root = am5.Root.new("daychart");

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([am5themes_Animated.new(root)]);

  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      paddingLeft: 50,
      paddingRight: 40,
    })
  );

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

  var yRenderer = am5xy.AxisRendererY.new(root, {});
  yRenderer.grid.template.set("visible", false);

  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "type",
      renderer: yRenderer,
      paddingRight: 40,
    })
  );

  var xRenderer = am5xy.AxisRendererX.new(root, {});
  xRenderer.grid.template.set("strokeDasharray", [3]);

  var xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: xRenderer,
    })
  );

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Income",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "value",
      categoryYField: "type",
      sequencedInterpolation: true,
      calculateAggregates: true,
      maskBullets: false,
      tooltip: am5.Tooltip.new(root, {
        dy: -30,
        pointerOrientation: "vertical",
        labelText: "{valueX}",
      }),
    })
  );

  series.columns.template.setAll({
    strokeOpacity: 0,
    cornerRadiusBR: 10,
    cornerRadiusTR: 10,
    cornerRadiusBL: 10,
    cornerRadiusTL: 10,
    maxHeight: 15,
    fillOpacity: 0.8,
  });

  var circleTemplate = am5.Template.new({});

  series.bullets.push(function (root, series, dataItem) {
    var bulletContainer = am5.Container.new(root, {});
    var circle = bulletContainer.children.push(
      am5.Circle.new(
        root,
        {
          radius: 22,
        },
        circleTemplate
      )
    );

    var maskCircle = bulletContainer.children.push(
      am5.Circle.new(root, { radius: 14 })
    );

    // only containers can be masked, so we add image to another container
    var imageContainer = bulletContainer.children.push(
      am5.Container.new(root, {
        mask: maskCircle,
      })
    );

    // not working
    var image = imageContainer.children.push(
      am5.Picture.new(root, {
        templateField: "pictureSettings",
        centerX: am5.p50,
        centerY: am5.p50,
        width: 30,
        height: 30,
      })
    );

    return am5.Bullet.new(root, {
      locationX: 0,
      sprite: bulletContainer,
    });
  });

  // color

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

  series.bulletsContainer.adapters.add("fill", function (fill, target) {
    return chart
      .get("colors")
      .getIndex(series.bulletsContainer.indexOf(target));
  });
  series.bulletsContainer.adapters.add("stroke", function (stroke, target) {
    return chart
      .get("colors")
      .getIndex(series.bulletsContainer.indexOf(target));
  });

  series.data.setAll(data);
  yAxis.data.setAll(data);

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear();
  chart.appear(1000, 100);
};
export { loadDay };
