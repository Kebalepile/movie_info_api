package main

import (
	"github.com/Kebalepile/movie_info_api/server"
	mongo "github.com/Kebalepile/movie_info_api/database"
	"fmt"
)

func main() {
	server.Init()
	trendingMovies := mongo.Trending()
	fmt.Println(len(trendingMovies))
	recommendedMovies := mongo.Recommended()
	fmt.Println(len(recommendedMovies))

}


