package read

import (
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	mongo "github.com/Kebalepile/movie_info_api/database"
)

var file_path = filepath.Join("files", "requests", "search_requests.json")

type search_request struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Requests    []Request `json:"requests"`
}
type Request struct {
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

	contents, err := io.ReadAll(file)
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
func EndUserRequest(end_user_request Request) (map[string]string, error) {
	search_requests := findJsonFile()

	requests := search_requests.Requests

	search_requests.Requests = append(requests, end_user_request)
	contents_bytes, err := json.Marshal(search_requests)
	if err != nil {

		return nil, err
	}

	err = os.WriteFile(file_path, contents_bytes, 0644)
	if err != nil {

		return nil, err
	}

	return map[string]string{"msg": "Your request has been successfully logged, will get back to you within 48hours"}, nil
}
func MovieRequest(movieRequest Request) (map[string]string, error) {
	mongo.Request(movieRequest)

	return map[string]string{"msg": "Your request has been successfully logged, will get back to you within 48hours"}, nil
}
