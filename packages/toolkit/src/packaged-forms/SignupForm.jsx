"use client";

import PackagedUniversalForm from "./UniversalForm";

/**
 * A fully functional Userfront signup form
 *
 * @param {object} props
 * @param {string=} props.tenantId - the tenant ID to use
 * @param {object=} props.flow - auth flow to use. By default this is fetched from the server.
 * @param {boolean=} props.compact - if true, for the password method, show a "Username and password" button.
 *   If false, show the password entry form alongside the buttons to choose a different factor.
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
 * @param {(string|boolean)=} props.redirect - URL to redirect to after successful signup.
 *   If false, do not redirect.
 *   If absent, use the after-signup path from the server.
 * @param {boolean=} props.redirectOnLoadIfLoggedIn - if true, will redirect to the after-signup path on page load
 *     if the user is already logged in
 *   If false, will not redirect on page load.
 *   Defaults to false.
 *   Does not control whether user is redirected after signing up.
 * @param {boolean=} props.shouldFetchFlow - if true (default), fetch the first factors from the server.
 *   If false, do not fetch the first factors from the server.
 *   Should be left at true in most production use cases.
 *   May be useful in some dev environments.
 * @param {boolean=} props.xstateDevTools - if true, enable XState dev tools on the form's model.
 *   Defaults to false; should remain false in production.
 *   Only useful when developing this library.
 */
function PackagedSignupForm(props) {
  return <PackagedUniversalForm type="signup" {...props} />;
}

export default PackagedSignupForm;
