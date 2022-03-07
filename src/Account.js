import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import RecipeReviewCard from "./Card";
import "./index.css";
import BasicModal from "./Modal";
import { supabase } from "./supabaseClient";

export default function Account() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState(null);
  const [datas, setDatas] = useState(null);
  const user = JSON.parse(localStorage.getItem("supabase.auth.token"));
  const languages = {
    en: {
      name: "English",
      code: "en",
    },
    es: {
      name: "Español",
      code: "es",
    },
  };
  const { t } = useTranslation();
  const [value, setValue] = useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (code) => {
    i18next.changeLanguage(code);
    setAnchorEl(null);
  };

  const getPostsByUser = async () => {
    try {
      let { data } = await supabase
        .from("records")
        .select()
        .eq("user_id", user?.currentSession?.user?.id);

      setData(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getPostsByAllUsers = async () => {
    try {
      let { data } = await supabase.from("records").select("*");
      setDatas(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPostsByUser();
    getPostsByAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box sx={{ width: "100%", marginLeft: "5%" }}>
          <Button onClick={handleOpen}>{t("button_modal")}</Button>
        </Box>
        <Box sx={{ flexShrink: 1, marginRight: "5%" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ mr: 2 }}
          >
            <LanguageRoundedIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={(e) => {
                handleClose(languages?.es?.code);
              }}
            >
              {languages.es.name}
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                handleClose(languages?.en?.code);
              }}
            >
              {languages.en.name}
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="one" label="Posts" />
          <Tab value="two" label="MyPost" />
        </Tabs>
      </Box>

      <Box sx={{ alignSelf: "center", padding: 3 }}>
        {data !== null && value === "one"
          ? data.map((current, index) => (
              <Box key={index} sx={{ marginBottom: 4 }}>
                <RecipeReviewCard
                  key={index}
                  username={current.user_email}
                  date={current.inserted_at}
                  description={current.description}
                  image={current.avatar_url}
                  like={current.like}
                  id={current.id}
                  setDatas={setDatas}
                  setData={setData}
                ></RecipeReviewCard>
              </Box>
            ))
          : ""}
        {datas !== null && value === "two"
          ? datas.map((current, index) => (
              <Box key={index} sx={{ marginBottom: 4 }}>
                <RecipeReviewCard
                  key={index}
                  username={current.user_email}
                  date={current.inserted_at}
                  description={current.description}
                  image={current.avatar_url}
                  like={current.like}
                  id={current.id}
                  setDatas={setDatas}
                  setData={setData}
                ></RecipeReviewCard>
              </Box>
            ))
          : ""}
      </Box>
      {/* {open && <BasicModal  />} */}
      {open && <BasicModal open={open} setOpen={setOpen} />}
    </Box>
  );
}
