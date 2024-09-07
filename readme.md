This `docker-compose.yml` file defines two services: `engine` and `otel-collector`. Each service has specific instructions regarding its build process, environment variables, ports, volumes, and other settings. Here’s a breakdown of each section:

### 1. **Service: `engine`**

This service likely represents the core "engine" of an application, perhaps a Hasura service or some custom API server.

#### Key Sections:

-   **`build`**:

    -   **`context: engine`**: The build context specifies the directory `engine`, where Docker will look for files related to building this image.
    -   **`dockerfile_inline`**: The Dockerfile instructions are provided inline:
        ```yaml
        FROM ghcr.io/hasura/v3-engine
        COPY ./build /md/
        ```
        -   **`FROM ghcr.io/hasura/v3-engine`**: The base image used for the engine service is pulled from GitHub Container Registry (`ghcr.io`), specifically `hasura/v3-engine`.
        -   **`COPY ./build /md/`**: Copies the `build` directory from the local file system into the `/md/` directory inside the container.

-   **`develop`**:

    -   **`watch`**: The `develop` block watches for changes in files and can trigger actions such as syncing files or restarting the container.
        -   **`path: engine/build`**: It watches the `engine/build` directory for changes.
        -   **`action: sync+restart`**: Whenever there are changes, it syncs the changes to the container and restarts the service.
        -   **`target: /md/`**: The target directory inside the container where the files are synced.

-   **`env_file`**:

    -   **`- engine/.env.engine`**: Loads environment variables from the `.env.engine` file located in the `engine` directory. These variables will be accessible to the `engine` service.

-   **`extra_hosts`**:

    -   **`local.hasura.dev=host-gateway`**: Adds an entry to the `/etc/hosts` file inside the container to resolve `local.hasura.dev` to the `host-gateway` (which usually represents the host system's IP address).

-   **`ports`**:
    -   **`mode: ingress`**: Defines how Docker routes external traffic to the container. "Ingress" means incoming traffic will be directed to this container.
    -   **`target: 3000`**: The container listens on port `3000`.
    -   **`published: "3000"`**: The service is exposed on port `3000` on the host machine.
    -   **`protocol: tcp`**: Specifies that the port will use the TCP protocol.

### 2. **Service: `otel-collector`**

This service runs an OpenTelemetry (OTel) collector, which is used to gather and process telemetry data, such as traces, metrics, and logs, from applications.

#### Key Sections:

-   **`command`**:

    -   **`--config=/etc/otel-collector-config.yaml`**: The service runs with a specific command, telling it to use the configuration file located at `/etc/otel-collector-config.yaml` inside the container.

-   **`environment`**:

    -   **`HASURA_DDN_PAT: ${HASURA_DDN_PAT}`**: It pulls the value of the `HASURA_DDN_PAT` environment variable from the host system, allowing secure passing of environment variables.

-   **`image`**:

    -   **`otel/opentelemetry-collector:0.104.0`**: Specifies the image `otel/opentelemetry-collector` from Docker Hub, with the specific version tag `0.104.0`.

-   **`ports`**:

    -   **`mode: ingress`**: Incoming traffic will be routed to this service.
    -   **`target: 4317`**: Port `4317` inside the container is exposed.
    -   **`published: "4317"`**: Port `4317` is published on the host machine.
    -   **`protocol: tcp`**: The container communicates using the TCP protocol.

    Similarly for port `4318`:

    -   **`target: 4318`**: Port `4318` is also exposed.
    -   **`published: "4318"`**: Port `4318` is exposed on the host machine.

-   **`volumes`**:
    -   **`./otel-collector-config.yaml:/etc/otel-collector-config.yaml`**: This mounts a local file `otel-collector-config.yaml` into the container at `/etc/otel-collector-config.yaml`, allowing the OpenTelemetry Collector to use the configuration specified in that file.

### Summary

-   The `engine` service builds a custom image based on the Hasura engine and watches for changes in a local `build` folder to sync those changes into the container's `/md/` directory. It uses environment variables from a `.env` file and exposes port `3000`.
-   The `otel-collector` service uses an official OpenTelemetry collector image to gather telemetry data. It loads configuration from a local YAML file and exposes ports `4317` and `4318` for communication.

This setup combines an engine **for handling API requests** and a telemetry collector for **observability**.

### NodeJS connector steps

https://hasura.io/docs/3.0/business-logic/typescript/#step-1-initialize-the-nodejs-lambda-connector

ddn connector introspect nodejs_connector
ddn command add nodejs_connector todov2  
ddn supergraph build local

| Build Version | 2ffd0fb9b8 |
+---------------+-------------------------------------------------------------------------------------------+
| API URL | https://awaited-leech-1951-2ffd0fb9b8.ddn.hasura.app/graphql |
+---------------+-------------------------------------------------------------------------------------------+
| Console URL | https://console.hasura.io/project/awaited-leech-1951/build/2ffd0fb9b8/graphql?scope=build |
+---------------+-------------------------------------------------------------------------------------------+
| Project Name | awaited-leech-1951 |

### Creating connector

ddn connector init graphql*connector -i
ddn connector introspect graphql_connector
ddn model add graphql_connector "\*"
ddn command add graphql*connector "\*"
ddn relationship add graphql_connector "\*"

### Spin up graphql connector

docker compose --env-file ../../../.env up --build --watch

### Spin up nodejs connector

docker compose --env-file ../../../.env up --build --watch

### Spin up hasura engine and telemetry connector

HASURA_DDN_PAT=$(ddn auth print-pat) docker compose --env-file .env up --build --watch
