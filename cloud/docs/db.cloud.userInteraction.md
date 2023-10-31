---
layout: docs-dexie-cloud
title: "db.cloud.userInteraction"
---

An observable that emits data for login dialogs. This observable shall be used in combination with setting [db.cloud.configure()#customlogingui](/cloud/docs/db.cloud.configure()#customlogingui) to true.

For an example on how to consume this observable and provide a custom GUI, see [authentication#customizing-login-gui](/cloud/docs/authentication#customizing-login-gui)

## Type

```ts
Observable<DXCUserInteraction>
```

```ts
export type DXCUserInteraction =
  | DXCGenericUserInteraction
  | DXCEmailPrompt
  | DXCOTPPrompt
  | DXCMessageAlert
  | DXCLogoutConfirmation;

export interface DXCGenericUserInteraction<Type extends string="generic", TFields extends {[name: string]: DXCInputField} = any> {
  type: Type;
  title: string;
  alerts: DXCAlert[];
  fields: TFields;
  submitLabel: string;
  cancelLabel: string | null;
  onSubmit: (params: { [P in keyof TFields]: string} ) => void;
  onCancel: () => void;
}

/** When the system needs to prompt for an email address for login.
 * 
*/
export interface DXCEmailPrompt {
  type: 'email';
  title: string;
  alerts: DXCAlert[];
  fields: {
    email: {
      type: 'text';
      placeholder: string;
    };
  };
  submitLabel: string;
  cancelLabel: string;
  onSubmit: (params: { email: string } | { [paramName: string]: string }) => void;
  onCancel: () => void;
}

/** When the system needs to prompt for an OTP code.
 * 
*/
export interface DXCOTPPrompt {
  type: 'otp';
  title: string;
  alerts: DXCAlert[];
  fields: {
    otp: {
      type: 'text';
      label: string;
    }
  };
  submitLabel: string;
  cancelLabel: string;
  onSubmit: (params: { otp: string } | { [paramName: string]: string }) => void;
  onCancel: () => void;
}

/** When the system must inform about errors, warnings or information */
export interface DXCMessageAlert {
  type: 'message-alert';
  title: string;
  alerts: DXCAlert[];
  fields: {
    [name: string]: DXCInputField;
  };
  submitLabel: string;
  cancelLabel?: null;
  onSubmit: (params: { [paramName: string]: string }) => void;
  onCancel: () => void;
}

/** When the system needs confirmation to logout current user when
 * there are unsynced changes that would be lost.
 */
export interface DXCLogoutConfirmation {
  type: 'logout-confirmation';
  title: string;
  alerts: DXCAlert[];
  fields: {
    [name: string]: DXCInputField;
  };
  submitLabel: string;
  cancelLabel: string;
  onSubmit: (params: { [paramName: string]: string }) => void;
  onCancel: () => void;
}

export type DXCAlert = DXCErrorAlert | DXCWarningAlert | DXCInfoAlert;

export interface DXCErrorAlert {
  type: 'error';
  messageCode: 'INVALID_OTP' | 'INVALID_EMAIL' | 'LICENSE_LIMIT_REACHED' | 'GENERIC_ERROR';
  message: string;
  messageParams: { [paramName: string]: string; };
}

export interface DXCWarningAlert {
  type: 'warning';
  messageCode: 'GENERIC_WARNING' | 'LOGOUT_CONFIRMATION';
  message: string;
  messageParams: { [paramName: string]: string; };
}

export interface DXCInfoAlert {
  type: 'info';
  messageCode: 'GENERIC_INFO' | 'OTP_SENT';
  message: string;
  messageParams: { [paramName: string]: string; };
}

export type DXCInputField = DXCTextField | DXCPasswordField;

export interface DXCTextField {
  type: 'text' | 'email' | 'otp';
  label?: string;
  placeholder?: string;
}

export interface DXCPasswordField {
  type: 'password';
  label?: string;
  placeholder?: string;
}

```

## Localization

If you need to localize the login dialog, you can ignore the given texts and use custom texts based on:

* type:  ('otp', 'email', 'message-alert' or 'logout-confirmation')
* alerts[n].type: ('error', 'warning' or 'info')
* alerts[n].messageCode, which can be any of the following values:
  * 'INVALID_OTP'
  * 'INVALID_EMAIL'
  * 'LICENSE_LIMIT_REACHED'
  * 'GENERIC_ERROR'
  * 'GENERIC_WARNING'
  * 'LOGOUT_CONFIRMATION' - messageParams will contain `{currentUserId, numUnsyncedChanges}`
  * 'GENERIC_INFO'
  * 'OTP_SENT' - messageParams will contain `{ email }`
* fields[name].type ('text', 'email', 'otp' or 'password')
