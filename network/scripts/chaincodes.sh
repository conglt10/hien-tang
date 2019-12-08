#!/bin/bash

buildChaincodes () {
    chaincode=hientang
    version=1.0

    ./scripts/buildcontract.sh "${chaincode}" "${versions}"

}

buildChaincodes
