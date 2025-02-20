import ErrorMessage from "../components/ErrorMessage";

/**
 * A view that's exclusively an error message, for unhandled, unrecoverable errors
 * that prevent entering the flow.
 * Errors within flows are shown in the regular UI.
 *
 * @param {object} props
 * @param {object} error - a Userfront error to display
 */
const GeneralErrorMessage = ({
  error,
  message = "An unhandled error occurred. Please try again later.",
}) => {
  return (
    <div>
      {message && <p>{message}</p>}
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default GeneralErrorMessage;
