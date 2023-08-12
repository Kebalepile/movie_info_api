package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/Kebalepile/movie_info_api/encrypt"
	"github.com/Kebalepile/movie_info_api/read"
)

// for developmnet use only, remove them at production
var allowedDomains = map[string]bool{
	"http://127.0.0.1:5500":  true,
	"http://127.0.0.1:5500/": true,
}

// Api end points
func requestHandler(w http.ResponseWriter, r *http.Request) {

	origin := r.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(w, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}
	if r.Method != http.MethodPost {

		http.Error(w, "Method not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var encodedCipherText string
	err := json.NewDecoder(r.Body).Decode(&encodedCipherText)
	if err != nil {

		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	userRequest := encrypt.DecodeCipherText(encodedCipherText)

	message, err := read.EndUserRequest(userRequest)
	if err != nil {

		http.Error(w, "Failed to log end-user request", http.StatusInternalServerError)
		return
	}

	// Encrypt & Encode filesData
	encodedText, err := encrypt.EncryptEncode(message)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(encodedText)
	if err != nil {
		http.Error(w, "Failed to marshel response", http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)

	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)

	w.Write(response)
}
func trendingHandler(w http.ResponseWriter, r *http.Request) {

	origin := r.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(w, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	files, err := read.GetFiles("trending")
	if err != nil {
		http.Error(w, "Failed to get trending files", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")

	if files != nil {
		fileContentsChan := make(chan []byte)

		for _, file := range files {
			go func(filename string) {

				contents, err := read.ReadFileContents(filename)
				if err != nil {

					http.Error(w, "Failed to read file contents", http.StatusInternalServerError)
					return
				}
				fileContentsChan <- contents
			}(file)
		}

		var filesData []map[string]any
		for range files {
			var fileData map[string]any
			err := json.Unmarshal(<-fileContentsChan, &fileData)
			if err != nil {
				http.Error(w, "Failed to read file contents", http.StatusInternalServerError)
				return
			}

			filesData = append(filesData, fileData)

		}
		// Encrypt & Encode filesData
		encodedText, err := encrypt.EncryptEncode(filesData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(encodedText)
		if err != nil {
			http.Error(w, "Failed to stringify response", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write(response)
	} else {

		custom := encrypt.CustomError{Message: "could not find trending files"}

		// Encrypt & Encode error message
		encodedText, err := encrypt.EncryptEncode(custom.Error())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(encodedText)
		if err != nil {
			http.Error(w, "Failed to marshel response", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		w.Write(response)
	}

}

func recommendedHandler(w http.ResponseWriter, r *http.Request) {

	origin := r.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(w, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	files, err := read.GetFiles("must_watch")
	if err != nil {
		http.Error(w, "Failed to get trending files", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")

	if files != nil {

		fileContentsChan := make(chan []byte)

		for _, file := range files {
			go func(filename string) {
				contents, err := read.ReadFileContents(filename)
				if err != nil {
					log.Println("Error while trying to read " + filename + " file contents")
					log.Println(err)
					http.Error(w, "Failed to read file contents", http.StatusInternalServerError)
					return
				}
				fileContentsChan <- contents
			}(file)
		}

		var filesData []map[string]interface{}

		for range files {

			var fileData map[string]interface{}
			err := json.Unmarshal(<-fileContentsChan, &fileData)
			if err != nil {
				http.Error(w, "Failed to read file contents", http.StatusInternalServerError)
				return
			}

			filesData = append(filesData, fileData)
		}

		// Encrypt & Encode filesData
		encodedText, err := encrypt.EncryptEncode(filesData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(encodedText)
		if err != nil {
			http.Error(w, "Failed to marshel response", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write(response)
	} else {
		custom := encrypt.CustomError{Message: "could not find recommended files"}
		// Encrypt & Encode error message
		encodedText, err := encrypt.EncryptEncode(custom.Error())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(encodedText)
		if err != nil {
			http.Error(w, "Failed to marshel response", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		w.Write(response)
	}

}
func homeHandler(w http.ResponseWriter, r *http.Request) {

	origin := r.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(w, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}
	encodedText, err := encrypt.EncryptEncode(map[string]string{"message": "WelCome Home. Movie Api"})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(encodedText)

	if err != nil {
		http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
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
