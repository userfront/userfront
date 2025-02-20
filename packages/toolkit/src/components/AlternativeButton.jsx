/**
 * A button that offers an alternative, with subtle styling.
 * Props are passed through to the underlying <button>
 * @param {object} props
 * @returns
 */
const AlternativeButton = (props) => {
  return (
    <button className="userfront-button userfront-button-subtle" {...props} />
  );
};

export default AlternativeButton;
