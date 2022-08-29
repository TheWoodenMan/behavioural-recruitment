const recycleSymbol = document.querySelectorAll(".fa-recycle");
const trashSymbol = document.querySelectorAll(".fa-trash");

Array.from(recycleSymbol).forEach((el) => {
	el.addEventListener("click", replaceQuestion);
});

Array.from(trashSymbol).forEach((el) => {
	el.addEventListener("click", deleteQuestion);
});

async function replaceQuestion() {
	const questionText = this.parentNode.childNodes[1].innerText;

	try {
		const response = await fetch("replaceQuestion", {
			method: "replaceOne",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				"question": questionText,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

async function deleteQuestion() {
	const questionText = this.parentNode.childNodes[1].innerText;
	console.log(questionText);
	try {
		await fetch("deleteQuestion", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "question": questionText }),
		}).then((response) => response.json());
		location.reload();
	} catch (err) {
		console.log(err);
	}
}
