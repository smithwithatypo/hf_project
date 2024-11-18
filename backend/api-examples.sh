# DON'T RUN AS A SCRIPT!
# This file contains example curl commands to interact with the backend API

# Login
curl -X POST http://localhost:5001/api/auth/login \          
  -H "Content-Type: application/json" \
  -d '{"username": "alice_smith", "password": "hashed_password_1"}'


# Get all topics
Request:
curl -X GET http://localhost:5001/api/topics \
  -H 'Content-Type: application/json'

Response:
[
  {
    "_id": "673bb2a650a5a814644aebb7",
    "topicId": "arrays_and_hashing",
    "name": "Arrays and Hashing",
    "description": "Techniques involving arrays and hash maps.",
    "problems": [],
    "__v": 0
  },
  {
    "_id": "673bb2a650a5a814644aebb9",
    "topicId": "two_pointers",
    "name": "Two Pointers",
    "description": "Techniques involving two pointers moving through data.",
    "problems": [],
    "__v": 0
  },
  {
    "_id": "673bb2a650a5a814644aebbb",
    "topicId": "1d_dynamic_programming",
    "name": "1-D Dynamic Programming",
    "description": "Techniques for solving problems by breaking them down into simpler subproblems in one dimension.",
    "problems": [],
    "__v": 0
  }
]


# Get Problems for a Topic
Request:
curl -X GET http://localhost:5001/api/topics/arrays_and_hashing/problems \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: YOUR_JWT_TOKEN'

Response:
[
  {
    "_id": "673bb2b13c7a87dacd78b80c",
    "problemId": "two_sum",
    "title": "Two Sum",
    "description": "Given an array of integers and a target value, find two numbers such that they add up to the target.",
    "topic": "673bb2a650a5a814644aebb7",
    "__v": 0
  }
]


# Get Questions for a Problem
Request:
curl -X GET http://localhost:5001/api/problems/two_sum/questions \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: YOUR_JWT_TOKEN'

Response:
[
  {
    "_id": "673bb2abde5e776209afa104",
    "questionId": "two_sum_q1",
    "text": "What is the main goal of the Two Sum problem?",
    "type": "multiple_choice",
    "options": [
      "Find two numbers that add up to the target",
      "Sort the array",
      "Find the maximum value",
      "Calculate the sum of all elements"
    ],
    "correctAnswer": 0,
    "order": 1,
    "explanation": "The main goal is to find indices of the two numbers such that they add up to a specific target.",
    "pointValue": 1,
    "__v": 0
  },
  {
    "_id": "673bb2abde5e776209afa105",
    "questionId": "two_sum_q2",
    "text": "What should the function return?",
    "type": "short_answer",
    "options": [],
    "correctAnswer": "indices",
    "order": 2,
    "explanation": "The function should return the indices of the two numbers.",
    "pointValue": 1,
    "__v": 0
  },
  ...more questions...
]

# Submit question answer(s)
Request:
curl -X POST http://localhost:5001/api/answers/submit \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: YOUR_JWT_TOKEN' \
  -d '{
    "problemId": "two_sum",
    "responses": [
      {
        "questionId": "two_sum_q1",
        "userResponse": 0
      },
      {
        "questionId": "two_sum_q2",
        "userResponse": "indicess"
      }
    ]
  }'

# Get a user's progress
curl -X GET http://localhost:5001/api/userProgress/progress \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: YOUR_JWT_TOKEN'


# Get user response history
curl -X GET http://localhost:5001/api/userProgress/history \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: YOUR_JWT_TOKEN'