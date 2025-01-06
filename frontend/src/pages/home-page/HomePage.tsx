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
import Card from "../../components/card/Card.tsx";
import { isEqual } from "lodash";

function HomePage() {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const {
    control: cardControl,
    handleSubmit: handleCardSubmit,
    reset: resetCard,
  } = useForm({
    mode: "all",
  });
  const baseUrl = `http://localhost:8000/api`;
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
  const [originalCardDetails, setOriginalCardDetails] = useState({
    card_title: "",
    card_description: "",
    card_tag: "",
  });

  const [originalTagDetails, setOriginalTagDetails] = useState({
    tag_name: "",
    bg_color: "#8134af",
    font_color: "#FFFF",
  });

  const columnsData = [
    { id: 1, name: "Backlog" },
    { id: 2, name: "To do" },
    { id: 3, name: "Done" },
  ];

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [cardID, setCardID] = useState<number | null>(null);

  const [tagDetails, setTagDetails] = useState({
    tag_name: "",
    bg_color: "#8134af",
    font_color: "#FFFF",
  });

  const isTagDetailsChanged = !isEqual(tagDetails, originalTagDetails);
  const isCardDetailsChanged = !isEqual(cardDetails, originalCardDetails);

  const [cards, setCards] = useState<CardProps[]>([]);
  const tagOptions: SelectOption[] = [
    ...tags.map((tag) => ({
      text: tag.name,
      value: tag.id,
    })),
  ];

  const fetchColumns = async () => {
    const storedColumns = localStorage.getItem("columnsData");

    if (storedColumns?.length === 0) {
      setColumns(JSON.parse(storedColumns));
    } else {
      try {
        // If no cached data, fetch from the API
        const response = await fetch(`${baseUrl}/columns`);
        if (!response.ok) {
          throw new Error("Failed to fetch columns data");
        }
        const data = await response.json();
        let storedColumnData = data.length === 0 ? columnsData : data;

        setColumns(data.length === 0 ? columnsData : data);
        localStorage.setItem("columnsData", JSON.stringify(storedColumnData));
      } catch (error) {
        console.error("Error fetching columns data:", error);
      }
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${baseUrl}/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags data");
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags data:", error);
    }
  };

  const handleEditTag = async () => {
    setIsFetchingTags(true);

    const response = await fetch(
      `${baseUrl}/tags/${cardDetails.card_tag}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tagDetails.tag_name,
          bg_color: tagDetails.bg_color,
          font_color: tagDetails.font_color,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update tag");
    }

    const updatedTag = await response.json();

    // Update the tags list in state with the updated tag
    setTags((prevTags) =>
      prevTags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
    );

    setIsFetchingTags(false);
    handleCloseTagModal();
  };

  const handleAddTag = async () => {
    setIsFetchingTags(true);
    const response = await fetch(`${baseUrl}/tags`, {
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

  useEffect(() => {
    if (cardDetails.card_tag) {
      // Assuming cardDetails.card_tag is an ID or object representing the tag
      const selectedTag = tags.find((tag) => tag.id === cardDetails.card_tag);
      if (selectedTag) {
        setTagDetails({
          tag_name: selectedTag.name,
          bg_color: selectedTag.bg_color,
          font_color: selectedTag.font_color,
        });
        setOriginalTagDetails({
          tag_name: selectedTag.name,
          bg_color: selectedTag.bg_color,
          font_color: selectedTag.font_color,
        });
      }
    } else {
      // Reset tagDetails if no card_tag is available
      setTagDetails({
        tag_name: "",
        bg_color: "#8134af",
        font_color: "#FFFF",
      });
      setOriginalTagDetails({
        tag_name: "",
        bg_color: "#8134af",
        font_color: "#FFFF",
      });
    }
  }, [cardDetails.card_tag, tags]);

  const handleAddCardClick = (columnId: number) => {
    setSelectedColumnId(columnId);
    if (columnId !== 0) {
      setIsCardModalOpen(true);
    }
  };

  const fetchCards = async () => {
    const response = await fetch(`${baseUrl}/cards`);

    if (!response.ok) {
      throw new Error("Failed to fetch cards");
    }

    const data = await response.json();
    setCards(data);
    return data;
  };

  const handleCloseModal = () => {
    resetCard();
    setCardDetails({
      card_title: "",
      card_description: "",
      card_tag: "",
    });
    setOriginalCardDetails({
      card_title: "",
      card_description: "",
      card_tag: "",
    });
    setIsCardModalOpen(false);
  };
  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    resetTag();
    setTagDetails({
      tag_name: "",
      bg_color: "#8134af",
      font_color: "#FFFF",
    });
    setOriginalTagDetails({
      tag_name: "",
      bg_color: "#8134af",
      font_color: "#FFFF",
    });
  };

  console.log(originalCardDetails);
  console.log(cardDetails);

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
    const response = await fetch(`${baseUrl}/cards`, {
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
    const column = columns.find((col) => col.id === newCard.column_id);
    const columnName = column ? column.name : "Column";
    const description = `'${newCard.title}' is newly added to ${columnName}`;
    handleAddLogs(description);
  };

  const handleCardDrop = async (
    targetColumnId: number,
    targetPosition: number
  ) => {
    const response = await fetch(
      `${baseUrl}/cards/${activeCard}/position`,
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

    // Call handleAddLogs with the dynamic description
    await handleAddLogs(description);
  };

  const onClearTag = (name) => {
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: "", // Clear the value for the given name
    }));
  };

  const handleAddLogs = async (description) => {
    const response = await fetch(`${baseUrl}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      throw new Error("Failed to add log");
    }
  };

  const handleEditCard = (cardID) => {
    const cardToEdit = cards.find((card) => card.id === cardID);
    setCardID(cardID);

    if (cardToEdit) {
      setCardDetails({
        card_title: cardToEdit.title,
        card_description: cardToEdit.description,
        card_tag: cardToEdit.tag_id || "",
      });
      setOriginalCardDetails({
        card_title: cardToEdit.title,
        card_description: cardToEdit.description,
        card_tag: cardToEdit.tag_id || "",
      });
    }
    setIsCardModalOpen(true);
  };

  const handleSubmitEditCard = async () => {
    setIsAddingCard(true);
    const response = await fetch(
      `${baseUrl}/cards/${cardID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: cardDetails.card_title,
          description: cardDetails.card_description,
          tag_id: cardDetails.card_tag,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      setIsAddingCard(false);
      throw new Error(errorData.error || "Failed to update the card");
    }

    const updatedCard = await response.json();

    // Update the state with the new card details
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    setIsAddingCard(false);
    handleCloseModal();
  };

  return (
    <>
      {" "}
      <div className="homepage-container">
        {columns.map((column) => {
          const filteredCards = cards.filter(
            (card) => card.column_id === column.id
          );
          const cardsWithTagDetails = filteredCards.map((card) => {
            const tag = tags?.find((tag) => tag.id === card.tag_id);
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
              onClickHandler={(cardId) => handleEditCard(cardId)}
            />
          );
        })}
      </div>
      <Modal
        isOpen={isCardModalOpen}
        onClose={handleCloseModal}
        title={originalCardDetails.card_title ? "Edit Card" : "Add Card"}
      >
        <div className="homepage-cardPreview">
          <Card
            title={cardDetails.card_title || "Title"}
            description={cardDetails.card_description || "Description"}
            tagName={tagDetails.tag_name || "tagName"}
            backgroundColor={tagDetails.bg_color || "#8134af"}
            fontColor={tagDetails.font_color || "#FFFF"}
          />
        </div>
        <form
          onSubmit={
            originalCardDetails.card_title
              ? handleCardSubmit(handleSubmitEditCard)
              : handleCardSubmit(handleAddCard)
          }
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
              placeholder={
                tagOptions.length !== 0 ? "Select a Tag..." : "Add a new Tag"
              }
              options={tagOptions}
              disabled={tagOptions.length === 0}
              onClear={() => onClearTag("card_tag")}
            />
            <Button
              id="homepage-button"
              variant="secondary"
              text={cardDetails.card_tag ? "Edit Tag" : "Add Tag"}
              onClickHandler={() => {
                setIsTagModalOpen(true);
              }}
            />
          </div>

          <div className="homepage-modalActionButtons">
            <Button
              text={originalCardDetails.card_title ? "Update" : "Add"}
              type="submit"
              isLoading={isAddingCard}
              disabled={isAddingCard || !isCardDetailsChanged}
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
        title={cardDetails.card_tag ? "Edit Tag" : "Add Tag"}
      >
        <>
          <div className="homepage-cardPreview">
            <Card
              title="Title"
              description="Description"
              tagName={tagDetails.tag_name || "Tag Name"}
              backgroundColor={tagDetails.bg_color || "#8134af"}
              fontColor={tagDetails.font_color || "#FFFF"}
            />
          </div>
          <form
            onSubmit={
              cardDetails.card_tag
                ? handleTagSubmit(handleEditTag)
                : handleTagSubmit(handleAddTag)
            }
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
                  if (
                    value.toLowerCase() !==
                    originalTagDetails.tag_name.toLocaleLowerCase()
                  ) {
                    const isDuplicate = tagOptions.some(
                      (option) =>
                        option.text.toLowerCase() === value.toLowerCase()
                    );
                    return isDuplicate ? "Tag Name must be unique" : true;
                  }
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
                text={cardDetails.card_tag ? "Update" : "Add"}
                type="submit"
                isLoading={isFetchingTags}
                disabled={isFetchingTags || !isTagDetailsChanged}
              />
              <Button
                text={"Cancel"}
                variant="secondary"
                onClickHandler={handleCloseTagModal}
                disabled={isFetchingTags}
              />
            </div>
          </form>
        </>
      </Modal>
    </>
  );
}

export default HomePage;
