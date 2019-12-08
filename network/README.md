## Install Samples, Binaries and Docker Images

```bash
curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.0
cp -r fabric-samples/bin
```

## Generate channel congiguration and achor peer for Orgs

```bash
mkdir channel-artifacts
```

## Start network

```bash
./upNetwork.sh
```

## Stop network

```bash
./stop.sh
```
