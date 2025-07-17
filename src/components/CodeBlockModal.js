import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";

const CodeBlockModal = ({
  open,
  onClose,
  onSave,
  currentUser,
  existingNames,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [nameError, setNameError] = useState("");

  const handleSave = () => {
    if (!name || !code) return;

    if (existingNames.has(name.trim())) {
      setNameError("This name already exists. Choose a different name.");
      return;
    }

    onSave({
      title: name.trim(),
      type: "code_block",
      code,
      updated_by: currentUser,
      updated_at: new Date().toISOString(),
    });

    setName("");
    setCode("");
    setNameError("");
    onClose();
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    if (existingNames.has(value.trim())) {
      setNameError("This name already exists. Choose a different name.");
    } else {
      setNameError("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Code Block</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Code Block Title"
            value={name}
            onChange={handleNameChange}
            fullWidth
            error={!!nameError}
            helperText={nameError}
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
          <Typography variant="caption" color="text.secondary">
            Author: {currentUser}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!!nameError}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodeBlockModal;
