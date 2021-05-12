PROJECT_NAME=1time
BINARIES_DIRECTORY=bin
LDFLAGS = "-w -s"

clean:
	rm -rf ${BINARIES_DIRECTORY}

vet:
	go vet ./...

collect_static: clean
	mkdir ${BINARIES_DIRECTORY}
	cp -r templates ${BINARIES_DIRECTORY}/templates

build: clean collect_static
	go build -ldflags ${LDFLAGS} -o ${BINARIES_DIRECTORY}/${PROJECT_NAME}