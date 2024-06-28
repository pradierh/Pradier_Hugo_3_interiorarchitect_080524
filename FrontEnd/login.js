document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("loginForm");

	form.addEventListener("submit", async (e) => {
		e.preventDefault(); // Empêche la soumission par défaut du formulaire

		const email = document.getElementById("email").value;
		const password = document.getElementById("psw").value;
		console.log(JSON.stringify({ email, password }));

		try {
			const response = await fetch(
				"http://localhost:5678/api/users/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await response.json();
			console.log(response);

			if (response.ok) {
				alert("Connexion réussie");
				console.log(data.token);
				localStorage.setItem("token", data.token);
				window.location.href = "./index.html";
			} else {
				alert(data.message);
			}
		} catch (error) {
			console.error("Erreur:", error);
			alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
		}
	});
});
