const Container = ({ sizeClass, title, children, style }) => {
  return (
    <div
      style={style}
      className={`userfront-toolkit userfront-container ${sizeClass}`}
    >
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default Container;
