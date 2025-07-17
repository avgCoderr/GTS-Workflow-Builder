import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import Block from "./components/Block";
import DropZone from "./components/DropZone";
import CodeBlockModal from "./components/CodeBlockModal";
import CodeBlockPreview from "./components/CodeBlockPreview";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const App = () => {
  let [user, setUser] = useState("ProjectM");
  let [codeBlocks, setCodeBlocks] = useState([]);
  let [modalOpen, setModalOpen] = useState(false);
  let [workflowItems, setWorkflowItems] = useState([]);
  let [selectedBlock, setSelectedBlock] = useState(null);
  let [previewOpen, setPreviewOpen] = useState(false);
  let [previewSource, setPreviewSource] = useState("tray");
  let [trayOpen, setTrayOpen] = useState(false);
  let [selectedBlockType, setSelectedBlockType] = useState(null);

  useEffect(() => {
    let fetchBlocks = async () => {
      try {
        let res = await fetch(
          "https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions"
        );
        let data = await res.json();

        let latestBlocksMap = {};

        data.forEach((block) => {
          const name = block.codeBlockName;
          if (
            !latestBlocksMap[name] ||
            block.version > latestBlocksMap[name].version
          ) {
            latestBlocksMap[name] = block;
          }
        });

        let mapped = Object.values(latestBlocksMap).map((block) => ({
          title: block.codeBlockName,
          type: "code_block",
          code: block.code?.raw || "",
          updated_by: block.createdBy,
          updated_at: block.createdAt,
        }));

        setCodeBlocks(mapped);
      } catch (err) {
        console.error("Error fetching code blocks:", err);
      }
    };

    fetchBlocks();
  }, []);

  let handleAddCodeBlock = async (block) => {
    try {
      let res = await fetch(
        "https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions"
      );
      let existingBlocks = await res.json();

      let latestVersion = existingBlocks
        .filter((b) => b.codeBlockName === block.title)
        .reduce((max, b) => Math.max(max, b.version || 0), 0);

      let payload = {
        codeBlockName: block.title,
        createdBy: block.updated_by,
        code: { raw: block.code },
        version: latestVersion + 1,
      };

      let postRes = await fetch(
        "https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      let data = await postRes.json();

      setCodeBlocks((prev) => [
        ...prev,
        {
          title: data.codeBlockName,
          type: "code_block",
          code: data.code?.raw || "",
          updated_by: data.createdBy,
          updated_at: data.createdAt,
        },
      ]);
    } catch (err) {
      console.error("Failed to create code block:", err);
    }
  };

  let handleDeleteBlock = async (title) => {
    try {
      let res = await fetch(
        `https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions?search=${title}`
      );
      let results = await res.json();
      let target = results[0];

      if (!target?.id) return;

      await fetch(
        `https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions/${target.id}`,
        {
          method: "DELETE",
        }
      );

      setCodeBlocks((prev) => prev.filter((block) => block.title !== title));
    } catch (err) {
      console.error("Failed to delete code block:", err);
    }
  };

  let handleUpdateBlock = async (updatedBlock) => {
    try {
      let res = await fetch(
        "https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions"
      );
      let existingBlocks = await res.json();

      let latestVersion = existingBlocks
        .filter((b) => b.codeBlockName === updatedBlock.title)
        .reduce((max, b) => Math.max(max, b.version || 0), 0);

      let payload = {
        codeBlockName: updatedBlock.title,
        createdBy: updatedBlock.updated_by,
        code: { raw: updatedBlock.code },
        version: latestVersion + 1,
      };

      await fetch(
        "https://6879061063f24f1fdca08636.mockapi.io/workflow/code_blocks_versions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      setCodeBlocks((prev) =>
        prev.map((block) =>
          block.title === updatedBlock.title ? updatedBlock : block
        )
      );
    } catch (err) {
      console.error("Failed to update code block:", err);
    }
  };

  let handleBlockSelect = (block) => {
    setSelectedBlockType(block);
    setTrayOpen(false);
  };

  let handleWorkflowBlockRemove = (index) => {
    let confirm = window.confirm();
    if (!confirm) return;

    setWorkflowItems((prev) => prev.filter((_, i) => i !== index));
  };

  let handleWorkflowClick = (event) => {
    if (selectedBlockType) {
      setWorkflowItems((prev) => [
        ...prev,
        {
          title: selectedBlockType.title,
          type: selectedBlockType.type,
          id: Date.now(),
        },
      ]);
      setSelectedBlockType(null);
    }
  };

  let handleDrop = (item) => {
    if (item.source === "tray") {
      setWorkflowItems((prev) => [
        ...prev,
        { title: item.title, type: item.type },
      ]);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: selectedBlockType ? "#e3f2fd" : "#fff",
          zIndex: 1000,
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => setTrayOpen(true)}
            sx={{
              backgroundColor: "#f5f5f5",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            GTS Workflow Builder
          </Typography>
          {selectedBlockType && (
            <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
              Selected: {selectedBlockType.title} - Click on workflow area to
              place
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {selectedBlockType && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedBlockType(null)}
            >
              Cancel
            </Button>
          )}
          <Select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            size="small"
          >
            <MenuItem value="ProjectM">ProjectM</MenuItem>
            <MenuItem value="SolutionsE">SolutionsE</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2, overflow: "hidden" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Workflow Area {selectedBlockType && "- Click to place selected block"}
        </Typography>
        <DropZone
          onDrop={handleDrop}
          workflowItems={workflowItems}
          onBlockClick={(block) => {
            const fullBlock = codeBlocks.find((b) => b.title === block.title);
            if (fullBlock) {
              setSelectedBlock(fullBlock);
              setPreviewOpen(true);
              setPreviewSource("workflow");
            }
          }}
          onWorkflowClick={handleWorkflowClick}
          onWorkflowBlockRemove={handleWorkflowBlockRemove}
          selectedBlockType={selectedBlockType}
        />
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: trayOpen ? 0 : "-400px",
          width: "400px",
          height: "100vh",
          backgroundColor: "#fff",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          transition: "left 0.3s ease-in-out",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Block Tray
          </Typography>
          <IconButton onClick={() => setTrayOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Block
              title="Manual Step"
              type="manual"
              source="tray"
              onClick={() =>
                handleBlockSelect({ title: "Manual Step", type: "manual" })
              }
              isSelected={selectedBlockType?.title === "Manual Step"}
            />
            <Block
              title="Maker/Editor"
              type="editor"
              source="tray"
              onClick={() =>
                handleBlockSelect({ title: "Maker/Editor", type: "editor" })
              }
              isSelected={selectedBlockType?.title === "Maker/Editor"}
            />

            {codeBlocks.map((block, index) => (
              <Block
                key={`${block.title}-${index}`}
                title={block.title}
                type="code_block"
                source="tray"
                onClick={() => handleBlockSelect(block)}
                isSelected={selectedBlockType?.title === block.title}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedBlock(block);
                  setPreviewOpen(true);
                  setPreviewSource("tray");
                }}
              />
            ))}
            {user === "SolutionsE" && (
              <Button
                variant="contained"
                onClick={() => setModalOpen(true)}
                sx={{ height: 80, mt: 2 }}
                fullWidth
              >
                + Add Code Block
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {trayOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
          onClick={() => setTrayOpen(false)}
        />
      )}
      <CodeBlockPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        block={selectedBlock}
        currentUser={user}
        onUpdate={handleUpdateBlock}
        onDelete={handleDeleteBlock}
        forceReadOnly={previewSource === "workflow"}
      />
      <CodeBlockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddCodeBlock}
        currentUser={user}
      />
    </Box>
  );
};

export default App;
