import IconButton from "./IconButton";

/**
 * A button for an SSO provider, with appropriate icon.
 * Emits the selectFactor event when clicked.
 *
 * @param {object} props
 * @param {string} props.provider - the SSO provider
 * @param {function} props.onEvent
 */
const SsoButton = ({ provider, onEvent }) => {
  const handleClick = (evt) => {
    if (onEvent) {
      onEvent({
        type: "selectFactor",
        factor: {
          channel: "email",
          strategy: provider,
        },
      });
    }
  };
  return (
    <IconButton
      onClick={handleClick}
      factor={{ channel: "email", strategy: provider }}
    />
  );
};

export default SsoButton;
