
import React from "react";
import { Route } from "react-router";
import { Complete_Material } from "./Components/Complete_Material";
import { Mainpage } from "./Components/Mainpage";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import { Routes } from "react-router";
import { Homepage } from "./Components/Homepage";

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="Mainpage" element={<Mainpage/>} />
        <Route path="Complete_Material" element={<Complete_Material/>} />
      </Routes>
      
    </div>
  )
    
}

export default App;
