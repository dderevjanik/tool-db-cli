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

    console.log();
    console.log(`ToolDB node running at ${config.host}:${config.port}`);
    console.log();
    console.log(colors.gray(`Storage:  ${colors.yellow(config.storageName)}`));

    toolDb.onConnect = () => {
        console.log(colors.green("Connected to server peer"));
    };
    toolDb.onDisconnect = () => {
        console.log(colors.red("Disconnected from server peer"));
    };

    console.log(colors.gray(`Watching: ${colors.yellow(config.watch.join(", "))}`));
    for (const watchKey of config.watch) {
        toolDb.addKeyListener(watchKey, (msg) => {
            const from = (msg as any).p as string;
            const data = (msg as any).v as string;
            console.log(
                `${new Date().toLocaleTimeString()}\t[${colors.yellow(watchKey)}] =>`,
                colors.green(JSON.stringify(data, null, "\t"))
            );
        });
    }
}
