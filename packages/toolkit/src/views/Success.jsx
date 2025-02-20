import ContinueButton from "../components/ContinueButton";

/**
 * Show a success message, and a continue button if a redirect URL is provided.
 * @param {object} props
 * @param {string} props.redirect - URL to redirect to. If
 * @returns
 */
const Success = ({ redirect }) => {
  return (
    <>
      <p>
        You're logged in!
        {redirect &&
          "If you aren't redirected, click the button below to continue."}
      </p>
      {redirect && <ContinueButton href={redirect} />}
    </>
  );
};

export default Success;
