/**
 * A "Back" button that sends a back event when clicked.
 * Styled as a secondary button.
 * If no children are provided, contains the text "Back".
 * Additional props are passed through to the underlying <button>
 *
 * @param {object} props
 * @param {function} props.onEvent
 * @param {function} props.onClick
 * @param {Array} props.children
 * @returns
 */
const BackButton = ({ onEvent, onClick, children, ...props }) => {
  const handleClick = (evt) => {
    if (onEvent) {
      onEvent({
        type: "back",
      });
    }
    if (onClick) {
      onClick(evt);
    }
  };

  const content = children || "Back";
  return (
    <button
      className="userfront-button userfront-button-secondary"
      type="button"
      {...props}
      onClick={handleClick}
    >
      {content}
    </button>
  );
};

export default BackButton;
