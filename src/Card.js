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
}) {
  const [avatarUrl, setAvatarUrl] = useState(null);

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
        <IconButton aria-label="add to favorites">
          <FavoriteBorderOutlinedIcon />
          <FavoriteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
