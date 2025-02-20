import { getUserfrontProperty } from "../services/userfront";
import { useState, useEffect } from "react";

/**
 * A small banner, visible if in test mode, showing the reason why we're in test mode.
 * Hidden if not in test mode.
 *
 * @param {object} props
 * @param {string} mode - the mode, "test" or "live"
 */
const TestModeNotice = ({ mode }) => {
  const [testModeReason, setTestModeReason] = useState("");
  const isTestMode = mode === "test";
  useEffect(() => {
    const perform = async () => {
      const result = await getUserfrontProperty("mode");
      setTestModeReason(result?.reason || "");
    };
    if (isTestMode) {
      perform();
    }
  }, [isTestMode]);
  if (!isTestMode) {
    return null;
  }

  return (
    <div className="userfront-test-mode-notice">
      <span className="userfront-test-mode-text">
        Test Mode: {testModeReason}
      </span>
    </div>
  );
};

export default TestModeNotice;
