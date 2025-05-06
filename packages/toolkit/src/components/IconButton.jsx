import appleLogo from "../assets/logos/apple.svg";
import azureLogo from "../assets/logos/azure.svg";
import facebookLogo from "../assets/logos/facebook.svg";
import githubLogo from "../assets/logos/github.svg";
import googleLogo from "../assets/logos/google.svg";
import linkedInLogo from "../assets/logos/linkedin.svg";
import twitterLogo from "../assets/logos/twitter.svg";
import oktaLogo from "../assets/logos/okta.svg";
import { MdPassword, MdOutlineMarkEmailRead } from "react-icons/md";
import { TbLink, TbDeviceMobileMessage } from "react-icons/tb";
import { TiSortNumerically } from "react-icons/ti";
import React from "react";

const BasicButton = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

const Icon = ({ logo }) => {
  return (
    <img
      src={logo}
      alt=""
      className="userfront-button-icon"
      width="32px"
      height="32px"
    />
  );
};

/**
 * @typedef {Object} Factor
 * @property {string} channel
 * @property {string} strategy
 *
 * @typedef {Object} FactorDisplayInfo
 * @property {React.Component} icon
 * @property {string} text
 */

/**
 * Given a factor from a Userfront auth endpoint, get its
 * display icon and text.
 * @param {Factor} factor
 * @returns {FactorDisplayInfo}
 */
export const factorToLogoAndText = (factor) => {
  switch (factor.strategy) {
    case "password":
      return {
        logo: <MdPassword className="userfront-button-icon" size="32px" />,
        text: "Username and password",
      };
    case "link":
      return {
        logo: <TbLink className="userfront-button-icon" size="32px" />,
        text: "Email me a link",
      };
    case "totp":
      return {
        logo: (
          <TiSortNumerically className="userfront-button-icon" size="32px" />
        ),
        text: "Use an authenticator app",
      };
    case "apple":
      return {
        logo: <Icon logo={appleLogo} />,
        text: "Apple",
      };
    case "azure":
      return {
        logo: <Icon logo={azureLogo} />,
        text: "Azure",
      };
    case "facebook":
      return {
        logo: <Icon logo={facebookLogo} />,
        text: "Facebook",
      };
    case "github":
      return {
        logo: <Icon logo={githubLogo} />,
        text: "Github",
      };
    case "google":
      return {
        logo: <Icon logo={googleLogo} />,
        text: "Google",
      };
    case "linkedin":
    case "linkedIn":
      return {
        logo: <Icon logo={linkedInLogo} />,
        text: "LinkedIn",
      };
    case "twitter":
      return {
        logo: <Icon logo={twitterLogo} />,
        text: "Twitter",
      };
    case "okta":
      return {
        logo: <Icon logo={oktaLogo} />,
        text: "Okta",
      };
    case "verificationCode": {
      switch (factor.channel) {
        case "email":
          return {
            logo: (
              <MdOutlineMarkEmailRead
                className="userfront-button-icon"
                size="32px"
              />
            ),
            text: "Email already configured",
            disabled: true,
          };
        case "sms":
          return {
            logo: (
              <TbDeviceMobileMessage
                className="userfront-button-icon"
                size="32px"
              />
            ),
            text: "Text me a code",
          };
      }
    }
    default:
      return {
        logo: null,
        text: factor.strategy,
      };
  }
};

/**
 * A button with an icon for the given Userfront factor.
 * Text is chosen based on the factor.
 *
 * @param {object} props
 * @param {object} props.factor - a Userfront factor { strategy, channel }
 * @returns
 */
const IconButton = ({ factor, children, ...props }) => {
  if (!factor) {
    return <BasicButton {...props}>{children}</BasicButton>;
  }
  const { logo, text , disabled } = factorToLogoAndText(factor);
  return (
    <button {...props} disabled={props?.disabled || disabled} className="userfront-button userfront-button-secondary">
      <span className="userfront-icon-button-content">
        {logo}
        <span className="userfront-icon-button-text">{`${text}`}</span>
      </span>
    </button>
  );
};

export default IconButton;
