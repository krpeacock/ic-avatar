import { Actor, HttpAgent } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./avatar.did.js";
export { idlFactory } from "./avatar.did.js";
// CANISTER_ID is replaced by webpack based on node environment
export const canisterId = process.env.AVATAR_CANISTER_ID;

/**
 * @typedef CreateActorOptions
 * @property {(import("@dfinity/agent").Agent)} [agent]
 * @property {(import("@dfinity/agent").HttpAgentOptions)} [agentOptions]
 * @property {(import("@dfinity/agent").ActorConfig)} [actorOptions]
 */

/**
 *
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {CreateActorOptions} options {@link CreateActorOptions}
 * @param {CreateActorOptions["agent"]} [options.agent] An initialized agent
 * @param {CreateActorOptions["agentOptions"]} [options.agentOptions] Options to initialize an {@link HttpAgent}. Overridden if an `agent` is passed.
 * @param {CreateActorOptions["actorOptions"]} [options.actorOptions] Options of to pass during the actor initialization.
 * @return {import("@dfinity/agent").ActorSubclass<import("./avatar.did.js")._SERVICE>} ActorSubclass configured for the canister
 */
export const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

/**
 * A ready-to-use agent for the avatar canister
 * @type {import("@dfinity/agent").ActorSubclass<import("./avatar.did.js")._SERVICE>}
*/
export const avatar = createActor(canisterId);
