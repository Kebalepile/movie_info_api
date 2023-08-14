package environment
import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

func Variables()map[string] string {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	return map[string] string {
		"host":os.Getenv("DB_HOST"),
		"user": os.Getenv("DB_USER"),
		"password" :os.Getenv("DB_PASSWORD")
	}

}