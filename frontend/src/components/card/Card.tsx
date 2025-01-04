import React from "react";
import "./card-styles.scss"; // Make sure you create this SCSS file
import { CardProps } from "../../models/components";

const Card: React.FC<CardProps> = ({ title, description, tag, tagColor="red" }) => {
    if (!tag || !title) return null;
    return (
    <div className="card" style={{ width: "254px" }}>
      {/* Header with tag */}
      <div className="card-header" style={{ backgroundColor: tagColor }}>
        <span className="tag">{tag}</span>
      </div>

      {/* Body with title and description */}
      <div className="card-body">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

export default Card;
