import * as tooldb from "tool-db";

interface ReadConf {
    db?: string;
    storageName: string;
    peers: Array<{ host: string; port: number }>;
    key: string;
}

export async function readKey(config: ReadConf): Promise<void> {
    const toolDb = new tooldb.ToolDb({
        db: config.db,
        storageName: config.storageName,
        peers: config.peers,
    });

    toolDb.onConnect = async () => {
        await toolDb.anonSignIn();
        const data = await toolDb.getData(config.key);
        console.log(data);
        process.exit(0);
    };
}
