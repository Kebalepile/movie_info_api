package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kebalepile/movie_info_api/read"
)

// for developmnet use only, remove them at production
var allowedDomains = map[string]bool{
	"http://127.0.0.1:5500":  true,
	"http://127.0.0.1:5500/": true,
}

type err_message struct {
	Message string
}

// Api end points
func requestHandler(res http.ResponseWriter, req *http.Request) {

	origin := req.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}
	log.Println(req.Method)
	if req.Method != http.MethodPost {

		http.Error(res, "Method not Allowed", http.StatusMethodNotAllowed)
		return
	}
	var end_user_request read.Request
	err := json.NewDecoder(req.Body).Decode(&end_user_request)
	if err != nil {

		http.Error(res, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	message, err := read.EndUserRequest(end_user_request)
	if err != nil {

		http.Error(res, "Failed to log end-user request", http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(message)
	if err != nil {

		http.Error(res, "Failed to marshel response", http.StatusInternalServerError)
		return
	}

	// Set response headers
	res.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)

	res.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.Header().Set("Content-Type", "application/json")

	res.WriteHeader(http.StatusOK)

	res.Write(response)
}
func trendingHandler(res http.ResponseWriter, req *http.Request) {

	origin := req.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	files, err := read.GetFiles("trending")
	if err != nil {
		http.Error(res, "Failed to get trending files", http.StatusInternalServerError)
		return
	}
	res.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	res.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.Header().Set("Content-Type", "application/json")

	if files != nil {
		fileContentsChan := make(chan []byte)

		for _, file := range files {
			go func(filename string) {

				contents, err := read.ReadFileContents(filename)
				if err != nil {

					http.Error(res, "Failed to read file contents", http.StatusInternalServerError)
					return
				}
				fileContentsChan <- contents
			}(file)
		}

		var files_data []map[string]any
		for range files {
			var file_data map[string]any
			err := json.Unmarshal(<-fileContentsChan, &file_data)
			if err != nil {
				http.Error(res, "Failed to read file contents", http.StatusInternalServerError)
				return
			}

			files_data = append(files_data, file_data)

		}

		response, err := json.Marshal(files_data)
		if err != nil {
			http.Error(res, "Failed to stringify response", http.StatusInternalServerError)
			return
		}

		res.WriteHeader(http.StatusOK)
		res.Write(response)
	} else {

		response, err := json.Marshal(err_message{"could not find trending files"})
		if err != nil {
			http.Error(res, "Failed to stringify response", http.StatusInternalServerError)
			return
		}

		res.WriteHeader(http.StatusInternalServerError)
		res.Write(response)
	}

}

func recommendedHandler(res http.ResponseWriter, req *http.Request) {

	origin := req.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	files, err := read.GetFiles("must_watch")
	if err != nil {
		http.Error(res, "Failed to get trending files", http.StatusInternalServerError)
		return
	}

	res.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	res.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.Header().Set("Content-Type", "application/json")

	if files != nil {

		fileContentsChan := make(chan []byte)

		for _, file := range files {
			go func(filename string) {
				contents, err := read.ReadFileContents(filename)
				if err != nil {
					log.Println("Error while trying to read " + filename + " file contents")
					log.Println(err)
					http.Error(res, "Failed to read file contents", http.StatusInternalServerError)
					return
				}
				fileContentsChan <- contents
			}(file)
		}

		var files_data []map[string]interface{}

		for range files {

			var file_data map[string]interface{}
			err := json.Unmarshal(<-fileContentsChan, &file_data)
			if err != nil {
				http.Error(res, "Failed to read file contents", http.StatusInternalServerError)
				return
			}

			files_data = append(files_data, file_data)
		}

		response, err := json.Marshal(files_data)
		if err != nil {
			http.Error(res, "Failed to marshel response", http.StatusInternalServerError)
			return
		}

		res.WriteHeader(http.StatusOK)
		res.Write(response)
	} else {

		response, err := json.Marshal(err_message{"could not find trending files"})
		if err != nil {
			http.Error(res, "Failed to marshel response", http.StatusInternalServerError)
			return
		}

		res.WriteHeader(http.StatusInternalServerError)
		res.Write(response)
	}

}
func homeHandler(res http.ResponseWriter, req *http.Request) {

	origin := req.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(res, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}
	response, err := json.Marshal(map[string]string{"message": "WelCome Home. Movie Api"})
	if err != nil {
		http.Error(res, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	res.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	res.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(response)
}

func Init() {

	// Create Http server
	serveMux := http.NewServeMux()
	serveMux.HandleFunc("/", homeHandler)
	serveMux.HandleFunc("/request", requestHandler)
	serveMux.HandleFunc("/trending", trendingHandler)
	serveMux.HandleFunc("/recommended", recommendedHandler)

	log.Println("Golang API server listeing on port 8080")
	log.Fatal(http.ListenAndServe(":8080", serveMux))
}
