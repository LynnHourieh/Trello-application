import React, { useEffect, useState } from "react";
import Column from "../../components/column/Column.tsx";
import Modal from "../../components/modal/Modal.tsx";
import { Controller, useForm } from "react-hook-form";
import Button from "../../components/button/Button.tsx";
import InputField from "../../components/inputField/InputField.tsx";
import "./home-page-styles.scss";
import Select from "../../components/select/Select.tsx";
import { SelectOption } from "../../models/components.ts";
import ColorPicker from "../../components/color-picker/ColorPicker.tsx";

function HomePage() {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    mode: "all",
  });

  const [cardDetails, setCardDetails] = useState({
    card_title: "",
    card_description: "",
    card_tag: "",
  });

  const [tagDetails, setTagDetails] = useState({
    tag_name: "",
    tag_color: "#8134af",
  });

  const tagOptions: SelectOption[] = [
    {
      text: "Shopping",
      value: "Shopping",
    },
    {
      text: "Cleaning",
      value: "Cleaning",
    },
    {
      text: "Create a New Tag",
      value: "create_new_tag",
    },
  ];
const cards=[];

  // const cards = [
  //   {
  //     title: "Task 1",
  //     description: "Complete this task",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 2",
  //     description: "Start project",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 1",
  //     description: "Complete this task",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 2",
  //     description: "Start project",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 1",
  //     description: "Complete this task",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 2",
  //     description: "Start project",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 1",
  //     description: "Complete this task",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 2",
  //     description: "Start project",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 1",
  //     description: "Complete this task",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 2",
  //     description: "Start project",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 1",
  //     description: "Complete this task",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  //   {
  //     title: "Task 2",
  //     description: "Start project",
  //     tag: "Work",
  //     tagColor: "#FF6347",
  //   },
  // ];
  const handleAddCardClick = () => {
    setIsCardModalOpen(true); // Open modal
  };

  const handleCloseModal = () => {
    setIsCardModalOpen(false); // Close modal
  };
  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };

  const handleFieldChange = (value: string, field: any) => {
    field.onChange(value);
    handleInputChange(field.name, value);
  };
  const handleTagFieldChange = (value: string, field: any) => {
    field.onChange(value);
    handleTagChange(field.name, value);
  };

  console.log(tagDetails)

  const handleTagChange = (name: string, value: string) => {
    setTagDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === "card_tag" && value === "create_new_tag") {
      //open modal
      setIsTagModalOpen(true);
      return;
    }
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddCard = () => {
    //call api to add a new card
  };

  const handleAddTag=()=>{
    //call api to add a new tag
  }

  console.log("cardDetails", cardDetails);

  return (
    <>
      {" "}
      <div className="homepage-container">
        <Column title="Backlog" cards={cards} onClick={handleAddCardClick} />
        <Column title="To Do" cards={cards} onClick={handleAddCardClick} />
        <Column title="Done" cards={[]} onClick={handleAddCardClick} />
      </div>
      <Modal
        isOpen={isCardModalOpen}
        onClose={handleCloseModal}
        title="Add Card"
        modalActions={[]}
      >
        <form
          onSubmit={handleSubmit(handleAddCard)}
          className="homepage-modalForm"
        >
          <Controller
            key="card_title"
            name="card_title"
            control={control}
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
          </div>

          <div className="homepage-modalActionButtons">
            <Button
              text={"Add"}
              type="submit"
              isLoading={false}
              disabled={false}
            />
            <Button
              text={"Cancel"}
              variant="secondary"
              onClickHandler={handleCloseModal}
              disabled={false}
            />
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={isTagModalOpen}
        onClose={handleCloseTagModal}
        title="Add Tag"
        modalActions={[]}
      >
        <form
          onSubmit={handleSubmit(handleAddTag)}
          className="homepage-modalForm"
        >
          <Controller
            key="tag_name"
            name="tag_name"
            control={control}
            defaultValue={tagDetails.tag_name}
            rules={{
              required: "Tag Name should be unique",
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
          <ColorPicker
            name="tag_color"
            value={tagDetails.tag_color}
            onChange={handleTagChange}
            label={"Tag Color"}
            placeholder={"Choose Tag Color ... "}
          />
          <div className="homepage-modalActionButtons">
            <Button
              text={"Add"}
              type="submit"
              isLoading={false}
              disabled={false}
            />
            <Button
              text={"Cancel"}
              variant="secondary"
              onClickHandler={handleCloseTagModal}
              disabled={false}
            />
          </div>
        </form>
      </Modal>
    </>
  );
}

export default HomePage;
