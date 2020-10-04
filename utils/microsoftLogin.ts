import qs from "qs";

export const getMicrosoftLoginLink = ({
  baseUrl,
  clientId,
}: {
  baseUrl: string;
  clientId: string;
}): string => {
  const TENANT = "link.cuhk.edu.hk";
  const redirectUrl = `${baseUrl}/api/login`;

  const body = qs.stringify({
    client_id: clientId,
    response_type: "code",
    scope: "user.read",
    redirect_uri: redirectUrl,
    response_mode: "form_post",
    prompt: "select_account",
    domain_hint: TENANT,
  });

  return `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize?${body}`;
};

export default getMicrosoftLoginLink;
