# ScriptCraft Editor

Web-based IDE that allows beginner programmers to automate Minecraft by
writing JavaScript functions that persist to a
[ScriptCraft](https://github.com/walterhiggins/ScriptCraft/)-enabled
MineCraft server.


# Getting Started

Set up [ScriptCraft](https://github.com/walterhiggins/ScriptCraft/).
Make sure you have [Node.js 4+](https://nodejs.org) and NPM 3+ installed.

In the Minecraft server directory
(where you run `java -jar spigot-1.10.2.jar` or similar):

```shell
git clone https://github.com/NealEhardt/scriptcraft-editor.git
cd scriptcraft-editor
npm install && npm start
```

You can browse to `http://localhost:8089` to start editing.


# Running in parallel with Spigot

https://felixmilea.com/2014/12/running-bash-commands-background-properly/


# Acknowledgements

Thanks to Walter H for making ScriptCraft.

Thanks to [GoDaddy](https://godaddy.com) for giving me paid time to work
on this.