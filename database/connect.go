package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// @description
//
//	This is a user defined method that returns mongo.Client,
//	context.Context, context.CancelFunc and error.
//	mongo.Client will be used for further database operation.
//	context.Context will be used set deadlines for process.
//	context.CancelFunc will be used to cancel context and
//	resource associated with it
func Connect() (*mongo.Client, context.Context, context.CancelFunc, error) {
	uri := ""
	// ctx will be used to set deadline for process, here
	// deadline will of 30 seconds.
	ctx, cancel := context.WithTimeout(context.Background(),
		30*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	return client, ctx, cancel, err
}

// @description
//
//	This is a user defined method to close resources.
//	This method closes mongoDB connection and cancel context.
func Disconnect(client *mongo.Client, ctx context.Context, cancel context.CancelFunc) {
	// CancelFunc to cancel context
	defer cancel()
	// client provides a method to close mongoDb connection
	defer func() {
		if err := client.Disconnect(ctx); err != nil {
			panic(err)
		}

	}()
}

// @description
//
// This is a user defined method that accepts
// mongo.Client and context.Context
// This method used to ping the mongoDB, return error if any.

func Ping(client *mongo.Client, ctx context.Context) error {
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		return err
	}
	log.Println("connected Successfully")
	return nil
}

// @description
//

// insertOne is a user defined method, used to insert
// documents into collection returns result of InsertOne
// and error if any.
func Insert() {}

// @description
//
// insertMany is a user defined method, used to insert
// documents into collection returns result of
// InsertMany and error if any.
func InsertMany() {}

// @description
//
// query is user defined method used to query MongoDB,
// that accepts mongo.client,context, database name,
// collection name, a query and field.

//  database name and collection name is of type
// string. query is of type interface.
// field is of type interface, which limits
// the field being returned.

// query method returns a cursor and error.
func Query() {}

// @description
//
// UpdateOne is a user defined method, that update
// a single document matching the filter.
// This methods accepts client, context, database,
// collection, filter and update filter and update
// is of type interface this method returns
// UpdateResult and an error if any.
func Update() {}

// @description
//
// UpdateMany is a user defined method, that update
// a multiple document matching the filter.
// This methods accepts client, context, database,
// collection, filter and update filter and update
// is of type interface this method returns
// UpdateResult and an error if any.
func UpdateMany() {}

// @description
//
// deleteOne is a user defined function that delete,
// a single document from the collection.
// Returns DeleteResult and an  error if any.
func Delete() {}

// @description
//
// deleteMany is a user defined function that delete,
// multiple documents from the collection.
// Returns DeleteResult and an  error if any.
func DeleteMany() {}

/*
@description

ReplaceOne() replaces all the existing fields except _id with the fields and values you specify.
If multiple documents match the query filter passed to ReplaceOne(), the method selects and replaces
the first matched document.Replace operation fails if no documents match the query filter
*/
func Replace() {}
func Init() {
	// Get *Client, Context, CancelFun, error
	client, ctx, cancel, err := Connect()
	if err != nil {
		panic(err)
	}

	// Release the resource once Init finction return
	defer Disconnect(client, ctx, cancel)
	// Ping mongoDb with Ping method
	if err := Ping(client, ctx); err != nil {
		panic(err)
	}
}
