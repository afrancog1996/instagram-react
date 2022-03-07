import { Box, Button, Input } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="header">{t("login_title")}</h1>
      <p className="description">{t("login_subtitle")}</p>
      <div>
        <Input
          className="inputField"
          type="email"
          placeholder={t("email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className={"button block"}
          disabled={loading}
        >
          {loading ? (
            <span>{t("loading_span")}</span>
          ) : (
            <span>{t("button_magiclink")}</span>
          )}
        </Button>
      </div>
    </Box>
  );
}
