import { Principal } from "@dfinity/principal";
import assert from "assert";

function _getDefaultLocation() {
  if (typeof window === "undefined") {
    throw new Error(
      "Could not find default location. Please provide a location to return to"
    );
  }

  return window.location.origin;
}

export interface AuthorizationOptions {
  /**
   * The Principal or principals that will be authorized
   */
  principals: Principal[];

  /**
   * The scope of the authorization request. This must contain at least one key and a maximum of four.
   * Canisters offering integration should provide a AUTHORIZATION_SCOPE type indicating the variants they support in their Candid interface
   */
  scope: string[];

  /**
   * The URI to redirect to, after authentication.
   */
  redirectUri: string;

  /**
   * Additional data for circumstances requiring additional context. This option is provided but is discouraged, and is up the the individual application to document.
   */
  data?: { string: unknown };
}

/**
 * Options for {@link createAuthenticationRequestUrl}. All these options may be limited
 * further by the identity provider, or an error can happen.
 */
export interface CreateUrlOptions extends AuthorizationOptions {
  /**
   * The URL base to use for the identity provider.
   * By default, this is "https://auth.ic0.app/authorize".
   */
  targetUri: URL | string;
}

export interface AuthorizationResponseOptions {
  /**
   *
   */
  ok: boolean;
  /**
   * URL that the response should redirect back to
   */
  redirectUri: string | URL;
  /**
   * Short message about the authorization, possibly providing a principal or other useful data
   */
  message?: string;
  /**
   * Additional data for circumstances requiring additional context. This option is provided but is discouraged, and is up the the individual application to document.
   */
  data?: { string: unknown };
}

/**
 * Create a URL that can be used to redirect the browser to request authorization (e.g. using
 * the authorization provider). Will throw if some options are invalid.
 * @param options An option with all options for the authorization request.
 */
export function createAuthorizationRequestUrl(options: CreateUrlOptions): URL {
  const { targetUri, principals, redirectUri, scope, data } = options;
  const url = new URL(targetUri.toString());
  url.searchParams.set(
    "principals",
    JSON.stringify(principals.map((principal) => principal.toString()))
  );
  url.searchParams.set("redirectUri", redirectUri ?? _getDefaultLocation());
  url.searchParams.set("scope", JSON.stringify(scope));
  if (data) {
    url.searchParams.set("data", JSON.stringify(data));
  }

  return url;
}

function _parseData(url: URL): { string: unknown } | undefined {
  let data = url.searchParams.get("data") ?? undefined;
  if (data) {
    const parsed: { string: unknown } = JSON.parse(data, (_, value) => {
      return value as unknown;
    });
    return parsed;
  }
  return undefined;
}

type ResponseOptions = {
  url: URL | string;
  silent?: boolean;
};

export function parseAuthorizationRequestUrl(
  options: ResponseOptions
): AuthorizationOptions | null {
  const url = new URL(options.url.toString());
  try {
    // get Principals from URL
    const principalsParam = url.searchParams.get("principals");
    assert(principalsParam, "Principals are required");
    let parsedPrincipals = JSON.parse(principalsParam);
    assert(
      typeof Array.isArray(parsedPrincipals),
      "Invalid format for principals"
    );
    assert(
      parsedPrincipals.length,
      "Authorization request must contain at least one principal"
    );
    const principals = (parsedPrincipals as [string]).map((string) =>
      Principal.fromText(string)
    );

    // Get scope
    const scopeParam = url.searchParams.get("scope");
    assert(scopeParam, "Scope is required for an authorization request");
    const scope = JSON.parse(scopeParam);

    // Get RedirectUri
    const redirectUri =
      url.searchParams.get("redirectUri") || window.location.origin;
    assert(
      redirectUri,
      "Could not find redirect URI or infer from window object"
    );

    // Get data
    const data = _parseData(url);

    return {
      principals,
      scope,
      redirectUri,
      data,
    };
  } catch (error) {
    console.error(error);
  }

  return null;
}

export function createAuthorizationResponseUrl(
  options: AuthorizationResponseOptions
): URL {
  const { redirectUri, ok, message, data } = options;
  const url = new URL(redirectUri.toString());
  url.searchParams.set("ok", ok.toString());
  if (message) {
    url.searchParams.set("message", message);
  }
  if (data) {
    url.searchParams.set("data", JSON.stringify(data));
  }
  return url;
}

export function parseAuthorizationResponseUrl(
  options: ResponseOptions
): AuthorizationResponseOptions | null {
  try {
    const url = new URL(options.url.toString());
    // parse ok status
    const okParam = url.searchParams.get("ok") ?? undefined;
    assert(okParam);
    const ok: boolean = JSON.parse(okParam);

    // parse message
    const message = url.searchParams.get("message") ?? undefined;

    // parse data
    const data = _parseData(url);

    let redirectUri = url.searchParams.get("redirectUri") ?? "";
    return {
      ok,
      message,
      data,
      redirectUri,
    };
  } catch (error) {
    if (!options.silent) {
      console.error(error);
    }
  }
  return null;
}
