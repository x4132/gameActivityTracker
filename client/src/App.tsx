import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import Navbar from "./jsx/Navbar";
import Dashboard from "./jsx/Dashboard";

import "./css/main.css";

function App() {
  return (
    <Router>
      <div className="w-100 h-100 bg-dark text-light" >
        <Navbar />
      </div>
      <Switch>
        <Route path="/" component={Dashboard} />
      </Switch>
    </Router>
  );
}

export default App;
