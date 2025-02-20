import { callUserfront } from "../services/userfront";

/**
 * A functioning logout button.
 *
 * @param {object} props
 * @param {boolean=} props.disabled - is the button disabled?
 * @param {object=} props.theme - theme information: color scheme, font, sizing, options
 * @param {string=} props.theme.colors.light - light color to use when deriving color scheme
 * @param {string=} props.theme.colors.dark - dark color to use when deriving color scheme
 * @param {object=} props.theme.colors - theme colors
 * @param {string=} props.theme.colors.accent - accent color to use when deriving color scheme (optional)
 * @param {string=} props.theme.colors.lightBackground - background color for light mode (optional)
 * @param {string=} props.theme.colors.darkBackground - background color for dark mode (optional)
 * @param {string=} props.theme.fontFamily - CSS font family to use for the form
 * @param {object=} props.theme.extras - additional options to modify the form's appearance
 * @param {boolean=} props.theme.extras.rounded - make form elements appear more rounded generally
 * @param {boolean=} props.theme.extras.squared - make form elements appear more squared-off generally
 * @param {boolean=} props.theme.extras.gradientButtons - add an interactive gradient to buttons
 * @param {boolean=} props.theme.extras.hideSecuredMessage - hide the "secured by Userfront" message
 * @param {boolean=} props.theme.extras.dottedOutline - use a dotted outline with some padding around active elements,
 *   rather than a solid outline that is flush with the outside of the element
 * @param {boolean=} props.theme.extras.raisedButtons - use old-school 3D-looking buttons
 * @param {(string|boolean)=} props.redirect - URL to redirect to. If false, disables redirect.
 *  If absent, redirect based on the tenant's after-logout path.
 * @param {array=} props.children - children to display in the button. Shows "Log out" if children are absent.
 * @returns
 */
const LogoutButton = ({
  redirect,
  disabled = false,
  demo = false,
  theme = {},
  children,
  style = {},
}) => {
  const _children = children || "Log out";
  const handleClick = async () => {
    if (demo) {
      return;
    }
    try {
      const arg = {};
      if (redirect != null) {
        arg.redirect = redirect;
      }
      callUserfront({
        method: "logout",
        args: [arg],
      });
    } catch (err) {
      // ...can this method even error, short of being disconnected or Userfront being down?
      console.warn(
        `Userfront.logout failed. Error: ${err.error}. Message: ${err.message}`
      );
    }
  };

  // Build the theme

  // Define CSS variables
  const themeColors = theme?.colors || {};
  const themeStyle = {
    "--userfront-light-color": themeColors.light || "#ffffff",
    "--userfront-dark-color": themeColors.dark || "#5e72e4",
    "--userfront-accent-color": themeColors.accent || "#13a0ff",
  };
  if (themeColors.lightBackground) {
    themeStyle["--userfront-light-background-color"] =
      themeColors.lightBackground;
  }
  if (themeColors.darkBackground) {
    themeStyle["--userfront-dark-background-color"] =
      themeColors.darkBackground;
  }
  if (theme?.fontFamily) {
    themeStyle["--userfront-font-family"] = theme.fontFamily;
  }

  // Classes for color schemes
  // For now, "light scheme only" is default, to match existing behavior.
  // In a future iteration "auto scheme" should be made default
  let colorSchemeClass = "userfront-light-scheme";
  if (theme?.colorScheme === "dark") {
    colorSchemeClass = "userfront-dark-scheme";
  }
  if (theme?.colorScheme === "auto") {
    colorSchemeClass = "userfront-auto-scheme";
  }

  // CSS variables for sizing
  if (theme?.size === "compact") {
    themeStyle["--userfront-em-size"] = "14px";
    themeStyle["--userfront-spacing"] = "0.5em";
  }
  if (theme?.size === "mini") {
    themeStyle["--userfront-em-size"] = "12px";
    themeStyle["--userfront-spacing"] = "0.5em";
    themeStyle["--userfront-container-width"] = "250px";
  }
  if (theme?.size === "spaced") {
    themeStyle["--userfront-em-size"] = "14px";
    themeStyle["--userfront-spacing"] = "20px";
  }
  if (theme?.size === "large") {
    themeStyle["--userfront-em-size"] = "20px";
    themeStyle["--userfront-spacing"] = "18px";
  }

  // Attach classes for theme customizations
  // TODO: syntax and terminology is flexible here
  const extrasClassMap = {
    gradientButtons: "userfront-gradient-buttons",
    hideSecuredMessage: "userfront-hide-branding",
    raisedButtons: "userfront-raised-buttons",
    dottedOutlines: "userfront-dotted-outlines",
  };
  const extras = theme?.extras || {};
  let customizationClasses = "";
  Object.entries(extras)
    .filter(([key, val]) => Boolean(val))
    .forEach(([key]) => {
      if (key in extrasClassMap) {
        customizationClasses += ` ${extrasClassMap[key]}`;
      } else {
        customizationClasses += ` userfront-${key}`;
      }
    });
  customizationClasses = customizationClasses.trim();

  return (
    <button
      onClick={handleClick}
      style={{ ...themeStyle, ...style }}
      className={`userfront-toolkit userfront-element userfront-button userfront-button-logout ${customizationClasses}`}
      aria-disabled={disabled}
      disabled={disabled}
    >
      {_children}
    </button>
  );
};

export default LogoutButton;
