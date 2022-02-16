import * as yargs from "yargs";
import * as repl from "repl";
import { readKey } from "./get";
import { put } from "./put";
import { serve } from "./serve";

yargs
    .scriptName("tool-db")
    .version("0.0.2")
    .usage("$0 <cmd> [args]")
    .command({
        command: "serve",
        describe: "start tool-db server on http",
        builder: {
            db: {
                describe: "database name to use",
                type: "string",
            },
            storageName: {
                describe: "our storage namespace",
                default: "tooldb",
                type: "string",
            },
            peers: {
                describe: "comma-seperated list of URLs and IPs",
                type: "string",
            },
            watch: {
                describe: "comma-separated list of keys to watch",
                type: "string",
            },
            host: {
                describe: "set ip to listen on",
                default: "127.0.0.1",
                type: "string",
            },
            port: {
                describe: "set port to listen on",
                default: 8080,
                type: "number",
            },
            repl: {
                describe: "go into a repl (with tooldb instance)",
                type: "boolean"
            },
            // certs: {
            //     describe: "use https with cert files from PATH (key.pem, cert.pem, ca.pem)",
            //     type: "string"
            // },
            debug: {
                describe: "enable debug mode",
                default: false,
                type: "boolean",
            },
        },
        handler: async (argv) => {
            const urls = argv["peers"] ? (argv["peers"] as string).split(",") : [];
            const peers = urls.map((u) => {
                const [host, port] = u.split(":");
                return {
                    host,
                    port: parseInt(port),
                };
            });
            const tooldb = await serve({
                db: argv["db"] as string,
                storageName: argv["storageName"] as string,
                watch: argv["watch"] ? (argv["watch"] as string).split(",") : [],
                peers,
                host: argv["host"] as string,
                port: argv["port"] as number,
                // certs: argv["certs"] as (string | undefined),
                debug: argv["debug"] as boolean,
            });
            if (argv["repl"] === true) {
                const r = repl.start(">");
                r.context["tooldb"] = tooldb;
            }
        },
    })
    .command({
        command: "get",
        describe: "get data using key",
        builder: {
            db: {
                describe: "database name to use",
                type: "string",
            },
            storageName: {
                describe: "our storage namespace",
                default: "tooldb",
                type: "string",
            },
            peers: {
                describe: "comma-seperated list of URLs and IPs",
                type: "string",
            },
        },
        handler: async (argv) => {
            const urls = argv["peers"] ? (argv["peers"] as string).split(",") : [];
            const peers = urls.map((u) => {
                const [host, port] = u.split(":");
                return {
                    host,
                    port: parseInt(port),
                };
            });
            await readKey({
                db: argv["db"] as string,
                storageName: argv["storageName"] as string,
                key: argv._[1] as string,
                peers,
            });
        },
    })
    .command({
        command: "put",
        describe: "put data",
        builder: {
            db: {
                describe: "database name to use",
                type: "string",
            },
            storageName: {
                describe: "our storage namespace",
                default: "tooldb",
                type: "string",
            },
            peers: {
                describe: "comma-seperated list of URLs and IPs",
                type: "string",
            },
        },
        handler: async (argv) => {
            const urls = argv["peers"] ? (argv["peers"] as string).split(",") : [];
            const peers = urls.map((u) => {
                const [host, port] = u.split(":");
                return {
                    host,
                    port: parseInt(port),
                };
            });
            await put({
                db: argv["db"] as string,
                storageName: argv["storageName"] as string,
                key: argv._[1] as string,
                value: argv._[2] as string,
                peers,
            });
        },
    })
    .help().argv;
