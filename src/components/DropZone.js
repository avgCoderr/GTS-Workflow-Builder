import React from "react";
import { Box } from "@mui/material";
import Block from "./Block";

const DropZone = ({
  workflowItems,
  onBlockClick,
  onWorkflowClick,
  onWorkflowBlockRemove,
  selectedBlockType,
}) => {
  const handleWorkflowAreaClick = (event) => {
    if (
      event.target === event.currentTarget ||
      event.target.closest("[data-block]") === null
    ) {
      onWorkflowClick(event);
    }
  };

  return (
    <Box
      onClick={handleWorkflowAreaClick}
      sx={{
        height: "90%",
        border: selectedBlockType ? "2px solid #1976d2" : "2px dashed gray",
        borderRadius: "8px",
        backgroundColor: selectedBlockType ? "#e3f2fd" : "#fafafa",
        transition: "all 0.2s",
        p: 2,
        overflowY: "auto",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
        alignContent: "flex-start",
        cursor: selectedBlockType ? "crosshair" : "default",
        position: "relative",
      }}
    >
      {selectedBlockType && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#1976d2",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1,
          }}
        >
          Click to place: {selectedBlockType.title}
        </Box>
      )}

      {workflowItems.map((item, index) => (
        <Box key={index} data-block>
          <Block
            title={item.title}
            type={item.type}
            source="workflow"
            onClick={() => {
              if (item.type === "code_block" && onBlockClick) {
                onBlockClick(item);
              }
            }}
            // onContextMenu={(e) => {
            //   e.preventDefault();
            //   if (item.type === "code_block" && onBlockClick) {
            //     onBlockClick(item);
            //   }
            // }}
            onContextMenu={() => {
              onWorkflowBlockRemove(index);
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default DropZone;
