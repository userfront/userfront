import { useState } from "react";
import "react-phone-input-2/lib/style.css";

// Workaround for a Vite/Rollup issue where CJS module exports
// work in development mode but not in production mode (?!?)
// See https://github.com/vitejs/vite/issues/2139#issuecomment-1173976668

import RPI from "react-phone-input-2";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const PhoneInput = RPI.default ?? RPI;

/**
 * A phone number input, using react-phone-input-2
 * Has country code dropdown selector and automatic formatting.
 * Value is the phone number in E.164 format.
 * Props are passed through to a hidden <input> whose value changes
 * when the visible input's value changes.
 *
 * @param {object} props
 * @returns
 */
const PhoneNumberInput = ({ ...props }) => {
  const [number, setNumber] = useState("");
  const handleChange = (value, country, e, formattedValue) => {
    setNumber(`+${value}`);
  };
  return (
    <>
      <PhoneInput country="us" value={number} onChange={handleChange} />
      <input type="hidden" value={number} {...props} />
    </>
  );
};

export default PhoneNumberInput;
