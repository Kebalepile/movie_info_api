package server

import (
	"encoding/json"
	"log"
	"net/http"
	"golang.org/x/time/rate"

	"github.com/Kebalepile/movie_info_api/encrypt"
	"github.com/Kebalepile/movie_info_api/read"
	mongo "github.com/Kebalepile/movie_info_api/database"
)

// for developmnet use only, remove them at production
var allowedDomains = map[string]bool{
	"http://127.0.0.1:5500":  true,
	"http://127.0.0.1:5500/": true,
}
var limiter = rate.NewLimiter(300/(24*3600), 300) // Limit to 300 requests per day with a burst of 300


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

	message, err := read.MovieRequest(userRequest)
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

	trendingMovies := mongo.Trending()
	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")

	if len(trendingMovies) > 0 {
		// Encrypt & Encode filesData
		encodedText, err := encrypt.EncryptEncode(trendingMovies)
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

	recommendedMovies := mongo.Recommended()

	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")

	if len(recommendedMovies) > 0 {

		// Encrypt & Encode filesData
		encodedText, err := encrypt.EncryptEncode(recommendedMovies)
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
func comingSoonHandler(w http.ResponseWriter, r *http.Request) {

	origin := r.Header.Get("Origin")

	if ok := allowedDomains[origin]; !ok {
		http.Error(w, "Forbidden Not Allowed Origin", http.StatusForbidden)
		return
	}

	comingSoonMovies := mongo.CommingSoon()

	w.Header().Set("Access-Control-Allow-Origin", origin) // Allow all origins (you can specify specific origins here)
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	w.Header().Set("Content-Type", "application/json")

	if len(comingSoonMovies) > 0 {

		// Encrypt & Encode filesData
		encodedText, err := encrypt.EncryptEncode(comingSoonMovies)
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
func rateLimit(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if !limiter.Allow() {
            http.Error(w, http.StatusText(http.StatusTooManyRequests), http.StatusTooManyRequests)
            return
        }
        next.ServeHTTP(w, r)
    })
}
func Init() {

	// Create Http server
	serveMux := http.NewServeMux()
    serveMux.HandleFunc("/", homeHandler)
    serveMux.HandleFunc("/request", requestHandler)
    serveMux.HandleFunc("/trending", trendingHandler)
    serveMux.HandleFunc("/recommended", recommendedHandler)
    serveMux.HandleFunc("/coming_soon", comingSoonHandler)
    wrappedMux := rateLimit(serveMux)
    log.Println("Golang API server listening on port 8080")
    log.Fatal(http.ListenAndServe(":8080", wrappedMux))
}
