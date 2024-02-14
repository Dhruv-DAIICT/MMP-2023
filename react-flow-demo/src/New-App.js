import React, { useState } from 'react';
import Modal from 'react-modal';
import Dagre from '@dagrejs/dagre';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background
} from 'reactflow';

import { setViewType, setModuleConnectivity, edgeList, nodeElements, booleanExpressions } from './node-edge-Maker';
import 'reactflow/dist/style.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

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

const CustomModal = ({ isOpen, onRequestClose, content, testCases }) => {
  const extractColumnNames = () => {
    const inputColumns = testCases.flatMap(testCase => Object.keys(testCase.inputValues));
    const outputColumns = testCases.flatMap(testCase => Object.keys(testCase.caseOutput));
    return [...new Set([...inputColumns, ...outputColumns])];
  };

  const columnNames = extractColumnNames();

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div>
        <p>{content}</p>
        <h4>Generated Test Cases:</h4>
        {testCases && testCases.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Test Case</th>
                {columnNames.map((columnName, index) => (
                  <th key={index}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {testCases.map((testCase, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {columnNames.map((columnName, columnIndex) => (
                    <React.Fragment key={columnIndex}>
                      <td>{testCase.inputValues[columnName] !== undefined ? testCase.inputValues[columnName].toString() : ''}</td>
                      <td>{testCase.caseOutput[columnName] !== undefined ? testCase.caseOutput[columnName].toString() : ''}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No test cases available.</p>
        )}
        <button onClick={onRequestClose}>Close</button>
      </div>
    </Modal>
  );
};



const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(nodeElements);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgeList);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [testCaseString, setTestCaseString] = useState('');
  const [testCases, setTestCases] = useState([]);

  const onLayout = (direction) => {
    const layouted = getLayoutedElements(nodes, edges, { direction });

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  };

  const ViewButton = (type) => {
    const New = setViewType(type, nodes);
    setNodes(New);
  };

  const moduleButton = (type) => {
    const New = setModuleConnectivity(type, nodes);
    setNodes(New);
  };

  const extractVariables = (expression) => {
    const parts = expression.split('=');
    return parts[1].split(/\s+(?:OR|AND|NOT)\s+/).map(variable => variable.trim());
  };

  const generateCombinations = (variables) => {
    return [...Array(2 ** variables.length)].map((_, i) =>
      variables.map((variable, j) => Boolean((i >> j) & 1))
    );
  };

  const evaluateExpression = (expression, inputValues) => {
    const parts = expression.split('=');
    const variable = parts[0].trim();
    const equation = parts[1].trim();

    if (equation.includes('NOT')) {
      const negatedVar = equation.split('NOT')[1].trim();
      return { variable, value: !inputValues[negatedVar] };
    } else {
      const terms = equation.split(/\s+(?:OR|AND)\s+/);
      let result = null;
      let operator = null;

      for (const term of terms) {
        if (term === 'AND' || term === 'OR') {
          operator = term;
        } else {
          const value = inputValues[term];
          if (result === null) {
            result = value;
          } else if (operator === 'AND') {
            result = result && value;
          } else if (operator === 'OR') {
            result = result || value;
          }
        }
      }

      return { variable, value: result };
    }
  };

  const generateTestCase = (str) => {
    const variables = extractVariables(str);
    const combinations = generateCombinations(variables);

    const testCases = combinations.map(combination => {
      const inputValues = Object.fromEntries(variables.map((variable, index) => [variable, combination[index]]));
      const caseOutput = {};

      for (const expr of booleanExpressions) {
        const { variable, value } = evaluateExpression(expr, inputValues);
        caseOutput[variable] = value;
      }

      return { inputValues, caseOutput };
    });

    console.log('Test Cases:', testCases);

    setTestCases(testCases);
    setTestCaseString(str);
    setModalIsOpen(true);
  };

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
            <input type="radio" name="moduleState" value="Show" onClick={() => moduleButton("Connect")} />
            Connect
          </label>
          <label>
            <input type="radio" name="moduleState" value="Hide" onClick={() => moduleButton("Release")} />
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
          <h4>Boolean expressions for this graph:</h4>
          {booleanExpressions.map((str, index) => (
            <div key={index}>
              <p>{str}</p>
              <button onClick={() => generateTestCase(str)}>Generate Test Case</button>
            </div>
          ))}
        </div>
      </Panel>

      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        content={`Test Case for: ${testCaseString}`}
        testCases={testCases}
      />
    </ReactFlow>
  );
};

export default function App() {
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
