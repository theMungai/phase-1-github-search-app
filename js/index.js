document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
  
    // Toggles between searching for users or repositories
    let currentSearchType = "user"; // Default search type is 'user'
  
    // Add event listener to the form submit
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (query === "") return;
  
      if (currentSearchType === "user") {
        searchUsers(query);
      } else if (currentSearchType === "repo") {
        searchRepositories(query);
      }
    });
  
    // Function to search GitHub users
    function searchUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          userList.innerHTML = "";
          reposList.innerHTML = "";
          data.items.forEach((user) => {
            const userItem = document.createElement("li");
            const userLink = document.createElement("a");
            userLink.href = user.html_url;
            userLink.target = "_blank";
            userLink.innerHTML = `
              <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50"/>
              <h3>${user.login}</h3>
            `;
            userItem.appendChild(userLink);
            userItem.addEventListener("click", () => showUserRepos(user.login));
            userList.appendChild(userItem);
          });
        })
        .catch((error) => console.error("Error fetching users:", error));
    }
  
    function showUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          reposList.innerHTML = "";
          data.forEach((repo) => {
            const repoItem = document.createElement("li");
            repoItem.innerHTML = `
              <a href="${repo.html_url}" target="_blank">${repo.name}</a> 
              - ${repo.language || "No language specified"}
            `;
            reposList.appendChild(repoItem);
          });
        })
        .catch((error) => console.error("Error fetching repos:", error));
    }
  
    // Toggle between user search and repo search
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "Search Repositories";
    document.getElementById("github-form").appendChild(toggleButton);
  
    toggleButton.addEventListener("click", () => {
      currentSearchType = currentSearchType === "user" ? "repo" : "user";
      toggleButton.textContent = currentSearchType === "user" ? "Search Repositories" : "Search Users";
      searchInput.value = ""; 
      userList.innerHTML = "";
      reposList.innerHTML = ""; 
    });
  });
  