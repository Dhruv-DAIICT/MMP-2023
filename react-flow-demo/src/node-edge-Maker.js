import {req1, req3} from './templete.js';
// const requirements = require('./templete.js');
let requirements = localStorage.getItem('l_req') ? JSON.parse(localStorage.getItem('l_req')) : req1;
let edgeList =[];
let IntermediateNodes = [];
let viewType = "Priority";
let booleanOperator = ['AND','OR','NOT'];
const colors = {
    "default" : {1: '#FF8080', 2: '#FFD080', 3: '#A8E9FF',4:"#ECFEEC"},
    "Risk" : {Critical:'#FF5733',High:'#FF6F61',Medium:'#FF9999',Low:'#FFCCCC' },
    "Priority" : {1:'#1a53ff',2: '#3366FF',3: '#99CCFF',4: '#E6F7FF'},
}

export function setViewType(type,nodes){
    viewType = type;
    return setColor(viewType,nodes);
}

export function setModuleConnectivity(type,nodes){
    return setModule(type,nodes);
}
    //Intermediate Node Genration
    let IntermidiateNodeCounter = 1;
    function makeNode(child, boolLabel){
        IntermediateNodes.push({
            id: `I${IntermidiateNodeCounter}`,
            data: { label: `I${IntermidiateNodeCounter}` },
            position: {
                x: Math.random() * 500,
                y: Math.random() * 500,
              },
        })
        edgeList.push({ id: `I${IntermidiateNodeCounter}-${child}`, source: `I${IntermidiateNodeCounter}`, target: child , label: boolLabel})
        return `I${IntermidiateNodeCounter++}`;

    }
    //edge genration
    function makeEdge(arr,child){
        let boolLabel;
        arr.map((e)=>{
            if(booleanOperator.includes(e)) {boolLabel = e}
            else if(typeof(e) == 'string') edgeList.push({ id: `${e}-${child}`, source: e, target: child,  label: boolLabel })
            else {
                let tempName = makeNode(child, boolLabel);
                makeEdge(e, tempName);
            }
        })
    }
    requirements.map(requirement => {
        if(requirement["Dependencies"].length>0){
            makeEdge(requirement["Dependencies"],requirement['Requirement Identifier']);
        }
    })

    // Node Genration
    let nodeElements = requirements.map((node) => ({
      id: node['Requirement Identifier'],
      data: { label: node['Requirement Text'], Priority:node["Priority"], Risk: node["Risk"], Module : node["Module"] },
      style: { background: colors["default"][node[viewType]] },
      position: { x: Math.random() * 500,
                y: Math.random() * 500, }, // Adjust the position as needed,
        // parentNode: node["Module"],
        draggable: true,
    }));

    //Adding Boxes for parent Node
    const groupNodes = requirements.filter((node) => node["Module"] && node["Module"].length > 0).
    map((node) =>{
        return {
            id: node["Module"],
            data: { label: node["Module"] },
            type: 'input',
            position: { x: Math.random() * 500,
                        y: Math.random() * 500, },
            style: {
                backgroundColor: 'rgba(255, 0, 255, 0.2)',
                width: 200,
                height: 50,
                }
        }
    })

    //Changine node color according to type
    const setColor = (viewType, nodes) => {

        nodeElements = nodes.map(node => {
            if (node.data && node.data[viewType]) {
              return{
                ...node,
                style : { background: colors[viewType][node.data[viewType]] },
            };
            }
            return node;
          });
        return nodeElements;
    }

    
    const setModule = (setType,nodes) =>{
        nodeElements = nodes.map(node => {
            if (node.data && node.data["Module"]) {
              if(setType == "Connect")  {
                    return{...node,parentNode : node.data["Module"], zIndex: 1,};
                }
                else{
                    return{...node, parentNode : "",};
                }
            }
            return node;
          });
        return nodeElements;
    }
    nodeElements.push(...IntermediateNodes,...groupNodes);

    let parameterContainer= {};
    edgeList.map((edge)=>{
        if(edge.target in parameterContainer){
            parameterContainer[edge.target][1].push(edge.source);
        }
        else{
            parameterContainer[edge.target] = [edge.label,[edge.source]];
        }
    })

    let booleanExpressions = [];
    for(const group in parameterContainer){
        let ex = `${group} = `;
        parameterContainer[group][1].map((src,index)=>{
            if(parameterContainer[group][0]=='NOT'){
                ex += "NOT " + src 
            }else{
                ex += " " + src +" "+ (index == parameterContainer[group][1].length-1 ? "" : parameterContainer[group][0]);
            }
        })
        booleanExpressions.push(ex);
    }
export {edgeList,nodeElements, booleanExpressions};