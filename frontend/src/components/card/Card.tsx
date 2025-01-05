import React from "react";
import "./card-styles.scss";
import { CardProps } from "../../models/components";

const Card: React.FC<CardProps> = ({
  title,
  description,
  tagName,
  tagColor = "#8134af",
  id,
  column_id,
  onDrop,
  position,
  setActiveCard
}) => {
  if (!tagName || !title) return null;

  return (
    <div
      className="card"
      id={`card-${id}`}
      style={{
        width: "254px",
      }}
      draggable
      onDragStart={()=>setActiveCard?.(id || null)}
      onDragEnd={()=>setActiveCard?.(null)}
  
    >
      <div className="card-header" style={{ backgroundColor: tagColor }}>
        <span className="tag">{tagName}</span>
      </div>
      <div className="card-body">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </div>
    </div>
  );
};

export default Card;
