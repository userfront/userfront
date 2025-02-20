import { Component } from "react";
import BaseInput from "./BaseInput";
import EmailInput from "./EmailInput";
import EmailOrUsernameInput from "./EmailOrUsernameInput";
import PasswordInput from "./PasswordInput";
import TotpCodeInput from "./TotpCodeInput";
import BackupCodeInput from "./BackupCodeInput";
import VerificationCodeInput from "./VerificationCodeInput";

/**
 * Use as <Input /> for BaseInput
 * Use as <Input.Email /> for EmailInput, etc.
 */
export default class Input extends Component {
  static Email = EmailInput;
  static EmailOrUsername = EmailOrUsernameInput;
  static Password = PasswordInput;
  static TotpCode = TotpCodeInput;
  static BackupCode = BackupCodeInput;
  static VerificationCode = VerificationCodeInput;

  render() {
    return BaseInput(this.props);
  }
}
