
import React, { Component } from "react";
import Mapp from "./maps/mapp";
 
// import { initMap } from "../mapGoogle";
class DeliverPickups extends Component {
    
  render() {
    return (
      <div className="text-center mt-5">
        <span style={{ opacity: 0.7 }}>Deliver Pickups</span>
      <Mapp></Mapp>
      </div>
    );
  }
}

export default DeliverPickups;