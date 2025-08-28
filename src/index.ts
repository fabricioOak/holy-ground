import "reflect-metadata";
import { buildServer } from "./shared/infra/http/server.ts";

async function start() {
	try {
		const server = await buildServer();
		const port = Number(process.env.PORT) || 3000;
		await server.listen({ port, host: "0.0.0.0" });
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

start();
