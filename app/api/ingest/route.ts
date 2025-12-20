import { inngest } from "@/ingest/client";
import { helloWorld, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/ingest/functions";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    helloWorld,
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
  ],
});