async function logout() {
	const response = await fetch("/api/users/logout", {
		method: "post",
		headers: { "Content-Type": "application/json" },
	});

	if (response.ok) {
		sessionStorage.clear();
		document.location.replace("/map");
	} else {
		alert(response.statusText);
	}
}

document.querySelector("#logout").addEventListener("click", logout);
