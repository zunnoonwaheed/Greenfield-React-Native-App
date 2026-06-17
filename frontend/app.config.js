import 'dotenv/config';

export default {
  expo: {
    name: "Greenfield",
    slug: "greenfield",

    version: "1.0.1",
    orientation: "portrait",

    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,

    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    scheme: "greenfield",

    ios: {
      bundleIdentifier: "com.greenfieldsupermarket.app",
      supportsTablet: true,
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
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
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

    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },

    plugins: [
      "expo-web-browser",
      "@react-native-google-signin/google-signin"
    ],

    extra: {
      API_BASE_URL:
        process.env.API_BASE_URL ||
        "https://greenfieldsupermarket.com/mobile-api/backend",

      NODE_ENV: process.env.NODE_ENV || "production",

      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || "969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com",

      eas: {
        projectId: "bb87a0c7-0bc3-4311-ac60-9a2167343b73"
      }
    },

    owner: "zunnoonwaheed"
  }
};
