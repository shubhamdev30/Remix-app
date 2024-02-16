import React, { useState, useCallback } from "react";
import {
  ResourceItem,
  Icon,
  Popover,
  Button,
  InlineStack,
  Text,
  Box,
} from "@shopify/polaris";
import { XIcon, DragHandleIcon} from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Activecol(props) {
  const { loading } = props;
  function ListItem(props) {
    const { id, index, title, onRemove } = props;

    const handleRemoveClick = () => {
      onRemove(id);
    };

    return (
      <Draggable disabled={loading == false ? false : true} draggableId={id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              style={
                snapshot.isDragging
                  ? { background: "white", ...provided.draggableProps.style }
                  : provided.draggableProps.style
              }
            >
              <ResourceItem id={id} style={{ listStyle: "none" }}>
                <InlineStack align="space-between">
                <InlineStack align="space-between">
                  <div {...provided.dragHandleProps}>
                    <Icon source={DragHandleIcon} color="inkLightest" />
                  </div>
                  {title}
                  </InlineStack>
                  <Button
                    disabled={loading == false ? false : true}
                    icon={XIcon}
                    onClick={handleRemoveClick}
                    variant="tertiary"
                  />
                </InlineStack>
              </ResourceItem>
            </div>
          );
        }}
      </Draggable>
    );
  }

  function List() {
    const [items, setItems] = useState(
      props.activecolumns.map((title, index) => ({ id: String(index), title }))
    );
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const activator = (
      <Button onClick={toggleActive} icon={DragHandleIcon} pressed={active}>
        Active Columns
      </Button>
    );

    function handleDragEnd({ source, destination }) {
      if (!destination) {
        return;
      }

      setItems((oldItems) => {
        const newItems = oldItems.slice();
        const [temp] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, temp);
        props.columnsupdate(newItems.map((item) => item.title));
        return newItems;
      });
    }

    function handleRemove(id) {
      setItems((oldItems) => {
        const newItems = oldItems.filter((item) => item.id !== id);
        props.columnsupdate(newItems.map((item) => item.title));
        return newItems;
      });
    }

    return (
      <Popover active={active} activator={activator} onClose={toggleActive}>
        <div style={{ padding: "5px" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="root">
              {(provided) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <Box padding="200">
                      <Text variant="headingMd" as="h6">
                        Active Columns
                      </Text>
                    </Box>
                    {items.map((item, index) => (
                      <ListItem
                        style={{ listStyleType: "none" }}
                        key={item.id}
                        id={item.id}
                        index={index}
                        title={item.title}
                        onRemove={handleRemove}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      </Popover>
    );
  }

  return (
    <>
      <List />
    </>
  );
}
