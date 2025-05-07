# Use the official Deno image
FROM denoland/deno:latest as builder

# Set the working directory
WORKDIR /app

# Copy the project files into the container
COPY . .
#RUN rm deno.lock

# Cache the dependencies
RUN deno cache main.ts

FROM denoland/deno:latest
WORKDIR /app

COPY --from=builder /app . 

# Set the default command to run the app
CMD [ "deno", "run", "prod"]