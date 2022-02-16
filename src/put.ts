import * as tooldb from "tool-db";

interface PutConf {
    db?: string;
    storageName: string;
    peers: Array<{ host: string; port: number }>;
    key: string;
    value: string;
}

export async function put(config: PutConf): Promise<void> {
    const toolDb = new tooldb.ToolDb({
        db: config.db,
        storageName: config.storageName,
        peers: config.peers,
        server: false,
    });

    toolDb.onConnect = async () => {
        await toolDb.anonSignIn();
        await toolDb.putData(config.key, config.value);
        process.exit(0);
    };
}
