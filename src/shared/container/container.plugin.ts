import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { MainContainer } from "./index";

async function containerPlugin(server: FastifyInstance) {
	const container = MainContainer.getInstance(server);
	server.decorate("container", container);
}

export default fp(containerPlugin, {
	name: "container-plugin",
	dependencies: ["db-connector"],
});
