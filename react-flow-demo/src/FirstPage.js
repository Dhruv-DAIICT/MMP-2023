import React, { useState } from 'react';
import './App.css'; // Import your CSS file
import {req1, req3} from './templete';
import { useNavigate } from 'react-router-dom';
import { updateRequirement } from './node-edge-Maker';

function App() {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleClear = () => {
    setText('');
    setMessage('');
  };

  const handlePreview = () => {
    setMessage(`You entered: ${text}`);
  };

  const isValidJSON = (text) => {
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  const handleSubmit = () => {
    if(isValidJSON(text)){
      navigate('/graph');
      localStorage.setItem("l_req",text);
      window.location.reload();
    }else{
      alert("Enter requirements in valid JSON format.");
    }
  };

  const fillTextAreaWithExample = (exampleText) => {
    setText(exampleText);
  };

  return (
    <div className="App">
      <div className="centered-content">
        <h1>CEG from Requirements</h1>
        <textarea
          rows="9"
          cols="50"
          value={text}
          onChange={handleInputChange}
          placeholder="Enter requirements here.."
        ></textarea>
        <br />
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSubmit} disabled={text.length==0} >Submit</button>
        <button onClick={handlePreview}>Preview</button>
        <button onClick={() => fillTextAreaWithExample(JSON.stringify(req1, null, 2))}>Example1</button>
        <button onClick={() => fillTextAreaWithExample(JSON.stringify(req3, null, 2))}>Example2</button>
        <div>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
export const req = useState;