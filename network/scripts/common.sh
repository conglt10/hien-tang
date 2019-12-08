#!/bin/bash

# verify the result of the end-to-end test
verifyResult () {
	if [ $1 -ne 0 ] ; then
		echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
    echo "========= ERROR !!! FAILED to execute End-2-End Scenario ==========="
		echo
   	exit 1
	fi
}

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
    CORE_PEER_LOCALMSPID="OrdererMSP"
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/hientang.com/msp/tlscacerts/tlsca.hientang.com-cert.pem
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bachmai.hientang.com/users/Admin@bachmai.hientang.com/msp
}

setGlobals () {
	CLUSTER=$1
	if [ $CLUSTER -eq 1 ] ; then
		CORE_PEER_LOCALMSPID=BachmaiMSP
		CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bachmai.hientang.com/peers/peer0.bachmai.hientang.com/tls/ca.crt
		CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/bachmai.hientang.com/users/Admin@bachmai.hientang.com/msp
		CORE_PEER_ADDRESS=peer0.bachmai.hientang.com:7051
	elif [ $CLUSTER -eq 2 ] ; then
		CORE_PEER_LOCALMSPID=ChorayMSP
		CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/choray.hientang.com/peers/peer0.choray.hientang.com/tls/ca.crt
		CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/choray.hientang.com/users/Admin@choray.hientang.com/msp
		CORE_PEER_ADDRESS=peer0.choray.hientang.com:7051
	else
		echo "================== ERROR !!! ORGANIZATION Unknown =================="
	fi

	env |grep CORE
}
