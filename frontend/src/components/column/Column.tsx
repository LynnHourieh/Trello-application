import React from "react";
import Card from "../card/Card.tsx";
import "./column-styles.scss"; 
import { AddIcon } from "../../assests/images/icons.tsx";
import Button from "../button/Button.tsx";
import { ColumnProps } from "../../models/components.ts";
import Skeleton from "../skeleton/Skeleton.tsx";


const Column: React.FC<ColumnProps> = ({
  id,
  name,
  cards,
  onClick,
  setActiveCard,
  onDrop,
}) => {
  return (
    <div className="column">
      <div className="column-header">{name}</div>
      <div className="column-body">
        <Skeleton onDrop={() => onDrop?.(id || 0 , 1)} />
        {cards?.map((card, index) => (
          <React.Fragment key={index}>
            <Card
              title={card.title}
              description={card.description}
              tagName={card.tagName}
              tagColor={card.tagColor}
              id={card.id}
              column_id={card.column_id}
              position={index + 1}
              setActiveCard={setActiveCard}
            />
            <Skeleton onDrop={() => onDrop?.(id || 0, index + 2)} />
          </React.Fragment>
        ))}
      </div>
      <div className="column-footer">
        <Button
          text="Add a card"
          icon={<AddIcon />}
          iconPosition="start"
          onClickHandler={onClick}
          variant="tertiary"
        />
      </div>
    </div>
  );
};

export default Column;
