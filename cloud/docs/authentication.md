---
layout: docs-dexie-cloud
title: "Authentication in Dexie Cloud"
---
<div class="shoutouts" style="text-align: left; margin: 20px 0 35px 0;">
   <p>Zero config, registrationless, passwordless</p>
   <p>Easy to replace with your own authentication</p>
   <p>Long-lived sessions & cryptographically protected tokens</p>
</div>
<hr/>

This page describes the default authentication in Dexie Cloud, how to replace it with your own authentication and how we protect our access tokens using the latest security standards in web browsers.

If you are new to Dexie Cloud, please visit the [Dexie Cloud landing page](/cloud/).

If you prefer to jump right in to samples, here some shortcuts:

- [Example zero config setup](#zero-config-setup)
- [Example customizing login GUI](#customizing-login-gui)
- [Example auth integration](db.cloud.configure()#example-integrate-custom-authentication)

## Introduction

Dexie Cloud is for writing offline capable applications, which means that the typical use case is long-lived authentication sessions that lasts for months or until the user actively logs out from it.

In the default setup, users will only need to authenticate the very first time they visit your app. There is no registration step for your users and they won't need to create any password, as authentication is performed over passwordless email OTP. The authentication step will result in a securely stored, non-exportable crypto key in your indexedDB that can reathenticate future sync calls automatically without having to require further user interaction.

## Zero config setup

If you just enable dexie-cloud-addon the way it is explained on [the landing page](/cloud/) you will be using the default authentication and you will not need your own server endpoint. Your app can be hosted on any site, such as a static site on GitHub Pages or similar and yet be able to authenticate users and sync data with your cloud database.

## Customizing login GUI

If nothing is configured, dexie-cloud-addon will provide a default login GUI when a login is required. If you don't need to replace the default OTP authentication but still need to control the GUI of the default OTP solution, it can be customized by as follows:

1. Configure it to disable built-in GUI: `db.cloud.configure({customLoginGui: true})`
2. Observe `db.cloud.userInteraction` and show a dialog that corresponds to what it requests.

Here's an example based on dexie-cloud-addon@4.0.1-beta.52 or later.

```tsx
import { useState } from 'react';
import { useObservable } from 'dexie-react-hooks';
import { db } from './db'; // A module that exports the Dexie instance with dexie-cloud-addon attached.
import { resolveText, DXCInputField, DXCUserInteraction } from 'dexie-cloud-addon';
import styled from 'styled-components';

/** Example login dialog
 * 
 * This component showcases how to provide a custom login GUI for login dialog.
 * The principle is simple:
 *   * We use useObservable() to observe `db.cloud.userInteraction` into local variable ui.
 *   * If it is undefined, the system does not need to show any dialog (which is the most common case)
 *   * Else if ui is truthy, it will have the following properties:
 *     * ui.type = type of dialog ('email', 'otp', 'message-alert' or 'logout-confirmation')
 *     * ui.title = the suggested title of the dialog. You can use it or use your own based on ui.type.
 *     * ui.alerts = array of alerts (warnings, errors or information messages to show to user). This array
 *       may be present in any type of dialog.
 *     * ui.fields = input fields to collect from user. This is an object where key is the field name and
 *       value is a field description (DXCInputField)
 *     * ui.submitLabel = A suggested text for the submit / OK button
 *     * ui.cancelLabel = undefined if no cancel button is appropriate, or a suggested text for the cancel button.
 *     * ui.onSubmit = callback to call when fields have been collected from user. Accepts an object where
 *       key is the field name and value is the collected value.
 *     * ui.onCancel = callback to call if user clicks cancel button.
 */
export function MyLoginGUI() {
  const ui = useObservable(db.cloud.userInteraction);
  if (!ui) return null; // No user interaction is requested.
  return <MyLoginDialog ui={ui} />
}

export function MyLoginDialog({ ui }: { ui: DXCUserInteraction }) {
  const [params, setParams] = useState<{ [param: string]: string }>({});

  return (
    <MyDialogStyling>
      <div className="fullscreen darken" />
      <div className="fullscreen dlg-outer">
        <div className="dlg-inner">
          <h2>My Custom Login Prompt</h2>
          <h3>{ui.title}</h3>
          {ui.alerts?.map((alert, i) => (
            <p key={i} className={`dxcdlg-alert-${alert.type}`}>{resolveText(alert)}</p>
          ))}
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              ui.onSubmit(params);
            }}
          >
            {(Object.entries(ui.fields) as [string, DXCInputField][]).map(
              ([fieldName, { type, label, placeholder }], idx) => (
                <label key={idx}>
                  {label ? `${label}: ` : ''}
                  <input
                    type={type}
                    name={fieldName}
                    autoFocus
                    placeholder={placeholder}
                    value={params[fieldName] || ''}
                    onChange={(ev) => {
                      const value = ev.target.value;
                      let updatedParams = {
                        ...params,
                        [fieldName]: value,
                      };
                      setParams(updatedParams);
                    }}
                  />
                </label>
              )
            )}
          </form>
          <div className="dxc-buttons">
            <>
              <button
                type="submit"
                onClick={() => ui.onSubmit(params)}
              >
                {ui.submitLabel}
              </button>
              {ui.cancelLabel && (
                <button onClick={ui.onCancel}>
                  {ui.cancelLabel}
                </button>
              )}
            </>
          </div>
        </div>
      </div>
    </MyDialogStyling>
  );
}

// Dialog styling
const MyDialogStyling = styled.div`
  .fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
  .darken {
    opacity: 0.5;
    background-color: #000;
    z-index: 150;
    backdrop-filter: blur(2px);
    webkit-backdrop-filter: blur(2px);
  }
  .dlg-outer {
    z-index: 150;
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .dlg-inner {
    position: relative;
    color: #222;
    background-color: #fff;
    padding: 30px;
    margin-bottom: 2em;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    border: 3px solid #3d3d5d;
    border-radius: 8px;
    box-shadow: 0 0 80px 10px #666;
    width: auto;
    font-family: sans-serif;
  }
  .dlg-input {
    height: 35px;
    width: 17em;
    border-color: #ccf4;
    outline: none;
    font-size: 17pt;
    padding: 8px;
  }
  .alert-error {
    color: red;
    font-weight: bold;
  }
  .alert-warning {
    color: #f80;
    font-weight: bold;
  }
  .alert-info {
    color: black;
  }    
`;

```

## Default Authentication from a user's perspective

1. User goes to your webapp the very first time (as authentication lasts for months by default)
2. User is prompted for email address.
3. User get an email containing a one-time password such as `ABC123`.
4. User enters the OTP.
5. User is in.

After this initial step, user does not need to reauthenticate for months unless he or she actively logs out from your app. The long session timeout is designed for typical offline-first applications that require this.

## Encrypting your offline data

For more sensitive applications, instead of limiting the session timeout (which by design should be long for offline first apps), your app could choose to encrypt sensitive data and require a password from your user for decryption. There are two dexie compatible open source libraries that adds encryption to Dexie: [dexie-encrypted](https://github.com/mark43/dexie-encrypted) with the steps described in [this issue comment](https://github.com/dexie/Dexie.js/issues/1604#issuecomment-1237065115) and [dexie-easy-encrypt](https://github.com/jaetask/dexie-easy-encrypt). By encrypting the sensisitve parts of the offline data you protect the data much better than short session timeouts, that would require resync more often.

Dexie Cloud will focus on making encryption easier to integrate going forward, with built-in support for local offline authentication, but if you need a working solution today, I would recommend the solution with dexie-encrypted as described above and provide some custom way of deriving an encryption key from a user password or similar. If you could wait with encryption until we have a more integrated solution, that might be even better as your encrypted data might need to be migrated if you later on decide to switch encryption solution.

## Replace authentication with custom authentication

The transport security will still be the same if you replace the default authentication - tokens will still be protected by CryptoKeys. The difference is only how the authentication takes place - the step that is required for Dexie Cloud to negotiate the token flow.

To replace authentication, see [the following sample](db.cloud.configure()#example-integrate-custom-authentication).


## Tokens

Every Dexie Cloud Database has a token endpoint that gives out tokens for client applications. A successful authentication will result in a new token returned. Dexie Cloud also gives out refresh tokens. Refresh tokens are accompanied with an RSA keypair stored on the client. The private key is protected from being
copied - stored as a CryptoKey instance in IndexedDB. Dexie cloud will only accept refresh tokens if they
are accompanied with a valid signature from the client's private key - a signature of the refresh token
content concatenated with current timestamp.

No matter if you have integrated your own authentication system, or use the built-in OTP authentication, security tokens will be generated by Dexie Cloud and their refresh tokens will be securely protected on the client by the RSA keypair. This is important as the refresh token is long-lived and must not be possible
to copy over to another device.

### The secure flow of retrieving and storing tokens

1. Client generates a new local non-exportable RSA keypair and stores it in IndexedDB.
2. Client request token from Dexie Cloud (using OTP auth OR via server-to-server requests (custom auth)). The token request is accompanied with the public key from the local keypair.
3. Server generates a short-lived access token and a long lived refresh token.

### The secure flow of refreshing tokens

1. Client requests a new access token from Dexie Cloud by sending the refresh token together with the current timestamp + signature of (refresh token + current timestamp).
2. Server verifies that signature is valid and that the timestamp is within current time +/- a margin for clock differences.
3. Server generates new access token from the claims in the refresh token.

### 3 ways of obtaining the tokens

Every Dexie Cloud database URL has a token endpoint that can give out tokens for a client. In order to do so, it will either require an authorization code from a successful authorization flow, OR a signed refresh-token, or accept a client_id and client_secret together with the email and name claims. The latter way is the way to use when you want to integrate an existing authentication solution to be able to authenticate users to use Dexie Cloud.

#### Default OTP Autentication

When the Dexie Cloud server endpoint verifies the user's email itself, you will not need a server for your own app - it is enough that the client talks directly to the Dexie Cloud server endpoint in order to establish a secure OTP flow and get the security token from it.

#### Custom Authentication

When you have an existing authentication solution using a server-side framework and programming language of your own choice, and you want to integrate that solution to authenticate users for your Dexie Cloud application, you will need to write a new endpoint into your existing server-side authentication server that, using your client_id and client_secret can request token from Dexie Cloud for the user you have already authenticated.

See [Example auth integration](db.cloud.configure()#example-integrate-custom-authentication).
