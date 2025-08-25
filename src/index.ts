import { server } from "./server.ts";

async function start() {
	try {
		await server.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

start();
