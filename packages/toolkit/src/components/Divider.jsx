/**
 * A horizontal divider, optionally containing some text.
 * If without text, a solid line.
 * If with text, two solid lines with the text in the middle:
 *   ---- text ----
 *
 * @param {object} props
 * @param {string} props.text
 * @returns
 */
const Divider = ({ text }) => {
  if (text) {
    return (
      <div className="userfront-divider-split">
        <div className="userfront-divider" />
        <span className="userfront-divider-text">{text}</span>
        <div className="userfront-divider" />
      </div>
    );
  }
  return <div className="userfront-divider" />;
};

export default Divider;
