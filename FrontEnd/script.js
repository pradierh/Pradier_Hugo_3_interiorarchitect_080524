document.addEventListener("DOMContentLoaded", () => {
	async function fetchImages() {
		try {
			const response = await fetch("http://localhost:5678/api/works");
			const data = await response.json();
			const gallery = document.querySelector(".gallery");

			data.forEach((item) => {
				const img = document.createElement("img");
				const fig = document.createElement("figure");
				const imgCaption = document.createElement("figcaption");
				img.src = item.imageUrl;
				img.alt = item.title;
				imgCaption.textContent = item.title;
				fig.setAttribute("id", item.id);
				fig.classList.add("e" + item.categoryId);
				fig.appendChild(img);
				fig.appendChild(imgCaption);
				gallery.appendChild(fig);
			});
		} catch (error) {
			console.error("Error fetching images:", error);
		}
	}

	async function fetchCategories() {
		try {
			const response = await fetch(
				"http://localhost:5678/api/categories"
			);
			const data = await response.json();
			const gallery_filters = document.querySelector(".gallery_filters");

			data.forEach((item) => {
				const button = document.createElement("button");
				button.id = "f" + item.id;
				button.innerHTML = item.name;
				button.classList.add("otherButton");
				gallery_filters.appendChild(button);
			});
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	}

	async function initialize() {
		await Promise.all([fetchImages(), fetchCategories()]);
		buttonsFilters();
		logedInUser();
		logedInGallery();
	}

	initialize();
});

function deleteImg(parentclassName) {
	const apiUrl = "http://localhost:5678/api/works/" + parentclassName;
	const token = localStorage.getItem("token");
	console.log(token);

	const fetchOptions = {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	};
	fetch(apiUrl, fetchOptions)
		.then((response) => {
			if (!response.ok) {
				throw new Error(
					"Network response was not ok " + response.statusText
				);
			}
			return response.json();
		})
		.then((data) => {
			console.log("Data fetched successfully:", data);
		})
		.catch((error) => {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		});
	window.location.reload();
}
async function logedInGallery() {
	try {
		const response = await fetch("http://localhost:5678/api/works");
		const data = await response.json();
		const gallery = document.querySelector(".modalGallery");
		data.forEach((item) => {
			const img = document.createElement("img");
			const fig = document.createElement("div");
			const trash = document.createElement("i");
			fig.setAttribute("class", item.id);
			fig.classList.add("gallery_img");
			trash.classList.add("fa-solid", "fa-trash-can");
			trash.addEventListener("click", function () {
				deleteImg(item.id);
			});
			img.src = item.imageUrl;
			fig.appendChild(img);
			fig.appendChild(trash);
			gallery.appendChild(fig);
		});
	} catch (error) {
		console.error("Error fetching images:", error);
	}
}

function logedInUser() {
	if (localStorage.getItem("token")) {
		const changement = document.getElementById("login");
		changement.textContent = "logout";
		var modal = document.getElementById("myModal");
		var btn = document.getElementById("myBtn");
		var span = document.getElementsByClassName("close")[0];
		btn.onclick = function () {
			modal.style.display = "block";
		};
		span.onclick = function () {
			modal.style.display = "none";
		};
		window.onclick = function (event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
		changement.addEventListener("click", () => {
			localStorage.removeItem("token");
			location.reload();
		});
	}
}

function buttonsFilters() {
	const buttons = document.querySelectorAll("#all, #f1, #f2, #f3");
	const figures = document.querySelectorAll(".e1, .e2, .e3");

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			figures.forEach((figure) => {
				figure.style.display = "none";
			});
			buttons.forEach((button) => {
				button.classList.remove("selectedButton");
			});

			if (button.id === "all") {
				figures.forEach((figure) => {
					figure.style.display = "block";
				});
				button.classList.add("selectedButton");
			} else {
				const selectedButtons = document.getElementById(button.id);
				selectedButtons.classList.add("selectedButton");
				const selectedFigures = document.querySelectorAll(
					"." + "e" + button.id[1]
				);
				selectedFigures.forEach((figure) => {
					figure.style.display = "block";
				});
			}
		});
	});
}
