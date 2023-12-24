import { frontend_endpoint } from "../common/constants";

const supertokens_endpoint = `${frontend_endpoint}`;

export const appInfo = {
  appName: "SuperTokens Next.js demo app",
  apiDomain: supertokens_endpoint,
  websiteDomain: supertokens_endpoint,
  apiBasePath: "/api/auth",
  websiteBasePath: "/auth",
};
