/**
 * A submit button with appropriate styling.
 * If no children are provided, contains the text "Submit".
 * Props are passed through to the underlying <button>.
 *
 * @param {object} props
 * @returns
 */
const SubmitButton = ({ children, ...props }) => {
  const _children = children || "Submit";
  return (
    <button
      className="userfront-button userfront-button-primary"
      type="submit"
      {...props}
    >
      {_children}
    </button>
  );
};

export default SubmitButton;
