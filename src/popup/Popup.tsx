import { useEffect, useMemo, useState } from "preact/hooks";
import SaveUser from "./SaveUser";
import Toggle from "./Toggle";

const Popup = () => {
  const [user, setUser] = useState<string>("");
  const [isOTPEnabled, setOTPEnabled] = useState<boolean>(false);
  const [isEnabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(
      ["isEnabled", "isOTPEnabled", "userID"],
      (data) => {
        if (data["userID"]) {
          setUser(data["userID"]);
        }
        if (data["isEnabled"]) {
          setEnabled(data["isEnabled"]);
          changeBadge(data["isEnabled"]);
        }
        if (data["isOTPEnabled"]) {
          setOTPEnabled(data["isOTPEnabled"]);
        }
      }
    );
  }, []);

  function handleAppState(isEnabled: boolean) {
    changeBadge(isEnabled);
    setEnabled(isEnabled);
    chrome.storage.local.set({ isEnabled });
  }

  function handleOTPState(isOTPEnabled: boolean) {
    setOTPEnabled(isOTPEnabled);
    chrome.storage.local.set({ isOTPEnabled });
  }

  return (
    <div class="w-[400px] h-[200px] flex flex-col justify-start items-center p-5 bg-slate-700 text-white">
      <div class="w-full flex justify-center items-center">
        <div class="w-3/4 flex justify-between">
          <Toggle
            data={{
              onLabel: "ON",
              offLabel: "OFF",
              btnType: "isEnabled",
              labelStyle: "text-base font-medium mr-4",
              disabled: false,
              onChange: handleAppState,
            }}
          />
          <Toggle
            data={{
              onLabel: "Receive OTP",
              offLabel: "Receive OTP",
              btnType: "isOTPEnabled",
              labelStyle: "text-base font-medium mr-4",
              disabled: !isEnabled,
              onChange: handleOTPState,
            }}
          />
        </div>
      </div>
      <SaveUser
        user={user}
        setUser={setUser}
        isEnabled={isEnabled}
        isOTPEnabled={isOTPEnabled}
      />
    </div>
  );
};

export default Popup;

function changeBadge(isON: boolean) {
  isON ? setBadge("green", "ON") : setBadge("red", "OFF");
}

function setBadge(color: string, text: string) {
  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeText({ text: text });
}
