import React from "react";
import ReactDOMClient from "react-dom/client";
import logo from "./asset/resource/ikun.jpg";
import "./demo.less";

class Demo extends React.Component {

  render() {
    return (
      <div className="my-font">
        demo123
        <img src={ logo } />
      </div>
    )
  }
}

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <Demo/>
)

console.log("123")
