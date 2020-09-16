import axios from "axios";

const TENANT = "link.cuhk.edu.hk";
const CLIENT_ID = "373b4ec9-6336-4955-90cf-b7cbd9e3426f";
const REDIRECT_URI = "http://localhost:3000/api/login";
const CLIENT_SECRET = "vKst47W0fi_-I~qv9zP4utA~6IOhYeHXHm";

export default async (req, res) => {
  if (req.body.code) {
    const link = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
    axios
      .post(link, {
        client_id: CLIENT_ID,
        scope: "user.read",
        code: req.body.code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
        client_secret: CLIENT_SECRET,
      })
      .then((res2) => {
        console.log(`statusCode: ${res.statusCode}`);
        // console.log(res2);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ name: "John Doe" }));
      });
  } else {
    console.log("???");
  }
};
