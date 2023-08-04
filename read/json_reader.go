package read

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

/*
* @description searchs for *.json files
 */
func findJsonFiles() (map[string][]string, error) {

	json_files := map[string][]string{
		"must_watch": []string{},
		"trending":   []string{},
	}

	files_dir := "files"
	err := filepath.Walk(files_dir, func(file_path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && filepath.Ext(file_path) == ".json" {
			
			if strings.Contains(info.Name(), "searched") {
				must_watch := json_files["must_watch"]
				json_files["must_watch"] = append(must_watch, file_path)

			} else if strings.Contains(info.Name(), "trending") {

				trending := json_files["trending"]
				
				json_files["trending"] = append(trending, file_path)
				
			}

		}

		return nil

	})

	if err != nil {
		return nil, err
	}

	return json_files, nil

}

/*
*@description read content of *.json files
@returns contents of file in slice of byte
 */

func ReadFileContents(filename string) ([]byte, error) {
	contents, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	return contents, nil
}
/*
*@description Get file names of *.json files 
*@return slice of *.json file names
*/
func GetFiles(key string) ([]string, error) {
	json_files, err := findJsonFiles()
	if err != nil {
		log.Println("Error while  searching for *.json files -> ", err)
		return nil, err
	}

	if value, exists := json_files[key]; exists && value != nil {
		return value, nil
	} else {
		return nil, nil
	}
}

func ReadAndPrintJSONFiles() {
	json_files, err := findJsonFiles()
	if err != nil {
		log.Println("Error while  searching for *.json files -> ", err)
		return
	}
	fileContentChan := make(chan []byte)
	for _, files := range json_files {

		for _, file := range files {
			go func(filename string) {
				contents, err := ReadFileContents(filename)
				if err != nil {
					log.Println("Error while trying to read " + filename + " file contents")
					log.Println(err)
					return
				}
				fileContentChan <- contents
			}(file)
		}

	}
	// Recevie the contents from the channel and print it to the cmd
	for k, files := range json_files {
		log.Println("Reading " + k + " files.")
		for range files {
			contents := <-fileContentChan
			log.Println(string(contents))
		}

	}

}
