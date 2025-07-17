import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";

const CodeBlockPreview = ({
  open,
  onClose,
  block,
  currentUser,
  onUpdate,
  onDelete,
  forceReadOnly = false,
}) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (block) setCode(block.code);
  }, [block]);

  const isEditable = !forceReadOnly && currentUser === "SolutionsE";

  const handleUpdate = () => {
    const updated = {
      ...block,
      code,
      updated_by: currentUser,
      updated_at: new Date().toISOString(),
    };
    onUpdate(updated);
    onClose();
  };

  if (!block) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{block.title}</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="body2">
            <strong>Last Updated By:</strong> {block.updated_by || "—"}
          </Typography>
          <Typography variant="body2">
            <strong>Last Updated At:</strong>{" "}
            {block.updated_at
              ? new Date(block.updated_at).toLocaleString()
              : "—"}
          </Typography>
        </Box>
        {isEditable ? (
          <TextField
            multiline
            fullWidth
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="Edit Code"
            sx={{ fontFamily: "monospace" }}
          />
        ) : (
          <Typography
            component="pre"
            sx={{
              background: "#f5f5f5",
              padding: 2,
              borderRadius: 1,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {block.code || "// No code"}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {isEditable && (
          <>
            <Button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this code block?"
                  )
                ) {
                  onDelete(block.title);
                  onClose();
                }
              }}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
            <Button onClick={handleUpdate} variant="contained">
              Save
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CodeBlockPreview;
