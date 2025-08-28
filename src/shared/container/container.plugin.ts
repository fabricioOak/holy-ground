import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { container } from "./index";

async function containerPlugin(server: FastifyInstance) {
	container.register<FastifyInstance>("FastifyInstance", { useValue: server });
	container.register("DbConnection", { useValue: server.db });

	server.decorate("container", container);
}

export default fp(containerPlugin, {
	name: "container-plugin",
	dependencies: ["db-connector"],
});
