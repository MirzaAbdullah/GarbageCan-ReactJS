import React, { Component } from "react";

class ManagePickups extends Component {
  render() {
    return (
      <div className="text-center mt-5">
        <span style={{ opacity: 0.7 }}>Manage Pickups</span>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCmp0HsvLx90YLBpVIlQW2A8ADtllKEPR8&callback=initMap&libraries=&v=weekly"
            defer></script>
        <script src="/src/mapGoogle.js"></script>  
        <h3>The distance to the next task</h3>
        <div id="map"></div>
        <div id="msg"></div>
        <link rel="stylesheet" type="text/css" href="/src/App.css" />
      </div>
    );
  }
}

export default ManagePickups;
