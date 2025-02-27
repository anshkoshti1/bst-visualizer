import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import axios from "axios";

const App = () => {
    const [tree, setTree] = useState(null);
    const [value, setValue] = useState("");

    const fetchTree = async () => {
        const { data } = await axios.get("http://localhost:5000/tree");
        setTree(data);
    };

    useEffect(() => {
        fetchTree();
    }, []);

    const insertNode = async () => {
        await axios.post("http://localhost:5000/insert", { value: parseInt(value) });
        fetchTree();
        setValue("");
        animateInsertion();
    };

    const deleteNode = async () => {
        await axios.delete(`http://localhost:5000/delete/${value}`);
        fetchTree();
        setValue("");
    };

    const animateInsertion = () => {
        gsap.fromTo(".node", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    };

    const renderTree = (node) => {
      if (!node) return null;
      
      return (
          <div className="tree-node">
              <div className="node">{node.value}</div>
              <div className="branches">
                  {node.left && <div className="line left-line"></div>}
                  {node.right && <div className="line right-line"></div>}
              </div>
              <div className="children">
                  {node.left && renderTree(node.left)}
                  {node.right && renderTree(node.right)}
              </div>
          </div>
      );
    };  

    return (
        <div className="container">
            <h1>Binary Search Tree Visualizer</h1>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={insertNode}>Insert</button>
            <button onClick={deleteNode}>Delete</button>
            <div className="tree">{renderTree(tree)}</div>
        </div>
    );
};

export default App;
