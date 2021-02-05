import React from "react";

const Like = ({ isLiked, onClick }) => {
  let classes = isLiked ? "fas fa-heart" : "far fa-heart";

  return (
    <i onClick={onClick} className={classes} style={{ cursor: "pointer" }}></i>
  );
};

export default Like;
