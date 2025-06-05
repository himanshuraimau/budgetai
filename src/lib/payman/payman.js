import { PaymanClient } from "@paymanai/payman-ts";

// Initialize the client
const payman = PaymanClient.withCredentials({
    clientId: "pm-test-pnIQljqD50H3GkdezYbwWF2n",
    clientSecret: "4cBW8wNd89UF3HkogC3wSzLhGSfBzRaf50F5q1wqXfLcptH6FxtXTGT8AEJbkDpi",
});

async function quickDemo() {
    try {
        // Check your wallets
        const wallets = await payman.ask("List all wallets and their balances");
        console.log("My wallets:", wallets);

        // Create a test payee
        const newPayee = await payman.ask(
            "Create a payee of type Test Rails called John Doe"
        );
        console.log("New Payee Detail:", newPayee);

        // View your payees
        const payees = await payman.ask("List all payees");
        console.log("My payees:", payees);

        // Send a test payment (using TSD test funds)
        const payment = await payman.ask("Send 10 TSD to alice");
        console.log("Payment sent:", payment);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

quickDemo();