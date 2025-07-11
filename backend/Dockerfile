# Build stage
FROM golang:1.23-alpine AS build

WORKDIR /app

# Install git (needed for fetching deps)
RUN apk add --no-cache git

# Copy go mod files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the Go binary
RUN go mod tidy
RUN go build -o server

# Final stage: minimal image with just the binary
FROM alpine:latest

WORKDIR /app

# Copy binary from build stage
COPY --from=build /app/server .

# Expose port your app listens on
EXPOSE 8080

# Run the server binary
CMD ["./server"]
