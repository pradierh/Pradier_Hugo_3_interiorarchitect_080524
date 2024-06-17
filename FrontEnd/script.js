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
				fig.appendChild(img);
				fig.appendChild(imgCaption);
				gallery.appendChild(fig);
			});
		} catch (error) {
			console.error("Error fetching images:", error);
		}
	}
	fetchImages();
});
