import type { ThirdPartyIntegrationProvider } from "@prisma/client";
import type { EventDispatcher } from "svelte";

export type DisconnectEvent = {
	disconnect: ThirdPartyIntegrationProvider;
};
export type DisconnectEventDispatcher = EventDispatcher<DisconnectEvent>;
