import React, { useState } from "react";
import Card from "../card/Card.tsx"; // Import Card component
import "./column-styles.scss"; // SCSS for styling the column component
import { AddIcon } from "../../assests/images/icons.tsx";
import Modal from "../modal/Modal.tsx";
import Button from "../button/Button.tsx";
import { ColumnProps } from "../../models/components.ts";

const Column: React.FC<ColumnProps> = ({ title, cards, onClick }) => {
  const [cardList, setCardList] = useState(cards);

  return (
    <>
      <div className="column">
        {/* Column Header */}
        <div className="column-header">{title}</div>

        {/* Column Body (List of Cards) */}
        <div className="column-body">
          {cardList.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              tag={card.tag}
              tagColor={card.tagColor}
            />
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
    </>
  );
};

export default Column;
