import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  gab: "15%",
  p: 4,
};

export default function BasicModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const textRef = React.useRef(null);
  const fileRef = React.useRef(null);

  async function handleInsert() {
    try {
      setUploading(true);

      if (!fileRef.current.files || fileRef.current.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      if (!textRef.current.value || textRef.current.value.length === 0) {
        throw new Error("You must add a description to upload.");
      }

      const file = fileRef.current.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const user = JSON.parse(localStorage.getItem("supabase.auth.token"));

      const updates = {
        description: textRef?.current?.value,
        avatar_url: filePath,
        user_id: user?.currentSession?.user?.id,
        user_email: user?.currentSession?.user?.email,
      };

      let { recordError } = await supabase.from("records").insert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      let { error } = await supabase.storage
        .from("posts")
        .upload(filePath, file);

      if (error || recordError) {
        throw error;
      }

      handleClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TextareaAutosize
          placeholder="Descripcion..."
          style={{ height: 200 }}
          ref={textRef}
        />
        <Button>
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading image..." : "Upload Image"}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            ref={fileRef}
            disabled={uploading}
          />
        </Button>
        <Button onClick={handleInsert} disabled={uploading}>
          {t("button_modal")}
        </Button>
        <Button onClick={handleClose}>{t("close_modal")}</Button>
      </Box>
    </Modal>
  );
}
