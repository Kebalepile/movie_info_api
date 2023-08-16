package database

import (
	"context"
	"log"
	"maps"
	// "encoding/json"
	"github.com/Kebalepile/movie_info_api/environment"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	uri = MongoDBUri()
	/***
	 * @description Database name
	 */
	dbName = "movie_info"
	/**
	 * @description database Collection Names
	 */
	names = []string{
		"trending_movies",
		"request_movies",
		"recommended_movies",
		"comming_soon_movies",
	}
)

/*
*@description Constructs
 */
func MongoDBUri() string {
	params := environment.Read()

	return params["DB_HOST"] + "://" + params["DB_USER"] + ":" + params["DB_PASSWORD"] + "@cluster0.mcpuyxa.mongodb.net/?retryWrites=true&w=majority"

}

func connect(callback func(*mongo.Client, *[]map[string]any), results *[]map[string]any) {
	// Pass in the URI and the ClientOptions to the Client
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	callback(client, results)

}
func Trending() []map[string]any {
	var trending []map[string]any
	connect(func(client *mongo.Client, trending *[]map[string]any) {

		defer func() {
			if err := client.Disconnect(context.TODO()); err != nil {
				panic(err)
			}
		}()

		coll := client.Database(dbName).Collection(names[0])
		// Create an empty filter to match all documents
		filter := bson.D{{}}

		cursor, err := coll.Find(context.TODO(), filter)
		if err != nil {
			panic(err)
		}

		if err := cursor.All(context.TODO(), trending); err != nil {
			panic(err)
		}

		for _, m := range *trending {
			maps.DeleteFunc(m, func(k string, val interface{}) bool {
				return k == "_id"
			})
		}

	}, &trending)

	return trending

}
func Recommended() []map[string]any {
	var recommended []map[string]any
	connect(func(client *mongo.Client, recommended *[]map[string]any) {

		defer func() {
			if err := client.Disconnect(context.TODO()); err != nil {
				panic(err)
			}
		}()

		coll := client.Database(dbName).Collection(names[2])
		// Create an empty filter to match all documents
		filter := bson.D{{}}

		cursor, err := coll.Find(context.TODO(), filter)
		if err != nil {
			panic(err)
		}

		if err := cursor.All(context.TODO(), recommended); err != nil {
			panic(err)
		}

		for _, m := range *recommended {
			maps.DeleteFunc(m, func(k string, val interface{}) bool {
				return k == "_id"
			})
		}

	}, &recommended)

	return recommended

}
func CommingSoon() []map[string]any {
	var commingSoon []map[string]any
	connect(func(client *mongo.Client, commingSoon *[]map[string]any) {

		defer func() {
			if err := client.Disconnect(context.TODO()); err != nil {
				panic(err)
			}
		}()

		coll := client.Database(dbName).Collection(names[3])
		// Create an empty filter to match all documents
		filter := bson.D{{}}

		cursor, err := coll.Find(context.TODO(), filter)
		if err != nil {
			panic(err)
		}

		if err := cursor.All(context.TODO(), commingSoon); err != nil {
			panic(err)
		}

		for _, m := range *commingSoon {
			maps.DeleteFunc(m, func(k string, val interface{}) bool {
				return k == "_id"
			})
		}

	}, &commingSoon)

	return commingSoon

}
func Request(mRequest struct {
	Date        string `json:"date"`
	Query       string `json:"query"`
	Email       string `json:"email"`
	MediaHandle string `json:"mediaHandle"`
}) bool {
	searchRequest, err := bson.Marshal(mRequest)
	if err != nil {
		log.Println(err)
		return false
	}
	// Pass in the URI and the ClientOptions to the Client
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	// close coonection once once with connection
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
	coll := client.Database(dbName).Collection(names[1])

	if _, err = coll.InsertOne(context.TODO(), searchRequest); err != nil {
		return false
	}

	return true
}
