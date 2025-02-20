/**
 * A retry button, with subtle styling.
 * If no children are passed, contains the text "Retry".
 * Props are passed through to the underlying <button>.
 *
 * @param {object} props
 * @returns
 */
const RetryButton = ({ children, ...props }) => {
  const message = children || "Retry";
  return (
    <button className="userfront-button userfront-button-subtle" {...props}>
      {message}
    </button>
  );
};

export default RetryButton;
