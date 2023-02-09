import packageJson from "../package.json";
import { ManifestType } from "@src/manifest-type";

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  author: packageJson.author,
  background: { service_worker: "src/background/index.js" },
  action: {
    default_icon: {
      "16": "timer_16.png",
      "32": "timer_32.png",
      "48": "timer_48.png",
      "128": "timer_128.png",
    },
    default_title: packageJson.name,
    default_popup: "src/popup/index.html",
  },
  icons: {
    "16": "timer_16.png",
    "32": "timer_32.png",
    "48": "timer_48.png",
    "128": "timer_128.png",
  },
  web_accessible_resources: [
    {
      resources: ["src/inject/index.js"],
      matches: [
        "https://online.tirupatibalaji.ap.gov.in/*",
        "https://tirupatibalaji.ap.gov.in/*",
      ],
    },
  ],
  permissions: [
    "webNavigation",
    "scripting",
    "storage",
    "declarativeNetRequest",
    "declarativeNetRequestFeedback",
  ],
  host_permissions: [
    "https://online.tirupatibalaji.ap.gov.in/*",
    "https://tirupatibalaji.ap.gov.in/*",
  ],
};

export default manifest;
