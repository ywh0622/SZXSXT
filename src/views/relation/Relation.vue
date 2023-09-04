<template>
  <!-- wsy -->
  <div class="container" @contextmenu.prevent></div>
  <div class="text-item-card">
    <div class="text-item">
      <span class="text-item-left">Name:</span>
      <span class="text-item-right">{{ name }}</span>
    </div>
    <div class="text-item">
      <span class="text-item-left">Group:</span>
      <span class="text-item-right">{{ group }}</span>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, nextTick, reactive, ref } from "vue";
import { SortUp } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import * as d3 from "d3"; //wsy
const { proxy } = getCurrentInstance();

const store = useStore();
const router = useRouter();
var name = ref(""); //wsy
var group = ref("");
// 获取当前登陆用户以及所操作的项目
store.commit("getCurrentUser");
store.commit("getCurrentUserSelectedProject");
const userAndProject = reactive({
  user: store.state.currentUser,
  project: store.state.selectedProject,
});

// 获取当前登陆用户id
store.commit("getCurrentUserId");
const currentUserId = store.state.currentUserId;

//wsy，后面基本都有改动
//知识图谱节点数据
const testGraph = reactive({
  nodes: [
    { id: "myriel", group: 1 },
    { id: "napoleon", group: 2 },
    { id: "mlle", group: 1 },
    { id: "mme", group: 3 },
    { id: "countessdelo", group: 1 },
    { id: "geborand", group: 2 },
  ],
  links: [
    { source: "napoleon", target: "myriel", relation: "friend" },
    { source: "mlle", target: "myriel", relation: "friend" },
    { source: "mme", target: "myriel", relation: "couple" },
    { source: "mme", target: "mlle", relation: "relative" },
    { source: "countessdelo", target: "myriel", relation: "friend" },
    { source: "geborand", target: "myriel", relation: "colleague" },
  ],
});

//初始化数据图谱
const initGraph = function (data) {
  const width = 1264;
  const height = 702;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d }));

  // 设置节点间作用力
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(200)
    )
    .force("charge", d3.forceManyBody().strength(-40))
    .force("collide", d3.forceCollide().radius(80).iterations(2))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  //设置连线
  const link = svg
    .append("g")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", "#191970")
    //.attr("fill","black")
    //.attr("stroke-opacity", 6)
    .attr("class", "link")
    .attr("stroke-width", 1.5)
    .attr("id", function (d, i) {
      return "edgepath" + d.source.index + "-" + d.target.index;
    });

  //连线文字
  const linkNameText = svg
    .append("g")
    .selectAll("text")
    .data(links)
    .join("text")
    // .attr("x", 100)
    //.attr("y", 160)
    .attr("class", "link-name")
    .attr("text-anchor", "middle")
    .attr("font-size", "20")
    .attr("stroke-weight", "bold")
    .append("textPath")
    .attr("fill", "#444444")
    .attr("xlink:href", function (d, i) {
      return "#edgepath" + d.source.index + "-" + d.target.index;
    })
    .attr("startOffset", "50%")
    .text(function (d) {
      return d.relation;
    });

  //设置节点
  const node = svg
    .append("g")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .selectAll()
    .data(nodes)
    .join("circle")
    .attr("r", 50)
    .attr("fill", "#191970")
    .on("mouseover", function () {
      d3.select(this).attr("stroke-width", "4");
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration(250).attr("stroke-width", 2);
    })
    .on("click", handleClick)
    .on("mousedown", showContextMenu);
  //.on("click", console.log(this.nodes));
  // .attr("fill", d => color(d.group));

  node.append("title").text((d) => d.id);

  //节点文字
  const nodeNameText = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    // .attr("dx", 1)
    .attr("dy", 6)
    .attr("font-size", "16px")
    .attr("class", "node-name")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(function (d) {
      return d.id;
    });
  //右键跳出上下文菜单
  const contextMe = d3
    .select("body")
    .append("div")
    .attr("class", "context-menu")
    .style("position", "absolute")
    .style("display", "none");

  const list1 = contextMe.append("ul").attr("class", "menu-list");
  list1
    .append("li")
    .attr("class", "menu-item")
    .text("Action 1")
    .on("click", function () {
      contextMe.style("display", "none");
    });

  const list2 = contextMe.append("ul").attr("class", "menu-list");
  list2
    .append("li")
    .attr("class", "menu-item")
    .text("Action 2")
    .on("click", () => {
      contextMe.style("display", "none");
    });

  function handleClick(event, d) {
    name.value = d.id;
    group.value = d.group;
  }

  document.addEventListener("click", () => {
    contextMe.style("display", "none");
  });

  function showContextMenu(event, d) {
    event.preventDefault();
    event.stopPropagation();
    event.returnValue = false;
    if (event.button == 2) {
      console.log(event);
      setTimeout(() => {
        contextMe
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px")
          .style("display", "block");
        // contextMe.nodeData = d;
      }, 200);
    }
  }

  //节点拖拽
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

  // 设置节点和边的位置属性
  function ticked() {
    // link
    //   .attr("d", d => "M" + d.source.x + " " + d.source.y + "L" + d.target.x + " " + d.target.y);
    link.attr("d", function (d) {
      if (d.source.x < d.target.x) {
        return (
          "M" +
          d.source.x +
          " " +
          d.source.y +
          "L" +
          d.target.x +
          " " +
          d.target.y
        );
      } else {
        return (
          "M" +
          d.target.x +
          " " +
          d.target.y +
          "L" +
          d.source.x +
          " " +
          d.source.y
        );
      }
    });

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    nodeNameText.attr("x", (d) => d.x).attr("y", (d) => d.y);
  }
  // 拖拽时更新节点位置
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
};

onMounted(() => {
  initGraph(testGraph);
});
</script>

<style>
.context-menu {
  font-family: Arial, sans-serif;
  border: 1px solid black;
  background-color: white;
  /* padding: 5px; */
}

.menu-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 80px;
}

.menu-item {
  color: black;
  padding: 5px;
  cursor: pointer;
  border: 0.5px solid #000;
  text-align: center;
}

.menu-item:hover {
  background-color: rgb(53, 148, 185);
}

.menu-separator {
  border-top: 1px solid black;
  margin: 5px 0;
}

.text-item-card {
  position: absolute;
  top: 70px;
  left: 220px;
  cursor: pointer;
  /* width: 500px; */
}

.text-item {
  /* display: inline-block; */
  display: inline;
  font-size: 20px;
  margin-right: 30px;
  /* width: 180px; */
}

.text-item-left {
  margin-right: 5px;
  font-weight: bold;
}
</style>