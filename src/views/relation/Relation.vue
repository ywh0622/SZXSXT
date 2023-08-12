<template>
  <!-- wsy -->
  <div class="container"></div>
</template>

<script setup>
import { getCurrentInstance, onMounted, nextTick, reactive } from "vue";
import { SortUp } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
import * as d3 from "d3"; //wsy
const { proxy } = getCurrentInstance();

const store = useStore();
const router = useRouter();

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

//wsy到后面都是
//知识图谱节点数据
const testGraph = reactive({
  nodes: [
    { id: "myriel", group: 1 },
    { id: "napoleon", group: 1 },
    { id: "mlle", group: 1 },
    { id: "mme", group: 1 },
    { id: "countessdelo", group: 1 },
    { id: "geborand", group: 1 },
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
    .force("charge", d3.forceManyBody().strength(-50))
    .force("collide", d3.forceCollide().radius(50).iterations(2))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  const svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 6)
    .selectAll()
    .data(links)
    .join("line")
    .attr("stroke-width", 1);

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 5)
    .selectAll()
    .data(nodes)
    .join("circle")
    .attr("r", 40)
    .attr("fill", (d) => color(d.group));

  node.append("title").text((d) => d.id);

  //节点文字
  const nodeNameText = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("dx", 4)
    .attr("dy", 8)
    .attr("class", "node-name")
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.id;
    });

  //连线文字
  const linkNameText = svg
    .append("g")
    .selectAll("text")
    .data(links)
    .join("text")
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.2)
    .attr("class", "link-name")
    .attr("font-size", "14")
    .text(function (d) {
      return d.relation;
    });

  //节点拖拽
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

  // 设置节点和边的位置属性
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    nodeNameText.attr("x", (d) => d.x).attr("y", (d) => d.y);

    linkNameText
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);
  }

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // 拖拽时更新节点位置
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

<style></style>