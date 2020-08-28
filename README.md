[![GitHub stars](https://img.shields.io/github/stars/Sajjal/Grantha)](https://github.com/Sajjal/Grantha/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Sajjal/Grantha)](https://github.com/Sajjal/Grantha/issues)
![Website](https://img.shields.io/website?down_color=lightgrey&down_message=offline&up_color=blue&up_message=online&url=https%3A%2F%2Fdb.mrsajjal.com)
![GitHub language count](https://img.shields.io/github/languages/count/Sajjal/Grantha)
![GitHub top language](https://img.shields.io/github/languages/top/Sajjal/Grantha)
![GitHub repo size](https://img.shields.io/github/repo-size/Sajjal/Grantha)

# Welcome to Grantha!

### Thank you for exploring S & D Grantha | Database as a Service (DBaaS).

It is a web-based lightweight Database as a Service (DBaaS) application that allows easy and automatic sharing of one of the most popular NoSQL database, MongoDB. It is also a SPA (Single Page Application).

This application is developed using Node.js, Express.js, HTML, CSS, and Vanilla JavaScript. MongoDB is used as a database. The user interface is minimal.

---

## Background (_Why this application was developed?_)

I started this project to continue my programming practice. My initial goal was to develop a web application for creating and authenticating MongoDB databases on a local machine. When I was pretty close to my goal, I realized that this application can have a greater use case. This application can be extended to simulate some features of **Google Cloud FireStore** and **MongoDB Atlas**.

I deploy all my personal projects on the Cloud and I have extra storage _(even the minimum is more than my need)_ on my Virtual Machines. This might be the case of many developers where the server resources are not being utilized to its full potential. Therefore, I decided to extend this application as a platform for providing Database as a Service (DBaaS).

#### What is Grantha?

I had a very hard time finding a good name for this application. It was difficult for me to find a name than to develop the project. I even discussed with **Deepa** but still we could not find anything satisfying. I was about to name it `Database as a Service` and suddenly I remembered about **Bhagavad Gita**.

_"The Bhagavad Gita, often referred to as the Gita, is a 700-verse Hindu scripture that is part of the epic Mahabharata"<br> -Wikipedia_ <br><br>
I sometimes read Bhagavad Gita to learn about ancient science and to get positive vibes. Bhagavad Gita was initially written in the **Sanskrit** language. **Grantha** means Book in Sanskrit and Book is a collection of words. Since this application is a platform for providing _Database as a Service_, it will be used as a collection of data and records. Hence, the name **Grantha** fits perfectly.

I have also created and published a package on NPM to access the server resources. The package can be found at `https://www.npmjs.com/package/grantha`

---

## Prerequisites:

### Node.js:

- Install **Node.js** on your machine.

### MongoDB:

- Install **MongoDB** on your machine.
- Create **Admin Account** and Enable **Authentication** on MongoDB.
- Create a **User Database**, add a non-admin **User Account** to the User Database and restart MongoDB.

---

## Server Installation:

1. Clone this Project.
2. Switch to the Root user.
3. **cd** to the server directory.
4. Modify the value of `KEY`, `IV`, `ENCRYPTION_SECRET`, `TOKEN_SECRET`, `DB_ADMIN_USER`, `DB_ADMIN_PASS`, `DB_USER_DB`, `DB_USER_USER`, `DB_USER_PASS` on `.env` file.
   <br>
   **Note:** `.env` file might be hidden.
5. Open terminal/command-prompt and type:

   i. `npm install`

   ii. `npm start`

6. Type `http://localhost:3000` on your browser's address bar and hit Enter. **The server is live.**

---

## API Installation:

- You can use the API from the **Client Directory** or
- Type `npm i grantha` to use the account from **Grantha Server** i.e. `https://db.mrsajjal.com`
- If you choose to run API from Client Directory, modify the server API Routes on: `Client --> app.js`

---

## Installation Summary:

|                      | Server                                | API                                       |
| -------------------- | ------------------------------------- | ----------------------------------------- |
| Using Grantha Server | Do Nothing, No need to setup MongoDB  | `npm i grantha`                           |
| Using Local Server   | Requires Complete Server Installation | Modify server routes on `client-->app.js` |

---

## Grantha Flow Chart:

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/flow-chart.svg">

---

## API Functions:

#### The Grantha API can be used to perform the following operations on Grantha Server:

- Create Records
- Read Records
- Search Records
- Update Records
- Remove Records
- Create Indexes

### Installation

`npm i grantha`

### Create a Record on a Collection:

```
const  db = require("grantha");

const  token = "aab5feca1e9c2770f3a711efe2f2388d1614cb0afe3e04";

const  record = {
         	token: token,
         	collection: "userInfo",
		data: {
			name: "John",
			age: "20",
			},
		};

db.addData(record);

// Adds {name: "John", age: "20"} to the "UserInfo" collection
```

<br/>

### Get all Records from a Collection:

```
const  db = require("grantha");

const  token = "aab5feca1e9c2770f3a711efe2f2388d1614cb0afe3e04";

const  record = {
         	token: token,
         	collection: "userInfo",
		};

db.getData(record);

// Returns all records from "UserInfo" collection
```

<br/>

### Search for Records on a Collection:

```
const  db = require("grantha");

const  token = "aab5feca1e9c2770f3a711efe2f2388d1614cb0afe3e04";

const  record = {
         	token: token,
         	collection: "userInfo",
		data: {
			age: "20",
			},
		};

db.searchData(record);

// Returns all mathching records where {age: "20"} from "UserInfo" collection
```

> **ProTip:** You can use any **MongoDB find()** properties.

<br/>

### Update a Record on a Collection:

```
const  db = require("grantha");

const  token = "aab5feca1e9c2770f3a711efe2f2388d1614cb0afe3e04";

const  record = {
         token: token,
         collection: "userInfo",
         id:"5f47f18ed1637ce1a3942f72",
	 data: {
		name:"Henry"
		age: "25",
		},
	 };

db.updateData(record);

// Updates record with {id: "5f47f18ed1637ce1a3942f72"} from "UserInfo" collection
```

<br/>

### Remove a Record from a Collection:

```
const  db = require("grantha");

const  token = "aab5feca1e9c2770f3a711efe2f2388d1614cb0afe3e04";

const  record = {
         	token: token,
         	collection: "userInfo",
         	id:"5f47f18ed1637ce1a3942f72",
		};

db.removeData(record);

// Removes record with {id: "5f47f18ed1637ce1a3942f72"} from "UserInfo" collection
```

<br/>

### Create an Index on a Collection:

```
const  db = require("grantha");

const  token = "aab5feca1e9c2770f3a711efe2f2388d1614cb0afe3e04";

const  record = {
         	token: token,
         	collection: "userInfo",
         	data:{
		      name:1
	             },
		};

db.createIndex(record);

// Creates an Index on "UserInfo" collection with "name" sorted in ascending order.
```

<br/>

### API Summary:

Here is the summary of all the available functions:

| Function       | Input                                               | Operation                                            |
| -------------- | --------------------------------------------------- | ---------------------------------------------------- |
| addData()      | `token, collection_name, data-to-add`               | Creates a record on a Collection                     |
| getData()      | `token, collection_name`                            | Returns all records from a Collection                |
| searchData()   | `token, collection_name, data-to-search`            | Returns all the matching records from a Collection   |
| updateData()   | `token, collection_name, record-id, data-to-update` | Updates record with given-id on a Collection         |
| removeRecord() | `token, collection_name, record-id`                 | Removes record with given-id from a Collection       |
| createIndex()  | `token, collection_name, index-info`                | Creates an Index based on index-info on a collection |

> **Note:** Input must be a valid JSON.

---

## Demo:

**Login Page:**

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/login.png">

---

**Home Page:**

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/home.png">

---

**Add New Project:**

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/add.png">

---

**Manage Project:**

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/manage.png">

---

**Explore Project:**

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/explore.png">

---

**Documentation:**

<img src="https://github.com/Sajjal/Grantha/blob/master/Server/public/images/Screen_shots/help.png">

---

With Love,

**Sajjal**
