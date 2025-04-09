import { UAParser } from 'ua-parser-js';
import UserActivity from "../models/userActivityModel.js"

const logUserActivity = async (req, res, next) => {
  try {
    // Only proceed if user is authenticated
    if (req.user) {
      const parser = new UAParser();
      const ua = parser.setUA(req.headers["user-agent"]).getResult();

      await UserActivity.create({
        user: req.user._id,
        browser: ua.browser.name || "Unknown",
        deviceType: ua.device.type || "Desktop",
        page: req.originalUrl
      });
    }
  } catch (error) {
    console.error("Error logging user activity:", error.message);
   
  }

  next(); 
};

export default logUserActivity;
