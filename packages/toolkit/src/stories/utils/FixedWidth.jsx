const FixedWidth = (props) => {
  if (props.width) {
    return (
      <div style={{ width: `${props.width}px`, maxWidth: "100%" }}>
        {props.children}
      </div>
    );
  }
  return <div style={{ width: "100%" }}>{props.children}</div>;
};

export default FixedWidth;
