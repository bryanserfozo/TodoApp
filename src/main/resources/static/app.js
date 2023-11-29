async function fetchAndPopulateTodoList() {
    const usernameCookie = getCookie("username");

    if (!usernameCookie) {
        // Handle the case where the username cookie is not set
        console.error("Username cookie is missing.");
        return;
    }

    try {
        // Fetch to-do items for the logged-in user
        const response = await fetch("http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/todo", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `username=${usernameCookie}`
            },
            credentials:"include"
        });

        if (response.ok) {
            const todoItems = await response.json();
            populateTodoList(todoItems);
        } else {
            console.error("Error fetching to-do items:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to populate to-do list
function populateTodoList(todoItems) {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = ""

    todoItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "card");
        listItem.innerHTML = `
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="checkbox-${item.id}" onchange="handleCheckboxChange(this)">
                <label class="custom-control-label" for="checkbox-${item.id}" id="label-${item.id}">${item.description}</label>
            </div>
        `;

        if (item.complete) {
            listItem.querySelector('input').checked = true;
            listItem.classList.add("checked");
            listItem.querySelector('label').innerText = "Completed: " + item.description;
        }

        todoList.appendChild(listItem);
    });
}

// Function to handle checkbox state change
async function handleCheckboxChange(checkbox) {
    const taskId = checkbox.id.split('-')[1];

    try {
        // Send fetch request to update task completion status
        const response = await fetch(`http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/todo/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `username=${getCookie("username")}`
            },
            credentials:"include",
            body: JSON.stringify({ complete: checkbox.checked })
        });

        if (!response.ok) {
            console.error("Error updating task completion status:", response.statusText);
            
        } else{
            fetchAndPopulateTodoList();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to get the value of a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// Show to-do page and fetch/populate the list when the user is logged in
function showTodoPage() {
    if (getCookie("username")){
        document.getElementById("todo-page").style.display = "block";
        document.getElementById("newTodoForm").style.display = "block";
        fetchAndPopulateTodoList();
    } else{
        console.log("false")
        console.log(document.cookie);
        console.log(getCookie("username"))
        console.log(getCookieWithExpiry("username"))
    }
    
}

// Example: Show to-do page after a successful login (replace with your actual authentication logic)
// Assume this function is called after successful login
// showTodoPage();

// Function to handle login attempt
async function attemptLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Check if username and password are not empty
    if (username.trim() === "" || password.trim() === "") {
        alert("Username and password are required");
        return;
    }

    // Prepare data for the fetch request
    const data = {
        username: username,
        password: password
    };

    try {
        // Send fetch request to http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/user/login
        const response = await fetch("http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Check if the request was successful (status code 2xx)
        if (response.ok) {
            const responseData = await response.json();
            // Handle the response from the server
            console.log(responseData); // Log the response, adjust as needed
            // You can add logic here to redirect the user or perform other actions based on the response
            location.reload()
            
        } else {
            // Handle error response (non-2xx status code)
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function attemptRegistration() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;

    // Check if username and password are not empty
    if (username.trim() === "" || password.trim() === "") {
        alert("Username and password are required");
        return;
    }

    // Prepare data for the fetch request
    const data = {
        username: username,
        password: password
    };

    console.log(data)

    try {
        // Send fetch request to http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/user/register
        const response = await fetch("http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Check if the request was successful (status code 2xx)
        if (response.ok) {
            const responseData = await response.json();
            // Handle the response from the server
            console.log(responseData); // Log the response, adjust as needed
            // You can add logic here to redirect the user or perform other actions based on the response
            location.reload()
            
        } else {
            // Handle error response (non-2xx status code)
            console.error("Error:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function addNewTodo() {
    const description = document.getElementById("newTodoDescription").value;

    // Check if the description is not empty
    if (description.trim() === "") {
        alert("To-Do description cannot be empty");
        return;
    }

    try {
        // Send fetch request to add a new to-do
        const response = await fetch("http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `username=${getCookie("username")}`
            },
            credentials:"include",
            body: JSON.stringify({ description: description, complete: false })
        });

        if (response.ok) {
            // Clear the input field and fetch/populate the updated to-do list
            document.getElementById("newTodoDescription").value = "";
            fetchAndPopulateTodoList();
        } else {
            console.error("Error adding new to-do:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


function getCookieWithExpiry(name) {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');

        if (cookieName === name) {
            const cookieParts = cookieValue.split(';');
            const value = cookieParts[0].trim();
            
            if (cookieParts.length > 1) {
                const expires = cookieParts[1].trim().split('=')[1];
                const expirationTime = new Date(expires).getTime();

                // Check if the cookie is not expired
                if (expirationTime && expirationTime > Date.now()) {
                    return value;
                } else {
                    // Remove the expired cookie
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                    return null;
                }
            }

            return value;
        }
    }

    return null;
}


