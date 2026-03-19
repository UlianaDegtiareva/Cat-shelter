FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod ./

RUN go mod download

COPY . .

ENV GOFLAGS=-mod=mod

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]