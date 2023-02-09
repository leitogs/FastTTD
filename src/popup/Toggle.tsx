import { useEffect, useState } from "preact/hooks";

const Toggle = ({
  data,
}: {
  data: {
    onLabel: string;
    offLabel: string;
    btnType: string;
    labelStyle: string;
    disabled: boolean;
    onChange?: (data: any) => void;
  };
}) => {
  const [isEnabled, setEnable] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get([data.btnType], (out) => {
      if (out[data.btnType]) {
        setEnable(out[data.btnType]);
      }
    });
  }, []);

  function handleChange(e: any) {
    setEnable((prev) => !prev);
    chrome.storage.local.set({
      [data.btnType]: e.target.checked,
    });
    if (data.onChange) {
      data.onChange(e.target.checked);
    }
  }

  return (
    <div class="flex justify-center items-center">
      <span class={data.labelStyle}>
        {isEnabled ? data.onLabel : data.offLabel}
      </span>
      <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id={data.btnType}
          checked={isEnabled}
          onChange={handleChange}
          disabled={data.disabled}
          class={`${
            isEnabled ? "border-green-400 right-0" : " border-gray-300"
          } ${
            data.disabled ? "border-gray-300" : "cursor-pointer"
          } absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none`}
        />
        <label
          for={data.btnType}
          class={`${isEnabled ? "bg-green-400" : "bg-gray-300"} ${
            data.disabled ? "bg-gray-300" : "cursor-pointer"
          } block overflow-hidden h-6 rounded-full`}
        />
      </div>
    </div>
  );
};

export default Toggle;
