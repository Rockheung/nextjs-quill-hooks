import Header from "./Header";

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: `1px solid #DDD`
};

export const Layout = props => {
  return (
    <div style={layoutStyle}>
      <Header />
      {props.children}
    </div>
  );
};

export const withLayout = Page => () => {
  return (
    <div style={layoutStyle}>
      <Header />
      <Page />
    </div>
  );
};
