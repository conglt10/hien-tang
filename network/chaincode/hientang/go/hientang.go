package main

import (
	"encoding/json"
	"fmt"
	//"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Giver struct {
	PassportID string
	FullName string
	Blood string
	Organ string
	Status string
}

type Receiver struct {
	PassportID string
	FullName string
	Blood string
	Organ string
	Hospital string
	Status string
}

type Pair struct {
	PairID string
	GiverInfo string
	ReceiverInfo string
	Hospital string
}


func (s *SmartContract) Init(stub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(stub shim.ChaincodeStubInterface) sc.Response {

	function, args := stub.GetFunctionAndParameters()

	if function == "QueryGiver" {
		return QueryGiver(stub, args)
	} else if function == "QueryReceiver" {
		return QueryReceiver(stub, args)
	} else if function == "QueryPair" {
		return QueryPair(stub, args)
	} else if function == "GetAllGiver" {
		return GetAllGiver(stub)
	} else if function == "GetAllReceiver" {
		return GetAllReceiver(stub)
	} else if function == "GetAllPair" {
		return GetAllPair(stub)
	}

	return shim.Error("Invalid Smart Contract function name!")
}


func QueryGiver(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	var PassportID string

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	PassportID = args[0]

	key := "Giver-" + PassportID
	passportAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if passportAsBytes == nil {
		return shim.Error("passport does not exist - " + args[0])
	}

	return shim.Success(passportAsBytes)
}

func QueryReceiver(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	var PassportID string

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	PassportID = args[0]

	key := "Receiver-" + PassportID
	passportAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if passportAsBytes == nil {
		return shim.Error("passport does not exist - " + args[0])
	}

	return shim.Success(passportAsBytes)
}

func QueryPair(stub shim.ChaincodeStubInterface, args []string) sc.Response {	
	var PairID string

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	PairID = args[0]

	key := "Pair-" + PairID
	pairAsBytes, err := stub.GetState(key)

	if err != nil {
		return shim.Error("Failed")
	}

	if pairAsBytes == nil {
		return shim.Error("pair does not exist - " + args[0])
	}

	return shim.Success(pairAsBytes)
}

func GetAllGiver(stub shim.ChaincodeStubInterface) sc.Response {

	allGiver, _ := getListGiver(stub)

	defer allGiver.Close()

	var tlist []Giver
	var i int

	for i = 0; allGiver.HasNext(); i++ {

		record, err := allGiver.Next()

		if err != nil {
			return shim.Success(nil)
		}

		giver := Giver{}
		json.Unmarshal(record.Value, &giver)
		tlist = append(tlist, giver)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllReceiver(stub shim.ChaincodeStubInterface) sc.Response {

	allReceiver, _ := getListReceiver(stub)

	defer allReceiver.Close()

	var tlist []Receiver
	var i int

	for i = 0; allReceiver.HasNext(); i++ {

		record, err := allReceiver.Next()

		if err != nil {
			return shim.Success(nil)
		}

		receiver := Receiver{}
		json.Unmarshal(record.Value, &receiver)
		tlist = append(tlist, receiver)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}

func GetAllPair(stub shim.ChaincodeStubInterface) sc.Response {

	allPair, _ := getListPair(stub)

	defer allPair.Close()

	var tlist []Pair
	var i int

	for i = 0; allPair.HasNext(); i++ {

		record, err := allPair.Next()

		if err != nil {
			return shim.Success(nil)
		}

		pair := Pair{}
		json.Unmarshal(record.Value, &pair)
		tlist = append(tlist, pair)
	}

	jsonRow, err := json.Marshal(tlist)

	if err != nil {
		return shim.Error("Failed")
	}

	return shim.Success(jsonRow)
}


func main() {

	err := shim.Start(new(SmartContract))

	if err != nil {
		fmt.Printf("Error createing new Smart Contract: %s", err)
	}
}