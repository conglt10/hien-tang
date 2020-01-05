package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

func CreateGiver(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	_, err := cid.GetMSPID(stub)

	if err != nil {
		return shim.Error("Error - cide.GetMSPID()")
	}

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Giver!")

	PassportID := args[0]
	FullName := args[1]
	Blood := args[2]
	Organ := args[3]
	Status := "Available"

	key := "Giver-" + PassportID
	checkGiverExist, err := getGiver(stub, key)

	if err == nil {
		fmt.Println(checkGiverExist)
		return shim.Error("This Giver already exists - " + PassportID)
	}

	var giver = Giver{PassportID: PassportID, FullName: FullName, Blood: Blood, Organ: Organ, Status: Status}

	giverAsBytes, _ := json.Marshal(giver)

	stub.PutState(key, giverAsBytes)

	return shim.Success(nil)
}

func CreateReceiver(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	_, err := cid.GetMSPID(stub)

	if err != nil {
		return shim.Error("Error - cide.GetMSPID()")
	}

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Giver!")

	PassportID := args[0]
	FullName := args[1]
	Blood := args[2]
	Organ := args[3]
	Hospital := args[4]
	Status := "Available"

	key := "Receiver-" + PassportID
	checkReceiverExist, err := getReceiver(stub, key)

	if err == nil {
		fmt.Println(checkReceiverExist)
		return shim.Error("This Receiver already exists - " + PassportID)
	}

	var receiver = Receiver{PassportID: PassportID, FullName: FullName, Blood: Blood, Organ: Organ, Hospital: Hospital, Status: Status}

	receiverAsBytes, _ := json.Marshal(receiver)

	stub.PutState(key, receiverAsBytes)

	return shim.Success(nil)
}

func Createpair(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	_, err := cid.GetMSPID(stub)

	if err != nil {
		return shim.Error("Error - cide.GetMSPID()")
	}

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Pair!")

	PairID := args[0]
	GiverInfo := args[1]
	ReceiverInfo := args[2]
	Hospital := args[3]
	

	key := "Pair-" + PairID
	checkPairExist, err := getPair(stub, key)

	if err == nil {
		fmt.Println(checkPairExist)
		return shim.Error("This Pair already exists - " + PairID)
	}

	var pair = Pair{PairID: PairID, GiverInfo: GiverInfo, Receiver: ReceiverInfo, Hospital: Hospital}

	pairAsBytes, _ := json.Marshal(pair)

	stub.PutState(key, pairAsBytes)

	return shim.Success(nil)
}
