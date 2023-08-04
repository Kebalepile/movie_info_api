package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

// Holds allowed domains.
// const whiteListDomains []string{}
const allowedDomain string = "locahost:5000"

type recipe struct {
	ID   int    `json:"id"`
	Name string `json:"name`
}

var recipes = []recipe{
	{ID: 1, Name: "mango bread"},
	{2, "str frie"},
	{ID: 3, Name: "Fish & Chips"},
}

// Api end points
func searchHandler(res http.ResponseWriter, req *http.Request) {
	// Set response headers
	res.Header().Set("Content-Type", "application/json")

	// Check if the request is from the allowed domain
	origin := req.Header.Get("Origin")
	log.Println("api called from: ",origin)
	// for production make it https://
	if origin == "http://"+allowedDomain {
		res.Header().Set("Access-Control-Allowed-Origin", origin)
	} else {
		http.Error(res, "Forbidden", http.StatusForbidden)
		return
	}

	// Read request data
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, "Failed to read request Body", http.StatusInternalServerError)
		return
	}

	// Parse search query
	var searchQuery string
	err = json.Unmarshal(body, &searchQuery)
	if err != nil {
		http.Error(res, "Failed to parse request body", http.StatusBadRequest)
		return
	}
	// Perform search
	var searchResult = []recipe{}

	for _, r := range recipes {
		if strings.Contains(strings.ToLower(r.Name), strings.ToLower(searchQuery)) {
			searchResult = append(searchResult, r)
		}
	}
	// Send response
	response, err := json.Marshal(searchResult)
	if err != nil {
		http.Error(res, "Failed to marshel response", http.StatusInternalServerError)
		return
	}
	res.WriteHeader(http.StatusOK)
	res.Write(response)

}
func homeHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	origin := req.Header.Get("Origin")
	log.Println("api called from: ", origin)

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	log.Println(body)
	var reqBody any
	if len(body) > 0 {
		err = json.Unmarshal(body, &reqBody)
		if err != nil {
			http.Error(res, "Failed to parse request body", http.StatusBadRequest)
			return
		}
	}
	// log.Println(reqBody) // nil inital value.
	resBody, err := json.Marshal("WelCome Home.")
	if err != nil {
		http.Error(res, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	res.WriteHeader(http.StatusOK)
	res.Write(resBody)
}

func Run() {
	// http.HandleFunc("/", homeHandler)
	// http.HandleFunc("/search", searchHandler)

	// log.Println("Golang API server listeing on port 3000")
	// log.Fatal(http.ListenAndServe(":3000", nil))
	// Create Http server
	serveMux := http.NewServeMux()
	serveMux.HandleFunc("/", homeHandler)
	serveMux.HandleFunc("/search", searchHandler)

	log.Println("Golang API server listeing on port 3000")
	log.Fatal(http.ListenAndServe(":3000",serveMux))
}
