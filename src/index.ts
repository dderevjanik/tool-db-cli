import * as yargs from "yargs";
import { readKey } from "./get";
import { serve } from "./serve";

yargs
    .scriptName("tool-db")
    .version("0.0.1")
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
                default: 8765,
                type: "number",
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
        handler: (argv) => {
            const urls = argv["peers"] ? (argv["peers"] as string).split(",") : [];
            const peers = urls.map((u) => {
                const [host, port] = u.split(":");
                return {
                    host,
                    port: parseInt(port),
                };
            });
            serve({
                db: argv["db"] as string,
                storageName: argv["storageName"] as string,
                watch: argv["watch"] ? (argv["watch"] as string).split(",") : [],
                peers,
                host: argv["host"] as string,
                port: argv["port"] as number,
                // certs: argv["certs"] as (string | undefined),
                debug: argv["debug"] as boolean,
            });
        },
    })
    .command({
        command: "get",
        describe: "get data using key",
        builder: {
            db: {
                describe: "database name to use",
                type: "string"
            },
            storageName: {
                describe: "our storage namespace",
                default: "tooldb",
                type: "string",
            },
            peers: {
                describe: "comma-seperated list of URLs and IPs",
                type: "string",
            }
        },
        handler: (argv) => {
            const urls = argv["peers"] ? (argv["peers"] as string).split(",") : [];
            const peers = urls.map((u) => {
                const [host, port] = u.split(":");
                return {
                    host,
                    port: parseInt(port),
                };
            });
            readKey({
                db: argv["db"] as string,
                storageName: argv["storageName"] as string,
                key: argv._[1] as string,
                peers,
            })
        }
    })
    .help().argv;
