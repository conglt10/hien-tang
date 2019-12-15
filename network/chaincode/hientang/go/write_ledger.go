package main

import (
	"encoding/json"

	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

func CreateGiver(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		return shim.Error("Error - cide.GetMSPID()")
	}

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Giver!")

	PassportID := args[0]
	Fullname := args[1]
	Blood := args[2]
	Organ := args[3]

	key := "Giver-" + PassportID
	checkGiverExist, err := getGiver(stub, key)

	if err == nil {
		fmt.Println(checkGiverExist)
		return shim.Error("This Giver already exists - " + PassportID)
	}

	var giver = Giver{PassportID: PassportID, Fullname: Fullname, Blood: Blood, Organ: Organ}

	giverAsBytes, _ := json.Marshal(giver)

	stub.PutState(key, giverAsBytes)

	return shim.Success(nil)
}

func CreateReceiver(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	MSPID, err := cid.GetMSPID(stub)

	if err != nil {
		return shim.Error("Error - cide.GetMSPID()")
	}

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	fmt.Println("Start Create Giver!")

	PassportID := args[0]
	Fullname := args[1]
	Blood := args[2]
	Organ := args[3]
	Hospital := args[4]

	key := "Receiver-" + PassportID
	checkReceiverExist, err := getReceiver(stub, key)

	if err == nil {
		fmt.Println(checkReceiverExist)
		return shim.Error("This Receiver already exists - " + PassportID)
	}

	var receiver = Receiver{PassportID: PassportID, Fullname: Fullname, Blood: Blood, Organ: Organ, Hospital: Hospital}

	receiverAsBytes, _ := json.Marshal(receiver)

	stub.PutState(key, receiverAsBytes)

	return shim.Success(nil)
}

