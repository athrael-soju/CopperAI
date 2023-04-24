import { useState, useEffect } from "react";
import env from "react-dotenv";

const useFetchRandomWallpaper = () => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("");

  useEffect(() => {
    const generateWallpaper = async () => {
      try {
        const response = await fetch(
          `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_WALLPAPER_ENDPOINT}`
        );

        if (!response.ok) {
          throw new Error("Unable to get image");
        }

        const data = await response.json();
        setBackgroundImageUrl(data.imageUrl);
      } catch (error) {
        console.error("Error fetching wallpaper from Dall-E:", error);
      }
    };

    if (env.DALLE_API_ENABLED === "true") {
      console.log("DALL-E Background Wallpaper Generation is Enabled");
      generateWallpaper();
    } else {
      console.log(
        "DALL-E Background Wallpaper Generation is Disabled. Using Default Background Wallpaper."
      );
    }
  }, []);

  return backgroundImageUrl;
};

export default useFetchRandomWallpaper;