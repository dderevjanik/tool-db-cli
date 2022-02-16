import colors from "colors/safe";
import * as tooldb from "tool-db";
// import * as http from "http";
// import * as https from "https";
// import * as fs from "fs";
// import * as path from "path";

interface ServeConf {
    db?: string;
    storageName: string;
    watch: string[];
    peers: Array<{ host: string; port: number }>;
    host: string;
    port: number;
    // certs?: string;
    debug: boolean;
}

export async function serve(config: ServeConf): Promise<void> {
    // let httpsConfig = null;

    // if (config.certs) {
    //     httpsConfig = {
    //         key: fs.readFileSync(path.resolve(config.certs, "key.pem")),
    //         cert: fs.readFileSync(path.resolve(config.certs, "cert.pem")),
    //         ca: fs.readFileSync(path.resolve(config.certs, "ca.pem"))
    //     };
    // };

    // const server = httpsConfig ? https.createServer(httpsConfig) : http.createServer();
    // server.listen(config.port, config.host);

    const toolDb = new tooldb.ToolDb({
        db: config.db,
        storageName: config.storageName,
        peers: config.peers,
        debug: config.debug,
        server: true,
        host: config.host,
        port: config.port,
        // httpServer: server,
    });

    const p = "http";

    console.log();
    console.log(`ToolDB node running at ${p}://${config.host}:${config.port}`);
    console.log();
    // console.log(colors.gray(`Id: ${colors.yellow(toolDb.options.id)}`));
    console.log(colors.gray(`Storage:  ${colors.yellow(config.storageName)}`));

    toolDb.onConnect = () => {
        // Provide serverPeerId
        console.log(colors.green("Connected to server peer"));
    };
    toolDb.onDisconnect = () => {
        console.log(colors.red("Disconnected from server peer"));
    };

    if (config.watch.length) {
        console.log(colors.gray(`Watching: ${colors.yellow(config.watch.join(", "))}`));
    }

    // if (config.certs) {
    //     console.log(colors.gray(`Certs: ${colors.yellow(config.certs)}`));
    // }

    if (config.peers.length) {
        const peers = config.peers.map((p) => colors.yellow(`${p.host}:${p.port}`)).join(", ");
        console.log(colors.gray(`Peers: ${peers}`));
    }

    for (const watchKey of config.watch) {
        toolDb.addKeyListener(watchKey, (msg) => {
            if (msg.type === "put") {
                console.log(
                    `${new Date().toLocaleTimeString()}\t[${colors.yellow(watchKey)}] =>`,
                    colors.green(JSON.stringify(msg.v, null, "\t"))
                );
            } else {
                // CRDT
                console.log(`${new Date().toLocaleTimeString()}\t[${colors.yellow(watchKey)}]`, colors.yellow("CRDT"));
            }
        });
    }
}
