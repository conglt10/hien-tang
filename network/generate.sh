#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin:${PWD}/bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
CHANNEL_NAME=hientangchannel

# remove previous crypto material and config transactions
rm -rf channel-artifacts/*
rm -rf crypto-config/*

# generate crypto material
./bin/cryptogen generate --config=./crypto-config.yaml
if [ $? -ne 0 ]; then
  echo "Failed to generate crypto material..."
  exit 1
fi

# generate genesis block for orderer
./bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
if [ $? -ne 0 ]; then
  echo "Failed to generate orderer genesis block..."
  exit 1
fi

# generate channel configuration transaction
./bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
if [ $? -ne 0 ]; then
  echo "Failed to generate channel configuration transaction..."
  exit 1
fi

# generate anchor peer transaction
./bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/BachmaiMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BachmaiMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for BachmaiMSP..."
  exit 1
fi

./bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/ChorayMSPanchors.tx -channelID $CHANNEL_NAME -asOrg ChorayMSP
if [ "$?" -ne 0 ]; then
  echo "Failed to generate anchor peer update for ChorayMSP..."
  exit 1
fi
