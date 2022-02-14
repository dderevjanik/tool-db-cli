# tool-db-cli

*DISCLAIMER: WORK IN PROGRESS/NOT PRODUCTION-READY*

## Installation

`npm i -g tooldb-cli`

### Example: Watching an expression

Start local tool-db server:

`tool-db serve --port=8222 watch=foobar`

Connect and put data from another local server:

```js
const ToolDb = require("tooldb").ToolDb;

const tooldb = new ToolDb({
    peers: [{ host: "127.0.0.1", port: 8222 }],
    server: false,
});
client.onConnect = async () => {
    await client.anonSignIn();
    await client.putData("foobar", "my-test-data");

}
```

## Usage

```
tool-db serve

start tool-db server on http

Options:
  --version      Show version number                                   [boolean]
  --help         Show help                                             [boolean]
  --db           database name to use                                   [string]
  --storageName  our storage namespace              [string] [default: "tooldb"]
  --peers        comma-seperated list of URLs and IPs                   [string]
  --watch        comma-separated list of keys to watch                  [string]
  --host         set ip to listen on             [string] [default: "127.0.0.1"]
  --port         set port to listen on                  [number] [default: 8765]
  --debug        enable debug mode                    [boolean] [default: false]
```
