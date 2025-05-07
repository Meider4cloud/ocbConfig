# ocbConfig

A deno app that uses a OpenTelemetry collector config.yaml to generate an OpenTelemetry Collector Builder builder-config.yaml file. The app is written in Typescript and uses Deno as runtime.

## How to use the app

Create a `config` folder in the root. Place your OpenTelemetry Collector `config.yaml` there. Please mind the spelling.


## Install Deno

[Install deno](https://docs.deno.com/runtime/getting_started/installation/)

## Run the app

- dev: deno task dev
- prod: deno task prod

## Docker

To build and run the container locally:

```bash
docker compose up --build 
```
