import 'dotenv/config';

export default {
  expo: {
    entryPoint: "./index.ts",
    name: "Greenfield",
    slug: "Greenfield",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.zunnoon.Greenfield"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "8042594d-c901-4079-a2d0-7eb6cc54ec79"
      },
      // Environment variables for production
      API_BASE_URL: process.env.API_BASE_URL || "https://greenfieldsupermarket.com",
      DB_NAME: process.env.DB_NAME || "greenfieldsuperm_db",
      NODE_ENV: process.env.NODE_ENV || "production"
    },
    owner: "zunnoon"
  }
};
