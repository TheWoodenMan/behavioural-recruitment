let info = {
	"get_random_questions": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/random/:number"
	},
	"get_specific_question_by_objectid": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/:id"
	},
	"Get a Question by a Single Value": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/value/:value"
	},
	"post a New Question": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/addone",
		"body": {
			"question": "a String which poses the question you want to ask.",
			"values": ["An array", "of leadership value", "strings"]
		}
	},
	"post_many_new_questions": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/addmany",
		"body": {
			"array": [
				{
					"question": "{Insert Question Text Here}",
					"values": ["value1", "value2", "value3"]
				},
				{
					"question": "{Insert Question Text 2 Here}",
					"values": ["value1", "value2", "value3"]
				}
			]
		}
	},
	"post_replacement_of_a_question": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/:id/replace",
		"body": {
			"question": "a String which poses the question you want to ask.",
			"values": ["An array", "of strings with", "leadership values"]
		}
	},
	"post_replacement_of_a_questions_values": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/:id/values/replace",
		"body": { "values": ["value1", "value2", "value3"] }
	},
	"patch_a_value_to_a_questions_values_array": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/:id/:value/addvalue"
	},
	"delete_a_question_by_objectid": {
		"query":
			"https://behavioural-recruitment-api.azurewebsites.net/api/questions/:id/delete"
	}
};
module.exports = info;
