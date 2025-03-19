import LogoutButton from "../../components/LogoutButton";
import FixedWidth from "../utils/FixedWidth";

export default {
  title: "Forms/Logout button",
  component: LogoutButton,
  argTypes: {
    width: {
      name: "Width of container",
      type: { name: "number", required: false },
      description:
        "Views fill their container by default. Set the container width, or 0 to fill the Storybook container. If set, disables the size option above.",
      control: "number",
    },
  },
  parameters: {
    passStyle: true,
  },
};

export const Default = (args) => {
  if (args.width) {
    return (
      <FixedWidth width={args.width}>
        <LogoutButton />
      </FixedWidth>
    );
  }
  let width;
  return (
    <FixedWidth width={width}>
      <LogoutButton />
    </FixedWidth>
  );
};
Default.args = {
  width: 340,
};
Default.storyName = "Logout button";
