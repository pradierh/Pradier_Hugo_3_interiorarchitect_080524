document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("loginForm");

	form.addEventListener("submit", async (e) => {
		e.preventDefault(); // Empêche la soumission par défaut du formulaire
		const email = document.getElementById("email").value;
		const password = document.getElementById("psw").value;

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
				var success = document.getElementsByClassName("log")[0];
				success.innerHTML = `<div class='success'><p><i class="fa-regular fa-square-check"></i> Connection Réussie !</p></div>`;
				setTimeout(function () {
					localStorage.setItem("token", data.token);
					window.location.href = "./index.html";
				}, 2000);
			} else {
				var failed = document.getElementById("loginForm");
				failed.innerHTML = `        <form id="loginForm" method="post">
            <div class="logContainer">
                <label for="email"><b>E-mail</b></label>
                <input type="text" id="email" name="email" required>
                <label for="psw"><b>Mot de passe</b></label>
                <input type="password" id="psw" name="psw" required>
                <button type="submit">Se connecter</button>
            </div>
            <span class="psw"><a href="#">Mot de passe oublié</a></span>
        </form>
						<div class="errorLogin">
									<p> <i class="fa-solid fa-circle-info"></i> Mot de passe ou identifiant incorrect</p> 
			</div>

		`;
			}
		} catch (error) {
			console.error("Erreur:", error);
			alert("Une erreur s'est produite. Veuillez réessayer plus tard.");
		}
	});
});
