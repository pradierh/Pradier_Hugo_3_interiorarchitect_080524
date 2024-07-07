function deleteImg(parentclassName) {
	const apiUrl = "http://localhost:5678/api/works/" + parentclassName;
	const modalPicture = document.getElementsByClassName(parentclassName);
	modalPicture[0].parentNode.removeChild(modalPicture[0]);
	const mainPicture = document.getElementById(parentclassName);
	mainPicture.parentNode.removeChild(mainPicture);

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

function addImageInModalErrorHandler(event) {
	if (
		event.target.files[0].type != "image/jpg" &&
		event.target.files[0].type != "image/jpeg" &&
		event.target.files[0].type != "image/png"
	) {
		errorMessage(
			"Le fichier que vous essayez d'Upload n'est pas dans un bon format"
		);

		borderError("addImageContainerId");

		return null;
	}
	if (event.target.files[0].size > 4000000) {
		errorMessage("Le fichier est trop volumineux");
		borderError("addImageContainerId");
		return null;
	}
	borderErrorElse("addImageContainerId");
	if (document.getElementsByClassName("errorAddImage")[0]) {
		var rm = document.getElementsByClassName("errorAddImage")[0];
		rm.remove();
	}
	return "success";
}

function addImageInModal(event) {
	if (addImageInModalErrorHandler(event) == null) {
		return null;
	}
	const imagediv = document.getElementsByClassName("add_img_container")[0];
	var file = URL.createObjectURL(event.target.files[0]);
	var newimg = document.createElement("img");
	imagediv.innerHTML = "";
	newimg.src = file;
	newimg.id = "imagePreview";
	imagediv.appendChild(newimg);
	addImageInDb(event.target.files[0]);
}

function errorMessage(text) {
	if (document.getElementsByClassName("errorAddImage")[0]) {
		var newText = document.getElementsByClassName("errorAddImage")[0];
		newText.textContent = "! " + text + " !";
		return;
	}
	var position = document.getElementById("categorie-select");
	var addPictureForm = document.getElementById("addPictureForm");
	var newParagraph = document.createElement("p");
	newParagraph.textContent = "! " + text + " !";
	newParagraph.classList = "errorAddImage";
	position.insertAdjacentElement("afterend", newParagraph);
}

const handleSubmit = async (e) => {
	e.preventDefault();
	addImageInDbErrorHandlerFirst();
};

async function addApictureModalPage() {
	const modal = document.getElementsByClassName("innerModal")[0];
	modal.innerHTML = "";
	const addAPicture = `
		<div class="modal-content-add-picture">
			<div class="close_return">
				<i id="return" class="fa-solid fa-arrow-left"></i>
				<i class="fa-solid fa-xmark close"></i>
			</div>
			<div class="modal-content-add-picture-body">
				<h3>Ajout Photo</h3>
				<div id="addImageContainerId" class="add_img_container">
					<i class="fa-regular fa-image"></i>
					<input type="file" name="upload_file" class="form-control" placeholder="Enter Name" id="upload_file">
					<label id="ajouterPhoto" for="upload_file">+ Ajouter photo</label>
					<span>jpg, png: 4mo max</span>
				</div>

				<form id="addPictureForm" action="#" method="post">
					<label for="title">Titre</label>
					<input type="text" name="title" id="title">
					<label for="categorie-select">Catégorie</label>
					<select name="categories" id="categorie-select">
						<option value=""></option>
					</select>
					<hr />
					<button type="submit" id='valider'>Valider</button>
				</form>
			</div>
		</div>
		</div>
		`;
	modal.insertAdjacentHTML("beforeend", addAPicture);
	fetchCategoriesForModal();
	const form = document.getElementById("addPictureForm");
	form.addEventListener("submit", handleSubmit);
	document
		.getElementById("upload_file")
		.addEventListener("change", addImageInModal);

	const leftArrow = document.getElementsByClassName("close_return")[0];
	leftArrow.style.justifyContent = "space-between";
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

function borderError(idError) {
	const name = document.getElementById(idError);
	name.style.border = "1px solid red";
}

function borderErrorElse(idError) {
	const name = document.getElementById(idError);
	name.style.border = "none";
}

function addImageInDbErrorHandlerFirst(file) {
	const name = document.getElementById("title");
	const categoryValue = document.getElementById("categorie-select");

	if (
		categoryValue.value != 1 &&
		categoryValue.value != 2 &&
		categoryValue.value != 3
	) {
		errorMessage("Veuillez introduire une catégorie correcte");
		borderError("categorie-select");
	} else borderErrorElse("categorie-select");

	if (name.value.length > 10) {
		errorMessage("Le titre est trop long");
		borderError("title");
	} else borderErrorElse("title");
	if (name.value.length < 1) {
		errorMessage("Veuillez insérer un titre");
		borderError("title");
	} else borderErrorElse("title");

	if (file === undefined || file === null) {
		errorMessage("Veuillez insérer une image");
		borderError("addImageContainerId");
	} else borderErrorElse("addImageContainerId");
}

function addImageInDbErrorHandler() {
	const name = document.getElementById("title");
	const categoryValue = document.getElementById("categorie-select");
	var errorNumber = 0;

	if (
		categoryValue.value != 1 &&
		categoryValue.value != 2 &&
		categoryValue.value != 3
	) {
		errorMessage("Veuillez introduire une catégorie correcte");
		borderError("categorie-select");
		errorNumber++;
	} else borderErrorElse("categorie-select");

	if (name.value.length > 10) {
		errorMessage("Le titre est trop long");
		borderError("title");
		errorNumber++;
	} else borderErrorElse("title");
	if (name.value.length < 1) {
		errorMessage("Veuillez insérer un titre");
		borderError("title");
		errorNumber++;
	} else borderErrorElse("title");

	if (errorNumber != 0) return null;

	return "success";
}

function addImageInDb(file) {
	const apiUrl = "http://localhost:5678/api/works";
	const token = localStorage.getItem("token");
	const form = document.getElementById("addPictureForm");

	// Remove any existing event listener to avoid duplicates
	form.removeEventListener("submit", handleSubmit);

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		if (addImageInDbErrorHandler() == null) {
			return;
		}

		const name = document.getElementById("title").value;
		const categoryValue = document.getElementById("categorie-select").value;
		const formData = new FormData();
		formData.append("image", file);
		formData.append("title", name);
		formData.append("category", categoryValue);

		const fetchOptions = {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		};

		try {
			const response = await fetch(apiUrl, fetchOptions);
			if (!response.ok) {
				throw new Error(
					"Network response was not ok " + response.statusText
				);
			}
			const data = await response.json();
			console.log("Data fetched successfully:", data);
		} catch (error) {
			console.error(
				"There was a problem with the fetch operation:",
				error
			);
		}

		const mainElement = document.querySelector("body");
		const gallery = document.getElementsByClassName("gallery")[0];
		gallery.innerHTML = ``;
		mainElement.removeChild(mainElement.lastChild);
		fetchImages();
	});
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
}

async function modalReturn() {
	const modal = document.getElementsByClassName("innerModal")[0];
	modal.innerHTML = "";
	const modalBuilder = `
					<div class="close_return">
						<i class="fa-solid fa-xmark close"></i>
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

async function fetchCategoriesForModal() {
	const response = await fetch("http://localhost:5678/api/categories");
	const data = await response.json();
	const gallery_filters = document.getElementById("categorie-select");

	data.forEach((item) => {
		const button = document.createElement("option");
		button.innerHTML = item.name;
		button.value = item.id;
		gallery_filters.appendChild(button);
	});
}

async function modalSetup() {
	const btn = document.getElementById("modalButonOpener");
	const endOfThePage = document.querySelector("body");

	btn.onclick = function () {
		const modalBuilder = `
			<div id="myModal" class="modal">
				<div class="innerModal">
					<div class="close_return">
						<i class="fa-solid fa-xmark close"></i>
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
