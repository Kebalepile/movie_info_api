package environment

import (
	"github.com/joho/godotenv"
)

// Read .env variables to be used.
func Read() map[string]string {

	variables, err := godotenv.Read()
	if err != nil {
		panic(err)
	}

	return variables

}
