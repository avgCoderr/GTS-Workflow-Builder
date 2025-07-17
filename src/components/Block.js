import React from "react";
import { Paper, Typography } from "@mui/material";

const Block = ({
  title,
  type,
  source,
  onClick,
  onContextMenu,
  onDoubleClick,
  isSelected = false,
}) => {
  return (
    <Paper
      elevation={isSelected ? 6 : 3}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      style={{
        padding: "16px",
        cursor: "pointer",
        width: source === "tray" ? "90%" : 180,
        backgroundColor: isSelected
          ? "#1976d2"
          : type === "manual"
          ? "#e3f2fd"
          : type === "editor"
          ? "#fce4ec"
          : "#f3e5f5",
        border: isSelected ? "2px solid #1976d2" : "none",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        style={{ color: isSelected ? "#fff" : "inherit" }}
      >
        {title}
      </Typography>
      {type === "code_block" && (
        <Typography
          variant="caption"
          color={isSelected ? "#fff" : "text.secondary"}
        >
          {source === "tray"
            ? "(Click to select, Right-click to edit)"
            : "(Right-click to remove)"}
        </Typography>
      )}
      {(type === "manual" || type === "editor") && source === "workflow" && (
        <Typography variant="caption" color="text.secondary">
          (Right-click to remove)
        </Typography>
      )}
    </Paper>
  );
};

export default Block;
