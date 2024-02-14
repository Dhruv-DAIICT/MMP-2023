import Dagre from '@dagrejs/dagre';
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background
} from 'reactflow';

import { setViewType, setModuleConnectivity, edgeList, nodeElements, booleanExpressions } from './node-edge-Maker'
import 'reactflow/dist/style.css';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(nodeElements);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeList);
  // console.log("Layout Rendered")

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  const ViewButton = (type) => {
    const New = setViewType(type, nodes);
    setNodes((prevNodes) => {
      // Create a copy of the previous nodes array and remove the last node
      // const newNodeArray = [...prevNodes];
      // newNodeArray.pop();
      return New;
    });
  }

  const moduleButton = (type) => {
    const New = setModuleConnectivity(type, nodes)
    setNodes((prevNodes) => {
      return New;
    });
  }
  
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
  <h3>Options:</h3>
  <div>
    <h4>Layout: </h4>
    <label>
      <input type="radio" name="layout" value="TB" onClick={() => onLayout('TB')} />
      Vertical Layout
    </label>
    <label>
      <input type="radio" name="layout" value="LR" onClick={() => onLayout('LR')} />
      Horizontal Layout
    </label>
  </div>
  <div>
    <h4>Module: </h4>
    <label>
      <input type="radio" name="moduleState" value="Show"  onClick = {()=> moduleButton("Connect")}/>
      Connect
    </label>
    <label>
      <input type="radio" name="moduleState" value="Hide"  onClick = {()=> moduleButton("Release")}/>
      Release
    </label>
  </div>
  <h4>View: </h4>
  <div>
    <input type="radio" name="view" value="Priority" id="priorityView" onClick={() => ViewButton('Priority')} />
    <label htmlFor="priorityView">Priority View</label>
  </div>
  <div>
    <input type="radio" name="view" value="Risk" id="riskView" onClick={() => ViewButton('Risk')} />
    <label htmlFor="riskView">Risk View</label>
  </div>
  <div>
    <h4>Bolean expressions for this graph:</h4>
    {booleanExpressions.map((str, index) => (
        <p key={index}>{str}</p>
      ))}
  </div>
</Panel>

    </ReactFlow>
  );
};

export default function () {
  return (
    <div style={{ width: '100%', height: window.innerHeight }}>
      <ReactFlowProvider>
        <Background />
        <LayoutFlow />
        <Controls />
      </ReactFlowProvider>
    </div>
  );
}
