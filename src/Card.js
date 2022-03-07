import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function RecipeReviewCard({
  username,
  date,
  description,
  image,
  like,
  id,
  setData,
  setDatas
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const user = JSON.parse(localStorage.getItem("supabase.auth.token"));

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("posts")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  };

  const handleClick = async () => {
    try {
      let aux = like + 1;
      let ids = id;

      await supabase
        .from("records")
        .update({"like": aux})
        .match({"id": ids});

        getPostsByUser();

        getPostsByAllUsers();
    } catch (e) {
      console.log(e);
    }
  };

  const getPostsByUser = async () => {
    try {
      let { data } = await supabase
        .from("records")
        .select()
        .eq("user_id", user?.currentSession?.user?.id);

      setData(data);
      console.log(data)
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
    const fetch = async () => {
      await downloadImage(image);
    };
    fetch();
  }, [image]);

  return (
    <Card sx={{ maxWidth: "90%", minWidth: "30%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        title={username}
        subheader={date}
      />
      <CardMedia component="img" height="350" image={avatarUrl} alt="Post" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="add to favorites" onClick={handleClick}>
          {like > 0 && <FavoriteIcon />}
          {like === 0 && <FavoriteBorderOutlinedIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
}
