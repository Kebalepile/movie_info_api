package main

import (
	// "github.com/Kebalepile/movie_info_api/server"
	"github.com/Kebalepile/movie_info_api/environment"
	"fmt"
)

func main() {
	// server.Init()
     v := environment.Read()
	 fmt.Println(v)
}
