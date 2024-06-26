//Fonction qui supprime une image dans la DB
function deleteImg(parentclassName) {
	const apiUrl = "http://localhost:5678/api/works/" + parentclassName;
	const token = localStorage.getItem("token");
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

document.addEventListener("DOMContentLoaded", () => {
	//Fonction qui gère les boutons des catégories
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
	// Fonction qui permet de chercher les images dans la DB et les mettre dans l'HTML
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

	// Fonction qui permet d'aller chercher les noms des catégories dans la DB
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

	async function initializeMyPage() {
		await Promise.all([fetchImages(), fetchCategories(), buttonsFilters()]);
		buttonsFilters();
	}

	initializeMyPage();
	logedInUser();
});

//Fonction de setup la Gallerie d'images de la modale
async function logedInGallery() {
	const response = await fetch("http://localhost:5678/api/works");
	const data = await response.json();
	const gallery = document.getElementsByClassName("modalGallery")[0];

	data.forEach((item) => {
		const img = document.createElement("img");
		const fig = document.createElement("div");
		const trash = document.createElement("i");

		trash.addEventListener("click", function () {
			deleteImg(item.id);
		});

		fig.setAttribute("class", item.id);
		fig.classList.add("gallery_img");
		trash.classList.add("fa-solid", "fa-trash-can");
		img.src = item.imageUrl;
		fig.appendChild(img);
		fig.appendChild(trash);
		gallery.appendChild(fig);
	});
}

async function logegInUserPageSetup() {
	const changement = document.getElementById("login");
	const modeEdition = document.getElementsByClassName("edition_mode")[0];
	const gallery_filters_hide =
		document.getElementsByClassName("gallery_filters")[0];
	const pageTitle = document.getElementsByClassName("container")[0];
	const navhead = document.getElementsByClassName("navhead")[0];
	const modalOpenerHTML = `
            <div class="modal_opener">
                <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
                <button id="modalButonOpener">modifier</button>
            </div>
        `;

	changement.textContent = "logout";
	changement.addEventListener("click", () => {
		localStorage.removeItem("token");
		location.reload();
	});
	modeEdition.style.display = "flex";
	gallery_filters_hide.style.display = "none";
	pageTitle.style.marginBottom = "92px";
	pageTitle.insertAdjacentHTML("beforeend", modalOpenerHTML);
	navhead.style.marginTop = "0px";
}

async function modalReturn() {
	const modal = document.getElementsByClassName("innerModal")[0];
	modal.innerHTML = "";
	const modalBuilder = `
					<div class="close_return">
						<i id="return" class="fa-solid fa-arrow-left"></i>
						<span class="close">&times;</span>
					</div>
					<div class="modal-content">
						<h3>Galerie photo</h3>
						<div class="modalGallery">
						</div>
						<hr />
						<button id="addAPicture">Ajouter une photo</button>
        `;
	modal.insertAdjacentHTML("beforeend", modalBuilder);
	const span = document.getElementsByClassName("close")[0];
	span.onclick = function () {
		const mainElement = document.querySelector("body");
		mainElement.removeChild(mainElement.lastChild);
	};
	logedInGallery();
	const addAPicture = document.getElementById("addAPicture");
	addAPicture.onclick = function () {
		addApictureModalPage();
	};
}

async function addApictureModalPage() {
	const modal = document.getElementsByClassName("innerModal")[0];
	modal.innerHTML = "";
	const addAPicture = `
		<div class="modal-content-add-picture">
			<div class="close_return">
				<i id="return" class="fa-solid fa-arrow-left"></i>
				<span class="close">&times;</span>
			</div>
			<div class="modal-content-add-picture-body">
				<h3>Ajout Photo</h3>
				<div class="add_img_container">
					<i class="fa-regular fa-image"></i>
					<button>+ Ajouter photo</button>
					<span>jpg, png: 4mo max</span>
				</div>
				<form id="addPictureForm" action="#" method="post">
					<label for="title">Titre</label>
					<input type="text" name="title" id="title">
					<label for="categorie-select">Catégorie</label>
					<select name="pets" id="categorie-select">
						<option value=""></option>
						<option value="dog">Dog</option>
						<option value="cat">Cat</option>
						<option value="hamster">Hamster</option>
						<option value="parrot">Parrot</option>
						<option value="spider">Spider</option>
						<option value="goldfish">Goldfish</option>
					</select>
				</form>
		
				<hr />
				<button>Valider</button>
			</div>
		</div>
		</div>
		`;
	modal.insertAdjacentHTML("beforeend", addAPicture);

	const span = document.getElementsByClassName("close")[0];
	span.onclick = function () {
		const mainElement = document.querySelector("body");
		mainElement.removeChild(mainElement.lastChild);
	};
	const returnButton = document.getElementById("return");
	returnButton.onclick = function () {
		modalReturn();
	};
}

async function modalSetup() {
	const btn = document.getElementById("modalButonOpener");
	const endOfThePage = document.querySelector("body");

	btn.onclick = function () {
		const modalBuilder = `
			<div id="myModal" class="modal">
				<div class="innerModal">
					<div class="close_return">
						<i id="return" class="fa-solid fa-arrow-left"></i>
						<span class="close">&times;</span>
					</div>
					<div class="modal-content">
						<h3>Galerie photo</h3>
						<div class="modalGallery">
						</div>
						<hr />
						<button id="addAPicture">Ajouter une photo</button>
					</div>
			</div>
        `;
		endOfThePage.insertAdjacentHTML("beforeend", modalBuilder);
		const modal = document.getElementById("myModal");
		const span = document.getElementsByClassName("close")[0];
		const addAPicture = document.getElementById("addAPicture");

		window.onclick = function (event) {
			if (event.target == modal) {
				const mainElement = document.querySelector("body");
				mainElement.removeChild(mainElement.lastChild);
			}
		};
		span.onclick = function () {
			const mainElement = document.querySelector("body");
			mainElement.removeChild(mainElement.lastChild);
		};
		logedInGallery();
		addAPicture.onclick = function () {
			addApictureModalPage();
		};
	};
}

//Fonction qui opére les changements de index.html quand l'USER est connecté
async function logedInUser() {
	if (localStorage.getItem("token")) {
		logegInUserPageSetup();
		modalSetup();
	}
}
