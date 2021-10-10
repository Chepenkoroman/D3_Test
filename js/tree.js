var treeData = {
  name: "ГАЗПРОМ",
  children: [
    {
      name: "TELEGRAM",
      children: [
        {
          name: "ГАЗПРОМ И ГАЗПРОМ НЕФТЬ ОБСУЖДАЮТ ВОПРОС ПРОДАЖИ ЧАСТИ АКЦИЙ ГАЗПРОМ НЕФТИ В РЫНОК",
          children: [
            {
              name: "@grazhdanin_nachaljnik",
            },
            {
              name: "«Газпром» создал новую дочернюю компанию — ООО «Газпром газификация». Она может стать единым оператором газификации в РФ.:",
            },
          ],
        },
        {
          name: "Газпром продлил контракт на поставку газа в Армению на I квартал 2021 года. Oб этом говорится в сообщении Газпром экспорт",
          children: [
            {
              name: "@armenpress",
            },
            {
              name: "ООО Газпром экспорт и ЗАО Газпром Армения 30 декабря продлили контракт на поставку газа в Армению на первый квартал 2021 года. Консультации о поставках газа в последующий период будут продолжены, - говорится в сообщении",
            },
          ],
        },
      ],
    },
    {
      name: "WEB",
      children: [
        {
          name: "Газпром объявил о создании (Газпром Сахалин холдинг)",
          children: [
            {
              name: "https://www.finam.ru/analysis/newsitem/gazprom-ob-yavil-o-sozdanii-gazprom-saxalin-xolding-20210824-16488/?utm_source=rss&utm_medium=new_compaigns&news_to_finamb=new_compaigns",
            },
            {
              name: "ООО Газпром капитал и ООО Газпром международные проекты приняли решение создать новую компанию ООО Газпром Сахалин холдинг, следует из раскрытия информации компании Газпром капитал. Так, Газпром, являясь единственным участником ООО Газпром капитал, принял решение: согласовать участие ООО Газпром капитал во вновь создаваемом совместно с ООО Газпром международные проекты обществе с ограниченной ответственностью Газпром Сахалин холдинг путем приобретения ООО Газпром капитал доли в уставном капитале ООО Газпром Сахалин холдинг номинальной стоимостью 9 млн 900 тыс. рублей, что составляет 99,99% уставного капитала ООО Газпром Сахалин холдинг, по номинальной стоимости с оплатой денежными средствами.Название новой компании повторяет наименование другой важной компании группы Газпром, а именно нидерландской Gazprom Sakhalin Holdings.:",
            },
          ],
        },
        {
          name: "(Газпром нефть) усилит шельфовое направление и дообучит сотрудников",
          children: [
            {
              name: "https://www.interfax.ru/russia/777225",
            },
            {
              name: "Газпром нефть намерена усилить шельфовое направление, готовит для этого новую учебную программу для сотрудников ООО Газпром нефть шельф, говорится в материалах компании.:",
            },
          ],
        },
      ],
    },
  ],
};

var margin = { top: 20, right: 90, bottom: 20, left: 90 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3
  .select(".container")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0;
var duration = 750;
var root;

var treemap = d3.tree().size([height, width]);
root = d3.hierarchy(treeData, function (d) {
  return d.children;
});
root.x0 = height / 2;
root.y0 = 0;
console.log("root ", root);

update(root);

function update(source) {
  var treeData = treemap(root);

  // nodes
  var nodes = treeData.descendants();
  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });
  var node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });
  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.y0 + ", " + source.x0 + ")";
    })
    .on("click", click);

  nodeEnter
    .append("circle")
    .attr("class", "node")
    .attr("r", 0)
    .style("fill", function (d) {
      return d._children ? "red" : "#fff";
    });

  nodeEnter
    .append("text")
    .attr("dy", ".350em")
    .attr("x", function (d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.data.name;
    });

  var nodeUpdate = nodeEnter.merge(node);

  nodeUpdate
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + d.y + ", " + d.x + ")";
    });

  nodeUpdate
    .select("circle.node")
    .attr("r", 10)
    .style("fill", function (d) {
      return d._children ? "red" : "#fff";
    })
    .attr("cursor", "pointer");

  nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle").attr("r", 0);
  nodeExit.select("text").style("fill-opacity", 0);

  // links
  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
      C ${(s.y + d.y) / 2} ${s.x}
        ${(s.y + d.y) / 2} ${d.x}
        ${d.y} ${d.x}`;
    return path;
  }
  var links = treeData.descendants().slice(1);
  var link = svg.selectAll("path.link").data(links, function (d) {
    return d.id;
  });
  var linkEnter = link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y };
      return diagonal(o, o);
    });
  var linkUpdate = linkEnter.merge(link);
  linkUpdate
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      return diagonal(d, d.parent);
    });

  var linkExit = link
    .exit()
    .transition()
    .duration(duration)
    .attr("d", function (d) {
      var o = { x: source.x0, y: source.y0 };
      return diagonal(o, o);
    })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  function click(event, d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}
