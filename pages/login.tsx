import React from "react";

const TENANT = "link.cuhk.edu.hk";
const CLIENT_ID = "373b4ec9-6336-4955-90cf-b7cbd9e3426f";
const REDIRECT_URI = "http://localhost:3000/api/login";

const microsoftLogin: React.FunctionComponent = () => {
  let link = "https://login.microsoftonline.com/";
  link += `${TENANT}/oauth2/v2.0/authorize?`;
  link += `client_id=${CLIENT_ID}`;
  link += `&response_type=code`;
  link += `&scope=user.read`;
  link += `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  link += `&response_mode=form_post`;
  link += `&prompt=select_account`;
  link += `&domain_hint=${TENANT}`;
  return <a href={link}>login</a>;
};

export default microsoftLogin;
