import React, { useEffect, useState } from "react";
import Column from "../../components/column/Column.tsx";
import Modal from "../../components/modal/Modal.tsx";
import { Controller, useForm } from "react-hook-form";
import Button from "../../components/button/Button.tsx";
import InputField from "../../components/inputField/InputField.tsx";
import "./home-page-styles.scss";
import Select from "../../components/select/Select.tsx";
import {
  CardProps,
  ColumnProps,
  SelectOption,
  TagProps,
} from "../../models/components.ts";
import ColorPicker from "../../components/color-picker/ColorPicker.tsx";

function HomePage() {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const {
    control: cardControl,
    handleSubmit: handleCardSubmit,
  } = useForm({
    mode: "all",
  });

  const {
    control: tagControl,
    handleSubmit: handleTagSubmit,
    reset: resetTag,
  } = useForm({
    mode: "all",
  });

  const [columns, setColumns] = useState<ColumnProps[]>([]);
  const [tags, setTags] = useState<TagProps[]>([]);
  const [isFetchingTags, setIsFetchingTags] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    card_title: "",
    card_description: "",
    card_tag: "",
  });

  const columnsData = [
    { id: 1, name: "Backlog" },
    { id: 2, name: "To do" },
    { id: 3, name: "Done" },
  ];

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const [tagDetails, setTagDetails] = useState({
    tag_name: "",
    bg_color: "#8134af",
    font_color: "#FFFF",
  });

  const [cards, setCards] = useState<CardProps[]>([]);
  const tagOptions: SelectOption[] = [
    ...tags.map((tag) => ({
      text: tag.name,
      value: tag.id,
    })),
  ];

  const fetchColumns = async () => {
    const storedColumns = localStorage.getItem("columnsData");

    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    } else {
      try {
        // If no cached data, fetch from the API
        const response = await fetch(`${process.env.REACT_APP_URL}/columns`);
        if (!response.ok) {
          throw new Error("Failed to fetch columns data");
        }
        const data = await response.json();

        // Store the fetched data in localStorage
        localStorage.setItem("columnsData", JSON.stringify(data));
        console.log("data",data)
        
        setColumns(data.length === 0 ? columnsData : data);
      } catch (error) {
        console.error("Error fetching columns data:", error);
      }
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags data");
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags data:", error);
    }
  };

  const handleAddTag = async () => {
    setIsFetchingTags(true);
    const response = await fetch(`${process.env.REACT_APP_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: tagDetails.tag_name,
        bg_color: tagDetails.bg_color,
        font_color: tagDetails.font_color,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setIsFetchingTags(false);
      throw new Error(errorData.error || "Failed to add new tag");
    }
    const newTag = await response.json();
    setTags((prevTags) => [...prevTags, newTag]);

    setCardDetails((prevState) => ({
      ...prevState,
      card_tag: newTag.id,
    }));

    setIsFetchingTags(false);
    handleCloseTagModal();
  };

  useEffect(() => {
    fetchColumns();
    fetchTags();
    fetchCards();
  }, []);

  const handleAddCardClick = (columnId: number) => {
    setSelectedColumnId(columnId);
    if (columnId !== 0) {
      setIsCardModalOpen(true);
    }
  };

  const fetchCards = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL}/cards`);

    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }

    const data = await response.json();
    setCards(data);
    return data;
  };

  const handleCloseModal = () => {
    setIsCardModalOpen(false);
  };
  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    resetTag();
  };

  const handleFieldChange = (value: string, field: any) => {
    field.onChange(value);
    handleInputChange(field.name, value);
  };
  const handleTagFieldChange = (value: string, field: any) => {
    field.onChange(value);
    handleTagChange(field.name, value);
  };

  const handleTagChange = (name: string, value: string) => {
    setTagDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleInputChange = (name: string, value: string) => {
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddCard = async () => {
    setIsAddingCard(true);
    const response = await fetch(`${process.env.REACT_APP_URL}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: cardDetails.card_title,
        description: cardDetails.card_description,
        tag_id: cardDetails.card_tag,
        column_id: selectedColumnId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setIsAddingCard(false);
      throw new Error(errorData.error || "Failed to add new card");
    }

    const newCard = await response.json();
    setCards((prevCards) => [...prevCards, newCard]);
    setIsAddingCard(false);
    handleCloseModal();
  };

  const handleCardDrop = async (
    targetColumnId: number,
    targetPosition: number
  ) => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/cards/${activeCard}/position`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPosition: targetPosition,
          targetColumnId: targetColumnId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update card position");
    }

    const data = await response.json();
    const { cards, movedToNewColumn, movedDirection } = data;

    setCards((prevCards) => {
      const updatedCardIds = cards.map((card) => card.id);
      const remainingCards = prevCards.filter(
        (card) => !updatedCardIds.includes(card.id)
      );

      return [...remainingCards, ...cards];
    });
    // Retrieve card title and column name for logging
    const movedCard = cards.find((card) => card.id === activeCard);
    const cardTitle = movedCard?.title || "Unknown card";
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    const columnName = targetColumn?.name || "Unknown column";

    // Prepare log description
    const description = movedToNewColumn
      ? `'${cardTitle}' was moved to '${columnName}'`
      : `'${cardTitle}' was moved ${movedDirection} within the column '${columnName}'`;

    // Call addLog with the dynamic description
    await addLog(description);
  };

  const addLog = async (description) => {
    const response = await fetch(`${process.env.REACT_APP_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error("Failed to add log");
    }

    const newLog = await response.json();
    console.log("newLog", newLog);
  };

  return (
    <>
      {" "}
      <div className="homepage-container">
        {tags.length > 0 &&
          columns.map((column) => {
            const filteredCards = cards.filter(
              (card) => card.column_id === column.id
            );
            const cardsWithTagDetails = filteredCards.map((card) => {
              const tag = tags.find((tag) => tag.id === card.tag_id);
              return {
                ...card,
                tagName: tag?.name || "No Tag",
                fontColor: tag?.font_color || "#000000",
                backgroundColor: tag?.bg_color || "#FFFF",
              };
            });

            return (
              <Column
                key={column.id}
                id={column.id}
                name={column.name}
                cards={cardsWithTagDetails}
                onClick={() => handleAddCardClick(column.id ?? 0)}
                setActiveCard={setActiveCard}
                onDrop={handleCardDrop}
              />
            );
          })}
      </div>
      <Modal
        isOpen={isCardModalOpen}
        onClose={handleCloseModal}
        title="Add Card"
      >
        <form
          onSubmit={handleCardSubmit(handleAddCard)}
          className="homepage-modalForm"
        >
          <Controller
            key="card_title"
            name="card_title"
            control={cardControl}
            defaultValue={cardDetails.card_title}
            rules={{
              required: "Card Title is required",
            }}
            render={({ field, fieldState }) => {
              return (
                <InputField
                  containerID="homepage-inputField"
                  name={field.name}
                  label={"Title"}
                  value={cardDetails.card_title}
                  placeholder={"Enter Card Title..."}
                  onChange={(name, value) => {
                    handleFieldChange(value, field);
                  }}
                  errorMessage={fieldState.error?.message}
                />
              );
            }}
          />
          <div className="homepage-textarea">
            <label>{"Description"}</label>
            <textarea
              id="homepage-textarea"
              name="card_description"
              value={cardDetails.card_description}
              placeholder={"Enter Card Description..."}
              onChange={(e) => {
                handleInputChange(e.target.name, e.target.value);
              }}
              rows={4}
              cols={40}
            />
          </div>
          <div className="homepage-select">
            <Select
              key="card_tag"
              id="homepage-select"
              name="card_tag"
              value={cardDetails.card_tag}
              label={"Tag"}
              onChange={handleInputChange}
              placeholder={"Select a Tag..."}
              options={tagOptions}
            />
            <Button
              variant="secondary"
              text="Add Tag "
              onClickHandler={() => {
                setIsTagModalOpen(true);
              }}
            />
          </div>

          <div className="homepage-modalActionButtons">
            <Button
              text={"Add"}
              type="submit"
              isLoading={isAddingCard}
              disabled={isAddingCard}
            />
            <Button
              text={"Cancel"}
              variant="secondary"
              onClickHandler={handleCloseModal}
              disabled={isAddingCard}
            />
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isTagModalOpen}
        onClose={handleCloseTagModal}
        title="Add Tag"
      >
        <form
          onSubmit={handleTagSubmit(handleAddTag)}
          className="homepage-modalForm"
        >
          <Controller
            key="tag_name"
            name="tag_name"
            control={tagControl}
            defaultValue={tagDetails.tag_name}
            rules={{
              required: "Tag Name is required",
              validate: (value) => {
                const isDuplicate = tagOptions.some(
                  (option) => option.text.toLowerCase() === value.toLowerCase()
                );
                return isDuplicate ? "Tag Name must be unique" : true;
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <InputField
                  containerID="homepage-inputField"
                  name={field.name}
                  label={"Title"}
                  value={tagDetails.tag_name}
                  placeholder={"Enter Tag Name..."}
                  onChange={(name, value) => {
                    handleTagFieldChange(value, field);
                  }}
                  errorMessage={fieldState.error?.message}
                />
              );
            }}
          />
          <div className="homepage-colorSelectors">
            <ColorPicker
              name="bg_color"
              value={tagDetails.bg_color}
              onChange={handleTagChange}
              label={"Background Color"}
              placeholder={"Choose Tag Color ... "}
            />
            <ColorPicker
              name="font_color"
              value={tagDetails.font_color}
              onChange={handleTagChange}
              label={"Font Color"}
              placeholder={"Choose Tag Color ... "}
            />
          </div>

          <div className="homepage-modalActionButtons">
            <Button
              text={"Add"}
              type="submit"
              isLoading={isFetchingTags}
              disabled={isFetchingTags}
            />
            <Button
              text={"Cancel"}
              variant="secondary"
              onClickHandler={handleCloseTagModal}
              disabled={isFetchingTags}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export default HomePage;
