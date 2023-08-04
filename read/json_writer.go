package read

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

var file_path = filepath.Join("files", "requests", "search_requests.json")

type search_request struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Requests    []request `json:"requests"`
}
type request struct {
	Date        string `json:"date"`
	Query       string `json:"query"`
	Email       string `json:"email"`
	MediaHandle string `json:"mediaHandle"`
}

/*
*@description search for *json file named "search_requests"
 */
func findJsonFile() search_request {

	file, err := os.Open(file_path)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	contents, err := ioutil.ReadAll(file)
	if err != nil {
		panic(err)
	}

	var json_data search_request
	err = json.Unmarshal(contents, &json_data)

	if err != nil {
		panic(err)
	}

	return json_data
}

/*
*@description append end-users request to search requests
 */
func EndUserRequest() {
	search_requests := findJsonFile()

	// new data
	end_user_request := request{
		Date:        "2023/08/04",
		Query:       "John Wick Chapter 4",
		Email:       "sage@xam.com",
		MediaHandle: "twiter.com/sage",
	}

	requests := search_requests.Requests
	search_requests.Requests = append(requests, end_user_request)
	contents_bytes, err := json.Marshal(search_requests)
	if err != nil {
		panic(err)
	}

	
	err = ioutil.WriteFile(file_path, contents_bytes, 0644)
	if err != nil {
		panic(err)
	}

	log.Println("Data Written to out file successfully")
}
