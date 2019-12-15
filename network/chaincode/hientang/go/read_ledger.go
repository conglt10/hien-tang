package main

import (
	"encoding/json"
	"errors"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func getGiver(stub shim.ChaincodeStubInterface, compoundKey string) (Giver, error) {

	var giver Giver

	giverAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return giver, errors.New("Failed to get giver - " + compoundKey)
	}

	if giverAsBytes == nil {
		return giver, errors.New("giver does not exist - " + compoundKey)
	}

	json.Unmarshal(giverAsBytes, &giver)

	return giver, nil
}

func getReceiver(stub shim.ChaincodeStubInterface, compoundKey string) (Receiver, error) {

	var receiver Receiver

	receiverAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return receiver, errors.New("Failed to get receiver - " + compoundKey)
	}

	if receiverAsBytes == nil {
		return receiver, errors.New("receiver does not exist - " + compoundKey)
	}

	json.Unmarshal(receiverAsBytes, &receiver)

	return receiver, nil
}

func getPair(stub shim.ChaincodeStubInterface, compoundKey string) (Pair, error) {

	var pair Pair

	pairAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return pair, errors.New("Failed to get pair - " + compoundKey)
	}

	if pairAsBytes == nil {
		return pair, errors.New("pair does not exist - " + compoundKey)
	}

	json.Unmarshal(pairAsBytes, &pair)

	return pair, nil
}


func getListGiver(stub shim.ChaincodeStubInterface) (shim.StateQueryIteratorInterface, error) {

	startKey := "Giver-"
	endKey := "Giver-zzzzzzzz"

	resultIter, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return nil, err
	}

	return resultIter, nil
}

func getListReceiver(stub shim.ChaincodeStubInterface) (shim.StateQueryIteratorInterface, error) {

	startKey := "Receiver-"
	endKey := "Receiver-zzzzzzzz"

	resultIter, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return nil, err
	}

	return resultIter, nil
}

func getListPair(stub shim.ChaincodeStubInterface) (shim.StateQueryIteratorInterface, error) {

	startKey := "Pair-"
	endKey := "Pair-zzzzzzzz"

	resultIter, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return nil, err
	}

	return resultIter, nil
}

