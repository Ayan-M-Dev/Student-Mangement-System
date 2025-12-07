FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod tidy
RUN go build -o report-service main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/report-service .

EXPOSE 8080

CMD ["./report-service"]
