import { useMemo, useState } from "preact/hooks";

type SaveUser = {
  user: string;
  setUser: (data: string) => void;
  isEnabled: boolean;
  isOTPEnabled: boolean;
};
const SaveUser = ({ user, setUser, isEnabled, isOTPEnabled }: SaveUser) => {
  const [isSaved, setSaved] = useState<boolean>(false);
  const savedUser = useMemo(() => user, [isSaved]);

  function handleUserChange(e: any) {
    setUser(e.target.value);
  }

  function handleSave() {
    if (user === savedUser) return;
    setSaved(true);
    chrome.storage.local.set({ userID: user });
  }

  return (
    <div class="h-1/3 flex flex-col mt-5">
      <label class="flex select-none items-center justify-between px-1 py-2 text-base">
        User
      </label>
      <label
        class="h-3/5 flex items-stretch text-black"
        disabled={!isOTPEnabled || (!isEnabled && isOTPEnabled)}
      >
        <input
          type="text"
          placeholder="Enter user id of SMS Forwarder"
          class="rounded p-4 text-base border-2 border-slate-500"
          id="input-user"
          onChange={handleUserChange}
          value={user}
          disabled={!isOTPEnabled || (!isEnabled && isOTPEnabled)}
        />
        <button
          class={`flex items-center ${
            isEnabled && isOTPEnabled
              ? "hover:bg-green-500 bg-green-600"
              : "bg-slate-500"
          } rounded-md  ml-2 py-2 px-3 text-center text-base font-semibold text-white outline-none`}
          onClick={handleSave}
          disabled={!isOTPEnabled || (!isEnabled && isOTPEnabled)}
        >
          Save
        </button>
      </label>
      <FadeOutText isShow={isSaved} setShow={setSaved} text="Saved 🗸" />
    </div>
  );
};
export default SaveUser;

type FadeOutText = {
  isShow: boolean;
  setShow: (val: boolean) => void;
  text: string;
};

function FadeOutText({ isShow, setShow, text }: FadeOutText) {
  return isShow ? (
    <p
      class="p-2 text-green-400 animate-faded"
      onAnimationEnd={() => setShow(false)}
    >
      {text}
    </p>
  ) : (
    <></>
  );
}
