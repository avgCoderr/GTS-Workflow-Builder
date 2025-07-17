import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const CodeBlockModal = ({ open, onClose, onSave, currentUser }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleSave = () => {
    if (!name || !code) return;
    onSave({
      title: name,
      type: "code_block",
      code,
      updated_by: currentUser,
      updated_at: new Date().toISOString(),
    });
    setName("");
    setCode("");
    onClose();
    console.log("Saved");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Code Block</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Code Block Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            multiline
            rows={8}
            fullWidth
            placeholder="// Write your Python or JS code here"
          />
          <Typography variant="caption" color="textSecondary">
            Author: {currentUser}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodeBlockModal;
