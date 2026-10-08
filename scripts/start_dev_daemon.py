#!/usr/bin/env python3
"""Double-fork daemon that runs `bun run dev` so it survives tool-call cleanup."""
import os, sys, subprocess

PROJECT = "/home/z/my-project"
LOG = os.path.join(PROJECT, "dev.log")

if os.fork() > 0:
    sys.exit(0)          # parent exits immediately -> child reparented later
os.setsid()
if os.fork() > 0:
    sys.exit(0)          # intermediate exits -> grandchild reparented to PID 1

os.chdir(PROJECT)
with open("/tmp/dev_daemon.pid", "w") as f:
    f.write(str(os.getpid()))

log = open(LOG, "a", buffering=1)
os.dup2(log.fileno(), 1)
os.dup2(log.fileno(), 2)
os.close(log.fileno()) if False else None
devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)

os.execvp("bun", ["bun", "run", "dev"])
