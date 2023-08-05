package server

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/Kebalepile/movie_info_api/read"
	// "strings"
)

// Holds allowed domains.
// const whiteListDomains []string{}

// for production use only
const allowedDomain string = "locahost:5000"

var allowedDomains = map[string]bool{
	"127.0.0.1": true,
	"[::1]":     true,
}

// Api end points
func searchHandler(res http.ResponseWriter, req *http.Request) {

	// origin := req.Header.Get("Referer")

	//for production use only
	origin := req.RemoteAddr
	log.Println("request origin: ", origin)
	// log.Println(req.Header)
	// for production make it https://
	// if origin == "http://"+allowedDomain {
	// 	res.Header().Set("Access-Control-Allowed-Origin", origin)
	// } else {
	// 	http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
	// 	return
	// }
	remoteIp := origin[:len(origin)-6] // [::1]

	if !allowedDomains[remoteIp] {
		http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	if contentType := req.Header.Get("Content-Type"); contentType != "application/json" {
		http.Error(res, "Content Type: "+contentType+" is not allowed.", http.StatusNotAcceptable)
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
	var searchResult = []string{"okoko"}

	// for _, r := range recipes {
	// 	if strings.Contains(strings.ToLower(r.Name), strings.ToLower(searchQuery)) {
	// 		searchResult = append(searchResult, r)
	// 	}
	// }
	files, err := read.GetFiles("must_watch")
	if err != nil {
		log.Println(err)
		http.Error(res, "Failed to get must watch files", http.StatusInternalServerError)
		return
	}
	log.Println(files)
	if files != nil {
		log.Println(files)
	}
	// Send response
	response, err := json.Marshal(searchResult)
	if err != nil {
		http.Error(res, "Failed to marshel response", http.StatusInternalServerError)
		return
	}
	// Set response headers
	res.Header().Set("Content-Type", "application/json")
	// ser status code
	res.WriteHeader(http.StatusOK)
	// send json as reponse
	res.Write(response)

}
func trendingHandler(res http.ResponseWriter, req *http.Request) {

	// origin := req.Header.Get("Referer")

	//for production use only
	origin := req.RemoteAddr
	log.Println("request origin: ", origin)
	
	remoteIp := origin[:len(origin)-6] // [::1]

	if !allowedDomains[remoteIp] {
		http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	files, err := read.GetFiles("trending")
	if err != nil {
		log.Println(err)
		http.Error(res, "Failed to get trending files", http.StatusInternalServerError)
		return
	}
	log.Println(files)
	if files != nil {
		log.Println(files)
		fileContentsChan := make(chan []byte)

		for _, file := range files {
			go func(filename string) {
				contents, err := read.ReadFileContents(filename)
				if err != nil {
					log.Println("Error while trying to read " + filename + " file contents")
					log.Println(err)
					http.Error(res, "Failed to file Contents", http.StatusInternalServerError)
					return
				}
				fileContentsChan <- contents
			}(file)
		}

		var file_contents string

		for range files {
			contents :=  <-fileContentsChan
			file_contents = string(contents)
		}

		response, err := json.Marshal(file_contents)
		if err != nil {
			http.Error(res, "Failed to marshel response", http.StatusInternalServerError)
			return
		}
		// Set response headers
		res.Header().Set("Content-Type", "application/json")
		// Set status code
		res.WriteHeader(http.StatusOK)
		// send json as reponse
		res.Write(response)
	}

}
func homeHandler(res http.ResponseWriter, req *http.Request) {

	// origin := req.Header.Get("Origin")
	// log.Println("api called from: ", origin)
	origin := req.RemoteAddr
	log.Println("request origin: ", origin)
	resBody, err := json.Marshal("WelCome Home. Movie Api")
	if err != nil {
		http.Error(res, "Failed to marshal response", http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(resBody)
}

func Run() {

	// Create Http server
	serveMux := http.NewServeMux()
	serveMux.HandleFunc("/", homeHandler)
	serveMux.HandleFunc("/search", searchHandler)
	serveMux.HandleFunc("/trending",trendingHandler)

	log.Println("Golang API server listeing on port 8080")
	log.Fatal(http.ListenAndServe(":8080", serveMux))
}
