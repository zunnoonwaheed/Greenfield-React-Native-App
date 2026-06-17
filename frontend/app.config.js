import 'dotenv/config';

export default {
  expo: {
    name: "greenfield",
    slug: "greenfield",

    version: "1.0.1",
    orientation: "portrait",

    icon: "./assets/logo.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    scheme: "greenfield",

    ios: {
      bundleIdentifier: "com.greenfieldsupermarket.app",
      associatedDomains: ["applinks:greenfieldsupermarket.com"]
    },

    android: {
      package: "com.greenfieldsupermarket.app",
      versionCode: 2,
      permissions: ["INTERNET"],
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff"
      },
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "greenfield",
              host: "*"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ]
    },

    plugins: [
      "expo-web-browser",
      "@react-native-google-signin/google-signin"
    ],

    extra: {
      API_BASE_URL:
        process.env.API_BASE_URL ||
        "https://greenfieldsupermarket.com/mobile-api/backend",

      NODE_ENV: "production",

      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || "969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com",

      // ✅ REQUIRED for dynamic config
      eas: {
        projectId: "bb87a0c7-0bc3-4311-ac60-9a2167343b73"
      }
    },

    owner: "zunnoonwaheed"
  }
};
