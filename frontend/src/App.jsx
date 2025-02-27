import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const BSTVisualizer = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tree");
      setTreeData(response.data.tree);
    } catch (error) {
      console.error("Error fetching tree:", error);
    }
  };

  const insertNode = async () => {
    const value = prompt("Enter a value to insert:");
    if (!value) return;
    try {
      await axios.post("http://localhost:5000/insert", { value: Number(value) });
      fetchTree();
    } catch (error) {
      console.error("Error inserting node:", error);
    }
  };

  useEffect(() => {
    if (treeData) {
      renderTree(treeData);
    }
  }, [treeData]);

  const renderTree = (data) => {
    d3.select("#tree-container").selectAll("*").remove();
    const width = 600, height = 400;
    const svg = d3
      .select("#tree-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);
    
    const linkGenerator = d3.linkVertical().x(d => d.x).y(d => d.y);
    svg.selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr("d", linkGenerator)
      .attr("fill", "none")
      .attr("stroke", "black");
    
    svg.selectAll("circle")
      .data(root.descendants())
      .enter()
      .append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 15)
      .attr("fill", "steelblue");
    
    svg.selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y - 20)
      .attr("text-anchor", "middle")
      .text(d => d.data.name);
  };

  return (
    <div>
      <button onClick={insertNode}>Insert Node</button>
      <div id="tree-container" style={{ marginTop: "20px" }}></div>
    </div>
  );
};

export default BSTVisualizer;
